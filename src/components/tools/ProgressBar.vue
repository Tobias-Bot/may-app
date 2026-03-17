<template>
  <div class="progress-tool card-base">
    <div class="card-header">
      <div class="card-title-wrapper">
        <span class="card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12L7 8L11 12L17 6L21 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 20H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </span>
        <input 
          v-model="localData.title" 
          class="card-title-input"
          :class="{ 'placeholder': !localData.title }"
          placeholder="Название прогресса"
          @blur="saveTitle"
          @keyup.enter="saveTitle"
        />
      </div>
      <button class="card-delete-button" @click="confirmDelete">✕</button>
    </div>

    <!-- Текущее значение и прогресс-бар -->
    <div class="progress-display">
      <div class="current-value">
        <span class="value-number">{{ localData.current }}</span>
        <span class="value-unit">{{ localData.unit }}</span>
      </div>
      
      <div class="progress-bar-container">
        <div 
          class="progress-bar-fill" 
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
      
      <div class="range-values">
        <span>{{ localData.min }}</span>
        <span>{{ localData.max }}</span>
      </div>
    </div>

    <!-- Кнопки управления -->
    <div class="progress-controls">
      <button class="control-button" @click="decrement" :disabled="localData.current <= localData.min">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
      
      <button class="control-button primary" @click="increment" :disabled="localData.current >= localData.max">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- Статистика -->
    <div class="progress-stats">
      <span>Прогресс: {{ progressPercentage }}%</span>
      <span>Осталось: {{ remaining }} {{ localData.unit }}</span>
    </div>

    <div class="card-footer">
      <span>{{ formatDate(localData.updatedAt) }}</span>
    </div>

    <div v-if="showDeleteConfirm" class="delete-confirm-overlay" @click.self="cancelDelete">
      <div class="delete-confirm-dialog">
        <p>Удалить прогресс?</p>
        <div class="dialog-actions">
          <button class="confirm-button" @click="deleteProgress">Удалить</button>
          <button class="cancel-button" @click="cancelDelete">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import '../../styles/card-styles.css';

export default {
  name: 'ProgressBar',
  props: { 
    toolId: String, 
    data: Object 
  },
  emits: ['update', 'delete'],
  
  setup(props, { emit }) {
    const localData = ref({
      title: props.data?.title || '',
      min: props.data?.min || 0,
      max: props.data?.max || 100,
      step: props.data?.step || 1,
      unit: props.data?.unit || 'шт',
      current: props.data?.current || props.data?.min || 0,
      updatedAt: props.data?.updatedAt || props.data?.createdAt || new Date().toISOString()
    });
    
    const showDeleteConfirm = ref(false);

    const progressPercentage = computed(() => {
      const total = localData.value.max - localData.value.min;
      const current = localData.value.current - localData.value.min;
      if (total === 0) return 0;
      return Math.round((current / total) * 100);
    });

    const remaining = computed(() => {
      return localData.value.max - localData.value.current;
    });

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      if (date.toDateString() === now.toDateString()) return 'Сегодня';
      const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) return 'Вчера';
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    };

    const getCleanData = () => {
      return {
        title: localData.value.title,
        min: localData.value.min,
        max: localData.value.max,
        step: localData.value.step,
        unit: localData.value.unit,
        current: localData.value.current,
        updatedAt: new Date().toISOString()
      };
    };

    let saveTimeout = null;
    const debouncedSave = () => {
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        const cleanData = getCleanData();
        emit('update', props.toolId, { data: cleanData });
        saveTimeout = null;
      }, 300);
    };

    watch(localData, () => {
      debouncedSave();
    }, { deep: true });

    const saveTitle = debouncedSave;

    const increment = () => {
      const newValue = localData.value.current + localData.value.step;
      if (newValue <= localData.value.max) {
        localData.value.current = Math.round(newValue * 10) / 10;
        localData.value.updatedAt = new Date().toISOString();
      }
    };

    const decrement = () => {
      const newValue = localData.value.current - localData.value.step;
      if (newValue >= localData.value.min) {
        localData.value.current = Math.round(newValue * 10) / 10;
        localData.value.updatedAt = new Date().toISOString();
      }
    };

    const confirmDelete = () => { 
      showDeleteConfirm.value = true; 
    };
    
    const cancelDelete = () => { 
      showDeleteConfirm.value = false; 
    };
    
    const deleteProgress = () => { 
      emit('delete', props.toolId); 
    };

    return {
      localData,
      showDeleteConfirm,
      progressPercentage,
      remaining,
      formatDate,
      saveTitle,
      increment,
      decrement,
      confirmDelete,
      cancelDelete,
      deleteProgress
    };
  }
}
</script>

<style scoped>
@import '../../styles/card-styles.css';

.progress-params {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(26, 59, 59, 0.04);
  border-radius: 30px;
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  color: #5a6a6a;
  flex-wrap: wrap;
}

.param {
  font-weight: 500;
  color: #1a3b3b;
}

.param-arrow {
  color: #8a9a9a;
  font-size: 0.9rem;
}

.param-step {
  color: #8a9a9a;
  margin-left: auto;
}

.progress-display {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.current-value {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 350;
  color: #1a3b3b;
  line-height: 1.2;
}

.value-number {
  font-size: 1.8rem;
}

.value-unit {
  font-size: 0.9rem;
  color: #8a9a9a;
  margin-left: 0.25rem;
}

.progress-bar-container {
  height: 6px;
  background: rgba(26, 59, 59, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #1a3b3b;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.range-values {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #8a9a9a;
}

.progress-controls {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.control-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(26, 59, 59, 0.05);
  border: 1px solid rgba(26, 59, 59, 0.1);
  color: #1a3b3b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.control-button.primary {
  background: #1a3b3b;
  color: white;
}

.control-button:hover:not(:disabled) {
  transform: scale(1.1);
}

.control-button.primary:hover:not(:disabled) {
  background: #2a4b4b;
}

.control-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.control-button svg {
  stroke: currentColor;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #5a6a6a;
  padding-top: 0.25rem;
  border-top: 1px solid rgba(26, 59, 59, 0.06);
}
</style>
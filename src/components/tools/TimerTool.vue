<template>
  <div class="timer-tool card-base">
    <div class="card-header">
      <div class="card-title-wrapper">
        <span class="card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 7V12L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </span>
        <input 
          v-model="localData.title" 
          class="card-title-input"
          :class="{ 'placeholder': !localData.title }"
          placeholder="Название события"
          @blur="saveTitle"
          @keyup.enter="saveTitle"
        />
      </div>
      <button class="card-delete-button" @click="confirmDelete">✕</button>
    </div>

    <!-- Дата и время события -->
    <div class="timer-datetime">
      <div class="datetime-inputs">
        <div class="input-group">
          <label>Дата</label>
          <input 
            type="date" 
            v-model="localData.date"
            class="date-input"
            @change="saveDateTime"
            :min="todayDate"
          />
        </div>
        <div class="input-group">
          <label>Время</label>
          <input 
            type="time" 
            v-model="localData.time"
            class="time-input"
            @change="saveDateTime"
            step="1"
          />
        </div>
      </div>
    </div>

    <!-- Отображение таймера -->
    <div class="timer-display" :class="{ expired: isExpired }">
      <div v-if="isExpired" class="expired-message">
        <span class="expired-icon">⏰</span>
        <span class="expired-text">Время прошло</span>
      </div>
      <div v-else class="timer-values">
        <div class="timer-value">
          <span class="value-number">{{ days }}</span>
          <span class="value-label">{{ getDaysLabel }}</span>
        </div>
        <div class="timer-separator">:</div>
        <div class="timer-value">
          <span class="value-number">{{ hours }}</span>
          <span class="value-label">ч</span>
        </div>
        <div class="timer-separator">:</div>
        <div class="timer-value">
          <span class="value-number">{{ minutes }}</span>
          <span class="value-label">мин</span>
        </div>
        <div class="timer-separator">:</div>
        <div class="timer-value">
          <span class="value-number">{{ seconds }}</span>
          <span class="value-label">сек</span>
        </div>
      </div>
    </div>

    <!-- Прогресс-бар -->
    <div class="progress-container">
      <div class="progress-bar" :style="{ width: `${progressPercentage}%` }"></div>
    </div>

    <div class="card-footer">
      <span>{{ formatDate(localData.updatedAt) }}</span>
    </div>

    <div v-if="showDeleteConfirm" class="delete-confirm-overlay" @click.self="cancelDelete">
      <div class="delete-confirm-dialog">
        <p>Удалить таймер?</p>
        <div class="dialog-actions">
          <button class="confirm-button" @click="deleteTimer">Удалить</button>
          <button class="cancel-button" @click="cancelDelete">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import '../../styles/card-styles.css';

export default {
  name: 'TimerTool',
  props: { 
    toolId: String, 
    data: Object 
  },
  emits: ['update', 'delete'],
  
  setup(props, { emit }) {
    const showDeleteConfirm = ref(false);
    const currentTime = ref(Date.now());
    let timerInterval = null;

    // Текущая дата для атрибута min
    const todayDate = computed(() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });

    // Локальные данные
    const localData = ref({
      title: props.data?.title || '',
      date: props.data?.date || '',
      time: props.data?.time || '00:00:00',
      updatedAt: props.data?.updatedAt || props.data?.createdAt || new Date().toISOString()
    });

    // Вычисляем целевую дату
    const targetDate = computed(() => {
      if (!localData.value.date) return null;
      const [year, month, day] = localData.value.date.split('-').map(Number);
      const [hours, minutes, seconds] = (localData.value.time || '00:00:00').split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes, seconds);
    });

    // Проверяем, истекло ли время
    const isExpired = computed(() => {
      if (!targetDate.value) return false;
      return currentTime.value >= targetDate.value.getTime();
    });

    // Вычисляем оставшееся время
    const timeLeft = computed(() => {
      if (!targetDate.value || isExpired.value) return 0;
      return Math.max(0, targetDate.value.getTime() - currentTime.value);
    });

    // Дни, часы, минуты, секунды
    const days = computed(() => Math.floor(timeLeft.value / (1000 * 60 * 60 * 24)));
    const hours = computed(() => Math.floor((timeLeft.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutes = computed(() => Math.floor((timeLeft.value % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = computed(() => Math.floor((timeLeft.value % (1000 * 60)) / 1000));

    // Склонение слова "день"
    const getDaysLabel = computed(() => {
      const d = days.value;
      if (d % 10 === 1 && d % 100 !== 11) return 'день';
      if ([2, 3, 4].includes(d % 10) && ![12, 13, 14].includes(d % 100)) return 'дня';
      return 'дней';
    });

    // Прогресс (если есть дата)
    const progressPercentage = computed(() => {
      if (!targetDate.value) return 0;
      const now = Date.now();
      const target = targetDate.value.getTime();
      if (now >= target) return 100;
      
      // Для прогресса используем относительное время
      // Берем диапазон от создания до цели (макс 30 дней)
      const createdAt = new Date(localData.value.updatedAt || Date.now()).getTime();
      const total = Math.min(target - createdAt, 30 * 24 * 60 * 60 * 1000);
      const elapsed = now - createdAt;
      return Math.min(100, Math.max(0, (elapsed / total) * 100));
    });

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      if (date.toDateString() === now.toDateString()) return 'Сегодня';
      const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) return 'Вчера';
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    };

    // Форматирование времени для отображения с ведущими нулями
    const formatTimeValue = (value) => {
      return String(value).padStart(2, '0');
    };

    // Сохранение изменений
    const getCleanData = () => {
      return {
        title: localData.value.title,
        date: localData.value.date,
        time: localData.value.time,
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

    const saveTitle = debouncedSave;
    const saveDateTime = debouncedSave;

    // Обновление текущего времени каждую секунду
    const startTimer = () => {
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        currentTime.value = Date.now();
      }, 1000);
    };

    // Запускаем таймер при монтировании
    onMounted(() => {
      startTimer();
    });

    // Очищаем интервал при размонтировании
    onUnmounted(() => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    });

    // Следим за изменениями данных
    watch(localData, () => {
      debouncedSave();
    }, { deep: true });

    const confirmDelete = () => { 
      showDeleteConfirm.value = true; 
    };
    
    const cancelDelete = () => { 
      showDeleteConfirm.value = false; 
    };
    
    const deleteTimer = () => { 
      emit('delete', props.toolId); 
    };

    return {
      localData,
      showDeleteConfirm,
      todayDate,
      isExpired,
      days: computed(() => formatTimeValue(days.value)),
      hours: computed(() => formatTimeValue(hours.value)),
      minutes: computed(() => formatTimeValue(minutes.value)),
      seconds: computed(() => formatTimeValue(seconds.value)),
      getDaysLabel,
      progressPercentage,
      formatDate,
      saveTitle,
      saveDateTime,
      confirmDelete,
      cancelDelete,
      deleteTimer
    };
  }
}
</script>

<style scoped>
@import '../../styles/card-styles.css';

.timer-tool {
  gap: 0.75rem;
}

.timer-datetime {
  background: rgba(26, 59, 59, 0.03);
  border-radius: 16px;
  padding: 0.75rem;
}

.datetime-inputs {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.input-group {
  flex: 1;
  min-width: 120px;
}

.input-group label {
  display: block;
  font-size: 0.7rem;
  color: #8a9a9a;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.date-input,
.time-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgba(26, 59, 59, 0.15);
  border-radius: 12px;
  font-size: 0.9rem;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.6);
  transition: all 0.2s ease;
  color: #1a3b3b;
}

.date-input:focus,
.time-input:focus {
  outline: none;
  border-color: #1a3b3b;
  background: white;
  box-shadow: 0 0 0 2px rgba(26, 59, 59, 0.1);
}

.timer-display {
  padding: 1rem 0.5rem;
  text-align: center;
  background: rgba(26, 59, 59, 0.02);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.timer-display.expired {
  background: rgba(180, 70, 70, 0.1);
}

.expired-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  color: #b34141;
  font-size: 1.1rem;
}

.expired-icon {
  font-size: 1.5rem;
}

.expired-text {
  font-weight: 400;
  letter-spacing: 0.02em;
}

.timer-values {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.timer-value {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
}

.value-number {
  font-size: 1.8rem;
  font-weight: 350;
  color: #1a3b3b;
  line-height: 1.2;
  font-feature-settings: "tnum";
}

.value-label {
  font-size: 0.65rem;
  color: #8a9a9a;
  text-transform: lowercase;
}

.timer-separator {
  font-size: 1.8rem;
  font-weight: 300;
  color: #8a9a9a;
  margin: 0 0.15rem;
  transform: translateY(-4px);
}

.progress-container {
  height: 4px;
  background: rgba(26, 59, 59, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin: 0.25rem 0;
}

.progress-bar {
  height: 100%;
  background: #1a3b3b;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.timer-display.expired .progress-bar {
  background: #b34141;
}

@media (max-width: 480px) {
  .timer-value {
    min-width: 40px;
  }
  
  .value-number {
    font-size: 1.5rem;
  }
  
  .timer-separator {
    font-size: 1.5rem;
  }
}
</style>
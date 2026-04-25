<!-- filepath: /src/components/BuilderCard/modals/TimerEditorModal.vue -->
<template>
  <ModalWindow :is-open="isOpen" @close="close" title="Настройка таймера" size="small">
    <div class="timer-editor-form">
      <!-- Переключатель режимов -->
      <div class="mode-switch">
        <button 
          class="mode-btn" 
          :class="{ active: mode === 'timer' }"
          @click="mode = 'timer'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 7V12L15 15"/>
          </svg>
          <span>Таймер</span>
        </button>
        <button 
          class="mode-btn" 
          :class="{ active: mode === 'reminder' }"
          @click="mode = 'reminder'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <path d="M8 2V6M16 2V6M3 10H21"/>
          </svg>
          <span>Напоминание</span>
        </button>
      </div>
      
      <!-- Режим таймера (обратный отсчет) -->
      <div v-if="mode === 'timer'" class="mode-content">
        <div class="info-note">Установите время таймера</div>
        <div class="time-inputs-row">
          <div class="time-input-group">
            <label>Часы</label>
            <input type="number" v-model.number="hours" min="0" max="99" class="time-input" />
          </div>
          <div class="time-input-group">
            <label>Минуты</label>
            <input type="number" v-model.number="minutes" min="0" max="59" class="time-input" />
          </div>
          <div class="time-input-group">
            <label>Секунды</label>
            <input type="number" v-model.number="seconds" min="0" max="59" class="time-input" />
          </div>
        </div>
      </div>
      
      <!-- Режим напоминания (дата события) -->
      <div v-else class="mode-content">
        <div class="info-note">Выберите дату и время события</div>
        <div class="datetime-inputs">
          <div class="input-group">
            <label>Дата</label>
            <input type="date" v-model="dateValue" class="editor-input" :min="todayDate" />
          </div>
          <div class="input-group">
            <label>Время</label>
            <input type="time" v-model="timeValue" class="editor-input" step="1" />
          </div>
        </div>
      </div>
      
      <div class="modal-actions">
        <button class="modal-button primary" @click="save">Сохранить</button>
        <button class="modal-button secondary" @click="close">Отмена</button>
      </div>
    </div>
  </ModalWindow>
</template>

<script>
import { ref, computed } from 'vue';
import ModalWindow from '../../ModalWindow.vue';

export default {
  name: 'TimerEditorModal',
  components: { ModalWindow },
  props: { isOpen: Boolean, blockData: Object },
  emits: ['close', 'save'],
  
  setup(props, { emit }) {
    const mode = ref(props.blockData?.mode || (props.blockData?.date ? 'reminder' : 'timer'));
    const totalSeconds = ref(props.blockData?.totalSeconds ?? 300);
    const dateValue = ref(props.blockData?.date ?? '');
    const timeValue = ref(props.blockData?.time ?? '00:00:00');
    
    const todayDate = computed(() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });
    
    const hours = computed({
      get: () => Math.floor(totalSeconds.value / 3600),
      set: (val) => {
        const newTotal = (val * 3600) + (minutes.value * 60) + seconds.value;
        totalSeconds.value = Math.max(0, newTotal);
      }
    });
    
    const minutes = computed({
      get: () => Math.floor((totalSeconds.value % 3600) / 60),
      set: (val) => {
        const newTotal = (hours.value * 3600) + (val * 60) + seconds.value;
        totalSeconds.value = Math.max(0, newTotal);
      }
    });
    
    const seconds = computed({
      get: () => totalSeconds.value % 60,
      set: (val) => {
        const newTotal = (hours.value * 3600) + (minutes.value * 60) + val;
        totalSeconds.value = Math.max(0, newTotal);
      }
    });
    
    const save = () => {
      const saveData = { mode: mode.value };
      
      if (mode.value === 'timer') {
        saveData.totalSeconds = totalSeconds.value;
        saveData.date = '';
        saveData.time = '00:00:00';
      } else {
        saveData.date = dateValue.value;
        saveData.time = timeValue.value;
        // Вычисляем секунды до события
        if (dateValue.value) {
          const [year, month, day] = dateValue.value.split('-').map(Number);
          const [hours, minutes, secs] = timeValue.value.split(':').map(Number);
          const targetDate = new Date(year, month - 1, day, hours, minutes, secs);
          const now = new Date();
          const diff = Math.max(0, Math.floor((targetDate - now) / 1000));
          saveData.totalSeconds = diff;
        } else {
          saveData.totalSeconds = 0;
        }
      }
      
      emit('save', saveData);
      emit('close');
    };
    
    const close = () => emit('close');
    
    return { mode, hours, minutes, seconds, dateValue, timeValue, todayDate, save, close };
  }
}
</script>

<style scoped>
.timer-editor-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.mode-switch {
  display: flex;
  gap: 0.5rem;
  background: rgba(26, 59, 59, 0.05);
  border-radius: 40px;
  padding: 0.25rem;
}

.mode-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem;
  background: transparent;
  border: none;
  border-radius: 32px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  color: #5a6a6a;
}

.mode-btn svg {
  stroke: currentColor;
}

.mode-btn.active {
  background: white;
  color: #1a3b3b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.info-note {
  font-size: 0.8rem;
  color: #8a9a9a;
  text-align: center;
  padding: 0.25rem;
}

.time-inputs-row {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.time-input-group {
  flex: 1;
  text-align: center;
}

.time-input-group label {
  display: block;
  font-size: 0.7rem;
  color: #8a9a9a;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.time-input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid rgba(26, 59, 59, 0.15);
  border-radius: 12px;
  font-size: 1rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
}

.time-input:focus {
  outline: none;
  border-color: #1a3b3b;
  background: white;
}

.datetime-inputs {
  display: flex;
  gap: 0.75rem;
}

.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.input-group label {
  font-size: 0.7rem;
  color: #8a9a9a;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.editor-input {
  padding: 0.6rem;
  border: 1px solid rgba(26, 59, 59, 0.15);
  border-radius: 12px;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.8);
}

.editor-input:focus {
  outline: none;
  border-color: #1a3b3b;
  background: white;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.modal-button {
  padding: 0.6rem 1.2rem;
  border-radius: 40px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.modal-button.primary {
  background: #1a3b3b;
  color: white;
}

.modal-button.primary:hover {
  background: #2a4b4b;
  transform: translateY(-2px);
}

.modal-button.secondary {
  background: transparent;
  border: 1px solid rgba(26, 59, 59, 0.2);
  color: #1a3b3b;
}

.modal-button.secondary:hover {
  background: rgba(26, 59, 59, 0.05);
}
</style>
<!-- filepath: /src/components/BuilderCard/blocks/TimerBlock.vue -->
<template>
  <div class="timer-block">
    <!-- Прогресс-бар -->
    <div class="timer-progress">
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
    </div>
    
    <!-- Отображение режима -->
    <div v-if="mode === 'reminder' && formattedTargetDate" class="target-datetime">
      <span class="datetime-label">До события:</span>
      <span class="datetime-value">{{ formattedTargetDate }}</span>
    </div>
    
    <!-- Основной дисплей -->
    <div class="timer-display-large">
      <div class="time-main">
        <template v-if="daysNum > 0">
          <span class="time-unit-large">
            <span class="unit-value">{{ daysNum }}</span>
            <span class="unit-label">{{ daysLabel }}</span>
          </span>
        </template>
        <span class="time-unit-large">
          <span class="unit-value">{{ hoursStr }}</span>
          <span class="unit-label">ч</span>
        </span>
        <span class="time-separator">:</span>
        <span class="time-unit-large">
          <span class="unit-value">{{ minutesStr }}</span>
          <span class="unit-label">мин</span>
        </span>
        <span class="time-separator">:</span>
        <span class="time-unit-large seconds-part" :class="{ 'low-visibility': showSecondsLow }">
          <span class="unit-value">{{ secondsStr }}</span>
          <span class="unit-label">с</span>
        </span>
      </div>
    </div>
    
    <!-- Кнопки управления -->
    <div class="timer-buttons-large">
      <button class="timer-btn-large play" @click="startTimer" :disabled="isRunning || currentSeconds <= 0">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>
        </svg>
      </button>
      <button class="timer-btn-large pause" @click="pauseTimer" :disabled="!isRunning">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
          <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
        </svg>
      </button>
    </div>
    
    <div v-if="isExpired" class="expired-badge">
      <span>⏰ Время вышло!</span>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

export default {
  name: 'TimerBlock',
  props: { 
    data: { 
      type: Object, 
      default: () => ({ totalSeconds: 300, mode: 'timer', date: '', time: '00:00:00' }) 
    } 
  },
  emits: ['update', 'delete'],
  
  setup(props, { emit }) {
    // Основные состояния
    const mode = ref('timer');
    const currentSeconds = ref(0);
    const startSeconds = ref(0);
    const targetDate = ref(null);
    const isRunning = ref(false);
    const isExpired = ref(false);
    let interval = null;
    let isUpdating = false;
    let updateTimeout = null;
    
    // Вычисление оставшихся секунд от целевой даты
    const calculateRemainingFromTarget = () => {
      if (!targetDate.value) return 0;
      const now = new Date();
      return Math.max(0, Math.floor((targetDate.value - now) / 1000));
    };
    
    // Полная остановка таймера и очистка интервала
    const stopTimerCompletely = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      isRunning.value = false;
    };
    
    // Полный сброс состояния таймера (как при создании нового)
    const resetTimerState = () => {
      stopTimerCompletely();
      isExpired.value = false;
    };
    
    // Обновление прогресса (синхронизация startSeconds с currentSeconds)
    const syncStartSeconds = () => {
      // Если таймер не запущен, startSeconds должен равняться currentSeconds
      if (!isRunning.value) {
        startSeconds.value = currentSeconds.value;
      }
    };
    
    // Обновление данных из props
    const updateFromProps = () => {
      if (!props.data || isUpdating) return;
      
      isUpdating = true;
      
      // Полностью останавливаем текущий таймер
      resetTimerState();
      
      mode.value = props.data.mode || 'timer';
      
      if (props.data.mode === 'reminder' && props.data.date) {
        const [year, month, day] = props.data.date.split('-').map(Number);
        const [hours, minutes, secs] = (props.data.time || '00:00:00').split(':').map(Number);
        targetDate.value = new Date(year, month - 1, day, hours, minutes, secs);
        
        const remaining = calculateRemainingFromTarget();
        currentSeconds.value = remaining;
        // Устанавливаем startSeconds в текущее значение
        startSeconds.value = remaining;
        isExpired.value = remaining === 0;
      } else {
        targetDate.value = null;
        const total = props.data.totalSeconds ?? 300;
        currentSeconds.value = total;
        // Устанавливаем startSeconds в текущее значение
        startSeconds.value = total;
        isExpired.value = total === 0;
      }
      
      // Восстанавливаем состояние running, если таймер был запущен и не истек
      if (props.data.isRunning && currentSeconds.value > 0 && !isExpired.value) {
        isRunning.value = true;
        // Запускаем таймер после обновления DOM
        setTimeout(() => {
          if (isRunning.value && currentSeconds.value > 0 && !isExpired.value) {
            startTimerInternal();
          }
        }, 50);
      } else {
        isRunning.value = false;
      }
      
      setTimeout(() => {
        isUpdating = false;
      }, 100);
    };
    
    // Внутренний запуск таймера без сохранения состояния
    const startTimerInternal = () => {
      if (interval) clearInterval(interval);
      
      interval = setInterval(() => {
        if (!isRunning.value) return;
        
        let newSeconds;
        if (mode.value === 'reminder' && targetDate.value) {
          newSeconds = calculateRemainingFromTarget();
        } else {
          newSeconds = currentSeconds.value - 1;
        }
        
        if (newSeconds <= 0) {
          currentSeconds.value = 0;
          isExpired.value = true;
          isRunning.value = false;
          if (interval) {
            clearInterval(interval);
            interval = null;
          }
          saveState();
        } else {
          currentSeconds.value = newSeconds;
          // Важно: не обновляем startSeconds здесь, чтобы прогресс работал корректно
          saveState();
        }
      }, 1000);
    };
    
    // Публичный запуск таймера
    const startTimer = () => {
      if (currentSeconds.value <= 0) return;
      if (isRunning.value) return;
      
      isRunning.value = true;
      saveState();
      startTimerInternal();
    };
    
    const pauseTimer = () => {
      if (!isRunning.value) return;
      
      isRunning.value = false;
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      // При паузе синхронизируем startSeconds с текущим значением
      syncStartSeconds();
      saveState();
    };
    
    // Сохранение состояния
    const saveState = () => {
      if (isUpdating) return;
      
      const saveData = {
        mode: mode.value,
        totalSeconds: currentSeconds.value,
        totalSecondsAtStart: startSeconds.value,
        isRunning: isRunning.value
      };
      
      if (mode.value === 'reminder' && targetDate.value) {
        saveData.date = props.data?.date || '';
        saveData.time = props.data?.time || '00:00:00';
      } else {
        saveData.date = '';
        saveData.time = '00:00:00';
      }
      
      emit('update', saveData);
    };
    
    // Вычисляемые значения для отображения
    const daysNum = computed(() => Math.floor(currentSeconds.value / 86400));
    const hoursNum = computed(() => Math.floor((currentSeconds.value % 86400) / 3600));
    const minutesNum = computed(() => Math.floor((currentSeconds.value % 3600) / 60));
    const secondsNum = computed(() => currentSeconds.value % 60);
    
    const hoursStr = computed(() => hoursNum.value.toString().padStart(2, '0'));
    const minutesStr = computed(() => minutesNum.value.toString().padStart(2, '0'));
    const secondsStr = computed(() => secondsNum.value.toString().padStart(2, '0'));
    
    const showSecondsLow = computed(() => daysNum.value === 0 && hoursNum.value === 0 && minutesNum.value < 10);
    
    const daysLabel = computed(() => {
      const d = daysNum.value;
      if (d % 10 === 1 && d % 100 !== 11) return 'день';
      if ([2, 3, 4].includes(d % 10) && ![12, 13, 14].includes(d % 100)) return 'дня';
      return 'дней';
    });
    
    // Исправленный прогресс: всегда вычисляется от startSeconds к currentSeconds
    const progressPercent = computed(() => {
      if (startSeconds.value === 0) return 0;
      // Вычисляем сколько прошло от начального значения
      const elapsed = startSeconds.value - currentSeconds.value;
      const percent = (elapsed / startSeconds.value) * 100;
      // Ограничиваем от 0 до 100
      return Math.min(100, Math.max(0, percent));
    });
    
    const formattedTargetDate = computed(() => {
      if (!targetDate.value) return '';
      return targetDate.value.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    });
    
    // Следим за изменением props и полностью пересоздаем таймер
    watch(() => props.data, () => {
      if (updateTimeout) clearTimeout(updateTimeout);
      updateTimeout = setTimeout(() => {
        updateFromProps();
      }, 50);
    }, { deep: true });
    
    onMounted(() => {
      updateFromProps();
    });
    
    onUnmounted(() => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      if (updateTimeout) clearTimeout(updateTimeout);
      if (isRunning.value) {
        saveState();
      }
    });
    
    return { 
      mode,
      currentSeconds: computed(() => currentSeconds.value),
      daysNum,
      hoursStr,
      minutesStr,
      secondsStr,
      showSecondsLow,
      daysLabel,
      progressPercent,
      formattedTargetDate,
      isRunning: computed(() => isRunning.value), 
      isExpired: computed(() => isExpired.value),
      startTimer, 
      pauseTimer
    };
  }
}
</script>

<style scoped>
/* Стили остаются без изменений */
.timer-block {
  padding: 0.5rem;
  width: 100%;
}

.target-datetime {
  text-align: center;
  margin-bottom: 0.5rem;
  padding: 0.25rem;
  background: rgba(26, 59, 59, 0.03);
  border-radius: 16px;
  font-size: 0.75rem;
}

.datetime-label {
  color: #8a9a9a;
  margin-right: 0.5rem;
}

.datetime-value {
  color: #1a3b3b;
  font-weight: 500;
}

.timer-progress {
  margin-bottom: 0.75rem;
}

.progress-bar-bg {
  height: 4px;
  background: rgba(26, 59, 59, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #1a3b3b, #2a5a5a);
  border-radius: 2px;
  transition: width 0.3s linear;
}

.timer-display-large {
  text-align: center;
  margin-bottom: 1rem;
}

.time-main {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.time-unit-large {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: rgba(26, 59, 59, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  min-width: 60px;
}

.unit-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a3b3b;
  line-height: 1.2;
  font-family: monospace;
}

.unit-label {
  font-size: 0.6rem;
  color: #8a9a9a;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.time-separator {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1a3b3b;
  line-height: 1;
  margin: 0 -0.25rem;
}

.seconds-part.low-visibility {
  opacity: 0.6;
}

.seconds-part.low-visibility .unit-value {
  font-size: 1.2rem;
}

.seconds-part.low-visibility .unit-label {
  font-size: 0.5rem;
}

.timer-buttons-large {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.timer-btn-large {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.timer-btn-large.play {
  background: #1a3b3b;
  color: white;
}

.timer-btn-large.play:hover:not(:disabled) {
  background: #2a4b4b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 59, 59, 0.2);
}

.timer-btn-large.pause {
  background: #f5a623;
  color: white;
}

.timer-btn-large.pause:hover:not(:disabled) {
  background: #e09612;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 166, 35, 0.2);
}

.timer-btn-large:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.timer-btn-large svg {
  stroke: currentColor;
  width: 20px;
  height: 20px;
}

.expired-badge {
  text-align: center;
  margin-top: 0.75rem;
  padding: 0.4rem;
  background: rgba(180, 70, 70, 0.1);
  border-radius: 20px;
  color: #b34141;
  font-size: 0.8rem;
  font-weight: 500;
}

@media (max-width: 480px) {
  .unit-value {
    font-size: 1.5rem;
  }
  
  .time-unit-large {
    min-width: 50px;
    padding: 0.2rem 0.3rem;
  }
  
  .time-separator {
    font-size: 1.3rem;
  }
}
</style>
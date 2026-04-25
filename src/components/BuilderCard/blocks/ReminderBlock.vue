<!-- filepath: /src/components/BuilderCard/blocks/ReminderBlock.vue -->
<template>
  <div class="reminder-block">
    <div class="reminder-info" :class="{ triggered: isTriggered }">
      <div class="reminder-icon">🔔</div>
      <div class="reminder-details">
        <div class="reminder-title">{{ title || 'Напоминание' }}</div>
        <div class="reminder-datetime">{{ formattedDateTime }}</div>
      </div>
      <div v-if="isTriggered" class="reminder-triggered-badge">Выполнено</div>
    </div>
    <div v-if="!isTriggered && remainingTime" class="reminder-remaining">
      <span>Осталось: {{ remainingTime }}</span>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

export default {
  name: 'ReminderBlock',
  props: { data: { type: Object, default: () => ({ title: '', date: '', time: '09:00', triggered: false }) } },
  emits: ['update', 'delete'],
  
  setup(props, { emit }) {
    const title = ref(props.data?.title || '');
    const dateValue = ref(props.data?.date || '');
    const timeValue = ref(props.data?.time || '09:00');
    const isTriggered = ref(props.data?.triggered || false);
    const remainingSeconds = ref(0);
    let interval = null;
    
    const targetDateTime = computed(() => {
      if (!dateValue.value) return null;
      const [year, month, day] = dateValue.value.split('-').map(Number);
      const [hours, minutes] = timeValue.value.split(':').map(Number);
      return new Date(year, month - 1, day, hours, minutes);
    });
    
    const formattedDateTime = computed(() => {
      if (!dateValue.value) return 'Дата не установлена';
      const date = new Date(dateValue.value);
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    });
    
    const remainingTime = computed(() => {
      if (!targetDateTime.value || isTriggered.value) return '';
      const seconds = remainingSeconds.value;
      if (seconds <= 0) return 'Сейчас!';
      
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      
      if (days > 0) return `${days}д ${hours}ч`;
      if (hours > 0) return `${hours}ч ${minutes}м`;
      return `${minutes}м`;
    });
    
    const updateRemaining = () => {
      if (!targetDateTime.value || isTriggered.value) return;
      const now = new Date();
      const diff = Math.max(0, Math.floor((targetDateTime.value - now) / 1000));
      remainingSeconds.value = diff;
      
      if (diff === 0 && !isTriggered.value) {
        triggerReminder();
      }
    };
    
    const triggerReminder = () => {
      if (isTriggered.value) return;
      isTriggered.value = true;
      save();
      
      if (Notification.permission === 'granted') {
        new Notification('May - Напоминание', { body: title.value || 'Время пришло!', icon: '/favicon.ico' });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(perm => {
          if (perm === 'granted') {
            new Notification('May - Напоминание', { body: title.value || 'Время пришло!', icon: '/favicon.ico' });
          }
        });
      }
    };
    
    const save = () => {
      emit('update', {
        title: title.value,
        date: dateValue.value,
        time: timeValue.value,
        triggered: isTriggered.value
      });
    };
    
    const startChecking = () => {
      if (interval) clearInterval(interval);
      updateRemaining();
      interval = setInterval(updateRemaining, 1000);
    };
    
    watch(() => props.data, (newData) => {
      if (newData) {
        title.value = newData.title || '';
        dateValue.value = newData.date || '';
        timeValue.value = newData.time || '09:00';
        isTriggered.value = newData.triggered || false;
        startChecking();
      }
    }, { deep: true, immediate: true });
    
    onMounted(() => {
      if (Notification.permission === 'default') Notification.requestPermission();
      startChecking();
    });
    
    onUnmounted(() => {
      if (interval) clearInterval(interval);
    });
    
    return { title, formattedDateTime, remainingTime, isTriggered };
  }
}
</script>

<style scoped>
.reminder-block {
  width: 100%;
  padding: 0.25rem;
}

.reminder-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(26, 59, 59, 0.05);
  border-radius: 16px;
  transition: all 0.2s ease;
}

.reminder-info.triggered {
  opacity: 0.6;
  background: rgba(26, 59, 59, 0.02);
}

.reminder-icon {
  font-size: 1.5rem;
}

.reminder-details {
  flex: 1;
}

.reminder-title {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1a3b3b;
}

.reminder-datetime {
  font-size: 0.7rem;
  color: #8a9a9a;
}

.reminder-triggered-badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  background: rgba(26, 59, 59, 0.1);
  border-radius: 20px;
  color: #5a6a6a;
}

.reminder-remaining {
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.75rem;
  color: #1a3b3b;
  background: rgba(26, 59, 59, 0.03);
  padding: 0.3rem;
  border-radius: 20px;
}
</style>
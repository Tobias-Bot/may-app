<!-- filepath: /src/components/BuilderCard/blocks/ProgressBlock.vue -->
<template>
  <div class="progress-block">
    <div class="progress-display-large">
      <div class="current-value-large">
        <span class="value-number-large">{{ localData.current }}</span>
        <span class="value-unit-large">{{ localData.unit }}</span>
      </div>
      <div class="progress-bar-large">
        <div class="progress-fill-large" :style="{ width: `${percentage}%` }"></div>
      </div>
      <div class="range-values-large">
        <span>{{ localData.min }}</span>
        <span>{{ localData.max }}</span>
      </div>
    </div>
    <div class="progress-controls-large">
      <button class="progress-btn-large" @click="decrement">−</button>
      <button class="progress-btn-large primary" @click="increment">+</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  name: 'ProgressBlock',
  props: { data: { type: Object, default: () => ({ min: 0, max: 100, step: 1, unit: 'шт', current: 0 }) } },
  emits: ['update', 'delete'],
  
  setup(props, { emit }) {
    const localData = ref({
      min: props.data?.min ?? 0,
      max: props.data?.max ?? 100,
      step: props.data?.step ?? 1,
      unit: props.data?.unit ?? 'шт',
      current: props.data?.current ?? 0
    });

    // Следим за изменением props
    watch(() => props.data, (newData) => {
      if (newData) {
        localData.value = {
          min: newData.min ?? 0,
          max: newData.max ?? 100,
          step: newData.step ?? 1,
          unit: newData.unit ?? 'шт',
          current: newData.current ?? 0
        };
      }
    }, { deep: true });

    const percentage = computed(() => {
      const total = localData.value.max - localData.value.min;
      const current = localData.value.current - localData.value.min;
      if (total === 0) return 0;
      return Math.round((current / total) * 100);
    });

    const increment = () => {
      const newValue = localData.value.current + localData.value.step;
      if (newValue <= localData.value.max) {
        localData.value.current = Math.round(newValue * 10) / 10;
        emit('update', localData.value);
      }
    };

    const decrement = () => {
      const newValue = localData.value.current - localData.value.step;
      if (newValue >= localData.value.min) {
        localData.value.current = Math.round(newValue * 10) / 10;
        emit('update', localData.value);
      }
    };

    return { localData, percentage, increment, decrement };
  }
}
</script>

<style scoped>
.progress-block {
  padding: 0.5rem;
  width: 100%;
}

.progress-display-large {
  margin-bottom: 1rem;
}

.current-value-large {
  text-align: center;
  margin-bottom: 0.5rem;
}

.value-number-large {
  font-size: 2rem;
  font-weight: 700;
  color: #1a3b3b;
}

.value-unit-large {
  font-size: 0.9rem;
  color: #8a9a9a;
  margin-left: 0.25rem;
}

.progress-bar-large {
  height: 12px;
  background: rgba(26, 59, 59, 0.1);
  border-radius: 6px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.progress-fill-large {
  height: 100%;
  background: linear-gradient(90deg, #1a3b3b, #2a5a5a);
  border-radius: 6px;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
}

.progress-fill-large::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3));
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.range-values-large {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #8a9a9a;
}

.progress-controls-large {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.progress-btn-large {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.5rem;
  font-weight: 600;
}

.progress-btn-large.primary {
  background: #1a3b3b;
  color: white;
}

.progress-btn-large.primary:hover {
  background: #2a4b4b;
  transform: translateY(-2px);
}

.progress-btn-large:hover:not(.primary) {
  background: rgba(26, 59, 59, 0.1);
  transform: translateY(-2px);
}
</style>
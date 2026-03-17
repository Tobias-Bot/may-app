<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="close">
      <div class="modal-content" :class="sizeClass">
        <div v-if="!hideHeader" class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="close-button" @click="close">✕</button>
        </div>
        <button v-else class="close-button absolute" @click="close">✕</button>
        <div class="modal-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'ModalWindow',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    hideHeader: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  
  setup(props, { emit }) {
    const sizeClass = computed(() => `modal-${props.size}`);
    
    const close = () => {
      emit('close');
    };
    
    return {
      sizeClass,
      close
    };
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  padding: 0;
  background: #ffffff;
  border-radius: 32px;
  box-shadow: 0 20px 40px -15px rgba(26, 59, 59, 0.2);
  max-height: 90vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
  position: relative;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem 0.5rem 2rem;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 400;
  color: #1a3b3b;
  margin: 0;
  letter-spacing: 0.02em;
}

.close-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: transparent;
  border: 1px solid rgba(26, 59, 59, 0.1);
  color: #8a9a9a;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-button.absolute {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 10;
}

.close-button:hover {
  background: #1a3b3b;
  color: white;
  transform: rotate(90deg);
}

.modal-body {
  padding: 0 2rem 2rem 2rem;
  overflow-y: auto;
  flex: 1;
}

.modal-small {
  max-width: 400px;
}

.modal-medium {
  max-width: 500px;
}

.modal-large {
  max-width: 700px;
}

@media (max-width: 768px) {
  .modal-header {
    padding: 1.25rem 1.5rem 0.5rem 1.5rem;
  }
  
  .modal-body {
    padding: 0 1.5rem 1.5rem 1.5rem;
  }
  
  .close-button.absolute {
    top: 1.25rem;
    right: 1.25rem;
  }
}

@media (max-width: 480px) {
  .modal-header {
    padding: 1rem 1.25rem 0.5rem 1.25rem;
  }
  
  .modal-body {
    padding: 0 1.25rem 1.25rem 1.25rem;
  }
  
  .modal-title {
    font-size: 1.1rem;
  }
  
  .close-button.absolute {
    top: 1rem;
    right: 1rem;
  }
}
</style>
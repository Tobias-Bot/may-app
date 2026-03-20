<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fullscreen-overlay" @click.self="close">
      <div class="fullscreen-container">
        <div class="fullscreen-header">
          <button class="close-button" @click="close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="fullscreen-content">
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  name: 'FullscreenCard',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close'],
  
  setup(props, { emit }) {
    const close = () => {
      emit('close');
    };

    return { close };
  }
}
</script>

<style scoped>
.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 59, 59, 0.2);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
  padding: 2rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fullscreen-container {
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  background: transparent;
  overflow: auto;
  display: flex;
  flex-direction: column;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fullscreen-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
}

.close-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(26, 59, 59, 0.2);
  color: #1a3b3b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.close-button:hover {
  background: #1a3b3b;
  color: white;
}

.fullscreen-content {
  flex: 1;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .fullscreen-overlay {
    padding: 1rem;
  }
  
  .close-button {
    width: 44px;
    height: 44px;
  }
}
</style>
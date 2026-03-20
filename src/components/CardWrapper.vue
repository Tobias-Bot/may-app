<template>
  <div class="card-wrapper">
    <div class="card-inner">
      <slot></slot>
    </div>
    
    <div class="card-actions">
      <!-- Кнопка увеличения - скрыта для фото -->
      <button 
        v-if="!hideExpand" 
        class="action-button expand" 
        @click.stop="openFullscreen" 
        title="Открыть на весь экран"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3H5C3.89543 3 3 3.89543 3 5V8M21 8V5C21 3.89543 20.1046 3 19 3H16M16 21H19C20.1046 21 21 20.1046 21 19V16M3 16V19C3 20.1046 3.89543 21 5 21H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
      
      <button class="action-button delete" @click.stop="showDeleteConfirm = true" title="Удалить">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    
    <div v-if="showDeleteConfirm" class="delete-confirm-overlay" @click.self="cancelDelete">
      <div class="delete-confirm-dialog">
        <p>Удалить карточку?</p>
        <div class="dialog-actions">
          <button class="confirm-button" @click="confirmDelete">Удалить</button>
          <button class="cancel-button" @click="cancelDelete">Отмена</button>
        </div>
      </div>
    </div>
    
    <FullscreenCard :is-open="showFullscreen" @close="closeFullscreen">
      <div class="fullscreen-card">
        <slot></slot>
      </div>
    </FullscreenCard>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import FullscreenCard from './FullscreenCard.vue';

export default {
  name: 'CardWrapper',
  components: {
    FullscreenCard
  },
  props: {
    hideExpand: {
      type: Boolean,
      default: false
    }
  },
  emits: ['delete'],
  
  setup(props, { emit }) {
    const showFullscreen = ref(false);
    const showDeleteConfirm = ref(false);
    
    const openFullscreen = () => {
      showFullscreen.value = true;
      document.body.style.overflow = 'hidden';
    };
    
    const closeFullscreen = () => {
      showFullscreen.value = false;
      document.body.style.overflow = '';
    };
    
    const confirmDelete = () => {
      emit('delete');
      showDeleteConfirm.value = false;
    };
    
    const cancelDelete = () => {
      showDeleteConfirm.value = false;
    };
    
    return {
      showFullscreen,
      showDeleteConfirm,
      openFullscreen,
      closeFullscreen,
      confirmDelete,
      cancelDelete
    };
  }
}
</script>

<style scoped>
.card-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.card-inner {
  cursor: pointer;
  width: 100%;
  height: 100%;
}

/* Убрана анимация сдвига при наведении */
.card-inner:hover {
  /* transform: translateY(-2px); удалено */
}

.card-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.action-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(26, 59, 59, 0.15);
  color: #1a3b3b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.action-button:hover {
  transform: scale(1.1);
}

.action-button.expand:hover {
  background: #1a3b3b;
  color: white;
  border-color: #1a3b3b;
}

.action-button.delete:hover {
  background: #b34141;
  color: white;
  border-color: #b34141;
}

.action-button svg {
  stroke: currentColor;
}

.delete-confirm-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.delete-confirm-dialog {
  background: white;
  padding: 1rem;
  border-radius: 16px;
  text-align: center;
  max-width: 180px;
  box-shadow: 0 10px 25px rgba(26, 59, 59, 0.15);
}

.delete-confirm-dialog p {
  margin-bottom: 0.8rem;
  color: #1a3b3b;
  font-size: 0.9rem;
}

.dialog-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.confirm-button {
  background: #b34141;
  color: white;
  border-radius: 30px;
  padding: 0.4rem 0.8rem;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.confirm-button:hover {
  background: #c45151;
  transform: scale(1.05);
}

.cancel-button {
  background: transparent;
  border: 1px solid rgba(26, 59, 59, 0.2);
  border-radius: 30px;
  padding: 0.4rem 0.8rem;
  color: #1a3b3b;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background: rgba(26, 59, 59, 0.05);
}

.fullscreen-card {
  width: 100%;
  background: transparent;
}
</style>
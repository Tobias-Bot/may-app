<template>
  <div class="bottom-action-buttons" :class="{ hidden: !visible }">
    <div class="action-button-wrapper">
      <button class="action-button pencil-button" @click="toggleToolsDropdown" title="Инструменты">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 3L21 7L7 21H3V17L17 3Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 6L18 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>
      
      <div v-if="showToolsDropdown" class="tools-dropdown" ref="toolsDropdown">
        <button class="dropdown-item" @click="openNoteTool">
          <span class="item-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 3L21 7L7 21H3V17L17 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14 6L18 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <span>Заметка</span>
        </button>
        <button class="dropdown-item" @click="openListTool">
          <span class="item-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <span>Список</span>
        </button>
        <button class="dropdown-item" @click="openPhotoTool">
          <span class="item-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="17" cy="7" r="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M2 16L7 11L12 15L17 10L22 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <span>Фото</span>
        </button>
        <button class="dropdown-item" @click="openProgressTool">
          <span class="item-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L7 8L11 12L17 6L21 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3 20H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <span>Прогресс</span>
        </button>
        <button class="dropdown-item" @click="openTimerTool">
          <span class="item-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12 7V12L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
          <span>Таймер</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'BottomActionButtons',
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  emits: ['open-note', 'open-list', 'open-photo', 'open-progress', 'open-timer'],
  
  setup(props, { emit }) {
    const showToolsDropdown = ref(false);
    const toolsDropdown = ref(null);

    const handleClickOutside = (event) => {
      if (toolsDropdown.value && !toolsDropdown.value.contains(event.target) && !event.target.closest('.action-button-wrapper')) {
        showToolsDropdown.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    const toggleToolsDropdown = () => {
      showToolsDropdown.value = !showToolsDropdown.value;
    };

    const openNoteTool = () => {
      emit('open-note');
      showToolsDropdown.value = false;
    };

    const openListTool = () => {
      emit('open-list');
      showToolsDropdown.value = false;
    };

    const openPhotoTool = () => {
      emit('open-photo');
      showToolsDropdown.value = false;
    };

    const openProgressTool = () => {
      emit('open-progress');
      showToolsDropdown.value = false;
    };

    const openTimerTool = () => {
      emit('open-timer');
      showToolsDropdown.value = false;
    };

    return {
      showToolsDropdown,
      toolsDropdown,
      toggleToolsDropdown,
      openNoteTool,
      openListTool,
      openPhotoTool,
      openProgressTool,
      openTimerTool,
      visible: props.visible
    };
  }
}
</script>

<style scoped>
.bottom-action-buttons {
  position: fixed;
  bottom: 100px;
  right: 20px;
  z-index: 1001;
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.bottom-action-buttons.hidden {
  opacity: 0;
  visibility: hidden;
  transform: translateY(15px);
}

.action-button-wrapper {
  position: relative;
}

.pencil-button {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: white;
  border: 1px solid rgba(26, 59, 59, 0.1);
  color: #1a3b3b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.pencil-button:hover {
  background: #f8f8f8;
  transform: scale(1.05);
  box-shadow: 0 6px 14px rgba(26, 59, 59, 0.15);
}

.pencil-button svg {
  stroke: currentColor;
}

.tools-dropdown {
  position: absolute;
  bottom: 80px;
  right: 0;
  background: white;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 0.5rem;
  box-shadow: 0 10px 30px -10px rgba(26, 59, 59, 0.2);
  border: 1px solid rgba(26, 59, 59, 0.1);
  min-width: 160px;
  z-index: 1002;
  animation: slideUp 0.2s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  width: 100%;
  padding: 0.7rem 1rem;
  background: transparent;
  border: none;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: #1a3b3b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  white-space: nowrap;
}

.dropdown-item:hover {
  background: rgba(26, 59, 59, 0.08);
  transform: translateX(4px);
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
}

.item-icon svg {
  stroke: currentColor;
  width: 18px;
  height: 18px;
}

@media (max-width: 768px) {
  .bottom-action-buttons {
    bottom: 90px;
    right: 16px;
  }
  
  .pencil-button {
    width: 56px;
    height: 56px;
  }
  
  .pencil-button svg {
    width: 26px;
    height: 26px;
  }
}

@media (max-width: 480px) {
  .bottom-action-buttons {
    bottom: 85px;
    right: 12px;
  }
  
  .pencil-button {
    width: 52px;
    height: 52px;
  }
  
  .pencil-button svg {
    width: 24px;
    height: 24px;
  }
}
</style>
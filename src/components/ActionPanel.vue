<template>
  <div class="action-panel" :class="{ hidden: !visible }">
    <div class="panel-container">
      <!-- Кнопка настроек -->
      <button class="action-button" @click="openSettings" title="Настройки">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="2.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M5 12H3M21 12H19M12 5V3M12 21V19M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>

      <!-- Разделитель -->
      <div class="separator"></div>

      <!-- Кнопка карандаш с выпадающим списком -->
      <div class="action-button-wrapper">
        <button class="action-button" @click="toggleToolsDropdown" title="Инструменты">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 3L21 7L7 21H3V17L17 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 6L18 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        
        <!-- Выпадающий список инструментов -->
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
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'ActionPanel',
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  emits: ['open-settings', 'open-note', 'open-list', 'open-photo', 'open-progress', 'open-timer'],
  
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

    const openSettings = () => {
      emit('open-settings');
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
      openSettings,
      openNoteTool,
      openListTool,
      openPhotoTool,
      openProgressTool,
      openTimerTool
    };
  }
}
</script>

<style scoped>
.action-panel {
  position: relative;
  left: 0;
  right: 0;
  z-index: 951;
  background: transparent;
  padding: 8px 0;
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
  opacity: 1;
  visibility: visible;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.action-panel.hidden {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-15px);
}

.panel-container {
  width: 180px; /* Увеличено для 3 кнопок */
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 40px;
  border: 1px solid rgba(26, 59, 59, 0.1);
  box-shadow: 0 4px 12px rgba(26, 59, 59, 0.05);
  pointer-events: auto;
}

.action-button-wrapper {
  position: relative;
}

.action-button {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: #1a3b3b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: rgba(26, 59, 59, 0.05);
  transform: translateY(-1px);
}

.action-button svg {
  stroke: currentColor;
  width: 20px;
  height: 20px;
}

.separator {
  width: 1px;
  height: 22px;
  background: rgba(26, 59, 59, 0.15);
}

.tools-dropdown {
  position: absolute;
  top: 45px;
  right: 0;
  background: white;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 0.5rem;
  box-shadow: 0 10px 30px -10px rgba(26, 59, 59, 0.2);
  border: 1px solid rgba(26, 59, 59, 0.1);
  min-width: 160px;
  z-index: 1002;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  width: 100%;
  padding: 0.6rem 0.9rem;
  background: transparent;
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #1a3b3b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
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
  width: 16px;
  height: 16px;
}

/* Мобильные устройства */
@media (max-width: 768px) {
  .action-panel {
    top: 10px;
    padding: 6px 0;
  }
  
  .panel-container {
    width: 160px;
    padding: 4px 10px;
  }
  
  .action-button {
    width: 34px;
    height: 34px;
  }
  
  .action-button svg {
    width: 18px;
    height: 18px;
  }
  
  .separator {
    height: 20px;
  }
}

@media (max-width: 480px) {
  .action-button {
    width: 32px;
    height: 32px;
  }
  
  .action-button svg {
    width: 16px;
    height: 16px;
  }
  
  .separator {
    height: 18px;
  }
}
</style>
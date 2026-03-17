<template>
  <div class="image-uploader">
    <!-- Если есть изображение - показываем предпросмотр -->
    <div v-if="localImage" class="image-preview" @click="openFullscreen">
      <img :src="localImage" alt="Preview" />
      <div class="preview-overlay">
        <button class="preview-button" @click.stop="replaceImage" title="Заменить">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 3L21 7L7 21H3V17L17 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 6L18 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="preview-button remove" @click.stop="removeImage" title="Удалить">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Если нет изображения - показываем кнопки загрузки -->
    <div v-else class="upload-options">
      <button class="upload-button" @click="triggerFileInput">
        <span class="button-icon">📁</span>
        <span class="button-text">Загрузить с компьютера</span>
      </button>
      
      <button class="upload-button paste" @click="activatePaste" :class="{ active: isPasteActive }">
        <span class="button-icon">📋</span>
        <span class="button-text">{{ isPasteActive ? 'Ожидание вставки...' : 'Вставить фото' }}</span>
      </button>
      
      <p v-if="isPasteActive" class="paste-hint">Нажмите Ctrl+V для вставки</p>
    </div>
    
    <!-- Скрытый input для загрузки файлов -->
    <input 
      type="file" 
      ref="fileInput" 
      accept="image/*" 
      @change="handleFileSelect" 
      class="hidden-input"
    />

    <!-- Полноэкранный просмотр (без модального окна) -->
    <Teleport to="body">
      <div v-if="showFullscreen" class="fullscreen-overlay" @click.self="closeFullscreen">
        <div class="fullscreen-container">
          <img :src="localImage" alt="Full size" />
        </div>
        <button class="fullscreen-close" @click="closeFullscreen">✕</button>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from 'vue';

export default {
  name: 'ImageUploader',
  props: {
    modelValue: {
      type: String,
      default: null
    }
  },
  emits: ['update:modelValue', 'change'],
  
  setup(props, { emit }) {
    const localImage = ref(props.modelValue);
    const fileInput = ref(null);
    const isPasteActive = ref(false);
    const showFullscreen = ref(false);

    // Следим за изменением props
    watch(() => props.modelValue, (newVal) => {
      localImage.value = newVal;
    });

    // Обработка выбора файла
    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file) {
        processFile(file);
      }
    };

    // Активация режима вставки
    const activatePaste = () => {
      isPasteActive.value = true;
      // Автоматически деактивируем через 10 секунд
      setTimeout(() => {
        if (isPasteActive.value) {
          isPasteActive.value = false;
        }
      }, 10000);
    };

    // Обработка вставки из буфера обмена
    const handlePaste = async (event) => {
      if (!isPasteActive.value) return;

      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            processFile(file);
            isPasteActive.value = false;
            event.preventDefault();
            break;
          }
        }
      }
    };

    // Обработка файла
    const processFile = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        localImage.value = imageData;
        emit('update:modelValue', imageData);
        emit('change', imageData);
      };
      reader.readAsDataURL(file);
    };

    // Заменить изображение
    const replaceImage = () => {
      triggerFileInput();
    };

    // Удалить изображение
    const removeImage = () => {
      localImage.value = null;
      emit('update:modelValue', null);
      emit('change', null);
    };

    const triggerFileInput = () => {
      fileInput.value?.click();
    };

    // Открыть на весь экран
    const openFullscreen = () => {
      if (localImage.value) {
        showFullscreen.value = true;
        // Блокируем прокрутку body
        document.body.style.overflow = 'hidden';
      }
    };

    const closeFullscreen = () => {
      showFullscreen.value = false;
      // Возвращаем прокрутку
      document.body.style.overflow = '';
    };

    // Обработка нажатия Escape
    const handleEscape = (event) => {
      if (event.key === 'Escape' && showFullscreen.value) {
        closeFullscreen();
      }
    };

    // Добавляем обработчики при монтировании
    onMounted(() => {
      document.addEventListener('paste', handlePaste);
      document.addEventListener('keydown', handleEscape);
    });

    // Убираем обработчики при размонтировании
    onUnmounted(() => {
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    });

    return {
      localImage,
      fileInput,
      isPasteActive,
      showFullscreen,
      handleFileSelect,
      replaceImage,
      removeImage,
      triggerFileInput,
      activatePaste,
      openFullscreen,
      closeFullscreen
    };
  }
}
</script>

<style scoped>
.image-uploader {
  width: 100%;
}

.upload-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.5rem;
}

.upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(26, 59, 59, 0.05);
  border: 1px dashed rgba(26, 59, 59, 0.2);
  border-radius: 40px;
  color: #1a3b3b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  width: 100%;
}

.upload-button:hover {
  background: rgba(26, 59, 59, 0.1);
  border-color: #1a3b3b;
  transform: translateY(-2px);
}

.upload-button.paste.active {
  background: rgba(26, 59, 59, 0.15);
  border-color: #1a3b3b;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(26, 59, 59, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(26, 59, 59, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(26, 59, 59, 0);
  }
}

.button-icon {
  font-size: 1.2rem;
}

.paste-hint {
  text-align: center;
  font-size: 0.8rem;
  color: #1a3b3b;
  font-style: italic;
  margin-top: -0.25rem;
}

.image-preview {
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 0.25rem;
  cursor: pointer;
  background: rgba(26, 59, 59, 0.02);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview img {
  width: 100%;
  height: auto;
  object-fit: cover; /* Растягиваем по ширине */
  display: block;
  transition: transform 0.3s ease;
}

.image-preview:hover img {
  transform: scale(1.02);
}

.preview-overlay {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.image-preview:hover .preview-overlay {
  opacity: 1;
}

.preview-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #1a3b3b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-button:hover {
  background: #1a3b3b;
  color: white;
  transform: scale(1.1);
}

.preview-button.remove:hover {
  background: #b34141;
}

.preview-button svg {
  stroke: currentColor;
}

.hidden-input {
  display: none;
}

/* Полноэкранный просмотр */
.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 59, 59, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fullscreen-container {
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fullscreen-container img {
  max-width: 100%;
  max-height: 90vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.fullscreen-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1.5rem;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.fullscreen-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .upload-button {
    padding: 0.6rem 1rem;
  }
  
  .preview-button {
    width: 32px;
    height: 32px;
  }
  
  .fullscreen-close {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    top: 15px;
    right: 15px;
  }
}

@media (max-width: 480px) {
  .fullscreen-close {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
    top: 10px;
    right: 10px;
  }
}
</style>
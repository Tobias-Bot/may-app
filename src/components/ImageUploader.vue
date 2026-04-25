<!-- filepath: /src/components/ImageUploader.vue - обновляем кнопки -->
<template>
  <div class="image-uploader">
    <div v-if="localImage" class="image-preview" @click="openFullscreen">
      <img :src="localImage" alt="Preview" />
      <div class="preview-overlay">
        <button class="preview-button" @click.stop="replaceImage" title="Заменить">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 3L21 7L7 21H3V17L17 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 6L18 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        <button class="preview-button remove" @click.stop="removeImage" title="Удалить">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <div v-else class="upload-options">
      <div class="upload-buttons-row">
        <button class="upload-button" @click="triggerFileInput">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V16M8 12L12 16L16 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 16V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        
        <button class="upload-button paste" @click="activatePaste" :class="{ active: isPasteActive }">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="2" width="8" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/>
            <path d="M4 6H20V20H4V6Z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 10H16M8 14H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <p v-if="isPasteActive" class="paste-hint">Нажмите Ctrl+V для вставки</p>
    </div>
    
    <input type="file" ref="fileInput" accept="image/*" @change="handleFileSelect" class="hidden-input" />

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

    watch(() => props.modelValue, (newVal) => {
      localImage.value = newVal;
    });

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file) {
        processFile(file);
      }
    };

    const activatePaste = () => {
      isPasteActive.value = true;
      setTimeout(() => {
        if (isPasteActive.value) {
          isPasteActive.value = false;
        }
      }, 10000);
    };

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

    const replaceImage = () => {
      triggerFileInput();
    };

    const removeImage = () => {
      localImage.value = null;
      emit('update:modelValue', null);
      emit('change', null);
    };

    const triggerFileInput = () => {
      fileInput.value?.click();
    };

    const openFullscreen = () => {
      if (localImage.value) {
        showFullscreen.value = true;
        document.body.style.overflow = 'hidden';
      }
    };

    const closeFullscreen = () => {
      showFullscreen.value = false;
      document.body.style.overflow = '';
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && showFullscreen.value) {
        closeFullscreen();
      }
    };

    onMounted(() => {
      document.addEventListener('paste', handlePaste);
      document.addEventListener('keydown', handleEscape);
    });

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
  padding: 0.5rem;
}

.upload-buttons-row {
  display: flex;
  gap: 0.5rem;
}

.upload-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem;
  background: rgba(26, 59, 59, 0.05);
  border: 1px solid rgba(26, 59, 59, 0.15);
  border-radius: 12px;
  color: #1a3b3b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.upload-button:hover {
  background: rgba(26, 59, 59, 0.1);
  transform: translateY(-2px);
}

.upload-button.paste.active {
  background: rgba(26, 59, 59, 0.15);
  border-color: #1a3b3b;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(26, 59, 59, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(26, 59, 59, 0); }
  100% { box-shadow: 0 0 0 0 rgba(26, 59, 59, 0); }
}

.paste-hint {
  text-align: center;
  font-size: 0.7rem;
  color: #1a3b3b;
  font-style: italic;
  margin-top: 0.5rem;
}

.image-preview {
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background: rgba(26, 59, 59, 0.02);
}

.image-preview img {
  width: 100%;
  height: auto;
  object-fit: cover;
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
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #1a3b3b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.preview-button:hover {
  background: #1a3b3b;
  color: white;
  transform: scale(1.05);
}

.preview-button.remove:hover {
  background: #b34141;
}

.hidden-input {
  display: none;
}

.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  backdrop-filter: blur(12px);
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
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.fullscreen-container img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 12px;
}

.fullscreen-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1.2rem;
}

.fullscreen-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .upload-button {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
}
</style>
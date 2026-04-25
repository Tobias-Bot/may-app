<!-- filepath: /src/App.vue -->
<template>
  <div id="app">
    <div id="background-blur"></div>
    
    <div class="content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    
    <BottomBar 
      @visibility-change="updateNavVisibility" 
      @open-settings="openSettings"
    />
    
    <FloatingActionButton />

    <ModalWindow :is-open="showSettings" @close="closeSettings" title="Настройки" size="medium">
      <div class="modal-form">
        <div class="settings-card">
          <h3>Фон страницы</h3>
          <ImageUploader v-model="backgroundImage" @change="handleBackgroundChange" />
          <div class="background-actions">
            <button class="reset-button" @click="resetBackground" :disabled="!backgroundImage">Сбросить</button>
          </div>
          <p class="settings-note">Изображение будет растянуто на весь фон страницы</p>
        </div>
        <div class="settings-card">
          <h3>О приложении</h3>
          <p>May — пространство для осознанной жизни</p>
          <p class="version">Версия 2.0.0</p>
        </div>
      </div>
    </ModalWindow>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import BottomBar from './components/BottomBar/index.vue';
import FloatingActionButton from './components/FloatingActionButton.vue';
import ModalWindow from './components/ModalWindow.vue';
import ImageUploader from './components/ImageUploader.vue';
import { settingsStore } from './stores/settingsStore';
import { toolsStore } from './stores/toolsStore';
import { spacesStore } from './stores/spacesStore';
import { initDB } from './db/db';

import './styles/global-styles.css';
import './styles/modal-styles.css';
import './styles/settings-styles.css';
import './styles/pwa-styles.css';

export default {
  name: 'App',
  components: {
    BottomBar,
    FloatingActionButton,
    ModalWindow,
    ImageUploader
  },
  
  setup() {
    const navVisible = ref(true);
    const showSettings = ref(false);
    const backgroundImage = ref(null);

    const updateNavVisibility = (visible) => { 
      navVisible.value = visible; 
    };
    
    const openSettings = () => { 
      showSettings.value = true; 
    };
    
    const closeSettings = () => { 
      showSettings.value = false; 
    };

    const applyBackground = (image) => {
      if (image) {
        document.body.style.backgroundImage = `url(${image})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
      } else {
        document.body.style.backgroundImage = '';
      }
    };

    const loadSettings = async () => {
      try {
        await settingsStore.ready();
        const settings = settingsStore.getSettings();
        backgroundImage.value = settings.background || null;
        applyBackground(backgroundImage.value);
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    };

    const saveSettings = async () => {
      try {
        await settingsStore.updateSettings({ background: backgroundImage.value });
      } catch (e) {
        console.error('Failed to save settings', e);
      }
    };

    const handleBackgroundChange = async (image) => {
      backgroundImage.value = image;
      applyBackground(image);
      await saveSettings();
    };

    const resetBackground = async () => {
      backgroundImage.value = null;
      applyBackground(null);
      await saveSettings();
    };

    const initializeApp = async () => {
      try {
        await initDB();
        await toolsStore.ready();
        await spacesStore.ready();
        await loadSettings();
      } catch (e) {
        console.error('Failed to initialize app', e);
      }
    };

    onMounted(() => {
      initializeApp();
      window.addEventListener('open-settings', openSettings);
    });

    return {
      navVisible,
      showSettings,
      backgroundImage,
      updateNavVisibility,
      openSettings,
      closeSettings,
      handleBackgroundChange,
      resetBackground
    };
  }
}
</script>

<style>
#background-blur {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
  background: transparent;
}

.content {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem 16px 8rem 16px;
  transition: padding 0.3s ease;
}

@media (min-width: 1440px) {
  .content {
    padding: 2rem 32px 8rem 32px;
  }
}

@media (min-width: 1920px) {
  .content {
    padding: 2rem 64px 8rem 64px;
  }
}

@media (max-width: 768px) {
  .content {
    padding: 1.5rem 16px 5rem 16px;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 1rem 12px 5rem 12px;
  }
}
</style>
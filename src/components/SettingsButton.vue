<template>
  <button class="settings-button" :class="{ 'mobile-position': isMobile }" @click="openSettings" title="Настройки">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 6V12L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
      <path d="M12 3V5M12 19V21M21 12H19M5 12H3M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'SettingsButton',
  setup() {
    const isMobile = ref(window.innerWidth <= 768);

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768;
    };

    onMounted(() => {
      window.addEventListener('resize', checkMobile);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile);
    });

    const openSettings = () => {
      window.dispatchEvent(new Event('open-settings'));
    };

    return {
      isMobile,
      openSettings
    };
  }
}
</script>

<style scoped>
.settings-button {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: #1a3b3b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 900;
  box-shadow: 0 5px 15px -5px rgba(26, 59, 59, 0.15);
  transition: all 0.2s ease;
}

.settings-button:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px) rotate(90deg);
}

/* Мобильная позиция - справа внизу */
.settings-button.mobile-position {
  top: auto;
  bottom: 100px;
  right: 20px;
}

.settings-button svg {
  stroke: currentColor;
}

@media (max-width: 768px) {
  .settings-button {
    width: 56px;
    height: 56px;
  }
}
</style>
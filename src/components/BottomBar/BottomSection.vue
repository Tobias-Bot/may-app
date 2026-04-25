<!-- filepath: /src/components/BottomBar/BottomSection.vue -->
<template>
  <div class="bottom-section">
    <div class="pilot-controls">
      <button class="nav-arrow settings-btn" @click="openSettings" title="Настройки">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/>
          <path d="M19.4 15.1L18.3 16.2C18.1 16.4 17.8 16.4 17.6 16.2L15.8 14.4C15.6 14.2 15.6 13.9 15.8 13.7L16.9 12.6C17.1 12.4 17.1 12.1 16.9 11.9L15.8 10.8C15.6 10.6 15.6 10.3 15.8 10.1L17.6 8.3C17.8 8.1 18.1 8.1 18.3 8.3L19.4 9.4C20.2 10.2 20.2 11.4 19.4 12.2L18.3 13.3C18.1 13.5 18.1 13.8 18.3 14L19.4 15.1C20.2 15.9 20.2 17.1 19.4 17.9L18.3 19C17.5 19.8 16.3 19.8 15.5 19L14.4 17.9C14.2 17.7 14.2 17.4 14.4 17.2L15.5 16.1C15.7 15.9 15.7 15.6 15.5 15.4L13.7 13.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M4.6 15.1L5.7 16.2C5.9 16.4 6.2 16.4 6.4 16.2L8.2 14.4C8.4 14.2 8.4 13.9 8.2 13.7L7.1 12.6C6.9 12.4 6.9 12.1 7.1 11.9L8.2 10.8C8.4 10.6 8.4 10.3 8.2 10.1L6.4 8.3C6.2 8.1 5.9 8.1 5.7 8.3L4.6 9.4C3.8 10.2 3.8 11.4 4.6 12.2L5.7 13.3C5.9 13.5 5.9 13.8 5.7 14L4.6 15.1C3.8 15.9 3.8 17.1 4.6 17.9L5.7 19C6.5 19.8 7.7 19.8 8.5 19L9.6 17.9C9.8 17.7 9.8 17.4 9.6 17.2L8.5 16.1C8.3 15.9 8.3 15.6 8.5 15.4L10.3 13.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
      
      <button class="nav-arrow" @click="prevSpace" :disabled="!hasPrevSpace">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <div class="logo-container" @click="openSpaceMenu">
        <img src="/logo.png" alt="May" class="logo-image" />
      </div>
      
      <button class="nav-arrow" @click="nextSpace" :disabled="!hasNextSpace">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      
      <button class="nav-arrow tools-btn" @click="createCard" title="Создать карточку">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 3L21 7L7 21H3V17L17 3Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 6L18 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    
    <!-- Меню пространств (рендерится отдельно через портал) -->
  </div>
</template>

<script>
export default {
  name: 'BottomSection',
  props: {
    hasPrevSpace: Boolean,
    hasNextSpace: Boolean
  },
  emits: ['open-settings', 'prev-space', 'next-space', 'open-space-menu', 'create-card'],
  
  setup(props, { emit }) {
    const openSettings = () => {
      emit('open-settings');
    };
    
    const prevSpace = () => {
      emit('prev-space');
    };
    
    const nextSpace = () => {
      emit('next-space');
    };
    
    const openSpaceMenu = () => {
      emit('open-space-menu');
    };
    
    const createCard = () => {
      emit('create-card');
    };
    
    return {
      openSettings,
      prevSpace,
      nextSpace,
      openSpaceMenu,
      createCard
    };
  }
}
</script>

<style scoped>
.bottom-section {
  width: 100%;
}

.pilot-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 60px;
  padding: 8px 16px;
  box-shadow: 0 15px 30px -12px rgba(26, 59, 59, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.nav-arrow {
  width: 48px;
  height: 48px;
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

.nav-arrow:hover:not(:disabled) {
  background: rgba(26, 59, 59, 0.1);
  transform: scale(1.1);
}

.nav-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-arrow svg {
  stroke: currentColor;
}

.settings-btn, .tools-btn {
  background: rgba(26, 59, 59, 0.05);
}

.settings-btn:hover, .tools-btn:hover {
  background: rgba(26, 59, 59, 0.15);
}

.logo-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logo-container:hover {
  transform: scale(1.1);
}

.logo-image {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

@media (max-width: 768px) {
  .pilot-controls {
    gap: 8px;
    padding: 6px 12px;
  }
  
  .nav-arrow {
    width: 40px;
    height: 40px;
  }
  
  .logo-container {
    width: 50px;
    height: 50px;
  }
  
  .logo-image {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 480px) {
  .nav-arrow {
    width: 36px;
    height: 36px;
  }
  
  .logo-container {
    width: 44px;
    height: 44px;
  }
  
  .logo-image {
    width: 44px;
    height: 44px;
  }
  
  .nav-arrow svg {
    width: 20px;
    height: 20px;
  }
}
</style>
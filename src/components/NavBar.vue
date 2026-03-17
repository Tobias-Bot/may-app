<template>
  <nav class="nav-bar" :class="{ hidden: !navVisible }">
    <!-- Мы (новая иконка - мир/общение) -->
    <button 
      class="nav-tab"
      :class="{ active: $route.path === '/people' }"
      @click="$router.push('/people')"
    >
      <span class="tab-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
          <path d="M3 12H21M12 3C9.5 5 8 8 8 12C8 16 9.5 19 12 21C14.5 19 16 16 16 12C16 8 14.5 5 12 3Z" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </span>
      <span class="tab-label">Мы</span>
    </button>

    <!-- Я (иконка профиля) -->
    <button 
      class="nav-tab"
      :class="{ active: $route.path === '/ya' }"
      @click="$router.push('/ya')"
    >
      <span class="tab-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/>
          <path d="M5 20V19C5 15.6863 7.68629 13 11 13H13C16.3137 13 19 15.6863 19 19V20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </span>
      <span class="tab-label">Я</span>
    </button>

    <!-- Логотип (кликабельный) -->
    <div class="logo-container" @click="openAboutModal">
      <img src="/logo.png" alt="May" class="logo-image" />
    </div>

    <!-- Дом -->
    <button 
      class="nav-tab"
      :class="{ active: $route.path === '/dom' }"
      @click="$router.push('/dom')"
    >
      <span class="tab-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 10L12 3L21 10V20H3V10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <span class="tab-label">Дом</span>
    </button>

    <!-- Близкие -->
    <button 
      class="nav-tab"
      :class="{ active: $route.path === '/blizkie' }"
      @click="$router.push('/blizkie')"
    >
      <span class="tab-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 20V19C17 16.2386 14.7614 14 12 14H7C4.23858 14 2 16.2386 2 19V20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="9.5" cy="7.5" r="3.5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M22 20V19C22 16.2386 19.7614 14 17 14H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="17" cy="7.5" r="3.5" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </span>
      <span class="tab-label">Близкие</span>
    </button>
  </nav>

  <!-- Модальное окно "О приложении" -->
  <ModalWindow :is-open="showAboutModal" @close="closeAboutModal" title="О приложении" size="small">
    <div class="about-content">
      <div class="about-logo">
        <img src="/logo.png" alt="May" class="about-logo-image" />
      </div>
      <h3 class="app-name">May</h3>
      <p class="app-description">
        Пространство для осознанной жизни. Здесь вы можете вести заметки, 
        списки, отслеживать баланс жизни и делиться моментами с близкими.
      </p>
      <div class="app-version">Версия 1.0.0</div>
      <div class="app-year">© 2026 May</div>
    </div>
  </ModalWindow>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import ModalWindow from './ModalWindow.vue';

export default {
  name: 'NavBar',
  components: {
    ModalWindow
  },
  emits: ['visibility-change'],
  
  setup(props, { emit }) {
    const route = useRoute();
    const navVisible = ref(true);
    const showAboutModal = ref(false);
    
    let lastScrollTop = 0;
    const scrollThreshold = 10;

    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      
      if (Math.abs(currentScroll - lastScrollTop) <= scrollThreshold) {
        return;
      }

      if (currentScroll > lastScrollTop && currentScroll > 50) {
        navVisible.value = false;
      } else {
        navVisible.value = true;
      }
      
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    };

    // Следим за изменением видимости и отправляем событие
    watch(navVisible, (newVal) => {
      emit('visibility-change', newVal);
    });

    onMounted(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      emit('visibility-change', navVisible.value);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    const openAboutModal = () => {
      showAboutModal.value = true;
    };

    const closeAboutModal = () => {
      showAboutModal.value = false;
    };

    return {
      navVisible,
      showAboutModal,
      openAboutModal,
      closeAboutModal
    };
  }
}
</script>

<style scoped>
.nav-bar {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 60px;
  padding: 8px 16px;
  box-shadow: 0 15px 30px -12px rgba(26, 59, 59, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
  opacity: 1;
  visibility: visible;
  width: auto;
  min-width: 500px;
  max-width: 90vw;
  justify-content: center;
}

.nav-bar.hidden {
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%) translateY(15px);
}

.nav-tab {
  background: transparent;
  border: none;
  border-radius: 50px;
  padding: 10px 16px;
  font-size: 0.95rem;
  font-weight: 400;
  color: #5a6a6a;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid transparent;
}

.nav-tab:hover {
  color: #1a3b3b;
  background: rgba(255, 255, 255, 0.5);
}

.nav-tab.active {
  background: white;
  color: #1a3b3b;
  box-shadow: 0 4px 10px rgba(26, 59, 59, 0.1);
}

.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-icon svg {
  stroke: currentColor;
}

/* Логотип по центру */
.logo-container {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 8px;
}

.logo-container:hover {
  transform: scale(1.1);
}

.logo-image {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

/* Модальное окно "О приложении" */
.about-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0.5rem 0;
}

.about-logo {
  margin-bottom: 1.5rem;
}

.about-logo-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.app-name {
  font-size: 1.8rem;
  font-weight: 350;
  color: #1a3b3b;
  margin-bottom: 1rem;
}

.app-description {
  font-size: 1rem;
  color: #5a6a6a;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  max-width: 400px;
}

.app-version {
  font-size: 0.9rem;
  color: #8a9a9a;
  margin-bottom: 0.5rem;
}

.app-year {
  font-size: 0.85rem;
  color: #aababa;
}

@media (max-width: 768px) {
  .nav-bar {
    bottom: 20px;
    min-width: auto;
    width: 90vw;
    padding: 6px 12px;
  }
  
  .nav-tab {
    padding: 8px 12px;
    gap: 4px;
  }
  
  .tab-label {
    font-size: 0.9rem;
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
  .tab-label {
    display: none;
  }
  
  .nav-tab {
    padding: 10px;
  }
  
  .logo-container {
    width: 44px;
    height: 44px;
  }
  
  .logo-image {
    width: 44px;
    height: 44px;
  }
}
</style>
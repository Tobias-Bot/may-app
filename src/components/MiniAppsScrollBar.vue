<template>
  <div class="mini-apps-scroll-bar" :class="{ hidden: !visible }">
    <div class="scroll-container" ref="scrollContainer">
      <div class="scroll-content" :style="{ transform: `translateX(-${scrollPosition}px)` }">
        <button 
          v-for="app in miniAppsForCurrentPage" 
          :key="app.id"
          class="mini-app-button"
          @click="openMiniApp(app)"
          :title="app.name"
        >
          <span class="button-emoji">{{ app.emoji }}</span>
        </button>
      </div>
    </div>
    
    <!-- Стрелки навигации (только для ПК) -->
    <button 
      v-if="!isMobile && showLeftArrow" 
      class="scroll-arrow left" 
      @click="scrollLeft"
      aria-label="Прокрутить влево"
    >
      ←
    </button>
    <button 
      v-if="!isMobile && showRightArrow" 
      class="scroll-arrow right" 
      @click="scrollRight"
      aria-label="Прокрутить вправо"
    >
      →
    </button>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'MiniAppsScrollBar',
  
  setup() {
    const route = useRoute();
    const router = useRouter();
    
    const visible = ref(true);
    const scrollContainer = ref(null);
    const scrollPosition = ref(0);
    const maxScroll = ref(0);
    const isMobile = ref(window.innerWidth <= 768);
    
    let lastScrollTop = 0;
    const scrollThreshold = 10;

    // Мини-приложения для каждой страницы
    const miniAppsForPage = {
      ya: [
        { id: 'balance', emoji: '⚖️', name: 'Баланс', path: '/mini-apps/balance' },
        { id: 'gratitude', emoji: '🙏', name: 'Благодарности', path: '/mini-apps/gratitude' },
        { id: 'mood', emoji: '🎭', name: 'Настроение', path: '/mini-apps/mood' },
        { id: 'habits', emoji: '🌱', name: 'Привычки', path: '/mini-apps/habits' },
        { id: 'finance', emoji: '💰', name: 'Трекер финансов', path: '/mini-apps/finance' }
      ],
      dom: [
        { id: 'balance', emoji: '⚖️', name: 'Баланс', path: '/mini-apps/balance' },
        { id: 'chores', emoji: '🧹', name: 'Домашние дела', path: '/mini-apps/chores' },
        { id: 'shopping', emoji: '🛒', name: 'Список покупок', path: '/mini-apps/shopping' },
        { id: 'plants', emoji: '🌿', name: 'Уход за растениями', path: '/mini-apps/plants' }
      ],
      blizkie: [
        { id: 'balance', emoji: '⚖️', name: 'Баланс', path: '/mini-apps/balance' },
        { id: 'birthdays', emoji: '🎂', name: 'Дни рождения', path: '/mini-apps/birthdays' },
        { id: 'calls', emoji: '📞', name: 'Звонки', path: '/mini-apps/calls' },
        { id: 'gifts', emoji: '🎁', name: 'Идеи подарков', path: '/mini-apps/gifts' }
      ],
      people: [
        { id: 'balance', emoji: '⚖️', name: 'Баланс', path: '/mini-apps/balance' },
        { id: 'network', emoji: '🤝', name: 'Нетворкинг', path: '/mini-apps/network' },
        { id: 'events', emoji: '📅', name: 'События', path: '/mini-apps/events' }
      ]
    };

    const currentPage = computed(() => {
      return route.path.replace('/', '') || 'ya';
    });

    const miniAppsForCurrentPage = computed(() => {
      return miniAppsForPage[currentPage.value] || [];
    });

    const showLeftArrow = computed(() => scrollPosition.value > 0);
    const showRightArrow = computed(() => scrollPosition.value < maxScroll.value);

    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      
      if (Math.abs(currentScroll - lastScrollTop) <= scrollThreshold) {
        return;
      }

      if (currentScroll > lastScrollTop && currentScroll > 50) {
        visible.value = false;
      } else {
        visible.value = true;
      }
      
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    };

    const updateMaxScroll = () => {
      if (scrollContainer.value) {
        const container = scrollContainer.value;
        const content = container.querySelector('.scroll-content');
        if (content) {
          maxScroll.value = Math.max(0, content.scrollWidth - container.clientWidth);
        }
      }
    };

    const scrollLeft = () => {
      scrollPosition.value = Math.max(0, scrollPosition.value - 250);
    };

    const scrollRight = () => {
      scrollPosition.value = Math.min(maxScroll.value, scrollPosition.value + 250);
    };

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768;
    };

    const openMiniApp = (app) => {
      sessionStorage.setItem('returnPath', route.path);
      router.push(app.path);
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', () => {
        checkMobile();
        updateMaxScroll();
      });
      updateMaxScroll();
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    });

    watch([miniAppsForCurrentPage, scrollContainer], () => {
      setTimeout(updateMaxScroll, 100);
    });

    return {
      visible,
      scrollContainer,
      scrollPosition,
      showLeftArrow,
      showRightArrow,
      isMobile,
      miniAppsForCurrentPage,
      scrollLeft,
      scrollRight,
      openMiniApp
    };
  }
}
</script>

<style scoped>
.mini-apps-scroll-bar {
  position: relative;
  left: 0;
  right: 0;
  z-index: 950;
  background: transparent;
  padding: 8px 0;
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
  opacity: 1;
  visibility: visible;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.mini-apps-scroll-bar.hidden {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-15px);
}

.scroll-container {
  overflow: hidden;
  position: relative;
  margin: 0;
  padding: 0 20px;
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 40px;
  border: 1px solid rgba(26, 59, 59, 0.1);
  box-shadow: 0 4px 12px rgba(26, 59, 59, 0.05);
}

.scroll-content {
  display: flex;
  gap: 10px;
  transition: transform 0.3s ease;
  white-space: nowrap;
  justify-content: flex-start;
  align-items: center;
  
}

.mini-app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: transparent;
  border: none;
  color: #1a3b3b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2rem;
  border-radius: 50%;
}

.mini-app-button:hover {
  background: rgba(26, 59, 59, 0.05);
  transform: translateY(-1px);
}

.button-emoji {
  font-size: 1.2rem;
  line-height: 1;
}

.scroll-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: 1px solid rgba(26, 59, 59, 0.15);
  color: #1a3b3b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
  font-size: 1rem;
  pointer-events: auto;
}

.scroll-arrow:hover {
  background: #1a3b3b;
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.scroll-arrow.left {
  left: 5px;
}

.scroll-arrow.right {
  right: 5px;
}

/* Мобильные устройства */
@media (max-width: 768px) {
  .mini-apps-scroll-bar {
    top: 10px;
    padding: 6px 0;
  }
  
  .scroll-container {
    width: calc(100% - 32px);
    max-width: 340px;
    padding: 0 16px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  
  .scroll-container::-webkit-scrollbar {
    display: none;
  }
  
  .scroll-content {
    transform: none !important;
    width: max-content;
    gap: 15px;
    padding: 4px 0;
  }
  
  .mini-app-button {
    width: 34px;
    height: 34px;
    font-size: 1.1rem;
  }
  
  .button-emoji {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .mini-app-button {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
  
  .button-emoji {
    font-size: 1rem;
  }
}
</style>
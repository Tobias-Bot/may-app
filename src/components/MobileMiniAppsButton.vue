<template>
  <div class="mobile-mini-apps" :class="{ hidden: !visible }">
    <button class="mini-apps-toggle" @click="toggleMenu" title="Мини-приложения">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" stroke-width="1.5"/>
        <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" stroke-width="1.5"/>
        <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" stroke-width="1.5"/>
        <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" stroke-width="1.5"/>
      </svg>
    </button>

    <div v-if="showMenu" class="mini-apps-dropdown" ref="dropdown">
      <button 
        v-for="app in miniAppsForCurrentPage" 
        :key="app.id"
        class="dropdown-item"
        @click="openMiniApp(app)"
      >
        <span class="item-emoji">{{ app.emoji }}</span>
        <span class="item-name">{{ app.name }}</span>
      </button>
      
      <div class="dropdown-divider"></div>
      
      <button class="dropdown-item settings-item" @click="openSettings">
        <span class="item-emoji">⚙️</span>
        <span class="item-name">Настройки</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'MobileMiniAppsButton',
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  emits: ['open-settings'],
  
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();
    const showMenu = ref(false);
    const dropdown = ref(null);
    const isMobile = ref(window.innerWidth <= 768);

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768;
    };

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

    const handleClickOutside = (event) => {
      if (dropdown.value && !dropdown.value.contains(event.target) && !event.target.closest('.mini-apps-toggle')) {
        showMenu.value = false;
      }
    };

    const toggleMenu = () => {
      showMenu.value = !showMenu.value;
    };

    const openMiniApp = (app) => {
      sessionStorage.setItem('returnPath', route.path);
      router.push(app.path);
      showMenu.value = false;
    };

    const openSettings = () => {
      emit('open-settings');
      showMenu.value = false;
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('resize', checkMobile);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', checkMobile);
    });

    return {
      showMenu,
      dropdown,
      isMobile,
      miniAppsForCurrentPage,
      toggleMenu,
      openMiniApp,
      openSettings,
      visible: props.visible
    };
  }
}
</script>

<style scoped>
.mobile-mini-apps {
  position: fixed;
  bottom: 100px;
  left: 20px;
  z-index: 1001;
  pointer-events: auto;
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
  opacity: 1;
  visibility: visible;
}

.mobile-mini-apps.hidden {
  opacity: 0;
  visibility: hidden;
  transform: translateY(15px);
}

.mini-apps-toggle {
  width: 56px;
  height: 56px;
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

.mini-apps-toggle:hover {
  background: #f8f8f8;
  transform: scale(1.05);
}

.mini-apps-toggle svg {
  stroke: currentColor;
}

.mini-apps-dropdown {
  position: absolute;
  bottom: 70px;
  left: 0;
  background: white;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 0.5rem;
  box-shadow: 0 10px 30px -10px rgba(26, 59, 59, 0.2);
  border: 1px solid rgba(26, 59, 59, 0.1);
  min-width: 200px;
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
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #1a3b3b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.dropdown-item:hover {
  background: rgba(26, 59, 59, 0.08);
  transform: translateX(4px);
}

.dropdown-divider {
  height: 1px;
  background: rgba(26, 59, 59, 0.1);
  margin: 0.5rem 0;
}

.settings-item {
  margin-top: 0.25rem;
  color: #b34141;
}

.settings-item:hover {
  background: rgba(180, 70, 70, 0.1);
  color: #b34141;
}

.item-emoji {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.item-name {
  flex: 1;
}

@media (max-width: 480px) {
  .mobile-mini-apps {
    bottom: 90px;
    left: 16px;
  }
  
  .mini-apps-toggle {
    width: 48px;
    height: 48px;
  }
  
  .mini-apps-dropdown {
    min-width: 180px;
  }
}
</style>
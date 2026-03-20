<template>
  <div v-if="!isMobile" class="mini-apps-sidebar" :class="{ hidden: !visible }">
    <div class="sidebar-container">
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
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'MiniAppsSidebar',
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  
  setup(props) {
    const route = useRoute();
    const router = useRouter();
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

    const openMiniApp = (app) => {
      sessionStorage.setItem('returnPath', route.path);
      router.push(app.path);
    };

    onMounted(() => {
      window.addEventListener('resize', checkMobile);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile);
    });

    return {
      isMobile,
      miniAppsForCurrentPage,
      openMiniApp,
      visible: props.visible // <-- Добавляем visible
    };
  }
}
</script>

<style scoped>
.mini-apps-sidebar {
  position: fixed;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 950;
  display: flex;
  flex-direction: column;
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
  opacity: 1;
  visibility: visible;
}

.mini-apps-sidebar.hidden {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-50%) translateX(-15px);
}

.sidebar-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: auto;
}

.mini-app-button {
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
  font-size: 1.4rem;
}

.mini-app-button:hover {
  background: #f8f8f8;
  transform: scale(1.1);
  box-shadow: 0 6px 14px rgba(26, 59, 59, 0.15);
  border-color: rgba(26, 59, 59, 0.2);
}

@media (max-width: 768px) {
  .mini-apps-sidebar {
    display: none;
  }
}
</style>
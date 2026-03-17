<template>
  <div class="mini-app-page">
    <div class="mini-app-header">
      <h1 class="page-title">{{ appTitle }}</h1>
      <button class="close-button" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    
    <div class="mini-app-container">
      <BalanceTracker v-if="appType === 'balance'" />
      <div v-else class="coming-soon">
        <span class="coming-soon-icon">🚧</span>
        <h2>Скоро появится</h2>
        <p>Это мини-приложение находится в разработке</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BalanceTracker from '../components/mini-apps/BalanceTracker.vue';

export default {
  name: 'MiniAppPage',
  components: {
    BalanceTracker
  },
  
  setup() {
    const router = useRouter();
    const route = useRoute();
    const appType = ref(route.params.type || 'balance');
    const appTitle = ref('');

    const appTitles = {
      balance: 'Баланс',
      gratitude: 'Благодарности',
      mood: 'Настроение',
      habits: 'Привычки',
      finance: 'Трекер финансов',
      chores: 'Домашние дела',
      shopping: 'Список покупок',
      plants: 'Уход за растениями',
      birthdays: 'Дни рождения',
      calls: 'Звонки',
      gifts: 'Идеи подарков',
      network: 'Нетворкинг',
      events: 'События'
    };

    onMounted(() => {
      appTitle.value = appTitles[appType.value] || 'Мини-приложение';
    });

    const goBack = () => {
      const returnPath = sessionStorage.getItem('returnPath') || '/ya';
      router.push(returnPath);
    };

    return {
      appType,
      appTitle,
      goBack
    };
  }
}
</script>

<style scoped>
.mini-app-page {
  animation: fadeInPage 0.25s ease;
  width: 100%;
  min-height: 400px;
  padding: 2rem 1.5rem;
}

@keyframes fadeInPage {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.mini-app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 350;
  color: #1a3b3b;
  margin: 0;
}

.close-button {
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
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(26, 59, 59, 0.1);
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: rotate(90deg);
}

.close-button svg {
  stroke: currentColor;
}

.mini-app-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 32px;
  padding: 3rem 2rem;
  border: 1px solid rgba(26, 59, 59, 0.08);
}

.coming-soon-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.coming-soon h2 {
  font-size: 1.8rem;
  font-weight: 350;
  color: #1a3b3b;
  margin-bottom: 1rem;
}

.coming-soon p {
  font-size: 1rem;
  color: #8a9a9a;
  max-width: 400px;
}

@media (max-width: 768px) {
  .mini-app-page {
    padding: 1.5rem 1rem;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .close-button {
    width: 44px;
    height: 44px;
  }
  
  .coming-soon {
    min-height: 300px;
    padding: 2rem 1.5rem;
  }
  
  .coming-soon-icon {
    font-size: 3rem;
  }
  
  .coming-soon h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .mini-app-page {
    padding: 1rem 0.75rem;
  }
  
  .page-title {
    font-size: 1.6rem;
  }
  
  .close-button {
    width: 40px;
    height: 40px;
  }
}
</style>
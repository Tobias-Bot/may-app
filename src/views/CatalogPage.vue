<!-- filepath: /src/views/CatalogPage.vue -->
<template>
  <div class="catalog-page">
    <div class="catalog-header">
      <button class="back-button" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="catalog-title">Каталог мини-приложений</h1>
      <div class="placeholder"></div>
    </div>
    
    <div class="catalog-categories">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        class="category-tab"
        :class="{ active: currentCategory === cat.id }"
        @click="currentCategory = cat.id"
      >
        <span class="category-icon"><MiniAppIcon :icon="cat.icon" /></span>
        <span class="category-name">{{ cat.name }}</span>
      </button>
    </div>
    
    <div class="catalog-grid">
      <div 
        v-for="app in filteredApps" 
        :key="app.id"
        class="catalog-item"
        :class="{ added: isAppAdded(app.id) }"
      >
        <div class="item-icon" :style="{ backgroundColor: app.color + '20' }">
          <MiniAppIcon :icon="app.icon" />
        </div>
        <div class="item-info">
          <h3 class="item-name">{{ app.name }}</h3>
          <p class="item-description">{{ app.description }}</p>
        </div>
        <button 
          class="add-button"
          :class="{ added: isAppAdded(app.id) }"
          @click="toggleApp(app)"
        >
          <span v-if="!isAppAdded(app.id)">+ Добавить</span>
          <span v-else>✓ Добавлено</span>
        </button>
      </div>
    </div>
    
    <div v-if="filteredApps.length === 0" class="empty-catalog">
      <span class="empty-icon">📦</span>
      <p>Нет мини-приложений в этой категории</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import MiniAppIcon from '../components/MiniAppIcon.vue';
import { MINI_APPS_CATALOG, categories } from '../config/miniAppsCatalog';
import { spaceMiniAppsStore } from '../stores/spaceMiniAppsStore';

export default {
  name: 'CatalogPage',
  components: { MiniAppIcon },
  
  setup() {
    const router = useRouter();
    const route = useRoute();
    const spaceId = ref(route.params.spaceId);
    const currentCategory = ref('all');
    const spaceApps = ref([]);
    
    const filteredApps = computed(() => {
      if (currentCategory.value === 'all') {
        return MINI_APPS_CATALOG;
      }
      return MINI_APPS_CATALOG.filter(app => app.category === currentCategory.value);
    });
    
    const isAppAdded = (appId) => {
      return spaceApps.value.some(app => app.appId === appId);
    };
    
    const loadSpaceApps = async () => {
      await spaceMiniAppsStore.ready();
      spaceApps.value = spaceMiniAppsStore.getMiniApps(spaceId.value);
    };
    
    const toggleApp = async (app) => {
      if (isAppAdded(app.id)) {
        await spaceMiniAppsStore.removeMiniApp(spaceId.value, app.id);
      } else {
        await spaceMiniAppsStore.addMiniApp(spaceId.value, app.id);
      }
      await loadSpaceApps();
    };
    
    const goBack = () => {
      const returnPath = sessionStorage.getItem('returnPath') || `/space/${spaceId.value}`;
      router.push(returnPath);
    };
    
    onMounted(async () => {
      await loadSpaceApps();
    });
    
    return {
      spaceId,
      currentCategory,
      categories,
      filteredApps,
      isAppAdded,
      toggleApp,
      goBack
    };
  }
}
</script>

<style scoped>
.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  overflow-x: hidden;
}

.catalog-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  border: 1px solid rgba(26, 59, 59, 0.08);
  transition: all 0.2s ease;
  text-align: center;
}

.catalog-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(26, 59, 59, 0.1);
}

.catalog-page {
  animation: fadeInPage 0.25s ease;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

@keyframes fadeInPage {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.catalog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.back-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(26, 59, 59, 0.1);
  color: #1a3b3b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.05);
}

.back-button svg {
  stroke: currentColor;
}

.catalog-title {
  font-size: 1.4rem;
  font-weight: 350;
  color: #1a3b3b;
  margin: 0;
}

.placeholder {
  width: 44px;
}

.catalog-categories {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 0.5rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.catalog-categories::-webkit-scrollbar {
  display: none;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(26, 59, 59, 0.1);
  border-radius: 40px;
  color: #5a6a6a;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.category-tab:hover {
  background: rgba(255, 255, 255, 0.8);
  color: #1a3b3b;
}

.category-tab.active {
  background: #1a3b3b;
  color: white;
  border-color: #1a3b3b;
}

.category-icon svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
}

.category-name {
  font-size: 0.85rem;
}

.catalog-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.catalog-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  border: 1px solid rgba(26, 59, 59, 0.08);
  transition: all 0.2s ease;
}

.catalog-item:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}

.catalog-item.added {
  opacity: 0.7;
}

.item-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-icon svg {
  width: 28px;
  height: 28px;
  stroke: #1a3b3b;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 1rem;
  font-weight: 500;
  color: #1a3b3b;
  margin-bottom: 0.25rem;
}

.item-description {
  font-size: 0.8rem;
  color: #8a9a9a;
}

.add-button {
  padding: 0.5rem 1.2rem;
  background: #1a3b3b;
  color: white;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  white-space: nowrap;
}

.add-button:hover {
  background: #2a4b4b;
  transform: scale(1.05);
}

.add-button.added {
  background: #8a9a9a;
  cursor: default;
}

.add-button.added:hover {
  transform: none;
}

.empty-catalog {
  text-align: center;
  padding: 3rem;
  color: #8a9a9a;
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.5;
  margin-bottom: 1rem;
  display: block;
}

@media (max-width: 768px) {
  .catalog-page {
    padding: 0.75rem;
  }
  
  .catalog-title {
    font-size: 1.2rem;
  }
  
  .item-icon {
    width: 48px;
    height: 48px;
  }
  
  .item-icon svg {
    width: 24px;
    height: 24px;
  }
  
  .item-name {
    font-size: 0.9rem;
  }
  
  .item-description {
    font-size: 0.7rem;
  }
  
  .add-button {
    padding: 0.4rem 1rem;
    font-size: 0.75rem;
  }
}
</style>
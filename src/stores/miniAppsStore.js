import { ref } from 'vue';
import { STORES, getAll, add, update, remove, initDB } from '../db/db';

// Кэш для быстрого доступа
const cache = ref({
  ya: [],
  dom: [],
  blizkie: [],
  people: []
});

// Флаг инициализации
let isInitialized = false;
const initPromise = new Promise((resolve) => {
  window.resolveMiniAppsInit = resolve;
});

// Подписчики на изменения
const subscribers = [];

// Загрузка всех данных при инициализации
const loadAllData = async () => {
  try {
    await initDB();
    
    // Загружаем мини-приложения для всех страниц
    const allApps = await getAll(STORES.MINI_APPS);
    
    // Группируем по страницам
    cache.value = {
      ya: allApps.filter(a => a.page === 'ya').sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ),
      dom: allApps.filter(a => a.page === 'dom').sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ),
      blizkie: allApps.filter(a => a.page === 'blizkie').sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ),
      people: allApps.filter(a => a.page === 'people').sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )
    };
    
    console.log('Mini apps data loaded from IndexedDB', cache.value);
    isInitialized = true;
    window.resolveMiniAppsInit();
  } catch (e) {
    console.error('Failed to load mini apps from IndexedDB', e);
    window.resolveMiniAppsInit();
  }
};

// Инициализация при загрузке модуля
loadAllData();

export const miniAppsStore = {
  // Дождаться инициализации
  async ready() {
    await initPromise;
    return this;
  },

  // Получить приложения для страницы
  getApps(page) {
    return cache.value[page] || [];
  },

  // Добавить приложение
  async addApp(page, appData) {
    try {
      const newApp = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        page: page,
        type: appData.type,
        data: appData.data || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Сохраняем в IndexedDB
      await add(STORES.MINI_APPS, newApp);
      
      // Обновляем кэш
      if (!cache.value[page]) cache.value[page] = [];
      cache.value[page].unshift(newApp);
      
      this._notify();
      return newApp;
    } catch (e) {
      console.error('Failed to add mini app to IndexedDB', e);
      throw e;
    }
  },

  // Обновить приложение
  async updateApp(page, appId, newData) {
    try {
      const index = cache.value[page].findIndex(app => app.id === appId);
      if (index !== -1) {
        const updatedApp = {
          ...cache.value[page][index],
          ...newData,
          updatedAt: new Date().toISOString()
        };
        
        // Сохраняем в IndexedDB
        await update(STORES.MINI_APPS, updatedApp);
        
        // Обновляем кэш
        cache.value[page][index] = updatedApp;
        
        this._notify();
        return updatedApp;
      }
      return null;
    } catch (e) {
      console.error('Failed to update mini app in IndexedDB', e);
      throw e;
    }
  },

  // Удалить приложение
  async deleteApp(page, appId) {
    try {
      // Удаляем из IndexedDB
      await remove(STORES.MINI_APPS, appId);
      
      // Обновляем кэш
      cache.value[page] = cache.value[page].filter(app => app.id !== appId);
      
      this._notify();
    } catch (e) {
      console.error('Failed to delete mini app from IndexedDB', e);
      throw e;
    }
  },

  // Подписка на изменения
  subscribe(callback) {
    subscribers.push(callback);
    return () => {
      const index = subscribers.indexOf(callback);
      if (index > -1) subscribers.splice(index, 1);
    };
  },
  
  _notify() {
    subscribers.forEach(cb => cb());
  }
};
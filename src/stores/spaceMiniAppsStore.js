import { ref } from 'vue';
import { STORES, getAll, add, remove, getByIndex, initDB } from '../db/db';

const cache = ref({});
let isInitialized = false;
const initPromise = new Promise((resolve) => {
  window.resolveSpaceMiniAppsInit = resolve;
});
const subscribers = [];

const loadAllData = async () => {
  try {
    await initDB();
    const allMiniApps = await getAll(STORES.MINI_APPS);
    
    const grouped = {};
    for (const app of allMiniApps) {
      if (!grouped[app.spaceId]) grouped[app.spaceId] = [];
      grouped[app.spaceId].push(app);
    }
    
    for (const spaceId in grouped) {
      grouped[spaceId].sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    }
    
    cache.value = grouped;
    console.log('Space mini apps loaded:', cache.value);
    isInitialized = true;
    window.resolveSpaceMiniAppsInit();
  } catch (e) {
    console.error('Failed to load space mini apps', e);
    window.resolveSpaceMiniAppsInit();
  }
};

loadAllData();

export const spaceMiniAppsStore = {
  async ready() {
    await initPromise;
    return this;
  },

  getMiniApps(spaceId) {
    return cache.value[spaceId] || [];
  },

  async addMiniApp(spaceId, appId) {
    try {
      const existing = (cache.value[spaceId] || []).find(a => a.appId === appId);
      if (existing) return null;
      
      const newApp = {
        id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        spaceId: spaceId,
        appId: appId,
        addedAt: new Date().toISOString()
      };
      
      await add(STORES.MINI_APPS, newApp);
      
      if (!cache.value[spaceId]) cache.value[spaceId] = [];
      cache.value[spaceId].unshift(newApp);
      
      this._notify();
      return newApp;
    } catch (e) {
      console.error('Failed to add mini app to space', e);
      throw e;
    }
  },

  async removeMiniApp(spaceId, appId) {
    try {
      const app = (cache.value[spaceId] || []).find(a => a.appId === appId);
      if (!app) return false;
      
      await remove(STORES.MINI_APPS, app.id);
      
      cache.value[spaceId] = (cache.value[spaceId] || []).filter(a => a.appId !== appId);
      
      this._notify();
      return true;
    } catch (e) {
      console.error('Failed to remove mini app from space', e);
      throw e;
    }
  },

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
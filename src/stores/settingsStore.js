import { ref } from 'vue';
import { STORES, getById, update, initDB } from '../db/db';

const SETTINGS_ID = 'app_settings';

// Кэш настроек
const settingsCache = ref({
  id: SETTINGS_ID,
  background: null,
  updatedAt: new Date().toISOString()
});

// Флаг инициализации
let isInitialized = false;
const initPromise = new Promise((resolve) => {
  window.resolveSettingsInit = resolve;
});

// Подписчики на изменения
const subscribers = [];

// Загрузка настроек при инициализации
const loadSettings = async () => {
  try {
    await initDB();
    const settings = await getById(STORES.SETTINGS, SETTINGS_ID);
    if (settings) {
      settingsCache.value = settings;
    }
    console.log('Settings loaded from IndexedDB', settingsCache.value);
    isInitialized = true;
    window.resolveSettingsInit();
  } catch (e) {
    console.error('Failed to load settings from IndexedDB', e);
    window.resolveSettingsInit();
  }
};

// Инициализация при загрузке модуля
loadSettings();

export const settingsStore = {
  // Дождаться инициализации
  async ready() {
    await initPromise;
    return this;
  },

  // Получить настройки
  getSettings() {
    return { ...settingsCache.value };
  },

  // Обновить настройки
  async updateSettings(newSettings) {
    try {
      const updatedSettings = {
        id: SETTINGS_ID,
        background: newSettings.background !== undefined ? newSettings.background : settingsCache.value.background,
        updatedAt: new Date().toISOString()
      };
      
      await update(STORES.SETTINGS, updatedSettings);
      settingsCache.value = { ...updatedSettings };
      
      this._notify();
      return updatedSettings;
    } catch (e) {
      console.error('Failed to update settings in IndexedDB', e);
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
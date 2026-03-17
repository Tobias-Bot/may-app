import { ref } from 'vue';
import { STORES, getById, update, initDB } from '../db/db';

const TRACKER_ID = 'balance_tracker';

// Кэш данных трекера
const trackerCache = ref({
  id: TRACKER_ID,
  lastMonth: '',
  days: {},
  updatedAt: new Date().toISOString()
});

// Флаг инициализации
let isInitialized = false;
const initPromise = new Promise((resolve) => {
  window.resolveBalanceInit = resolve;
});

// Подписчики на изменения
const subscribers = [];

// Функция для создания глубокой копии данных
const createDeepCopy = (data) => {
  if (!data) return null;
  
  return {
    id: data.id || TRACKER_ID,
    lastMonth: data.lastMonth || '',
    days: data.days ? JSON.parse(JSON.stringify(data.days)) : {},
    updatedAt: data.updatedAt || new Date().toISOString()
  };
};

// Загрузка данных при инициализации
const loadTrackerData = async () => {
  try {
    await initDB();
    const data = await getById(STORES.BALANCE_TRACKER, TRACKER_ID);
    if (data) {
      trackerCache.value = createDeepCopy(data);
    } else {
      // Если данных нет, создаем пустую структуру
      trackerCache.value = {
        id: TRACKER_ID,
        lastMonth: '',
        days: {},
        updatedAt: new Date().toISOString()
      };
    }
    console.log('Balance tracker data loaded from IndexedDB', trackerCache.value);
    isInitialized = true;
    window.resolveBalanceInit();
  } catch (e) {
    console.error('Failed to load balance tracker data from IndexedDB', e);
    trackerCache.value = {
      id: TRACKER_ID,
      lastMonth: '',
      days: {},
      updatedAt: new Date().toISOString()
    };
    window.resolveBalanceInit();
  }
};

// Инициализация при загрузке модуля
loadTrackerData();

export const balanceTrackerStore = {
  // Дождаться инициализации
  async ready() {
    await initPromise;
    return this;
  },

  // Получить данные трекера
  getData() {
    return createDeepCopy(trackerCache.value);
  },

  // Обновить данные трекера
  async updateData(newData) {
    try {
      const cleanData = {
        id: TRACKER_ID,
        lastMonth: String(newData.lastMonth || ''),
        days: JSON.parse(JSON.stringify(newData.days || {})),
        updatedAt: new Date().toISOString()
      };
      
      await update(STORES.BALANCE_TRACKER, cleanData);
      trackerCache.value = createDeepCopy(cleanData);
      
      this._notify();
      return cleanData;
    } catch (e) {
      console.error('Failed to update balance tracker data in IndexedDB', e);
      throw e;
    }
  },

  // Сбросить данные за месяц
  async resetMonth(newMonth) {
    try {
      const cleanData = {
        id: TRACKER_ID,
        lastMonth: String(newMonth),
        days: {},
        updatedAt: new Date().toISOString()
      };
      
      await update(STORES.BALANCE_TRACKER, cleanData);
      trackerCache.value = createDeepCopy(cleanData);
      this._notify();
      return cleanData;
    } catch (e) {
      console.error('Failed to reset month in IndexedDB', e);
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
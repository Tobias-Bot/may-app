// Открываем или создаем базу данных
const DB_NAME = 'MindfulAppDB';
const DB_VERSION = 1;

// Хранилища (stores)
export const STORES = {
  TOOLS: 'tools',
  MINI_APPS: 'miniApps',
  SETTINGS: 'settings',
  BALANCE_TRACKER: 'balanceTracker'
};

let db = null;

// Инициализация базы данных
export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      console.log('Database opened successfully');
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Создаем хранилище для инструментов (заметки, списки, фото)
      if (!db.objectStoreNames.contains(STORES.TOOLS)) {
        const toolsStore = db.createObjectStore(STORES.TOOLS, { keyPath: 'id' });
        toolsStore.createIndex('page', 'page', { unique: false });
        toolsStore.createIndex('type', 'type', { unique: false });
        toolsStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Создаем хранилище для мини-приложений
      if (!db.objectStoreNames.contains(STORES.MINI_APPS)) {
        const miniAppsStore = db.createObjectStore(STORES.MINI_APPS, { keyPath: 'id' });
        miniAppsStore.createIndex('page', 'page', { unique: false });
        miniAppsStore.createIndex('type', 'type', { unique: false });
        miniAppsStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // Создаем хранилище для настроек (только одна запись)
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
      }

      // Создаем хранилище для трекера баланса
      if (!db.objectStoreNames.contains(STORES.BALANCE_TRACKER)) {
        const balanceStore = db.createObjectStore(STORES.BALANCE_TRACKER, { keyPath: 'id' });
        balanceStore.createIndex('date', 'date', { unique: false });
        balanceStore.createIndex('month', 'month', { unique: false });
      }
    };
  });
};

// Утилита для выполнения операций с хранилищем
const withStore = async (storeName, mode, callback) => {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, mode);
    const store = transaction.objectStore(storeName);
    
    transaction.oncomplete = () => {
      // Результат уже должен быть передан через resolve в callback
    };
    
    transaction.onerror = (event) => {
      reject(event.target.error);
    };
    
    try {
      callback(store, resolve, reject);
    } catch (error) {
      reject(error);
    }
  });
};

// Получить все элементы из хранилища с возможностью фильтрации по индексу
export const getAll = async (storeName, indexName = null, value = null) => {
  return withStore(storeName, 'readonly', (store, resolve, reject) => {
    const request = indexName && value 
      ? store.index(indexName).getAll(value)
      : store.getAll();
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

// Получить элемент по ID
export const getById = async (storeName, id) => {
  return withStore(storeName, 'readonly', (store, resolve, reject) => {
    const request = store.get(id);
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

// Добавить элемент
export const add = async (storeName, item) => {
  return withStore(storeName, 'readwrite', (store, resolve, reject) => {
    const request = store.add(item);
    
    request.onsuccess = (event) => {
      resolve(item);
    };
    
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

// Обновить элемент
export const update = async (storeName, item) => {
  return withStore(storeName, 'readwrite', (store, resolve, reject) => {
    const request = store.put(item);
    
    request.onsuccess = (event) => {
      resolve(item);
    };
    
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

// Удалить элемент
export const remove = async (storeName, id) => {
  return withStore(storeName, 'readwrite', (store, resolve, reject) => {
    const request = store.delete(id);
    
    request.onsuccess = (event) => {
      resolve(id);
    };
    
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

// Получить элементы по индексу
export const getByIndex = async (storeName, indexName, value) => {
  return withStore(storeName, 'readonly', (store, resolve, reject) => {
    const request = store.index(indexName).getAll(value);
    
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

// Очистить хранилище
export const clear = async (storeName) => {
  return withStore(storeName, 'readwrite', (store, resolve, reject) => {
    const request = store.clear();
    
    request.onsuccess = (event) => {
      resolve(true);
    };
    
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};
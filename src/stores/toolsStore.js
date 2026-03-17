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
  // Будет разрешен после загрузки данных
  window.resolveToolsInit = resolve;
});

// Подписчики на изменения
const subscribers = [];

// Функция для сжатия изображения
const compressImage = (base64Data, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Data;
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round(height * (maxWidth / width));
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round(width * (maxHeight / height));
          height = maxHeight;
        }
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      let compressed = canvas.toDataURL('image/jpeg', quality);
      
      // Если всё ещё слишком большой, уменьшаем качество
      const MAX_IMAGE_SIZE = 500 * 1024; // 500KB
      while (compressed.length > MAX_IMAGE_SIZE && quality > 0.1) {
        quality -= 0.1;
        compressed = canvas.toDataURL('image/jpeg', quality);
      }
      
      resolve(compressed);
    };
  });
};

// Загрузка всех данных при инициализации
const loadAllData = async () => {
  try {
    await initDB();
    
    // Загружаем инструменты для всех страниц
    const allTools = await getAll(STORES.TOOLS);
    
    // Группируем по страницам
    cache.value = {
      ya: allTools.filter(t => t.page === 'ya').sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ),
      dom: allTools.filter(t => t.page === 'dom').sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ),
      blizkie: allTools.filter(t => t.page === 'blizkie').sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ),
      people: allTools.filter(t => t.page === 'people').sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )
    };
    
    console.log('Tools data loaded from IndexedDB', cache.value);
    isInitialized = true;
    window.resolveToolsInit();
  } catch (e) {
    console.error('Failed to load data from IndexedDB', e);
    window.resolveToolsInit(); // Все равно разрешаем, чтобы не блокировать
  }
};

// Инициализация при загрузке модуля
loadAllData();

export const toolsStore = {
  // Дождаться инициализации
  async ready() {
    await initPromise;
    return this;
  },

  // Получить инструменты для страницы
  getTools(page) {
    return cache.value[page] || [];
  },

  // Добавить инструмент
  async addTool(page, toolData) {
    try {
      // Сжимаем изображение, если оно есть
      let processedData = { ...toolData.data };
      if (toolData.data.image) {
        try {
          processedData.image = await compressImage(toolData.data.image);
        } catch (e) {
          console.error('Failed to compress image', e);
        }
      }
      
      const newTool = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        page: page,
        type: toolData.type,
        data: processedData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Сохраняем в IndexedDB
      await add(STORES.TOOLS, newTool);
      
      // Обновляем кэш
      if (!cache.value[page]) cache.value[page] = [];
      cache.value[page].unshift(newTool);
      
      this._notify();
      return newTool;
    } catch (e) {
      console.error('Failed to add tool to IndexedDB', e);
      throw e;
    }
  },

// Обновить инструмент
async updateTool(page, toolId, newData) {
  try {
    console.log('toolsStore: updateTool called', { page, toolId, newData });
    
    const index = cache.value[page].findIndex(tool => tool.id === toolId);
    if (index !== -1) {
      // Получаем текущие данные
      const currentTool = cache.value[page][index];
      
      // Извлекаем данные в зависимости от формата
      let updatedFields;
      if (newData.data) {
        // Формат: { data: { ... } }
        updatedFields = newData.data;
      } else {
        // Формат: прямые поля
        updatedFields = newData;
      }
      
      console.log('toolsStore: updatedFields', updatedFields);
      
      // Создаем чистую копию новых данных
      const cleanNewData = JSON.parse(JSON.stringify(updatedFields));
      
      // Создаем обновленный инструмент
      const updatedTool = {
        id: toolId,
        page: page,
        type: currentTool.type,
        data: {
          ...currentTool.data,
          ...cleanNewData
        },
        createdAt: currentTool.createdAt,
        updatedAt: new Date().toISOString()
      };
      
      console.log('toolsStore: updatedTool before compression', updatedTool);
      
      // Сжимаем изображение, если оно есть и изменилось
      if (updatedTool.data.image && updatedTool.data.image !== currentTool.data?.image) {
        try {
          updatedTool.data.image = await compressImage(updatedTool.data.image);
          console.log('toolsStore: image compressed');
        } catch (e) {
          console.error('Failed to compress image', e);
        }
      }
      
      console.log('toolsStore: saving to IndexedDB', updatedTool);
      
      // Очищаем от возможных reactive прокси перед сохранением
      const toolToSave = JSON.parse(JSON.stringify(updatedTool));
      
      // Сохраняем в IndexedDB
      await update(STORES.TOOLS, toolToSave);
      
      // Обновляем кэш
      cache.value[page][index] = updatedTool;
      
      console.log('toolsStore: update successful');
      this._notify();
      return updatedTool;
    }
    console.log('toolsStore: tool not found');
    return null;
  } catch (e) {
    console.error('Failed to update tool in IndexedDB', e);
    throw e;
  }
},

  // Удалить инструмент
  async deleteTool(page, toolId) {
    try {
      // Удаляем из IndexedDB
      await remove(STORES.TOOLS, toolId);
      
      // Обновляем кэш
      cache.value[page] = cache.value[page].filter(tool => tool.id !== toolId);
      
      this._notify();
    } catch (e) {
      console.error('Failed to delete tool from IndexedDB', e);
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
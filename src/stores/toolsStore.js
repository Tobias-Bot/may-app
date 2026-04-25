import { ref } from 'vue';
import { STORES, getAll, add, update, remove, initDB } from '../db/db';

// Кэш для быстрого доступа - теперь по spaceId
const cache = ref({});

let isInitialized = false;
const initPromise = new Promise((resolve) => {
  window.resolveToolsInit = resolve;
});

const subscribers = [];

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
      
      const MAX_IMAGE_SIZE = 500 * 1024;
      while (compressed.length > MAX_IMAGE_SIZE && quality > 0.1) {
        quality -= 0.1;
        compressed = canvas.toDataURL('image/jpeg', quality);
      }
      
      resolve(compressed);
    };
  });
};

const loadAllData = async () => {
  try {
    await initDB();
    const allTools = await getAll(STORES.TOOLS);
    
    // Группируем по spaceId
    const grouped = {};
    for (const tool of allTools) {
      const spaceId = tool.spaceId;
      if (!grouped[spaceId]) grouped[spaceId] = [];
      grouped[spaceId].push(tool);
    }
    
    // Сортируем каждую группу по дате создания
    for (const spaceId in grouped) {
      grouped[spaceId].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    cache.value = grouped;
    console.log('Tools data loaded from IndexedDB', cache.value);
    isInitialized = true;
    window.resolveToolsInit();
  } catch (e) {
    console.error('Failed to load data from IndexedDB', e);
    window.resolveToolsInit();
  }
};

loadAllData();

export const toolsStore = {
  async ready() {
    await initPromise;
    return this;
  },

  getTools(spaceId) {
    return cache.value[spaceId] || [];
  },

  async addTool(spaceId, toolData) {
    try {
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
        spaceId: spaceId,
        type: toolData.type,
        data: processedData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await add(STORES.TOOLS, newTool);
      
      if (!cache.value[spaceId]) cache.value[spaceId] = [];
      cache.value[spaceId].unshift(newTool);
      
      this._notify();
      return newTool;
    } catch (e) {
      console.error('Failed to add tool to IndexedDB', e);
      throw e;
    }
  },

  async updateTool(spaceId, toolId, newData) {
    try {
      const tools = cache.value[spaceId];
      if (!tools) return null;
      
      const index = tools.findIndex(tool => tool.id === toolId);
      if (index !== -1) {
        const currentTool = tools[index];
        
        let updatedFields;
        if (newData.data) {
          updatedFields = newData.data;
        } else {
          updatedFields = newData;
        }
        
        const cleanNewData = JSON.parse(JSON.stringify(updatedFields));
        
        const updatedTool = {
          ...currentTool,
          data: {
            ...currentTool.data,
            ...cleanNewData
          },
          updatedAt: new Date().toISOString()
        };
        
        if (updatedTool.data.image && updatedTool.data.image !== currentTool.data?.image) {
          try {
            updatedTool.data.image = await compressImage(updatedTool.data.image);
          } catch (e) {
            console.error('Failed to compress image', e);
          }
        }
        
        const toolToSave = JSON.parse(JSON.stringify(updatedTool));
        await update(STORES.TOOLS, toolToSave);
        
        cache.value[spaceId][index] = updatedTool;
        
        this._notify();
        return updatedTool;
      }
      return null;
    } catch (e) {
      console.error('Failed to update tool in IndexedDB', e);
      throw e;
    }
  },

  async deleteTool(spaceId, toolId) {
    try {
      await remove(STORES.TOOLS, toolId);
      
      if (cache.value[spaceId]) {
        cache.value[spaceId] = cache.value[spaceId].filter(tool => tool.id !== toolId);
      }
      
      this._notify();
    } catch (e) {
      console.error('Failed to delete tool from IndexedDB', e);
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
// filepath: /src/stores/spacesStore.js
import { ref } from 'vue';
import { STORES, getAll, add, update, remove, initDB } from '../db/db';

const spacesCache = ref([]);
const currentSpaceId = ref(null);

let isInitialized = false;
const initPromise = new Promise((resolve) => {
  window.resolveSpacesInit = resolve;
});

const subscribers = [];

const loadSpaces = async () => {
  try {
    await initDB();
    const allSpaces = await getAll(STORES.SPACES);
    
    // Нет стандартных пространств - пользователь сам создаст первое
    spacesCache.value = allSpaces.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    const savedCurrent = localStorage.getItem('current_space_id');
    if (savedCurrent && spacesCache.value.some(s => s.id === savedCurrent)) {
      currentSpaceId.value = savedCurrent;
    } else if (spacesCache.value.length > 0) {
      currentSpaceId.value = spacesCache.value[0].id;
    } else {
      currentSpaceId.value = null;
    }
    
    console.log('Spaces loaded:', spacesCache.value);
    isInitialized = true;
    window.resolveSpacesInit();
  } catch (e) {
    console.error('Failed to load spaces', e);
    window.resolveSpacesInit();
  }
};

loadSpaces();

export const spacesStore = {
  async ready() {
    await initPromise;
    return this;
  },

  getSpaces() {
    return [...spacesCache.value];
  },

  getCurrentSpace() {
    return spacesCache.value.find(s => s.id === currentSpaceId.value) || null;
  },

  getCurrentSpaceId() {
    return currentSpaceId.value;
  },

  async setCurrentSpace(spaceId) {
    const space = spacesCache.value.find(s => s.id === spaceId);
    if (space) {
      currentSpaceId.value = spaceId;
      localStorage.setItem('current_space_id', spaceId);
      this._notify();
      return true;
    }
    return false;
  },

  async addSpace(name, icon) {
    try {
      const newSpace = {
        id: Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        name: name.trim(),
        icon: icon,
        createdAt: new Date().toISOString()
      };
      
      await add(STORES.SPACES, newSpace);
      spacesCache.value.unshift(newSpace);
      await this.setCurrentSpace(newSpace.id);
      this._notify();
      return newSpace;
    } catch (e) {
      console.error('Failed to add space', e);
      throw e;
    }
  },

  async updateSpace(spaceId, updates) {
    try {
      const index = spacesCache.value.findIndex(s => s.id === spaceId);
      if (index !== -1) {
        const updatedSpace = { 
          ...spacesCache.value[index], 
          ...updates, 
          updatedAt: new Date().toISOString() 
        };
        await update(STORES.SPACES, updatedSpace);
        spacesCache.value[index] = updatedSpace;
        this._notify();
        return updatedSpace;
      }
      return null;
    } catch (e) {
      console.error('Failed to update space', e);
      throw e;
    }
  },

  async deleteSpace(spaceId) {
    try {
      const space = spacesCache.value.find(s => s.id === spaceId);
      if (!space) return false;
      
      const { toolsStore } = await import('./toolsStore');
      const tools = toolsStore.getTools(spaceId);
      for (const tool of tools) {
        await toolsStore.deleteTool(spaceId, tool.id);
      }
      
      await remove(STORES.SPACES, spaceId);
      spacesCache.value = spacesCache.value.filter(s => s.id !== spaceId);
      
      if (currentSpaceId.value === spaceId) {
        currentSpaceId.value = spacesCache.value[0]?.id || null;
        localStorage.setItem('current_space_id', currentSpaceId.value || '');
      }
      
      this._notify();
      return true;
    } catch (e) {
      console.error('Failed to delete space', e);
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
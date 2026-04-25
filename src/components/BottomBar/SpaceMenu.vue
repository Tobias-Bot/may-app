<!-- filepath: /src/components/BottomBar/SpaceMenu.vue -->
<template>
  <div v-if="isOpen" class="space-menu" ref="menuRef">
    <div class="space-menu-header">
      <span>Пространства</span>
    </div>
    
    <div class="spaces-list" v-if="spaces.length > 0">
      <button 
        v-for="space in spaces" 
        :key="space.id"
        class="space-menu-item"
        :class="{ active: currentSpaceId === space.id }"
        @click="selectSpace(space.id)"
      >
        <span class="space-icon">
          <SpaceIcon :icon="space.icon" />
        </span>
        <span class="space-name">{{ space.name }}</span>
        <button
          class="delete-space" 
          @click.stop="deleteSpace(space)"
          title="Удалить пространство"
        >✕</button>
      </button>
    </div>
    
    <div v-else class="empty-spaces">
      <p>Нет созданных пространств</p>
      <p class="empty-hint">Нажмите "+" чтобы создать</p>
    </div>
    
    <button class="add-space-btn" @click="createSpace">
      <span class="plus-icon">+</span> Создать пространство
    </button>
  </div>
</template>

<script>
import SpaceIcon from '../SpaceIcon.vue';

export default {
  name: 'SpaceMenu',
  components: { SpaceIcon },
  props: {
    isOpen: Boolean,
    spaces: Array,
    currentSpaceId: String
  },
  emits: ['close', 'select-space', 'delete-space', 'create-space'],
  
  setup(props, { emit }) {
    const close = () => {
      emit('close');
    };
    
    const selectSpace = (spaceId) => {
      emit('select-space', spaceId);
    };
    
    const deleteSpace = (space) => {
      emit('delete-space', space);
    };
    
    const createSpace = () => {
      emit('create-space');
    };
    
    return { close, selectSpace, deleteSpace, createSpace };
  }
}
</script>

<style scoped>
.space-menu {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  background: white;
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 0.75rem;
  box-shadow: 0 10px 30px -10px rgba(26, 59, 59, 0.2);
  border: 1px solid rgba(26, 59, 59, 0.1);
  min-width: 220px;
  z-index: 1002;
  animation: slideUp 0.2s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(10px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.space-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid rgba(26, 59, 59, 0.1);
  font-weight: 500;
  color: #1a3b3b;
}

.close-menu {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #8a9a9a;
  transition: all 0.2s ease;
}

.close-menu:hover {
  background: rgba(26, 59, 59, 0.1);
  color: #1a3b3b;
}

.spaces-list {
  max-height: 300px;
  overflow-y: auto;
  margin: 0.5rem 0;
}

.spaces-list::-webkit-scrollbar {
  width: 4px;
}

.spaces-list::-webkit-scrollbar-track {
  background: rgba(26, 59, 59, 0.05);
  border-radius: 4px;
}

.spaces-list::-webkit-scrollbar-thumb {
  background: rgba(26, 59, 59, 0.2);
  border-radius: 4px;
}

.space-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  background: transparent;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.space-menu-item:hover {
  background: rgba(26, 59, 59, 0.08);
}

.space-menu-item.active {
  background: rgba(26, 59, 59, 0.12);
  color: #1a3b3b;
}

.space-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
}

.space-icon svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}

.space-menu-item .space-name {
  flex: 1;
  font-size: 0.9rem;
  margin: 0;
  color: #1a3b3b;
}

.delete-space {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: #b34141;
  cursor: pointer;
  font-size: 0.9rem;
  opacity: 0.6;
  transition: all 0.2s ease;
}

.delete-space:hover {
  opacity: 1;
  background: rgba(180, 70, 70, 0.1);
}

.add-space-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem;
  background: rgba(26, 59, 59, 0.05);
  border: 1px dashed rgba(26, 59, 59, 0.25);
  border-radius: 40px;
  color: #1a3b3b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.add-space-btn:hover {
  background: rgba(26, 59, 59, 0.1);
  border-color: #1a3b3b;
}

.plus-icon {
  font-size: 1.1rem;
}

.empty-spaces {
  text-align: center;
  padding: 1.5rem;
  color: #8a9a9a;
}

.empty-hint {
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
</style>
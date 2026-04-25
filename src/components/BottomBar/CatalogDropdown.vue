<!-- filepath: /src/components/BottomBar/CatalogDropdown.vue -->
<template>
  <div v-if="isOpen" class="catalog-dropdown" ref="dropdownRef">
    <button class="dropdown-header" @click="openCatalogPage">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
      <span>Каталог мини-приложений</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18L15 12L9 6"/>
      </svg>
    </button>
    
    <div class="dropdown-divider"></div>
    
    <div class="dropdown-apps-list">
      <div 
        v-for="app in apps" 
        :key="app.id"
        class="dropdown-app-item"
      >
        <div class="dropdown-app-info" @click="selectApp(app)">
          <div class="dropdown-app-icon" :style="{ background: app.gradient }">
            <MiniAppIcon :icon="app.icon" />
          </div>
          <span class="dropdown-app-name">{{ app.name }}</span>
        </div>
        <button class="dropdown-app-delete" @click.stop="removeApp(app)" title="Удалить из пространства">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6L18 18"/>
          </svg>
        </button>
      </div>
      
      <div v-if="apps.length === 0" class="dropdown-empty">
        <span>Нет добавленных мини-приложений</span>
        <button class="add-from-catalog" @click="openCatalogPage">Добавить из каталога</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import MiniAppIcon from '../MiniAppIcon.vue';

export default {
  name: 'CatalogDropdown',
  components: { MiniAppIcon },
  props: {
    isOpen: Boolean,
    apps: Array,
    spaceId: String
  },
  emits: ['close', 'select-app', 'remove-app', 'open-catalog'],
  
  setup(props, { emit }) {
    const dropdownRef = ref(null);
    
    const openCatalogPage = () => {
      emit('open-catalog');
      emit('close');
    };
    
    const selectApp = (app) => {
      emit('select-app', app);
      emit('close');
    };
    
    const removeApp = (app) => {
      emit('remove-app', app);
    };
    
    const handleClickOutside = (event) => {
      if (props.isOpen && dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        emit('close');
      }
    };
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    
    return { dropdownRef, openCatalogPage, selectApp, removeApp };
  }
}
</script>

<style scoped>
.catalog-dropdown {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 0.5rem;
  background: white;
  border-radius: 16px;
  padding: 0.5rem;
  box-shadow: 0 10px 30px -10px rgba(26, 59, 59, 0.2);
  border: 1px solid rgba(26, 59, 59, 0.1);
  min-width: 220px;
  max-width: 280px;
  z-index: 100;
  animation: slideUp 0.2s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  background: rgba(26, 59, 59, 0.05);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  color: #1a3b3b;
}

.dropdown-header:hover {
  background: rgba(26, 59, 59, 0.1);
}

.dropdown-header svg:last-child {
  margin-left: auto;
}

.dropdown-divider {
  height: 1px;
  background: rgba(26, 59, 59, 0.1);
  margin: 0.5rem 0;
}

.dropdown-apps-list {
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
}

.dropdown-apps-list::-webkit-scrollbar {
  width: 4px;
}

.dropdown-apps-list::-webkit-scrollbar-track {
  background: rgba(26, 59, 59, 0.05);
  border-radius: 4px;
}

.dropdown-apps-list::-webkit-scrollbar-thumb {
  background: rgba(26, 59, 59, 0.2);
  border-radius: 4px;
}

.dropdown-app-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.5rem;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.dropdown-app-item:hover {
  background: rgba(26, 59, 59, 0.05);
}

.dropdown-app-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  cursor: pointer;
}

.dropdown-app-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dropdown-app-icon svg {
  width: 16px;
  height: 16px;
  stroke: white;
}

.dropdown-app-name {
  font-size: 0.85rem;
  color: #1a3b3b;
}

.dropdown-app-delete {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: #b34141;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
  transition: all 0.2s ease;
}

.dropdown-app-delete:hover {
  opacity: 1;
  background: rgba(180, 70, 70, 0.1);
}

.dropdown-empty {
  text-align: center;
  padding: 1rem;
  color: #8a9a9a;
  font-size: 0.8rem;
}

.add-from-catalog {
  display: block;
  margin-top: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: rgba(26, 59, 59, 0.05);
  border: 1px solid rgba(26, 59, 59, 0.15);
  border-radius: 20px;
  color: #1a3b3b;
  cursor: pointer;
  font-size: 0.75rem;
  width: 100%;
}

.add-from-catalog:hover {
  background: rgba(26, 59, 59, 0.1);
}
</style>
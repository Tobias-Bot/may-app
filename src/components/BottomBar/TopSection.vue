<!-- filepath: /src/components/BottomBar/TopSection.vue -->
<template>
  <div class="top-section">
    <div class="top-section-container">
      <!-- Название пространства -->
      <div class="space-name-wrapper">
        <div class="space-icon-small">
          <SpaceIcon :icon="spaceIcon" />
        </div>
        <div class="space-name-container">
          <div 
            v-if="!isEditingName" 
            class="space-name-text" 
            :class="{ 'marquee': isOverflowing }" 
            ref="spaceNameRef"
            @click="startEditName"
          >
            {{ spaceName || 'Пространство' }}
          </div>
          <input 
            v-else
            v-model="editNameValue"
            class="space-name-input"
            @blur="saveName"
            @keyup.enter="saveName"
            ref="nameInput"
            maxlength="20"
          />
        </div>
      </div>
      
      <!-- Часто используемые мини-приложения -->
      <div class="frequent-apps">
        <div 
          v-for="app in frequentApps" 
          :key="app.id"
          class="frequent-app-item"
          @click="selectApp(app)"
          :title="app.name"
        >
          <div class="frequent-app-icon" :style="{ background: app.gradient }">
            <MiniAppIcon :icon="app.icon" />
          </div>
        </div>
        
        <!-- Кнопка каталога -->
        <div class="catalog-dropdown-wrapper" ref="catalogWrapper">
          <button class="catalog-btn" @click.stop="toggleCatalog" title="Все мини-приложения">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </button>
          
          <CatalogDropdown 
  :is-open="showCatalogDropdown"
  :apps="allApps"
  :space-id="spaceId"
  @close="closeCatalog"
  @select-app="selectApp"
  @remove-app="removeApp"
  @open-catalog="openCatalogPage"
/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import SpaceIcon from '../SpaceIcon.vue';
import MiniAppIcon from '../MiniAppIcon.vue';
import CatalogDropdown from './CatalogDropdown.vue';

export default {
  name: 'TopSection',
  components: { SpaceIcon, MiniAppIcon, CatalogDropdown },
  props: {
    spaceId: String,
    spaceName: String,
    spaceIcon: String,
    frequentApps: Array,
    allApps: Array
  },
  emits: ['update-space-name', 'select-app', 'remove-app', 'open-catalog'],
  
  setup(props, { emit }) {
    const router = useRouter();
    const isEditingName = ref(false);
    const editNameValue = ref(props.spaceName || '');
    const showCatalogDropdown = ref(false);
    const spaceNameRef = ref(null);
    const nameInput = ref(null);
    const catalogWrapper = ref(null);
    const isOverflowing = ref(false);

    const removeApp = (app) => {
  emit('remove-app', app);
};
    
    const checkOverflow = () => {
      nextTick(() => {
        if (spaceNameRef.value) {
          isOverflowing.value = spaceNameRef.value.scrollWidth > spaceNameRef.value.clientWidth;
        }
      });
    };
    
    const startEditName = () => {
      editNameValue.value = props.spaceName || '';
      isEditingName.value = true;
      nextTick(() => {
        nameInput.value?.focus();
        nameInput.value?.select();
      });
    };
    
    const saveName = async () => {
      const newName = editNameValue.value.trim();
      if (newName && newName !== props.spaceName) {
        emit('update-space-name', newName);
      }
      isEditingName.value = false;
    };
    
    const toggleCatalog = () => {
      showCatalogDropdown.value = !showCatalogDropdown.value;
    };
    
    const closeCatalog = () => {
      showCatalogDropdown.value = false;
    };
    
    const selectApp = (app) => {
      emit('select-app', app);
      closeCatalog();
    };
    
    const openCatalogPage = () => {
      sessionStorage.setItem('returnPath', router.currentRoute.value.path);
      router.push(`/catalog/${props.spaceId}`);
      closeCatalog();
      emit('open-catalog');
    };
    
    const handleGlobalClose = () => {
      closeCatalog();
    };
    
    onMounted(() => {
      checkOverflow();
      window.addEventListener('close-catalog-dropdown', handleGlobalClose);
    });
    
    onUnmounted(() => {
      window.removeEventListener('close-catalog-dropdown', handleGlobalClose);
    });
    
    watch(() => props.spaceName, () => {
      checkOverflow();
    });
    
    return {
      isEditingName,
      editNameValue,
      showCatalogDropdown,
      spaceNameRef,
      nameInput,
      catalogWrapper,
      isOverflowing,
      removeApp,
      startEditName,
      saveName,
      toggleCatalog,
      closeCatalog,
      selectApp,
      openCatalogPage
    };
  }
}
</script>

<style scoped>
.top-section {
  width: 100%;
}

.top-section-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 60px;
  padding: 0.6rem 1.2rem;
  border: 1px solid rgba(26, 59, 59, 0.08);
}

.space-name-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex-shrink: 1;
}

.space-icon-small {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.space-icon-small svg {
  width: 28px;
  height: 28px;
  stroke: #1a3b3b;
}

.space-name-container {
  max-width: 180px;
  overflow: hidden;
}

.space-name-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: #1a3b3b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.space-name-text:hover {
  opacity: 0.7;
}

.space-name-text.marquee {
  animation: marquee 10s linear infinite;
  text-overflow: clip;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  50% { transform: translateX(calc(-100% + 180px)); }
  100% { transform: translateX(0); }
}

.space-name-input {
  font-size: 1rem;
  font-weight: 500;
  color: #1a3b3b;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #1a3b3b;
  border-radius: 20px;
  padding: 0.3rem 0.6rem;
  width: 160px;
  outline: none;
}

.frequent-apps {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.frequent-app-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.frequent-app-item:hover {
  transform: translateY(-2px);
}

.frequent-app-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.frequent-app-icon svg {
  width: 22px;
  height: 22px;
  stroke: white;
}

.catalog-dropdown-wrapper {
  position: relative;
}

.catalog-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 1px solid rgba(26, 59, 59, 0.1);
  color: #1a3b3b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.catalog-btn:hover {
  background: #f8f8f8;
  transform: scale(1.05);
}

.catalog-btn svg {
  width: 22px;
  height: 22px;
  stroke: currentColor;
}

@media (max-width: 768px) {
  .top-section-container {
    padding: 0.5rem 1rem;
  }
  
  .space-icon-small {
    width: 34px;
    height: 34px;
  }
  
  .space-icon-small svg {
    width: 22px;
    height: 22px;
  }
  
  .space-name-container {
    max-width: 140px;
  }
  
  .space-name-text {
    font-size: 0.95rem;
  }
  
  .frequent-app-icon {
    width: 34px;
    height: 34px;
  }
  
  .frequent-app-icon svg {
    width: 18px;
    height: 18px;
  }
  
  .catalog-btn {
    width: 34px;
    height: 34px;
  }
  
  .catalog-btn svg {
    width: 18px;
    height: 18px;
  }
  
  .frequent-app-item {
    display: none;
  }
  
  .frequent-app-item:nth-child(1),
  .frequent-app-item:nth-child(2) {
    display: block;
  }
}

@media (max-width: 480px) {
  .space-name-container {
    max-width: 120px;
  }
  
  .space-name-text {
    font-size: 0.85rem;
  }
  
  .frequent-app-item {
    display: none;
  }
  
  .frequent-app-item:nth-child(1) {
    display: block;
  }
}
</style>
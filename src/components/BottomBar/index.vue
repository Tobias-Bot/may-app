<!-- filepath: /src/components/BottomBar/index.vue -->
<template>
  <div class="bottom-bar" :class="{ hidden: !visible }">
    <TopSection 
      :space-id="currentSpaceId"
      :space-name="currentSpaceName"
      :space-icon="currentSpaceIcon"
      :frequent-apps="frequentApps"
      :all-apps="allSpaceApps"
      @update-space-name="updateSpaceName"
      @select-app="openMiniApp"
      @remove-app="removeApp"
      @open-catalog="refreshData"
    />
    
    <BottomSection 
      :has-prev-space="hasPrevSpace"
      :has-next-space="hasNextSpace"
      @open-settings="openSettings"
      @prev-space="prevSpace"
      @next-space="nextSpace"
      @open-space-menu="toggleSpaceMenu"
      @create-card="createCard"
    />
    
    <SpaceMenu 
      :is-open="showSpaceMenu"
      :spaces="spaces"
      :current-space-id="currentSpaceId"
      @close="closeSpaceMenu"
      @select-space="selectSpace"
      @delete-space="openDeleteModal"
      @create-space="openCreateModal"
    />
    
    <CreateSpaceModal 
      :is-open="showCreateModal" 
      @close="closeCreateModal" 
      @create="handleCreateSpace"
    />
    
    <DeleteSpaceModal 
      :is-open="showDeleteModal" 
      :space-name="spaceToDelete?.name"
      @close="closeDeleteModal" 
      @confirm="confirmDelete"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TopSection from './TopSection.vue';
import BottomSection from './BottomSection.vue';
import SpaceMenu from './SpaceMenu.vue';
import CreateSpaceModal from './CreateSpaceModal.vue';
import DeleteSpaceModal from './DeleteSpaceModal.vue';
import { MINI_APPS_CATALOG } from '../../config/miniAppsCatalog';
import { spaceMiniAppsStore } from '../../stores/spaceMiniAppsStore';
import { spacesStore } from '../../stores/spacesStore';
import { toolsStore } from '../../stores/toolsStore';

export default {
  name: 'BottomBar',
  components: {
    TopSection,
    BottomSection,
    SpaceMenu,
    CreateSpaceModal,
    DeleteSpaceModal
  },
  props: { visible: { type: Boolean, default: true } },
  emits: ['visibility-change', 'open-settings'],
  
  setup(props, { emit }) {
    const router = useRouter();
    const route = useRoute();
    
    // Состояние
    const spaces = ref([]);
    const currentSpaceId = ref(null);
    const spaceMiniApps = ref([]);
    const isLoading = ref(true);
    const showSpaceMenu = ref(false);
    const showCreateModal = ref(false);
    const showDeleteModal = ref(false);
    const spaceToDelete = ref(null);
    
    // Подписки на store
    let unsubscribeSpaces = null;
    let unsubscribeMiniApps = null;
    
    // Вычисляемые свойства
    const currentSpace = computed(() => spaces.value.find(s => s.id === currentSpaceId.value));
    const currentSpaceName = computed(() => currentSpace.value?.name || '');
    const currentSpaceIcon = computed(() => currentSpace.value?.icon || 'star');
    
    const allSpaceApps = computed(() => {
      const spaceAppIds = spaceMiniApps.value.map(a => a.appId);
      return MINI_APPS_CATALOG.filter(app => spaceAppIds.includes(app.id));
    });
    
    const frequentApps = computed(() => allSpaceApps.value.slice(0, 5));
    
    const currentIndex = computed(() => spaces.value.findIndex(s => s.id === currentSpaceId.value));
    const hasPrevSpace = computed(() => currentIndex.value > 0);
    const hasNextSpace = computed(() => currentIndex.value < spaces.value.length - 1);
    
    // Загрузка данных
    const loadSpaces = async () => {
      await spacesStore.ready();
      spaces.value = [...spacesStore.getSpaces()];
      const savedCurrentId = spacesStore.getCurrentSpaceId();
      
      if (savedCurrentId && spaces.value.some(s => s.id === savedCurrentId)) {
        currentSpaceId.value = savedCurrentId;
      } else if (spaces.value.length > 0) {
        currentSpaceId.value = spaces.value[0].id;
        await spacesStore.setCurrentSpace(currentSpaceId.value);
      } else {
        currentSpaceId.value = null;
      }
    };
    
    const loadSpaceApps = async () => {
      await spaceMiniAppsStore.ready();
      if (currentSpaceId.value) {
        spaceMiniApps.value = [...spaceMiniAppsStore.getMiniApps(currentSpaceId.value)];
      } else {
        spaceMiniApps.value = [];
      }
    };
    
    const refreshData = async () => {
      isLoading.value = true;
      try {
        await loadSpaces();
        await loadSpaceApps();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        isLoading.value = false;
      }
    };
    
    // Навигация по пространствам
    const selectSpace = async (spaceId) => {
      if (currentSpaceId.value === spaceId) return;
      
      await spacesStore.setCurrentSpace(spaceId);
      currentSpaceId.value = spaceId;
      
      const currentPath = route.path;
      const targetPath = `/space/${spaceId}`;
      if (currentPath !== targetPath) {
        router.push(targetPath);
      }
      
      await loadSpaceApps();
      closeSpaceMenu();
      emit('visibility-change', props.visible);
    };
    
    const prevSpace = () => {
      if (hasPrevSpace.value) selectSpace(spaces.value[currentIndex.value - 1].id);
    };
    
    const nextSpace = () => {
      if (hasNextSpace.value) selectSpace(spaces.value[currentIndex.value + 1].id);
    };
    
    // Управление пространствами
    const updateSpaceName = async (newName) => {
      if (currentSpace.value) {
        await spacesStore.updateSpace(currentSpaceId.value, { name: newName });
        await loadSpaces();
      }
    };
    
    const handleCreateSpace = async ({ name, icon }) => {
      const newSpace = await spacesStore.addSpace(name, icon);
      await refreshData();
      await selectSpace(newSpace.id);
      closeCreateModal();
    };
    
    const openDeleteModal = (space) => {
      spaceToDelete.value = space;
      showDeleteModal.value = true;
      closeSpaceMenu();
    };
    
    const closeDeleteModal = () => {
      showDeleteModal.value = false;
      spaceToDelete.value = null;
    };
    
    const confirmDelete = async () => {
      if (spaceToDelete.value) {
        await spacesStore.deleteSpace(spaceToDelete.value.id);
        await refreshData();
        
        if (spaces.value.length > 0) {
          await selectSpace(spaces.value[0].id);
        } else {
          router.push('/');
        }
      }
      closeDeleteModal();
    };
    
    // Меню пространств
    const toggleSpaceMenu = () => {
      showSpaceMenu.value = !showSpaceMenu.value;
    };
    
    const closeSpaceMenu = () => {
      showSpaceMenu.value = false;
    };
    
    const openCreateModal = () => {
      showCreateModal.value = true;
      closeSpaceMenu();
    };
    
    const closeCreateModal = () => {
      showCreateModal.value = false;
    };
    
    // Мини-приложения
    const openMiniApp = (app) => {
      sessionStorage.setItem('returnPath', router.currentRoute.value.path);
      router.push(`/mini-apps/${app.id}`);
    };
    
    const removeApp = async (app) => {
      if (currentSpaceId.value) {
        await spaceMiniAppsStore.removeMiniApp(currentSpaceId.value, app.id);
        await loadSpaceApps();
      }
    };
    
    // Создание карточки
    const createCard = () => {
      const event = new CustomEvent('open-create-card-modal');
      window.dispatchEvent(event);
    };
    
    const openSettings = () => {
      emit('open-settings');
    };
    
    // Следим за изменением маршрута
    watch(() => route.params.id, async (newSpaceId, oldSpaceId) => {
      if (newSpaceId && newSpaceId !== currentSpaceId.value && newSpaceId !== oldSpaceId) {
        currentSpaceId.value = newSpaceId;
        await spacesStore.setCurrentSpace(newSpaceId);
        await loadSpaceApps();
      }
    });
    
    // Обработчики кликов вне меню
    const handleClickOutside = (event) => {
      if (!event.target.closest('.space-menu') && !event.target.closest('.logo-container')) {
        closeSpaceMenu();
      }
      if (!event.target.closest('.catalog-dropdown') && !event.target.closest('.catalog-btn')) {
        window.dispatchEvent(new CustomEvent('close-catalog-dropdown'));
      }
    };
    
    // Жизненный цикл
    onMounted(async () => {
      await Promise.all([
        spacesStore.ready(),
        spaceMiniAppsStore.ready(),
        toolsStore.ready()
      ]);
      
      await refreshData();
      
      unsubscribeSpaces = spacesStore.subscribe(async () => {
        await loadSpaces();
        await loadSpaceApps();
      });
      
      unsubscribeMiniApps = spaceMiniAppsStore.subscribe(async () => {
        await loadSpaceApps();
      });
      
      document.addEventListener('click', handleClickOutside);
    });
    
    onUnmounted(() => {
      if (unsubscribeSpaces) unsubscribeSpaces();
      if (unsubscribeMiniApps) unsubscribeMiniApps();
      document.removeEventListener('click', handleClickOutside);
    });
    
    return {
      spaces,
      currentSpaceId,
      currentSpaceName,
      currentSpaceIcon,
      frequentApps,
      allSpaceApps,
      showSpaceMenu,
      showCreateModal,
      showDeleteModal,
      spaceToDelete,
      hasPrevSpace,
      hasNextSpace,
      isLoading,
      prevSpace,
      nextSpace,
      selectSpace,
      updateSpaceName,
      handleCreateSpace,
      openDeleteModal,
      closeDeleteModal,
      confirmDelete,
      toggleSpaceMenu,
      closeSpaceMenu,
      openCreateModal,
      closeCreateModal,
      openMiniApp,
      removeApp,
      createCard,
      openSettings,
      refreshData,
      visible: props.visible
    };
  }
}
</script>

<style scoped>
.bottom-bar {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 700px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
  opacity: 1;
  visibility: visible;
}

.bottom-bar.hidden {
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%) translateY(15px);
}
</style>
<!-- filepath: /src/views/CategoryPage.vue -->
<template>
  <div class="category-page">
    <!-- Фильтры -->
    <div v-if="allTools.length > 0" class="scrollable-filters">
      <div class="filters-scroll">
        <div class="filters-list">
          <button 
            v-for="filter in filters" 
            :key="filter.value"
            class="filter-chip"
            :class="{ active: currentFilter === filter.value }"
            @click="setFilter(filter.value)"
          >
            {{ filter.label }}
            <span class="filter-count">{{ getFilterCount(filter.value) }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <CreateCardModal :is-open="showCreateModal" @close="closeCreateCardModal" @create="createCard" />
    
    <div class="main-content">
      <div v-if="isLoading" class="loading-state">
        <div class="loader"></div>
        <p>Загрузка...</p>
      </div>
      
      <div v-else-if="filteredTools.length > 0" class="pinterest-grid-container">
        <PinterestGrid 
          ref="pinterestGrid"
          :items="filteredTools" 
          :min-column-width="300" 
          :max-columns="8" 
          :gap="16"
          @card-drag-start="onCardDragStart"
          @card-drag-end="onCardDragEnd"
          @card-drop="onCardDrop"
        >
          <template v-for="(tool, idx) in filteredTools" :key="tool.id" #[`item-${tool.id}`]>
            <div 
              class="grid-item" 
              :class="{ wide: tool.data?.expanded }"
              :data-card-id="tool.id"
              :data-card-index="idx"
            >
              <BuilderCard 
                :toolId="tool.id" 
                :data="tool.data" 
                :cardIndex="idx"
                @update="updateTool"
                @delete="() => deleteTool(tool.id)"
                @edit="openCardEditor"
              />
            </div>
          </template>
        </PinterestGrid>
      </div>
      <div v-else class="empty-state">
        <p>Нажмите на кнопку с карандашом, чтобы создать карточку</p>
      </div>
    </div>
    
    <!-- Редактор карточки -->
    <CardEditorPage
      v-if="editorCard"
      :card-id="editorCard.toolId"
      :card-data="editorCard.data"
      :space-id="page"
      @close="closeCardEditor"
      @update="updateCardFromEditor"
      @delete="deleteCardFromEditor"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import BuilderCard from '../components/BuilderCard/index.vue';
import CreateCardModal from '../components/modals/CreateCardModal.vue';
import CardEditorPage from '../views/CardEditorPage.vue';
import PinterestGrid from '../components/PinterestGrid.vue';
import { toolsStore } from '../stores/toolsStore';
import { spacesStore } from '../stores/spacesStore';

export default {
  name: 'CategoryPage',
  components: {
    BuilderCard,
    CreateCardModal,
    CardEditorPage,
    PinterestGrid
  },
  props: { page: { type: String, required: true } },
  
  setup(props) {
    const allTools = ref([]);
    const isLoading = ref(true);
    const currentFilter = ref('all');
    const showCreateModal = ref(false);
    const editorCard = ref(null);
    const pinterestGrid = ref(null);
    let unsubscribeTools = null;
    let unsubscribeSpaces = null;
    
    const hasPhoto = (tool) => tool.data?.blocks?.some(block => block.type === 'photo' && block.data?.image);
    const hasText = (tool) => tool.data?.blocks?.some(block => block.type === 'text' && block.data?.content?.trim());
    const hasTimer = (tool) => tool.data?.blocks?.some(block => block.type === 'timer');
    const hasProgress = (tool) => tool.data?.blocks?.some(block => block.type === 'progress');
    const hasList = (tool) => tool.data?.blocks?.some(block => block.type === 'listItem');
    
    const filters = [
      { label: 'Все', value: 'all' },
      { label: 'Важные', value: 'important' },
      { label: 'Фото', value: 'photo' },
      { label: 'Текст', value: 'text' },
      { label: 'Таймер', value: 'timer' },
      { label: 'Прогресс', value: 'progress' },
      { label: 'Список', value: 'list' }
    ];
    
    const getFilterCount = (filterValue) => {
      if (filterValue === 'all') return allTools.value.length;
      return allTools.value.filter(tool => {
        if (filterValue === 'important') return tool.data?.important === true;
        if (filterValue === 'photo') return hasPhoto(tool);
        if (filterValue === 'text') return hasText(tool);
        if (filterValue === 'timer') return hasTimer(tool);
        if (filterValue === 'progress') return hasProgress(tool);
        if (filterValue === 'list') return hasList(tool);
        return false;
      }).length;
    };
    
    const filteredTools = computed(() => {
      if (currentFilter.value === 'all') return allTools.value;
      return allTools.value.filter(tool => {
        if (currentFilter.value === 'important') return tool.data?.important === true;
        if (currentFilter.value === 'photo') return hasPhoto(tool);
        if (currentFilter.value === 'text') return hasText(tool);
        if (currentFilter.value === 'timer') return hasTimer(tool);
        if (currentFilter.value === 'progress') return hasProgress(tool);
        if (currentFilter.value === 'list') return hasList(tool);
        return false;
      });
    });
    
    const loadTools = () => {
      const spaceId = props.page;
      const loadedTools = toolsStore.getTools(spaceId);
      allTools.value = [...loadedTools];
    };
    
    const initialize = async () => {
      await toolsStore.ready();
      await spacesStore.ready();
      loadTools();
      isLoading.value = false;
    };
    
    const setFilter = (filter) => { currentFilter.value = filter; };
    const openCreateCardModal = () => { showCreateModal.value = true; };
    const closeCreateCardModal = () => { showCreateModal.value = false; };
    
    const createCard = async (cardData) => {
      const spaceId = props.page;
      await toolsStore.addTool(spaceId, cardData);
      closeCreateCardModal();
    };
    
    const deleteTool = async (toolId) => {
      const spaceId = props.page;
      await toolsStore.deleteTool(spaceId, toolId);
      loadTools();
    };
    
    const updateTool = async (toolId, newData) => {
      const spaceId = props.page;
      await toolsStore.updateTool(spaceId, toolId, newData);
      loadTools();
    };
    
    const openCardEditor = (card) => {
      editorCard.value = card;
    };
    
    const closeCardEditor = () => {
      editorCard.value = null;
    };
    
    const updateCardFromEditor = async (newData) => {
      if (editorCard.value) {
        await updateTool(editorCard.value.toolId, { data: newData });
        editorCard.value = {
          ...editorCard.value,
          data: newData
        };
      }
    };
    
    const deleteCardFromEditor = async () => {
      if (editorCard.value) {
        await deleteTool(editorCard.value.toolId);
        closeCardEditor();
      }
    };
    
    // Drag and drop для карточек
    const onCardDragStart = (event, index, cardId) => {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', JSON.stringify({
        type: 'card',
        sourceIndex: index,
        cardId: cardId
      }));
    };
    
    const onCardDragEnd = () => {
      // Можно добавить визуальное сброс
    };
    
    const onCardDrop = async (event, targetIndex, targetCardId) => {
      event.preventDefault();
      
      const draggedData = event.dataTransfer.getData('text/plain');
      if (!draggedData) return;
      
      const { sourceIndex, cardId } = JSON.parse(draggedData);
      
      if (sourceIndex === targetIndex) return;
      
      // Создаём новый массив карточек
      const currentTools = [...allTools.value];
      const [movedTool] = currentTools.splice(sourceIndex, 1);
      currentTools.splice(targetIndex, 0, movedTool);
      
      // Обновляем состояние
      allTools.value = currentTools;
      
      // Сохраняем порядок в БД
      for (let i = 0; i < currentTools.length; i++) {
        await toolsStore.updateTool(props.page, currentTools[i].id, { data: { ...currentTools[i].data, order: i } });
      }
    };
    
    watch(() => props.page, () => { loadTools(); });
    
    onMounted(() => {
      initialize();
      window.addEventListener('open-create-card-modal', openCreateCardModal);
      unsubscribeTools = toolsStore.subscribe(() => loadTools());
      unsubscribeSpaces = spacesStore.subscribe(() => loadTools());
    });
    
    onUnmounted(() => {
      if (unsubscribeTools) unsubscribeTools();
      if (unsubscribeSpaces) unsubscribeSpaces();
      window.removeEventListener('open-create-card-modal', openCreateCardModal);
    });
    
    return { 
      allTools, filteredTools, isLoading, filters, currentFilter, showCreateModal, editorCard,
      pinterestGrid,
      deleteTool, updateTool, setFilter, getFilterCount, 
      openCreateCardModal, closeCreateCardModal, createCard,
      openCardEditor, closeCardEditor, updateCardFromEditor, deleteCardFromEditor,
      onCardDragStart, onCardDragEnd, onCardDrop
    };
  }
}
</script>

<style scoped>
.category-page {
  animation: fadeInPage 0.25s ease;
  width: 100%;
  min-height: 400px;
  padding-top: 0;
  padding-bottom: 120px;
}

@keyframes fadeInPage {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.scrollable-filters {
  margin-bottom: 1rem;
}

.filters-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.filters-scroll::-webkit-scrollbar {
  display: none;
}

.filters-list {
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem 0;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(26, 59, 59, 0.1);
  border-radius: 30px;
  color: #5a6a6a;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  white-space: nowrap;
}

.filter-chip:hover {
  background: rgba(255, 255, 255, 0.8);
  color: #1a3b3b;
}

.filter-chip.active {
  background: #1a3b3b;
  color: white;
  border-color: #1a3b3b;
}

.filter-count {
  font-size: 0.7rem;
  opacity: 0.8;
}

.main-content {
  width: 100%;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #8a9a9a;
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(26, 59, 59, 0.1);
  border-top-color: #1a3b3b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.pinterest-grid-container {
  width: 100%;
}

.grid-item {
  width: 100%;
  height: fit-content;
}

.empty-state {
  width: 100%;
  padding: 3rem 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 32px;
  border: 1px solid rgba(26, 59, 59, 0.08);
  margin-top: 2rem;
}

.empty-state p {
  color: #8a9a9a;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .filter-chip {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .filter-chip {
    padding: 0.35rem 0.7rem;
    font-size: 0.75rem;
  }
}
</style>
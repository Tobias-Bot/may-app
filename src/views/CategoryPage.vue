<template>
  <div class="category-page">
    <!-- Фильтры-теги -->
    <ScrollableFilters 
      :filters="filters"
      :current-filter="currentFilter"
      :visible="navVisible"
      @filter-change="setFilter"
    />

    <!-- Pinterest сетка для инструментов -->
    <div v-if="isLoading" class="loading-state">
      <div class="loader"></div>
      <p>Загрузка...</p>
    </div>
    
    <div v-else-if="filteredTools.length > 0" class="pinterest-grid-container">
      <PinterestGrid 
        :items="filteredTools" 
        :min-column-width="300" 
        :max-columns="8" 
        :gap="16"
      >
        <template v-for="tool in filteredTools" :key="tool.id" #[`item-${tool.id}`]>
          <div class="grid-item" :class="{ 'wide': tool.type === 'photo' }">
            <NoteTool 
              v-if="tool.type === 'note'" 
              :toolId="tool.id" 
              :data="tool.data" 
              @delete="deleteTool" 
              @update="updateTool" 
            />
            <ListTool 
              v-else-if="tool.type === 'list'" 
              :toolId="tool.id" 
              :data="tool.data" 
              @delete="deleteTool" 
              @update="updateTool" 
            />
            <PhotoTool 
              v-else-if="tool.type === 'photo'" 
              :toolId="tool.id" 
              :data="tool.data" 
              @update="updateTool" 
              @delete="deleteTool" 
            />
            <ProgressBar 
              v-else-if="tool.type === 'progress'" 
              :toolId="tool.id" 
              :data="tool.data" 
              @delete="deleteTool" 
              @update="updateTool" 
            />
            <TimerTool 
              v-else-if="tool.type === 'timer'" 
              :toolId="tool.id" 
              :data="tool.data" 
              @delete="deleteTool" 
              @update="updateTool" 
            />
          </div>
        </template>
      </PinterestGrid>
    </div>
    <div v-else class="empty-state">
      <p>Нажмите на кнопку с карандашом, чтобы добавить заметку, список, фото, прогресс или таймер</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import ScrollableFilters from '../components/ScrollableFilters.vue';
import NoteTool from '../components/tools/NoteTool.vue';
import ListTool from '../components/tools/ListTool.vue';
import PhotoTool from '../components/tools/PhotoTool.vue';
import ProgressBar from '../components/tools/ProgressBar.vue';
import TimerTool from '../components/tools/TimerTool.vue';
import PinterestGrid from '../components/PinterestGrid.vue';
import { toolsStore } from '../stores/toolsStore';

export default {
  name: 'CategoryPage',
  components: {
    ScrollableFilters,
    NoteTool,
    ListTool,
    PhotoTool,
    ProgressBar,
    TimerTool,
    PinterestGrid
  },
  props: {
    page: {
      type: String,
      required: true,
      validator: (value) => ['ya', 'dom', 'blizkie', 'people'].includes(value)
    }
  },
  
  setup(props) {
    const allTools = ref([]);
    const isLoading = ref(true);
    const currentFilter = ref('all');
    const navVisible = ref(true);
    let lastScrollTop = 0;
    const scrollThreshold = 10;

    const filters = [
      { label: 'Все', value: 'all' },
      { label: 'Заметки', value: 'note' },
      { label: 'Списки', value: 'list' },
      { label: 'Фото', value: 'photo' },
      { label: 'Прогресс', value: 'progress' },
      { label: 'Таймеры', value: 'timer' } // Добавлен фильтр для таймеров
    ];

    const filteredTools = computed(() => {
      if (currentFilter.value === 'all') {
        return allTools.value;
      }
      return allTools.value.filter(tool => tool.type === currentFilter.value);
    });

    const loadTools = () => { 
      const loadedTools = toolsStore.getTools(props.page);
      console.log(`Tools loaded for ${props.page}:`, loadedTools);
      allTools.value = [...loadedTools]; 
    };
    
    const initialize = async () => {
      console.log(`Initializing ${props.page} view...`);
      await toolsStore.ready();
      loadTools();
      isLoading.value = false;
    };

    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      
      if (Math.abs(currentScroll - lastScrollTop) <= scrollThreshold) {
        return;
      }

      if (currentScroll > lastScrollTop && currentScroll > 50) {
        navVisible.value = false;
      } else {
        navVisible.value = true;
      }
      
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    };
    
    onMounted(() => {
      initialize();
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      const unsubscribe = toolsStore.subscribe(() => { 
        console.log(`Tools store changed for ${props.page}, reloading...`);
        loadTools(); 
      });
      
      onUnmounted(() => {
        unsubscribe();
        window.removeEventListener('scroll', handleScroll);
      });
    });
    
    const deleteTool = (toolId) => toolsStore.deleteTool(props.page, toolId);
    const updateTool = (toolId, newData) => {
  console.log('🟠 [CategoryPage] updateTool RECEIVED:', { 
    page: props.page, 
    toolId, 
    newData,
    timestamp: Date.now()
  });
  
  // Проверяем, что newData действительно пришло
  console.log('🟠 [CategoryPage] data keys:', Object.keys(newData));
  
  // Вызываем store
  console.log('🟠 [CategoryPage] calling toolsStore.updateTool...');
  toolsStore.updateTool(props.page, toolId, newData)
    .then(result => {
      console.log('🟢 [CategoryPage] updateTool resolved:', result);
    })
    .catch(error => {
      console.error('🔴 [CategoryPage] updateTool error:', error);
    });
};
    
    const setFilter = (filter) => {
      currentFilter.value = filter;
    };
    
    return { 
      filteredTools,
      isLoading,
      filters,
      currentFilter,
      navVisible,
      deleteTool, 
      updateTool,
      setFilter
    };
  }
}
</script>

<style scoped>
.category-page {
  animation: fadeInPage 0.25s ease;
  width: 100%;
  min-height: 400px;
  padding-top: 70px;
}

@keyframes fadeInPage {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
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
  margin-top: 0.5rem;
}

.grid-item {
  width: 100%;
  height: fit-content;
}

.grid-item.wide {
  grid-column: span 2;
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
  .category-page {
    padding-top: 60px;
  }
  
  .grid-item.wide {
    grid-column: span 1;
  }
}

@media (max-width: 480px) {
  .category-page {
    padding-top: 55px;
  }
}
</style>
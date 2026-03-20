<template>
  <div v-if="shouldShow" class="scrollable-filters" :class="{ hidden: !visible }" ref="container">
    <div class="filters-container" ref="scrollContainer">
      <div class="filters-content" :style="{ transform: `translateX(-${scrollPosition}px)` }">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          class="filter-tag"
          :class="{ active: currentFilter === filter.value }"
          @click="$emit('filter-change', filter.value)"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>
    
    <!-- Стрелки навигации (только для ПК) -->
    <button 
      v-if="!isMobile && showLeftArrow" 
      class="scroll-arrow left" 
      @click="scrollLeft"
      aria-label="Прокрутить влево"
    >
      ←
    </button>
    <button 
      v-if="!isMobile && showRightArrow" 
      class="scroll-arrow right" 
      @click="scrollRight"
      aria-label="Прокрутить вправо"
    >
      →
    </button>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'ScrollableFilters',
  props: {
    filters: {
      type: Array,
      required: true
    },
    currentFilter: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  emits: ['filter-change'],
  
  setup(props) {
    const route = useRoute();
    const container = ref(null);
    const scrollContainer = ref(null);
    const scrollPosition = ref(0);
    const maxScroll = ref(0);
    const isMobile = ref(window.innerWidth <= 768);

    const shouldShow = computed(() => {
      // Скрываем на страницах мини-приложений
      return !route.path.startsWith('/mini-apps');
    });

    const showLeftArrow = computed(() => scrollPosition.value > 0);
    const showRightArrow = computed(() => scrollPosition.value < maxScroll.value);

    const updateMaxScroll = () => {
      if (scrollContainer.value) {
        const container = scrollContainer.value;
        const content = container.querySelector('.filters-content');
        if (content) {
          maxScroll.value = Math.max(0, content.scrollWidth - container.clientWidth);
        }
      }
    };

    const scrollLeft = () => {
      scrollPosition.value = Math.max(0, scrollPosition.value - 200);
    };

    const scrollRight = () => {
      scrollPosition.value = Math.min(maxScroll.value, scrollPosition.value + 200);
    };

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768;
    };

    const handleResize = () => {
      checkMobile();
      updateMaxScroll();
      scrollPosition.value = 0;
    };

    onMounted(() => {
      window.addEventListener('resize', handleResize);
      updateMaxScroll();
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    watch([() => props.filters, scrollContainer], () => {
      setTimeout(updateMaxScroll, 100);
    });

    return {
      shouldShow,
      container,
      scrollContainer,
      scrollPosition,
      showLeftArrow,
      showRightArrow,
      isMobile,
      scrollLeft,
      scrollRight
    };
  }
}
</script>

<style scoped>
.scrollable-filters {
  top: 0px;
  z-index: 900;
  background: transparent;
  padding: 0.75rem 0;
  margin-bottom: 1.5rem;
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
  opacity: 1;
  visibility: visible;
  width: 100%;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.scrollable-filters.hidden {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-15px);
}

.filters-container {
  overflow: hidden;
  position: relative;
  width: 100%;
  padding: 0 60px;
}

.filters-content {
  display: flex;
  gap: 0.5rem;
  transition: transform 0.3s ease;
  white-space: nowrap;
  justify-content: flex-start;
}

.filter-tag {
  padding: 0.5rem 1.2rem;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(26, 59, 59, 0.1);
  color: #5a6a6a;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.filter-tag:hover {
  background: rgba(255, 255, 255, 0.8);
  color: #1a3b3b;
}

.filter-tag.active {
  background: #1a3b3b;
  color: white;
  border-color: #1a3b3b;
}

.scroll-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  border: 1px solid rgba(26, 59, 59, 0.15);
  color: #1a3b3b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
  font-size: 1.1rem;
}

.scroll-arrow:hover {
  background: #1a3b3b;
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.scroll-arrow.left {
  left: 10px;
}

.scroll-arrow.right {
  right: 10px;
}

/* Мобильные устройства */
@media (max-width: 768px) {
  .scrollable-filters {
    top: 80px;
    padding: 0.5rem 0;
  }
  
  .filters-container {
    padding: 0 16px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  
  .filters-container::-webkit-scrollbar {
    display: none;
  }
  
  .filters-content {
    transform: none !important;
    width: max-content;
  }
  
  .filter-tag {
    padding: 0.4rem 1rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .scrollable-filters {
    top: 70px;
  }
  
  .filter-tag {
    padding: 0.35rem 0.85rem;
    font-size: 0.8rem;
  }
}
</style>
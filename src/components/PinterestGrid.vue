<template>
  <div class="pinterest-grid" ref="gridContainer">
    <div 
      v-for="(column, colIndex) in columns" 
      :key="colIndex"
      class="grid-column"
      :style="{ width: `${100 / columnCount}%` }"
    >
      <div 
        v-for="item in column" 
        :key="item.id"
        class="grid-item"
      >
        <slot :name="`item-${item.id}`" :item="item">
          <div v-if="!$slots[`item-${item.id}`]" class="default-item">
            {{ item }}
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';

export default {
  name: 'PinterestGrid',
  props: {
    items: {
      type: Array,
      default: () => []
    },
    minColumnWidth: {
      type: Number,
      default: 200 /* Уменьшено для более компактных карточек */
    },
    maxColumns: {
      type: Number,
      default: 10
    },
    gap: {
      type: Number,
      default: 16
    }
  },
  
  setup(props) {
    const gridContainer = ref(null);
    const columnCount = ref(1);
    const columns = ref([]);

    const calculateColumnCount = () => {
      if (!gridContainer.value) return;
      const containerWidth = gridContainer.value.offsetWidth;
      
      // Мобильные (до 480px) - 2 колонки
      if (window.innerWidth <= 480) {
        columnCount.value = 2;
      } 
      // Маленькие планшеты (481px - 768px) - 2-3 колонки
      else if (window.innerWidth <= 768) {
        const possibleColumns = Math.floor(containerWidth / (props.minColumnWidth + props.gap));
        columnCount.value = Math.min(Math.max(possibleColumns, 2), 3);
      }
      // Планшеты (769px - 1024px) - 3-4 колонки
      else if (window.innerWidth <= 1024) {
        const possibleColumns = Math.floor(containerWidth / (props.minColumnWidth + props.gap));
        columnCount.value = Math.min(Math.max(possibleColumns, 3), 4);
      }
      // Десктопы (1025px - 1440px) - 4-6 колонок
      else if (window.innerWidth <= 1440) {
        const possibleColumns = Math.floor(containerWidth / (props.minColumnWidth + props.gap));
        columnCount.value = Math.min(Math.max(possibleColumns, 4), 6);
      }
      // Широкие экраны (>1440px) - до 10 колонок
      else {
        const possibleColumns = Math.floor(containerWidth / (props.minColumnWidth + props.gap));
        columnCount.value = Math.min(possibleColumns, props.maxColumns);
      }
    };

    const distributeItems = () => {
      if (!props.items || !Array.isArray(props.items) || props.items.length === 0) {
        columns.value = Array.from({ length: columnCount.value }, () => []);
        return;
      }

      const newColumns = Array.from({ length: columnCount.value }, () => []);
      
      // Распределяем элементы по колонкам равномерно
      props.items.forEach((item) => {
        if (item) {
          // Находим колонку с наименьшим количеством элементов
          const targetColumn = newColumns.reduce((minIndex, col, i) => {
            return col.length < newColumns[minIndex].length ? i : minIndex;
          }, 0);
          
          newColumns[targetColumn].push(item);
        }
      });
      
      columns.value = newColumns;
    };

    const handleResize = () => {
      calculateColumnCount();
      distributeItems();
    };

    onMounted(() => {
      calculateColumnCount();
      distributeItems();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    watch(() => props.items, () => {
      distributeItems();
    }, { deep: true, immediate: true });

    watch(columnCount, () => {
      distributeItems();
    });

    return {
      gridContainer,
      columnCount,
      columns
    };
  }
}
</script>

<style scoped>
.pinterest-grid {
  display: flex;
  gap: v-bind(gap + 'px');
  width: 100%;
  margin: 0 auto;
  padding: 0;
}

.grid-column {
  display: flex;
  flex-direction: column;
  gap: v-bind(gap + 'px');
  flex: 1;
  min-width: 0;
}

.grid-item {
  width: 100%;
  min-width: 0;
  break-inside: avoid;
}

.default-item {
  padding: 1rem;
  background: rgba(26, 59, 59, 0.05);
  border-radius: 16px;
  text-align: center;
  color: #8a9a9a;
}
</style>
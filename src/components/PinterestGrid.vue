<!-- filepath: /src/components/PinterestGrid.vue -->
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
        :data-card-id="item.id"
        :data-card-index="getItemIndex(item)"
        draggable="true"
        @dragstart="onItemDragStart($event, item)"
        @dragend="onItemDragEnd"
        @dragover.prevent="onItemDragOver($event, item)"
        @drop="onItemDrop($event, item)"
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
      default: 200
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
  emits: ['card-drag-start', 'card-drag-end', 'card-drop'],
  
  setup(props, { emit }) {
    const gridContainer = ref(null);
    const columnCount = ref(1);
    const columns = ref([]);
    const draggedItem = ref(null);
    const dragOverItemId = ref(null);

    const calculateColumnCount = () => {
      if (!gridContainer.value) return;
      const containerWidth = gridContainer.value.offsetWidth;
      
      if (window.innerWidth <= 480) {
        columnCount.value = 2;
      } 
      else if (window.innerWidth <= 768) {
        const possibleColumns = Math.floor(containerWidth / (props.minColumnWidth + props.gap));
        columnCount.value = Math.min(Math.max(possibleColumns, 2), 3);
      }
      else if (window.innerWidth <= 1024) {
        const possibleColumns = Math.floor(containerWidth / (props.minColumnWidth + props.gap));
        columnCount.value = Math.min(Math.max(possibleColumns, 3), 4);
      }
      else if (window.innerWidth <= 1440) {
        const possibleColumns = Math.floor(containerWidth / (props.minColumnWidth + props.gap));
        columnCount.value = Math.min(Math.max(possibleColumns, 4), 6);
      }
      else {
        const possibleColumns = Math.floor(containerWidth / (props.minColumnWidth + props.gap));
        columnCount.value = Math.min(possibleColumns, props.maxColumns);
      }
    };

    const getItemIndex = (item) => {
      return props.items.findIndex(i => i.id === item.id);
    };

    const distributeItems = () => {
      if (!props.items || !Array.isArray(props.items) || props.items.length === 0) {
        columns.value = Array.from({ length: columnCount.value }, () => []);
        return;
      }

      const newColumns = Array.from({ length: columnCount.value }, () => []);
      
      props.items.forEach((item, idx) => {
        if (item) {
          const targetColumn = idx % columnCount.value;
          newColumns[targetColumn].push(item);
        }
      });
      
      columns.value = newColumns;
    };

    const onItemDragStart = (event, item) => {
      const index = getItemIndex(item);
      draggedItem.value = { item, index };
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', JSON.stringify({
        type: 'card',
        sourceIndex: index,
        cardId: item.id
      }));
      emit('card-drag-start', event, index, item.id);
    };

    const onItemDragEnd = (event) => {
      draggedItem.value = null;
      dragOverItemId.value = null;
      emit('card-drag-end', event);
    };

    const onItemDragOver = (event, item) => {
      event.preventDefault();
      if (draggedItem.value && draggedItem.value.item.id !== item.id) {
        dragOverItemId.value = item.id;
      }
    };

    const onItemDrop = (event, item) => {
      event.preventDefault();
      const targetIndex = getItemIndex(item);
      if (draggedItem.value && draggedItem.value.index !== targetIndex) {
        emit('card-drop', event, targetIndex, item.id);
      }
      dragOverItemId.value = null;
      draggedItem.value = null;
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
      columns,
      getItemIndex,
      onItemDragStart,
      onItemDragEnd,
      onItemDragOver,
      onItemDrop
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
  cursor: grab;
  transition: transform 0.2s ease;
}

.grid-item:active {
  cursor: grabbing;
}

.default-item {
  padding: 1rem;
  background: rgba(26, 59, 59, 0.05);
  border-radius: 16px;
  text-align: center;
  color: #8a9a9a;
}
</style>
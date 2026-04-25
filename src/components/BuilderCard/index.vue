<!-- filepath: /src/components/BuilderCard/index.vue -->
<template>
  <div 
    class="builder-card card-base" 
    :class="{ important: isImportant, dragging: isDragging }" 
    :style="{ backgroundColor: cardColor }"
    draggable="true"
    @dragstart="onCardDragStart"
    @dragend="onCardDragEnd"
  >
    <!-- Drag handle для перемещения карточки -->
    <div class="card-drag-handle" @mousedown.stop>
      ⋮⋮
    </div>
    
    <!-- Кнопки управления -->
    <div class="card-actions-top">
      <button class="card-action-btn edit-btn" @click="openEditor" title="Редактировать">✎</button>
      <div class="card-menu-wrapper">
        <button class="card-action-btn" @click.stop="toggleCardMenu" title="Действия">⋮</button>
        <div v-if="showCardMenu" class="card-context-menu" ref="cardMenu">
          <button class="menu-item" @click="toggleImportant">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" :fill="isImportant ? 'currentColor' : 'none'"/>
            </svg>
            <span>{{ isImportant ? 'Убрать из важных' : 'Сделать важной' }}</span>
          </button>
          <button class="menu-item danger" @click="deleteCard">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18 6L6 18M6 6L18 18"/>
            </svg>
            <span>Удалить карточку</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Блоки -->
    <div class="blocks-container">
      <div v-for="block in blocks" :key="block.id" class="block-preview">
        <div class="block-preview-content">
          <TitleBlock v-if="block.type === 'title'" :data="block.data" @update="(d) => updateBlockData(block.id, d)" />
          <TextBlock v-else-if="block.type === 'text'" :data="block.data" @update="(d) => updateBlockData(block.id, d)" />
          <ListItemBlock v-else-if="block.type === 'listItem'" :data="block.data" @update="(d) => updateBlockData(block.id, d)" />
          <TimerBlock v-else-if="block.type === 'timer'" :data="block.data" @update="(d) => updateBlockData(block.id, d)" />
          <ProgressBlock v-else-if="block.type === 'progress'" :data="block.data" @update="(d) => updateBlockData(block.id, d)" />
          <PhotoBlock v-else-if="block.type === 'photo'" :data="block.data" @update="(d) => updateBlockData(block.id, d)" />
          <DividerBlock v-else-if="block.type === 'divider'" :data="block.data" @update="(d) => updateBlockData(block.id, d)" />
          <TableBlock v-else-if="block.type === 'table'" :data="block.data" @update="(d) => updateBlockData(block.id, d)" />
          <ReminderBlock v-else-if="block.type === 'reminder'" :data="block.data" @update="(d) => updateBlockData(block.id, d)" />
        </div>
      </div>
    </div>
    
    <div class="card-footer"><span>{{ formatDate(updatedAt) }}</span></div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import TitleBlock from './blocks/TitleBlock.vue';
import TextBlock from './blocks/TextBlock.vue';
import ListItemBlock from './blocks/ListItemBlock.vue';
import TimerBlock from './blocks/TimerBlock.vue';
import ProgressBlock from './blocks/ProgressBlock.vue';
import PhotoBlock from './blocks/PhotoBlock.vue';
import DividerBlock from './blocks/DividerBlock.vue';
import TableBlock from './blocks/TableBlock.vue';
import ReminderBlock from './blocks/ReminderBlock.vue';

export default {
  name: 'BuilderCard',
  components: {
    TitleBlock,
    TextBlock,
    ListItemBlock,
    TimerBlock,
    ProgressBlock,
    PhotoBlock,
    DividerBlock,
    TableBlock,
    ReminderBlock
  },
  props: { 
    toolId: String, 
    data: Object, 
    cardIndex: Number 
  },
  emits: ['update', 'delete', 'edit', 'card-drag-start', 'card-drag-end'],
  
  setup(props, { emit }) {
    const blocks = ref([]);
    const updatedAt = ref(new Date().toISOString());
    const isImportant = ref(false);
    const cardColor = ref('#ffffff');
    const showCardMenu = ref(false);
    const isDragging = ref(false);
    const cardMenu = ref(null);
    
    const initData = () => {
      if (props.data) {
        blocks.value = props.data.blocks ? [...props.data.blocks] : [];
        updatedAt.value = props.data.updatedAt || new Date().toISOString();
        isImportant.value = props.data.important || false;
        cardColor.value = props.data.color || '#ffffff';
      }
    };
    
    watch(() => props.data, () => initData(), { deep: true, immediate: true });
    
    const updateBlockData = (blockId, newData) => {
      const index = blocks.value.findIndex(b => b.id === blockId);
      if (index !== -1) {
        blocks.value[index].data = { ...blocks.value[index].data, ...newData };
        save();
      }
    };
    
    const toggleImportant = () => {
      isImportant.value = !isImportant.value;
      save();
    };
    
    const openEditor = () => {
      emit('edit', {
        toolId: props.toolId,
        data: {
          blocks: blocks.value,
          important: isImportant.value,
          color: cardColor.value
        }
      });
    };
    
    const deleteCard = () => {
      if (confirm('Удалить карточку?')) {
        emit('delete');
      }
    };
    
    const toggleCardMenu = () => {
      showCardMenu.value = !showCardMenu.value;
    };
    
    const onCardDragStart = (event) => {
      isDragging.value = true;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', JSON.stringify({
        type: 'card',
        toolId: props.toolId,
        cardIndex: props.cardIndex
      }));
      event.target.classList.add('dragging-card');
      emit('card-drag-start', props.cardIndex);
    };
    
    const onCardDragEnd = () => {
      isDragging.value = false;
      const el = document.querySelector('.dragging-card');
      if (el) el.classList.remove('dragging-card');
      emit('card-drag-end');
    };
    
    const save = () => {
      updatedAt.value = new Date().toISOString();
      emit('update', props.toolId, {
        data: {
          blocks: blocks.value,
          updatedAt: updatedAt.value,
          important: isImportant.value,
          color: cardColor.value
        }
      });
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      if (date.toDateString() === now.toDateString()) return 'Сегодня';
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) return 'Вчера';
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    };
    
    const handleClickOutside = (event) => {
      if (cardMenu.value && !cardMenu.value.contains(event.target) && !event.target.closest('.card-action-btn')) {
        showCardMenu.value = false;
      }
    };
    
    initData();
    setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
    
    return {
      blocks,
      updatedAt,
      isImportant,
      cardColor,
      showCardMenu,
      isDragging,
      cardMenu,
      updateBlockData,
      toggleImportant,
      openEditor,
      deleteCard,
      toggleCardMenu,
      onCardDragStart,
      onCardDragEnd,
      formatDate
    };
  }
}
</script>

<style scoped>
@import '../../styles/card-styles.css';

.builder-card {
  gap: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
  padding-top: 2.5rem;
  cursor: grab;
  min-height: 200px;
}

.builder-card.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.builder-card.important {
  border-left: 4px solid #f5a623;
  border-right: 4px solid #f5a623;
}

.card-drag-handle {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  cursor: grab;
  color: #8a9a9a;
  padding: 0.25rem;
  font-size: 1.2rem;
  user-select: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 5;
}

.builder-card:hover .card-drag-handle {
  opacity: 0.5;
}

.card-drag-handle:active {
  cursor: grabbing;
}

.card-actions-top {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.card-action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(26, 59, 59, 0.15);
  color: #1a3b3b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1.2rem;
}

.card-action-btn:hover {
  background: #1a3b3b;
  color: white;
  transform: scale(1.05);
}

.edit-btn {
  background: rgba(26, 59, 59, 0.1);
}

.card-context-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 12px;
  padding: 0.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  z-index: 100;
  animation: fadeIn 0.15s ease;
}

.blocks-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.block-preview {
  background: transparent;
  border-radius: 12px;
  padding: 0.25rem;
  width: 100%;
}

.block-preview-content {
  width: 100%;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.15rem;
  padding-top: 0.3rem;
  border-top: 1px solid rgba(26, 59, 59, 0.08);
  font-size: 0.7rem;
  color: #5a6a6a;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  color: #1a3b3b;
}

.menu-item:hover {
  background: rgba(26, 59, 59, 0.08);
}

.menu-item.danger {
  color: #b34141;
}

.menu-item.danger:hover {
  background: rgba(180, 70, 70, 0.1);
}

.menu-item svg {
  width: 14px;
  height: 14px;
  stroke: currentColor;
}
</style>
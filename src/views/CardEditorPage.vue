<!-- filepath: /src/views/CardEditorPage.vue -->
<template>
  <div class="card-editor-overlay" @click.self="close">
    <!-- Большая круглая кнопка закрытия -->
    <button class="editor-close-btn" @click="close" title="Закрыть">✕</button>
    
    <div class="card-editor-container">
      <!-- Панель инструментов -->
      <div class="editor-toolbar">
        <button class="toolbar-btn" @click="toggleImportant" :class="{ active: isImportant }" title="Важное">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" :fill="isImportant ? 'currentColor' : 'none'"/>
          </svg>
          <span>Важная</span>
        </button>
        
        <div class="color-picker-wrapper">
          <button class="toolbar-btn" @click="toggleColorPicker" title="Цвет карточки">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15.1L18.3 16.2C18.1 16.4 17.8 16.4 17.6 16.2L15.8 14.4C15.6 14.2 15.6 13.9 15.8 13.7L16.9 12.6C17.1 12.4 17.1 12.1 16.9 11.9L15.8 10.8C15.6 10.6 15.6 10.3 15.8 10.1L17.6 8.3C17.8 8.1 18.1 8.1 18.3 8.3L19.4 9.4C20.2 10.2 20.2 11.4 19.4 12.2L18.3 13.3C18.1 13.5 18.1 13.8 18.3 14L19.4 15.1C20.2 15.9 20.2 17.1 19.4 17.9L18.3 19C17.5 19.8 16.3 19.8 15.5 19L14.4 17.9C14.2 17.7 14.2 17.4 14.4 17.2L15.5 16.1C15.7 15.9 15.7 15.6 15.5 15.4L13.7 13.6"/>
            </svg>
            <span>Цвет</span>
          </button>
          <div v-if="showColorPicker" class="color-picker-dropdown">
            <div class="color-picker-options">
              <button 
                v-for="color in colorOptions" 
                :key="color.value" 
                class="color-option" 
                :style="{ backgroundColor: color.value }" 
                :class="{ active: cardColor === color.value }" 
                @click="setCardColor(color.value)"
                :title="color.name"
              ></button>
            </div>
          </div>
        </div>
        
        <button class="toolbar-btn" @click="openAddBlockModal" title="Добавить блок">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5V19M5 12H19"/>
          </svg>
          <span>Блок</span>
        </button>
        
        <button class="toolbar-btn danger" @click="deleteCard" title="Удалить карточку">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M18 6L6 18M6 6L18 18"/>
          </svg>
          <span>Удалить</span>
        </button>
      </div>
      
      <!-- Карточка -->
      <div class="editor-card" :style="{ backgroundColor: cardColor }">
        <div class="editor-blocks-container">
          <div 
            v-for="(block, index) in blocks" 
            :key="block.id" 
            class="editor-block-wrapper"
            :class="{ 
              'dragging': dragIndex === index,
              'drag-over-top': dragOverIndex === index && !dragOverBetween,
              'drag-over-bottom': dragOverIndex === index && dragOverBetween
            }"
            draggable="true"
            @dragstart="onDragStart($event, index)"
            @dragend="onDragEnd"
            @dragover.prevent="onDragOver($event, index)"
            @dragleave="onDragLeave"
            @drop="onDrop($event, index)"
          >
            <div class="editor-block-drag-handle">⋮⋮</div>
            <div class="editor-block-content">
              <TitleBlock v-if="block.type === 'title'" :data="block.data" @update="(d) => updateBlockData(index, d)" />
              <TextBlock v-else-if="block.type === 'text'" :data="block.data" @update="(d) => updateBlockData(index, d)" />
              <ListItemBlock v-else-if="block.type === 'listItem'" :data="block.data" @update="(d) => updateBlockData(index, d)" />
              <TimerBlock v-else-if="block.type === 'timer'" :data="block.data" @update="(d) => updateBlockData(index, d)" />
              <ProgressBlock v-else-if="block.type === 'progress'" :data="block.data" @update="(d) => updateBlockData(index, d)" />
              <PhotoBlock v-else-if="block.type === 'photo'" :data="block.data" @update="(d) => updateBlockData(index, d)" />
              <DividerBlock v-else-if="block.type === 'divider'" :data="block.data" @update="(d) => updateBlockData(index, d)" />
              <TableBlock v-else-if="block.type === 'table'" :data="block.data" @update="(d) => updateBlockData(index, d)" />
              <ReminderBlock v-else-if="block.type === 'reminder'" :data="block.data" @update="(d) => updateBlockData(index, d)" />
            </div>
            <div class="editor-block-actions">
              <button class="editor-block-menu-btn" @click.stop="toggleBlockMenu($event, index)">⋮</button>
              
              <div v-if="activeBlockMenu === index" class="editor-block-context-menu">
                <button class="menu-item" @click="editBlock(index)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M17 3L21 7L7 21H3V17L17 3Z"/><path d="M14 6L18 10"/>
                  </svg>
                  <span>Редактировать</span>
                </button>
                <button class="menu-item danger" @click="deleteBlock(index)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 6L6 18M6 6L18 18"/>
                  </svg>
                  <span>Удалить</span>
                </button>
              </div>
            </div>
          </div>
          <div v-if="dragOverBetween && dragOverIndex !== null" class="drop-indicator"></div>
        </div>
        
        <div class="editor-add-block">
          <button class="editor-add-block-btn" @click="openAddBlockModal">+ Добавить блок</button>
        </div>
      </div>
    </div>
    
    <!-- Модалка выбора блока -->
    <BlockSelectorModal :is-open="showBlockModal" :blocks="availableBlocks" @close="closeAddBlockModal" @select="addBlockToTop" />
    
    <!-- Модалка редактирования блока -->
    <BlockEditorModal 
      v-if="editingBlockType" 
      :is-open="showBlockEditor" 
      :block-type="editingBlockType" 
      :block-data="editingBlockData" 
      @close="closeBlockEditor" 
      @save="saveBlockData" 
    />
  </div>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import BlockSelectorModal from '../components/BuilderCard/modals/BlockSelectorModal.vue';
import BlockEditorModal from '../components/BuilderCard/modals/BlockEditorModal.vue';
import TitleBlock from '../components/BuilderCard/blocks/TitleBlock.vue';
import TextBlock from '../components/BuilderCard/blocks/TextBlock.vue';
import ListItemBlock from '../components/BuilderCard/blocks/ListItemBlock.vue';
import TimerBlock from '../components/BuilderCard/blocks/TimerBlock.vue';
import ProgressBlock from '../components/BuilderCard/blocks/ProgressBlock.vue';
import PhotoBlock from '../components/BuilderCard/blocks/PhotoBlock.vue';
import DividerBlock from '../components/BuilderCard/blocks/DividerBlock.vue';
import TableBlock from '../components/BuilderCard/blocks/TableBlock.vue';
import ReminderBlock from '../components/BuilderCard/blocks/ReminderBlock.vue';

export default {
  name: 'CardEditorPage',
  components: {
    BlockSelectorModal,
    BlockEditorModal,
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
    cardId: { type: String, required: true },
    cardData: { type: Object, required: true },
    spaceId: { type: String, required: true }
  },
  emits: ['close', 'update', 'delete'],
  
  setup(props, { emit }) {
    const blocks = ref([]);
    const isImportant = ref(false);
    const cardColor = ref('#ffffff');
    const showColorPicker = ref(false);
    const showBlockModal = ref(false);
    const showBlockEditor = ref(false);
    const activeBlockMenu = ref(null);
    const editingBlockType = ref(null);
    const editingBlockData = ref(null);
    const editingBlockIndex = ref(null);
    const dragIndex = ref(null);
    const dragOverIndex = ref(null);
    const dragOverBetween = ref(false);
    
    const colorOptions = [
      { value: '#ffffff', name: 'Белый' },
      { value: '#FFF5F0', name: 'Кремовый' },
      { value: '#F0F7F0', name: 'Мятный' },
      { value: '#F0F0FF', name: 'Лавандовый' },
      { value: '#FFF0F0', name: 'Розовый' },
      { value: '#F0FFF4', name: 'Светло-зеленый' },
      { value: '#FFF8E7', name: 'Ванильный' },
      { value: '#E8F4F8', name: 'Небесный' }
    ];
    
    const availableBlocks = [
      { type: 'title', name: 'Заголовок', description: 'Крупный заголовок', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 5H21M3 12H21M3 19H21"/></svg>' },
      { type: 'text', name: 'Текст', description: 'Обычный текст', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7H20M4 12H20M4 17H12"/></svg>' },
      { type: 'timer', name: 'Таймер', description: 'Обратный отсчет', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7V12L15 15"/></svg>' },
      { type: 'progress', name: 'Прогресс', description: 'Отслеживание целей', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12L7 8L11 12L17 6L21 10"/><path d="M3 20H21"/></svg>' },
      { type: 'photo', name: 'Фото', description: 'Изображение', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="4"/><circle cx="17" cy="7" r="2"/><path d="M2 16L7 11L12 15L17 10L22 14"/></svg>' },
      { type: 'listItem', name: 'Пункт списка', description: 'Чек-лист', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 6H20M4 12H20M4 18H14"/></svg>' },
      { type: 'divider', name: 'Разделитель', description: 'Линия', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12H20"/></svg>' },
      { type: 'table', name: 'Таблица', description: 'До 5×5 ячеек', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>' },
      { type: 'reminder', name: 'Напоминание', description: 'Уведомление о событии', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 2V6M16 2V6M3 10H21"/></svg>' }
    ];
    
    const initData = () => {
      if (props.cardData) {
        blocks.value = props.cardData.blocks ? [...props.cardData.blocks] : [];
        isImportant.value = props.cardData.important || false;
        cardColor.value = props.cardData.color || '#ffffff';
      }
    };
    
    const addBlockToTop = (type) => {
      blocks.value.unshift({
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        type: type,
        data: getDefaultBlockData(type)
      });
      showBlockModal.value = false;
      save();
    };
    
    const getDefaultBlockData = (type) => {
      const defaults = {
        title: { content: '' },
        text: { content: '' },
        listItem: { text: '', completed: false },
        timer: { totalSeconds: 300, mode: 'timer', date: '', time: '00:00:00' },
        progress: { min: 0, max: 100, step: 1, unit: 'шт', current: 0 },
        photo: { image: null },
        divider: {},
        table: { rows: 3, cols: 3, data: null },
        reminder: { title: '', date: '', time: '09:00', triggered: false }
      };
      return defaults[type] || {};
    };
    
    const deleteBlock = (index) => {
      blocks.value.splice(index, 1);
      if (activeBlockMenu.value === index) activeBlockMenu.value = null;
      if (editingBlockIndex.value === index) editingBlockIndex.value = null;
      save();
    };
    
    const updateBlockData = (index, newData) => {
      blocks.value[index].data = { ...blocks.value[index].data, ...newData };
      save();
    };
    
    const editBlock = (index) => {
      activeBlockMenu.value = null;
      const block = blocks.value[index];
      editingBlockIndex.value = index;
      editingBlockType.value = availableBlocks.find(b => b.type === block.type);
      editingBlockData.value = { ...block.data };
      showBlockEditor.value = true;
    };
    
    const saveBlockData = (newData) => {
      if (editingBlockIndex.value !== null) {
        blocks.value[editingBlockIndex.value].data = { ...newData };
        save();
      }
      closeBlockEditor();
    };
    
    const closeBlockEditor = () => {
      showBlockEditor.value = false;
      editingBlockIndex.value = null;
      editingBlockType.value = null;
      editingBlockData.value = null;
    };
    
    const onDragStart = (event, index) => {
      dragIndex.value = index;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', JSON.stringify({
        sourceIndex: index,
        block: blocks.value[index]
      }));
    };
    
    const onDragEnd = () => {
      dragIndex.value = null;
      dragOverIndex.value = null;
      dragOverBetween.value = false;
    };
    
    const onDragOver = (event, index) => {
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      const mouseY = event.clientY;
      const threshold = rect.top + rect.height / 2;
      
      if (mouseY < threshold) {
        dragOverIndex.value = index;
        dragOverBetween.value = false;
      } else {
        dragOverIndex.value = index;
        dragOverBetween.value = true;
      }
    };
    
    const onDragLeave = () => {
      dragOverIndex.value = null;
      dragOverBetween.value = false;
    };
    
    const onDrop = (event, dropIndex) => {
      event.preventDefault();
      
      if (dragIndex.value === null) {
        dragOverIndex.value = null;
        dragOverBetween.value = false;
        return;
      }
      
      const newBlocks = [...blocks.value];
      const [draggedBlock] = newBlocks.splice(dragIndex.value, 1);
      
      let targetIndex = dropIndex;
      if (dragOverBetween.value) {
        targetIndex = dropIndex + 1;
      }
      
      newBlocks.splice(targetIndex, 0, draggedBlock);
      blocks.value = newBlocks;
      
      dragIndex.value = null;
      dragOverIndex.value = null;
      dragOverBetween.value = false;
      save();
    };
    
    const toggleImportant = () => {
      isImportant.value = !isImportant.value;
      save();
    };
    
    const toggleColorPicker = () => {
      showColorPicker.value = !showColorPicker.value;
    };
    
    const setCardColor = (color) => {
      cardColor.value = color;
      showColorPicker.value = false;
      save();
    };
    
    const toggleBlockMenu = (event, index) => {
      event.stopPropagation();
      activeBlockMenu.value = activeBlockMenu.value === index ? null : index;
    };
    
    const openAddBlockModal = () => { showBlockModal.value = true; };
    const closeAddBlockModal = () => { showBlockModal.value = false; };
    
    const save = () => {
      emit('update', {
        blocks: blocks.value,
        important: isImportant.value,
        color: cardColor.value
      });
    };
    
    const deleteCard = () => {
      if (confirm('Удалить карточку?')) {
        emit('delete');
        close();
      }
    };
    
    const close = () => {
      emit('close');
    };
    
    const handleClickOutside = (event) => {
      if (showColorPicker.value && !event.target.closest('.color-picker-wrapper')) {
        showColorPicker.value = false;
      }
      if (activeBlockMenu.value !== null && !event.target.closest('.editor-block-context-menu') && !event.target.closest('.editor-block-menu-btn')) {
        activeBlockMenu.value = null;
      }
    };
    
    initData();
    
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden';
    });
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
    });
    
    return {
      blocks,
      isImportant,
      cardColor,
      showColorPicker,
      showBlockModal,
      showBlockEditor,
      activeBlockMenu,
      editingBlockType,
      editingBlockData,
      dragIndex,
      dragOverIndex,
      dragOverBetween,
      colorOptions,
      availableBlocks,
      addBlockToTop,
      deleteBlock,
      updateBlockData,
      editBlock,
      saveBlockData,
      closeBlockEditor,
      onDragStart,
      onDragEnd,
      onDragOver,
      onDragLeave,
      onDrop,
      toggleImportant,
      toggleColorPicker,
      setCardColor,
      toggleBlockMenu,
      openAddBlockModal,
      closeAddBlockModal,
      deleteCard,
      close
    };
  }
}
</script>

<style scoped>
.card-editor-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  z-index: 1002;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.card-editor-container {
  max-width: 700px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

.editor-close-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: 1px solid rgba(26, 59, 59, 0.15);
  color: #1a3b3b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.2s ease;
  z-index: 10001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.editor-close-btn:hover {
  background: #1a3b3b;
  color: white;
  transform: rotate(90deg);
}

.editor-toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  padding-right: 40px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(26, 59, 59, 0.15);
  border-radius: 40px;
  color: #1a3b3b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.toolbar-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar-btn.active {
  background: #1a3b3b;
  color: white;
  border-color: #1a3b3b;
}

.toolbar-btn.danger:hover {
  background: #b34141;
  color: white;
  border-color: #b34141;
}

.color-picker-wrapper {
  position: relative;
}

.color-picker-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 12px;
  padding: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.color-picker-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.active {
  border-color: #1a3b3b;
  box-shadow: 0 0 0 2px white;
}

.editor-card {
  background: white;
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
  min-height: 200px;
}

.editor-blocks-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
}

.editor-blocks-container::-webkit-scrollbar {
  width: 4px;
}

.editor-blocks-container::-webkit-scrollbar-track {
  background: rgba(26, 59, 59, 0.05);
  border-radius: 4px;
}

.editor-blocks-container::-webkit-scrollbar-thumb {
  background: rgba(26, 59, 59, 0.2);
  border-radius: 4px;
}

.editor-block-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 0.5rem;
  transition: all 0.2s ease;
  cursor: grab;
  position: relative;
}

.editor-block-wrapper:active {
  cursor: grabbing;
}

.editor-block-wrapper.dragging {
  opacity: 0.3;
  cursor: grabbing;
}

.editor-block-wrapper.drag-over-top {
  border-top: 2px solid #1a3b3b;
  margin-top: 0.25rem;
  padding-top: 0.75rem;
}

.editor-block-wrapper.drag-over-bottom {
  border-bottom: 2px solid #1a3b3b;
  margin-bottom: 0.25rem;
  padding-bottom: 0.75rem;
}

.editor-block-drag-handle {
  cursor: grab;
  color: #8a9a9a;
  padding: 0.25rem;
  font-size: 1.2rem;
  user-select: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.editor-block-wrapper:hover .editor-block-drag-handle {
  opacity: 0.6;
}

.editor-block-drag-handle:active {
  cursor: grabbing;
}

.editor-block-content {
  flex: 1;
  min-width: 0;
}

.editor-block-actions {
  position: relative;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.editor-block-wrapper:hover .editor-block-actions {
  opacity: 1;
}

.editor-block-menu-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  border: 1px solid rgba(26, 59, 59, 0.15);
  color: #1a3b3b;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.editor-block-menu-btn:hover {
  background: #1a3b3b;
  color: white;
  transform: scale(1.1);
}

.editor-block-context-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.25rem;
  background: white;
  border-radius: 12px;
  padding: 0.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 140px;
  z-index: 100;
  animation: fadeIn 0.15s ease;
}

.drop-indicator {
  height: 2px;
  background: #1a3b3b;
  margin: 0.5rem 0;
  animation: pulse 0.5s ease;
}

.editor-add-block {
  margin-top: 1rem;
  text-align: center;
}

.editor-add-block-btn {
  padding: 0.5rem 1rem;
  background: rgba(26, 59, 59, 0.1);
  border: 1px dashed rgba(26, 59, 59, 0.3);
  border-radius: 40px;
  color: #1a3b3b;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.editor-add-block-btn:hover {
  background: rgba(26, 59, 59, 0.2);
}

:deep(.modal-overlay) {
  z-index: 10002 !important;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
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
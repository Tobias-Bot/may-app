<template>
  <div class="list-tool card-base">
    <div class="card-header">
      <div class="card-title-wrapper">
        <span class="card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </span>
        <input 
          v-model="listTitle" 
          class="card-title-input"
          :class="{ 'placeholder': !listTitle }"
          placeholder="Название списка"
          @blur="saveTitle"
          @keyup.enter="saveTitle"
        />
      </div>
      <button class="card-delete-button" @click="confirmDelete">✕</button>
    </div>

    <div class="list-items-scroll">
      <div class="list-items">
        <div v-for="(item, index) in items" :key="item.id" class="list-item" :class="{ 'completed': item.completed }">
          <label class="checkbox-container">
            <input type="checkbox" v-model="item.completed" @change="saveItems" />
            <span class="checkmark"></span>
          </label>
          <input 
            v-model="item.text" 
            class="item-text"
            :class="{ 'placeholder': !item.text }"
            placeholder="Текст пункта"
            @blur="saveItems"
            @keyup.enter="saveItems"
          />
          <button class="remove-item" @click="removeItem(index)" title="Удалить пункт">✕</button>
        </div>
      </div>
    </div>

    <div class="list-footer">
      <button v-if="items.length < 25" class="add-item-button" @click="addItem" title="Добавить пункт">
        <span class="plus-icon">+</span>
      </button>
      <span class="items-count">{{ completedCount }}/{{ items.length }} · макс. 25</span>
    </div>

    <div class="card-footer">
      <span>{{ formatDate(updatedAt) }}</span>
    </div>

    <div v-if="showDeleteConfirm" class="delete-confirm-overlay" @click.self="cancelDelete">
      <div class="delete-confirm-dialog">
        <p>Удалить список?</p>
        <div class="dialog-actions">
          <button class="confirm-button" @click="deleteList">Удалить</button>
          <button class="cancel-button" @click="cancelDelete">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import '../../styles/card-styles.css';

export default {
  name: 'ListTool',
  props: { toolId: String, data: Object },
  emits: ['update', 'delete'],
  
  setup(props, { emit }) {
    const listTitle = ref(props.data?.title || '');
    const items = ref(props.data?.items ? JSON.parse(JSON.stringify(props.data.items)) : []);
    const updatedAt = ref(props.data?.updatedAt || props.data?.createdAt || new Date().toISOString());
    const showDeleteConfirm = ref(false);

    const completedCount = computed(() => items.value.filter(i => i.completed).length);

    const getCleanData = () => {
      return {
        title: listTitle.value,
        items: JSON.parse(JSON.stringify(items.value)),
        updatedAt: new Date().toISOString()
      };
    };

    let saveTimeout = null;
    const debouncedSave = () => {
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        const cleanData = getCleanData();
        emit('update', props.toolId, { data: cleanData });
        saveTimeout = null;
      }, 300);
    };

    watch([listTitle, items], () => {
      updatedAt.value = new Date().toISOString();
      debouncedSave();
    }, { deep: true });

    const saveTitle = debouncedSave;
    const saveItems = debouncedSave;

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      if (date.toDateString() === now.toDateString()) return 'Сегодня';
      const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) return 'Вчера';
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    };

    const addItem = () => {
      if (items.value.length >= 25) return;
      items.value.push({ 
        id: Date.now() + Math.random().toString(36).substr(2, 9), 
        text: '', 
        completed: false 
      });
    };

    const removeItem = (index) => { 
      items.value.splice(index, 1); 
    };

    const confirmDelete = () => { 
      showDeleteConfirm.value = true; 
    };
    
    const cancelDelete = () => { 
      showDeleteConfirm.value = false; 
    };
    
    const deleteList = () => { 
      emit('delete', props.toolId); 
    };

    return {
      listTitle,
      items,
      updatedAt,
      showDeleteConfirm,
      completedCount,
      formatDate,
      saveTitle,
      saveItems,
      addItem,
      removeItem,
      confirmDelete,
      cancelDelete,
      deleteList
    };
  }
}
</script>

<style scoped>
@import '../../styles/card-styles.css';

.list-items-scroll {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 4px;
}

.list-items-scroll::-webkit-scrollbar {
  width: 4px;
}

.list-items-scroll::-webkit-scrollbar-track {
  background: rgba(26, 59, 59, 0.05);
  border-radius: 4px;
}

.list-items-scroll::-webkit-scrollbar-thumb {
  background: rgba(26, 59, 59, 0.2);
  border-radius: 4px;
}

.list-items-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(26, 59, 59, 0.3);
}

.list-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
}

.list-item.completed .item-text {
  text-decoration: line-through;
  color: #aababa;
}

.checkbox-container {
  display: block;
  position: relative;
  width: 18px;
  height: 18px;
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 18px;
  width: 18px;
  background: transparent;
  border: 2px solid rgba(26, 59, 59, 0.25);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.checkbox-container:hover input ~ .checkmark {
  border-color: #1a3b3b;
}

.checkbox-container input:checked ~ .checkmark {
  background: #1a3b3b;
  border-color: #1a3b3b;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.item-text {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.25rem 0;
  font-size: 0.95rem;
  color: #2a3b3b;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
  min-width: 0;
  font-family: inherit;
}

.item-text:focus {
  outline: none;
  border-bottom-color: rgba(26, 59, 59, 0.15);
}

.item-text.placeholder {
  color: #aababa;
  font-style: italic;
}

.remove-item {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: #b34141;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  opacity: 0.6;
  flex-shrink: 0;
}

.remove-item:hover {
  opacity: 1;
  background: rgba(180, 70, 70, 0.1);
  transform: scale(1.1);
}

.list-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
}

.add-item-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(26, 59, 59, 0.7);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-item-button:hover {
  background: #1a3b3b;
  transform: scale(1.1);
}

.plus-icon {
  font-size: 1.2rem;
  font-weight: 300;
}

.items-count {
  font-size: 0.75rem;
  color: #5a6a6a;
  opacity: 0.8;
}
</style>
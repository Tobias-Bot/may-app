<!-- filepath: /src/components/BuilderCard/modals/TableEditorModal.vue -->
<template>
  <ModalWindow :is-open="isOpen" @close="close" title="Настройка таблицы" size="small">
    <div class="table-editor-form">
      <div class="input-group">
        <label>Строки (до 5)</label>
        <input type="number" v-model.number="rows" min="1" max="5" class="editor-input" />
      </div>
      <div class="input-group">
        <label>Столбцы (до 5)</label>
        <input type="number" v-model.number="cols" min="1" max="5" class="editor-input" />
      </div>
      <div class="modal-actions">
        <button class="modal-button primary" @click="save">Сохранить</button>
        <button class="modal-button secondary" @click="close">Отмена</button>
      </div>
    </div>
  </ModalWindow>
</template>

<script>
import { ref } from 'vue';
import ModalWindow from '../../ModalWindow.vue';

export default {
  name: 'TableEditorModal',
  components: { ModalWindow },
  props: { isOpen: Boolean, blockData: Object },
  emits: ['close', 'save'],
  
  setup(props, { emit }) {
    const rows = ref(props.blockData?.rows || 3);
    const cols = ref(props.blockData?.cols || 3);
    
    const save = () => {
      // Создаём новую таблицу с новыми размерами
      const newData = Array(rows.value).fill().map(() => Array(cols.value).fill(''));
      
      // Копируем существующие данные, если есть
      if (props.blockData?.data) {
        for (let i = 0; i < Math.min(rows.value, props.blockData.data.length); i++) {
          for (let j = 0; j < Math.min(cols.value, props.blockData.data[i]?.length || 0); j++) {
            newData[i][j] = props.blockData.data[i][j];
          }
        }
      }
      
      emit('save', { rows: rows.value, cols: cols.value, data: newData });
      emit('close');
    };
    
    const close = () => emit('close');
    
    return { rows, cols, save, close };
  }
}
</script>

<style scoped>
.table-editor-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.input-group label {
  font-size: 0.8rem;
  color: #5a6a6a;
}

.editor-input {
  padding: 0.6rem;
  border: 1px solid rgba(26, 59, 59, 0.15);
  border-radius: 12px;
  font-size: 1rem;
  text-align: center;
}

.editor-input:focus {
  outline: none;
  border-color: #1a3b3b;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.modal-button {
  padding: 0.6rem 1.2rem;
  border-radius: 40px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.modal-button.primary {
  background: #1a3b3b;
  color: white;
}

.modal-button.primary:hover {
  background: #2a4b4b;
  transform: translateY(-2px);
}

.modal-button.secondary {
  background: transparent;
  border: 1px solid rgba(26, 59, 59, 0.2);
  color: #1a3b3b;
}
</style>
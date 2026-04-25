<!-- filepath: /src/components/BuilderCard/modals/ReminderEditorModal.vue -->
<template>
  <ModalWindow :is-open="isOpen" @close="close" title="Настройка напоминания" size="small">
    <div class="reminder-editor-form">
      <div class="input-group">
        <label>Название</label>
        <input type="text" v-model="titleValue" placeholder="Что нужно сделать?" class="editor-input" />
      </div>
      <div class="input-group">
        <label>Дата</label>
        <input type="date" v-model="dateValue" class="editor-input" :min="todayDate" />
      </div>
      <div class="input-group">
        <label>Время</label>
        <input type="time" v-model="timeValue" class="editor-input" step="60" />
      </div>
      <div class="modal-actions">
        <button class="modal-button primary" @click="save">Сохранить</button>
        <button class="modal-button secondary" @click="close">Отмена</button>
      </div>
    </div>
  </ModalWindow>
</template>

<script>
import { ref, computed } from 'vue';
import ModalWindow from '../../ModalWindow.vue';

export default {
  name: 'ReminderEditorModal',
  components: { ModalWindow },
  props: { isOpen: Boolean, blockData: Object },
  emits: ['close', 'save'],
  
  setup(props, { emit }) {
    const titleValue = ref(props.blockData?.title || '');
    const dateValue = ref(props.blockData?.date || '');
    const timeValue = ref(props.blockData?.time || '09:00');
    
    const todayDate = computed(() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });
    
    const save = () => {
      emit('save', {
        title: titleValue.value,
        date: dateValue.value,
        time: timeValue.value,
        triggered: false
      });
      emit('close');
    };
    
    const close = () => emit('close');
    
    return { titleValue, dateValue, timeValue, todayDate, save, close };
  }
}
</script>

<style scoped>
.reminder-editor-form {
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
  font-size: 0.95rem;
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
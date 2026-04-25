<!-- filepath: /src/components/BuilderCard/modals/ProgressEditorModal.vue -->
<template>
  <ModalWindow :is-open="isOpen" @close="close" title="Настройка прогресса" size="small">
    <div class="progress-editor-form">
      <div class="input-group">
        <label>От</label>
        <input type="number" v-model.number="minVal" class="editor-input" />
      </div>
      <div class="input-group">
        <label>До</label>
        <input type="number" v-model.number="maxVal" class="editor-input" />
      </div>
      <div class="input-group">
        <label>Шаг</label>
        <input type="number" v-model.number="stepVal" step="0.1" class="editor-input" />
      </div>
      <div class="input-group">
        <label>Единица измерения</label>
        <input type="text" v-model="unitVal" placeholder="шт, %, км, и т.д." class="editor-input" />
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
  name: 'ProgressEditorModal',
  components: { ModalWindow },
  props: { isOpen: Boolean, blockData: Object },
  emits: ['close', 'save'],
  
  setup(props, { emit }) {
    const minVal = ref(props.blockData?.min ?? 0);
    const maxVal = ref(props.blockData?.max ?? 100);
    const stepVal = ref(props.blockData?.step ?? 1);
    const unitVal = ref(props.blockData?.unit ?? 'шт');
    
    const save = () => {
      emit('save', { 
        min: minVal.value, 
        max: maxVal.value, 
        step: stepVal.value, 
        unit: unitVal.value 
      });
      emit('close');
    };
    
    const close = () => emit('close');
    
    return { minVal, maxVal, stepVal, unitVal, save, close };
  }
}
</script>

<style scoped>
.progress-editor-form {
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
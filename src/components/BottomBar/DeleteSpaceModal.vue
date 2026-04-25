<!-- filepath: /src/components/BottomBar/DeleteSpaceModal.vue -->
<template>
  <ModalWindow :is-open="isOpen" @close="close" title="Удалить пространство?" size="small">
    <div class="modal-form">
      <p class="delete-warning">
        Вы действительно хотите удалить пространство <strong>"{{ spaceName }}"</strong>?
      </p>
      <p class="delete-warning-note">
        Все инструменты внутри этого пространства будут также удалены без возможности восстановления.
      </p>
      <div class="modal-actions">
        <button class="modal-button danger" @click="confirm">Удалить</button>
        <button class="modal-button secondary" @click="close">Отмена</button>
      </div>
    </div>
  </ModalWindow>
</template>

<script>
import ModalWindow from '../ModalWindow.vue';

export default {
  name: 'DeleteSpaceModal',
  components: { ModalWindow },
  props: { 
    isOpen: Boolean,
    spaceName: String
  },
  emits: ['close', 'confirm'],
  
  setup(props, { emit }) {
    const close = () => {
      emit('close');
    };
    
    const confirm = () => {
      emit('confirm');
    };
    
    return { close, confirm };
  }
}
</script>

<style scoped>
.delete-warning {
  text-align: center;
  color: #1a3b3b;
  margin-bottom: 0.5rem;
}

.delete-warning strong {
  color: #b34141;
}

.delete-warning-note {
  text-align: center;
  font-size: 0.8rem;
  color: #8a9a9a;
  margin-bottom: 0.5rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
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

.modal-button.danger {
  background: #b34141;
  color: white;
}

.modal-button.danger:hover {
  background: #c45151;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(180, 70, 70, 0.3);
}

.modal-button.secondary {
  background: transparent;
  border: 1px solid rgba(26, 59, 59, 0.2);
  color: #1a3b3b;
}
</style>
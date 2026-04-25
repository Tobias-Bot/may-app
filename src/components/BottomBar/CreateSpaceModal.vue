<!-- filepath: /src/components/BottomBar/CreateSpaceModal.vue -->
<template>
  <ModalWindow :is-open="isOpen" @close="close" title="Новое пространство" size="small">
    <div class="modal-form">
      <input 
        v-model="spaceName" 
        type="text" 
        placeholder="Название (до 15 символов)"
        class="modal-input"
        maxlength="15"
        ref="nameInput"
      />
      <div class="icon-selector">
        <label>Выберите значок</label>
        <div class="icons-grid">
          <button 
            v-for="icon in availableIcons" 
            :key="icon"
            class="icon-option"
            :class="{ active: selectedIcon === icon }"
            @click="selectedIcon = icon"
          >
            <SpaceIcon :icon="icon" />
          </button>
        </div>
      </div>
      <div class="modal-actions">
        <button class="modal-button primary" @click="create" :disabled="!spaceName.trim()">Создать</button>
        <button class="modal-button secondary" @click="close">Отмена</button>
      </div>
    </div>
  </ModalWindow>
</template>

<script>
import { ref, watch, nextTick } from 'vue';
import ModalWindow from '../ModalWindow.vue';
import SpaceIcon from '../SpaceIcon.vue';

export default {
  name: 'CreateSpaceModal',
  components: { ModalWindow, SpaceIcon },
  props: { isOpen: Boolean },
  emits: ['close', 'create'],
  
  setup(props, { emit }) {
    const spaceName = ref('');
    const selectedIcon = ref('star');
    const nameInput = ref(null);
    
    const availableIcons = ['person', 'home', 'people', 'heart', 'star', 'work', 'book', 'smile', 'flower', 'music'];
    
    const close = () => {
      emit('close');
      spaceName.value = '';
      selectedIcon.value = 'star';
    };
    
    const create = () => {
      if (!spaceName.value.trim()) return;
      emit('create', { name: spaceName.value.trim(), icon: selectedIcon.value });
      close();
    };
    
    watch(() => props.isOpen, (newVal) => {
      if (newVal) {
        nextTick(() => nameInput.value?.focus());
      }
    });
    
    return { spaceName, selectedIcon, nameInput, availableIcons, close, create };
  }
}
</script>

<style scoped>
.icon-selector {
  margin-top: 0.5rem;
}

.icon-selector label {
  display: block;
  font-size: 0.85rem;
  color: #5a6a6a;
  margin-bottom: 0.75rem;
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
}

.icon-option {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: rgba(26, 59, 59, 0.05);
  border: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.icon-option svg {
  width: 24px;
  height: 24px;
  stroke: #1a3b3b;
}

.icon-option:hover {
  background: rgba(26, 59, 59, 0.1);
  transform: scale(1.05);
}

.icon-option.active {
  border-color: #1a3b3b;
  background: rgba(26, 59, 59, 0.1);
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1rem;
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

@media (max-width: 480px) {
  .icons-grid {
    gap: 0.35rem;
  }
  
  .icon-option {
    width: 44px;
    height: 44px;
  }
}
</style>
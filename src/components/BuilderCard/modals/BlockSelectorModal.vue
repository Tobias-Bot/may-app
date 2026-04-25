<!-- filepath: /src/components/BuilderCard/modals/BlockSelectorModal.vue -->
<template>
  <ModalWindow :is-open="isOpen" @close="close" title="Выберите тип блока" size="medium">
    <div class="block-selector-grid">
      <button 
        v-for="blockType in blocks" 
        :key="blockType.type" 
        class="block-selector-card"
        @click="select(blockType.type)"
      >
        <div class="block-icon" v-html="blockType.icon"></div>
        <div class="block-info">
          <span class="block-name">{{ blockType.name }}</span>
          <span class="block-desc">{{ blockType.description }}</span>
        </div>
      </button>
    </div>
  </ModalWindow>
</template>

<script>
import ModalWindow from '../../ModalWindow.vue';

export default {
  name: 'BlockSelectorModal',
  components: { ModalWindow },
  props: { 
    isOpen: Boolean, 
    blocks: Array 
  },
  emits: ['close', 'select'],
  
  setup(props, { emit }) {
    const close = () => emit('close');
    const select = (type) => emit('select', type);
    return { close, select };
  }
}
</script>

<style scoped>
.block-selector-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
  padding: 0.25rem;
}

.block-selector-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(26, 59, 59, 0.03);
  border: 1px solid rgba(26, 59, 59, 0.08);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.block-selector-card:hover {
  background: rgba(26, 59, 59, 0.08);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(26, 59, 59, 0.1);
}

.block-icon svg {
  width: 32px;
  height: 32px;
  stroke: #1a3b3b;
}

.block-info {
  display: flex;
  flex-direction: column;
}

.block-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1a3b3b;
}

.block-desc {
  font-size: 0.7rem;
  color: #8a9a9a;
}

@media (max-width: 480px) {
  .block-selector-grid {
    grid-template-columns: 1fr;
  }
}
</style>
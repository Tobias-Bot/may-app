<!-- filepath: /src/components/BuilderCard/modals/BlockEditorModal.vue -->
<template>
  <TimerEditorModal 
    v-if="blockType?.type === 'timer'"
    :is-open="isOpen"
    :block-data="blockData"
    @close="close"
    @save="save"
  />
  <ProgressEditorModal 
    v-else-if="blockType?.type === 'progress'"
    :is-open="isOpen"
    :block-data="blockData"
    @close="close"
    @save="save"
  />
  <TableEditorModal 
    v-else-if="blockType?.type === 'table'"
    :is-open="isOpen"
    :block-data="blockData"
    @close="close"
    @save="save"
  />
  <ReminderEditorModal 
    v-else-if="blockType?.type === 'reminder'"
    :is-open="isOpen"
    :block-data="blockData"
    @close="close"
    @save="save"
  />
</template>

<script>
import TimerEditorModal from './TimerEditorModal.vue';
import ProgressEditorModal from './ProgressEditorModal.vue';
import TableEditorModal from './TableEditorModal.vue';
import ReminderEditorModal from './ReminderEditorModal.vue';

export default {
  name: 'BlockEditorModal',
  components: { TimerEditorModal, ProgressEditorModal, TableEditorModal, ReminderEditorModal },
  props: { 
    isOpen: Boolean, 
    blockType: Object, 
    blockData: Object 
  },
  emits: ['close', 'save'],
  
  setup(props, { emit }) {
    const close = () => emit('close');
    const save = (data) => {
      const mergedData = { ...props.blockData, ...data };
      emit('save', mergedData);
    };
    return { close, save };
  }
}
</script>
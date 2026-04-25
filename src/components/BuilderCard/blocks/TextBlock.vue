<!-- filepath: /src/components/BuilderCard/blocks/TextBlock.vue -->
<template>
  <div class="text-block">
    <div 
      contenteditable="true"
      @blur="save"
      @keydown.enter.prevent="save"
      class="text-editable"
      ref="textRef"
    >{{ localContent || '' }}</div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'TextBlock',
  props: { data: { type: Object, default: () => ({ content: '' }) } },
  emits: ['update', 'delete'],
  
  setup(props, { emit }) {
    const localContent = ref(props.data?.content || '');

    const save = (event) => {
      const newContent = event.target.innerText;
      if (newContent !== localContent.value) {
        localContent.value = newContent;
        emit('update', { content: newContent });
      }
    };

    watch(() => props.data?.content, (newVal) => {
      if (newVal !== localContent.value) {
        localContent.value = newVal || '';
      }
    });

    return { localContent, save };
  }
}
</script>

<style scoped>
.text-block {
  width: 100%;
}

.text-editable {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #2a3b3b;
  padding: 0.25rem 0;
  outline: none;
  border: none;
  background: transparent;
  width: 100%;
  cursor: text;
  white-space: pre-wrap;
}

.text-editable:empty:before {
  content: "Напишите что-нибудь...";
  color: #aababa;
}
</style>
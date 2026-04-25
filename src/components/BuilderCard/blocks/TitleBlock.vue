<!-- filepath: /src/components/BuilderCard/blocks/TitleBlock.vue -->
<template>
  <div class="title-block">
    <h2 
      contenteditable="true"
      @blur="save"
      @keydown.enter.prevent="save"
      class="title-editable"
      ref="titleRef"
    >{{ localContent || 'Заголовок' }}</h2>
  </div>
</template>

<script>
import { ref, watch, nextTick } from 'vue';

export default {
  name: 'TitleBlock',
  props: { data: { type: Object, default: () => ({ content: '' }) } },
  emits: ['update', 'delete'],
  
  setup(props, { emit }) {
    const localContent = ref(props.data?.content || '');
    const titleRef = ref(null);

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

    return { localContent, titleRef, save };
  }
}
</script>

<style scoped>
.title-block {
  width: 100%;
}

.title-editable {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a3b3b;
  margin: 0;
  padding: 0.25rem 0;
  outline: none;
  border: none;
  background: transparent;
  width: 100%;
  cursor: text;
}

.title-editable:empty:before {
  content: "Заголовок";
  color: #aababa;
  font-weight: 400;
}
</style>
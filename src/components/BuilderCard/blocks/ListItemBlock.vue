<!-- filepath: /src/components/BuilderCard/blocks/ListItemBlock.vue -->
<template>
  <div class="list-item-block">
    <label class="item-checkbox">
      <input type="checkbox" v-model="localCompleted" @change="saveCheckbox" />
      <span class="checkmark"></span>
    </label>
    <div 
      contenteditable="true"
      @blur="saveText"
      @keydown.enter.prevent="saveText"
      class="item-text-editable"
      :class="{ completed: localCompleted }"
    >{{ localText || '' }}</div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'ListItemBlock',
  props: { data: { type: Object, default: () => ({ text: '', completed: false }) } },
  emits: ['update', 'delete'],
  
  setup(props, { emit }) {
    const localText = ref(props.data?.text || '');
    const localCompleted = ref(props.data?.completed || false);

    const saveText = (event) => {
      const newText = event.target.innerText;
      if (newText !== localText.value) {
        localText.value = newText;
        emit('update', { text: newText, completed: localCompleted.value });
      }
    };

    const saveCheckbox = () => {
      emit('update', { text: localText.value, completed: localCompleted.value });
    };

    watch(() => props.data?.text, (newVal) => {
      if (newVal !== localText.value) {
        localText.value = newVal || '';
      }
    });

    watch(() => props.data?.completed, (newVal) => {
      if (newVal !== localCompleted.value) {
        localCompleted.value = newVal || false;
      }
    });

    return { localText, localCompleted, saveText, saveCheckbox };
  }
}
</script>

<style scoped>
.list-item-block {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.item-checkbox {
  position: relative;
  width: 18px;
  height: 18px;
  cursor: pointer;
  flex-shrink: 0;
}

.item-checkbox input {
  position: absolute;
  opacity: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(26, 59, 59, 0.3);
  border-radius: 4px;
  background: white;
  transition: all 0.2s ease;
}

.item-checkbox input:checked ~ .checkmark {
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

.item-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.item-text-editable {
  flex: 1;
  font-size: 0.9rem;
  color: #2a3b3b;
  padding: 0.25rem 0;
  outline: none;
  border: none;
  background: transparent;
  cursor: text;
  min-width: 0;
}

.item-text-editable.completed {
  text-decoration: line-through;
  color: #aababa;
}

.item-text-editable:empty:before {
  content: "Новый пункт";
  color: #aababa;
}
</style>
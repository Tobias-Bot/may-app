<template>
  <div class="note-tool card-base">
    <div class="card-header">
      <div class="card-title-wrapper">
        <span class="card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 3L21 7L7 21H3V17L17 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 6L18 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </span>
        <input 
          v-model="localData.title" 
          class="card-title-input" 
          :class="{ 'placeholder': !localData.title }" 
          placeholder="Без названия" 
          @blur="saveTitle" 
          @keyup.enter="saveTitle" 
        />
      </div>
    </div>

    <textarea 
      v-model="localData.content" 
      class="content-input" 
      :class="{ 'placeholder': !localData.content }" 
      placeholder="Напишите что-нибудь..." 
      rows="3" 
      @blur="saveContent"
    ></textarea>

    <ImageUploader v-model="localData.image" @change="handleImageChange" />

    <div class="card-footer">
      <span>{{ formatDate(localData.updatedAt) }}</span>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import ImageUploader from '../ImageUploader.vue';
import '../../styles/card-styles.css';

export default {
  name: 'NoteTool',
  components: { ImageUploader },
  props: { toolId: String, data: Object },
  emits: ['update', 'delete'],
  
  setup(props, { emit }) {
    const localData = ref({
      title: props.data?.title || '',
      content: props.data?.content || '',
      image: props.data?.image || null,
      updatedAt: props.data?.updatedAt || props.data?.createdAt || new Date().toISOString()
    });

    const contentLength = computed(() => localData.value.content?.length || 0);

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      if (date.toDateString() === now.toDateString()) return 'Сегодня';
      const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) return 'Вчера';
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    };

    const getCleanData = () => {
      return {
        title: localData.value.title,
        content: localData.value.content,
        image: localData.value.image,
        updatedAt: new Date().toISOString()
      };
    };

    let saveTimeout = null;
    const debouncedSave = () => {
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        const cleanData = getCleanData();
        emit('update', props.toolId, { data: cleanData });
        saveTimeout = null;
      }, 300);
    };

    watch(localData, () => {
      if (localData.value.content?.length > 500) {
        localData.value.content = localData.value.content.slice(0, 500);
      }
      debouncedSave();
    }, { deep: true });

    const saveTitle = debouncedSave;
    const saveContent = debouncedSave;

    const handleImageChange = (image) => {
      console.log('NoteTool: image changed', image ? 'has image' : 'no image');
    };

    return {
      localData,
      contentLength,
      formatDate,
      saveTitle,
      saveContent,
      handleImageChange
    };
  }
}
</script>

<style scoped>
@import '../../styles/card-styles.css';

.content-input {
  width: 100%;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #3a4a4a;
  background: transparent;
  border: none;
  padding: 4px 0;
  resize: vertical;
  min-height: 60px;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
  font-family: inherit;
}

.content-input:focus {
  outline: none;
  border-bottom-color: rgba(26, 59, 59, 0.15);
}

.content-input.placeholder {
  color: #aababa;
  font-style: italic;
}
</style>
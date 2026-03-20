<template>
  <div class="photo-tool card-base">
    <div class="card-header">
      <div class="card-title-wrapper">
        <span class="card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="17" cy="7" r="2" stroke="currentColor" stroke-width="1.5"/>
            <path d="M2 16L7 11L12 15L17 10L22 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="photo-title">Фото</span>
      </div>
    </div>

    <ImageUploader v-model="photoImage" @change="handleImageChange" />

    <div class="card-footer">
      <span>{{ formatDate(updatedAt) }}</span>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import ImageUploader from '../ImageUploader.vue';
import '../../styles/card-styles.css';

export default {
  name: 'PhotoTool',
  components: { ImageUploader },
  props: { 
    toolId: String, 
    data: Object 
  },
  emits: ['update', 'delete'],
  
  setup(props, { emit }) {
    const photoImage = ref(props.data?.image || null);
    const createdAt = ref(props.data?.createdAt || new Date().toISOString());
    const updatedAt = ref(props.data?.updatedAt || props.data?.createdAt || new Date().toISOString());

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      if (date.toDateString() === now.toDateString()) return 'Сегодня';
      const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) return 'Вчера';
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    };

    watch(photoImage, (newImage) => {
      updatedAt.value = new Date().toISOString();
      
      const dataToSave = {
        image: newImage,
        createdAt: createdAt.value,
        updatedAt: updatedAt.value
      };
      
      emit('update', props.toolId, { data: dataToSave });
    });

    const handleImageChange = (image) => {
      // photoImage уже обновится через v-model
    };

    return {
      photoImage,
      updatedAt,
      formatDate,
      handleImageChange
    };
  }
}
</script>

<style scoped>
@import '../../styles/card-styles.css';

.photo-title {
  font-size: 1rem;
  font-weight: 400;
  color: #1a3b3b;
  opacity: 0.8;
}
</style>
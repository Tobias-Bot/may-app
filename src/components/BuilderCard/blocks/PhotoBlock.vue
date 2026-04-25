<!-- filepath: /src/components/BuilderCard/blocks/PhotoBlock.vue -->
<template>
  <div class="photo-block">
    <ImageUploader v-model="localImage" @change="save" />
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import ImageUploader from '../../ImageUploader.vue';

export default {
  name: 'PhotoBlock',
  components: { ImageUploader },
  props: { data: { type: Object, default: () => ({ image: null }) } },
  emits: ['update', 'delete'],
  
  setup(props, { emit }) {
    const localImage = ref(props.data?.image || null);

    const save = (image) => {
      localImage.value = image;
      emit('update', { image: image });
    };

    watch(() => props.data?.image, (newVal) => {
      if (newVal !== localImage.value) {
        localImage.value = newVal;
      }
    });

    return { localImage, save };
  }
}
</script>

<style scoped>
.photo-block {
  width: 100%;
}

.photo-block :deep(img) {
  width: 100%;
  border-radius: 12px;
}
</style>
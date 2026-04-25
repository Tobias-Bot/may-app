<!-- filepath: /src/views/SpaceView.vue -->
<template>
  <CategoryPage :page="id" />
</template>

<script>
import CategoryPage from './CategoryPage.vue';

export default {
  name: 'SpaceView',
  components: { CategoryPage },
  props: {
    id: {
      type: String,
      required: true
    }
  }
}
</script>
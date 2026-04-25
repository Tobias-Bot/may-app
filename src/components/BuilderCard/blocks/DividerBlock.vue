<!-- filepath: /src/components/BuilderCard/blocks/DividerBlock.vue -->
<template>
  <div class="divider-block"><hr /></div>
</template>

<script>
export default { name: 'DividerBlock', props: { data: Object }, emits: ['update', 'delete'], setup() { return {}; } }
</script>

<style scoped>
.divider-block { width: 100%; }
.divider-block hr { margin: 0.5rem 0; border: none; height: 1px; background: linear-gradient(to right, transparent, rgba(26, 59, 59, 0.2), transparent); }
</style>
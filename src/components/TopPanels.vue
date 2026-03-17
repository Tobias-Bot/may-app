<template>
  <div v-if="shouldShow" class="top-panels" :class="{ hidden: !visible }">
    <div class="panels-wrapper">
      <MiniAppsScrollBar />
      <ActionPanel 
        :visible="visible"
        @open-settings="$emit('open-settings')"
        @open-note="$emit('open-note')"
        @open-list="$emit('open-list')"
        @open-photo="$emit('open-photo')"
        @open-progress="$emit('open-progress')"
        @open-timer="$emit('open-timer')"
      />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import MiniAppsScrollBar from './MiniAppsScrollBar.vue';
import ActionPanel from './ActionPanel.vue';

export default {
  name: 'TopPanels',
  components: {
    MiniAppsScrollBar,
    ActionPanel
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  emits: ['open-settings', 'open-note', 'open-list', 'open-photo', 'open-progress', 'open-timer'],
  
  setup(props) {
    const route = useRoute();
    
    const shouldShow = computed(() => {
      // Скрываем на страницах мини-приложений
      return !route.path.startsWith('/mini-apps');
    });

    return {
      shouldShow
    };
  }
}
</script>

<style scoped>
.top-panels {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 950;
  background: transparent;
  padding: 20px 0 0 0;
  transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
  opacity: 1;
  visibility: visible;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.top-panels.hidden {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-15px);
}

.panels-wrapper {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 700px;
  justify-content: center;
  pointer-events: none;
}

/* Левая и правая панели имеют pointer-events: auto внутри себя */
.panels-wrapper > * {
  pointer-events: auto;
}

/* Мобильные устройства */
@media (max-width: 768px) {
  .top-panels {
    padding: 10px 0 0 0;
  }
  
  .panels-wrapper {
    gap: 8px;
    padding: 0 16px;
  }
}
</style>
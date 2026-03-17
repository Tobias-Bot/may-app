<template>
  <button 
    class="fab" 
    :class="{ visible: showFab }"
    @click="scrollToTop"
    title="Наверх"
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 20V4M5 11L12 4L19 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'FloatingActionButton',
  setup() {
    const showFab = ref(false);
    let lastScrollTop = 0;

    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      
      // Показываем кнопку при скролле вниз после 300px
      if (currentScroll > 300) {
        showFab.value = true;
      } else {
        showFab.value = false;
      }
      
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    };

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return {
      showFab,
      scrollToTop
    };
  }
}
</script>

<style scoped>
.fab {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: white;
  border: 1px solid rgba(26, 59, 59, 0.15);
  color: #1a3b3b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  box-shadow: 0 8px 16px rgba(26, 59, 59, 0.2);
  opacity: 0;
  visibility: hidden;
}

.fab.visible {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.fab:hover {
  transform: translateX(-50%) scale(1.1);
  box-shadow: 0 12px 24px rgba(26, 59, 59, 0.25);
}

.fab svg {
  stroke: currentColor;
}

@media (max-width: 768px) {
  .fab {
    bottom: 90px;
    width: 48px;
    height: 48px;
  }
}

@media (max-width: 480px) {
  .fab {
    bottom: 85px;
    width: 44px;
    height: 44px;
  }
}
</style>
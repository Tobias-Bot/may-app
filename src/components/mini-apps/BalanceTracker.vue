<template>
  <div class="balance-tracker">
    <div class="tracker-header">
      <h2 class="tracker-title">🌿 Баланс</h2>
      <button class="stats-button" @click="openStats">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 3V21H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M7 14L10 10L14 13L19 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="18" cy="16" r="2" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <span>Анализ</span>
      </button>
    </div>

    <div class="date-navigation-full">
      <button class="nav-button" @click="prevDay" :disabled="isPrevDayDisabled">←</button>
      <span class="current-date">{{ formatDate(currentDate) }}</span>
      <button class="nav-button" @click="nextDay" :disabled="isNextDayDisabled">→</button>
    </div>

    <div class="spheres-wrapper">
      <button class="scroll-button left" @click="scrollLeft" :disabled="!canScrollLeft" :class="{ 'mobile-hidden': isMobile }">←</button>
      <div class="spheres-scroll" ref="scrollContainer">
        <div class="spheres-container">
          <div v-for="sphere in spheres" :key="sphere.id" class="sphere-item" :class="{ 'completed': isSphereCompleted(sphere.id) }">
            <div class="sphere-header">
              <span class="sphere-emoji">{{ sphere.emoji }}</span>
              <span class="sphere-title">{{ sphere.title }}</span>
            </div>
            <div class="sphere-description">{{ sphere.description }}</div>
            <label class="checkbox-container">
              <input type="checkbox" :checked="isSphereCompleted(sphere.id)" @change="toggleSphere(sphere.id)" />
              <span class="checkmark"></span>
            </label>
          </div>
        </div>
      </div>
      <button class="scroll-button right" @click="scrollRight" :disabled="!canScrollRight" :class="{ 'mobile-hidden': isMobile }">→</button>
    </div>

    <div class="tracker-footer">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${completedPercentage}%` }"></div>
      </div>
      <span class="stats-text">{{ completedCount }}/{{ spheres.length }}</span>
    </div>

    <div v-if="showNewMonthMessage" class="new-month-message">✨ Новый месяц</div>

    <!-- Модальное окно статистики -->
    <ModalWindow :is-open="showStatsModal" @close="closeStats" size="large">
      <template #header>
        <h2 class="modal-title">Статистика</h2>
        <div class="stats-period">{{ formatMonth(currentDate) }}</div>
      </template>

      <div class="chart-container">
        <Pie :data="chartData" :options="chartOptions" />
        <div class="chart-center">
          <span class="center-value">{{ totalDaysInMonth }}</span>
          <span class="center-label">дней</span>
        </div>
      </div>

      <div class="pie-legend">
        <div v-for="sphere in spheresWithStats" :key="sphere.id" class="legend-item">
          <span class="legend-color" :style="{ backgroundColor: sphere.color }"></span>
          <span class="legend-emoji">{{ sphere.emoji }}</span>
          <span class="legend-name">{{ sphere.title }}</span>
          <span class="legend-value">{{ sphere.count }} дн ({{ sphere.percentage }}%)</span>
        </div>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <span class="metric-value">{{ markedDaysCount }}</span>
          <span class="metric-label">отмеченных</span>
        </div>
        <div class="metric-card">
          <span class="metric-value">{{ averageSpheresPerDay }}</span>
          <span class="metric-label">сфер/день</span>
        </div>
        <div class="metric-card">
          <span class="metric-value">{{ bestDayCount }}</span>
          <span class="metric-label">рекорд</span>
        </div>
        <div class="metric-card">
          <span class="metric-value">{{ currentStreak }}</span>
          <span class="metric-label">серия</span>
        </div>
      </div>
    </ModalWindow>

    <!-- Модальное окно для фото -->
    <ModalWindow :is-open="showPhotoModal" @close="closePhotoModal" size="large" :hide-header="true">
      <div class="photo-viewer">
        <img :src="selectedPhoto" alt="Full size" />
      </div>
    </ModalWindow>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ModalWindow from '../ModalWindow.vue';
import { balanceTrackerStore } from '../../stores/balanceTrackerStore';

ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  name: 'BalanceTracker',
  components: { Pie, ModalWindow },
  
  setup() {
    const spheres = [
      { id: 'body', emoji: '💪', title: 'Тело', description: 'Физическая активность, питание, сон', color: '#FFB7B2' },
      { id: 'mental', emoji: '🧠', title: 'Ментальное здоровье', description: 'Медитация, отдых, психологическое состояние', color: '#B5EAD7' },
      { id: 'purpose', emoji: '🎯', title: 'Смыслы', description: 'Цели, миссия, ценности', color: '#C7CEEA' },
      { id: 'relationships', emoji: '❤️', title: 'Отношения', description: 'Общение с близкими, друзьями', color: '#FFDAC1' },
      { id: 'growth', emoji: '📚', title: 'Личностный рост', description: 'Обучение, развитие, увлечения', color: '#E2F0CB' },
      { id: 'finance', emoji: '💰', title: 'Дело и финансы', description: 'Работа, доходы, инвестиции', color: '#FDDFC3' },
      { id: 'nature', emoji: '🌳', title: 'Природа', description: 'Прогулки, экология, связь с природой', color: '#CAE7D9' },
      { id: 'selfcare', emoji: '🌸', title: 'Забота о себе', description: 'Релаксация, уход за собой, удовольствия', color: '#F3B9C6' }
    ];

    const currentDate = ref(new Date());
    const today = new Date();
    const trackerData = ref({
      lastMonth: '',
      days: {}
    });
    const showNewMonthMessage = ref(false);
    const showStatsModal = ref(false);
    const showPhotoModal = ref(false);
    const selectedPhoto = ref(null);
    const scrollContainer = ref(null);
    const canScrollLeft = ref(false);
    const canScrollRight = ref(true);
    const isMobile = ref(window.innerWidth <= 768);
    const isLoading = ref(true);

    const checkMobile = () => { isMobile.value = window.innerWidth <= 768; };

    const loadData = async () => {
      isLoading.value = true;
      try {
        // Ждем готовности хранилища
        await balanceTrackerStore.ready();
        
        const saved = balanceTrackerStore.getData();
        console.log('Loaded balance data:', saved);
        
        if (saved && saved.days) {
          trackerData.value = {
            lastMonth: saved.lastMonth || '',
            days: { ...saved.days }
          };
        }
        
        // Проверяем, не начался ли новый месяц
        const currentMonth = currentDate.value.getMonth();
        const currentYear = currentDate.value.getFullYear();
        const currentMonthStr = `${currentYear}-${currentMonth}`;
        
        if (trackerData.value.lastMonth !== currentMonthStr) {
          console.log('New month detected, resetting data');
          // Новый месяц - очищаем данные
          trackerData.value = {
            lastMonth: currentMonthStr,
            days: {}
          };
          await saveData();
          showNewMonthMessage.value = true;
          setTimeout(() => { showNewMonthMessage.value = false; }, 3000);
        }
      } catch (e) {
        console.error('Failed to load tracker data', e);
      } finally {
        isLoading.value = false;
      }
    };

    const saveData = async () => {
      try {
        // Создаем копию данных для сохранения
        const dataToSave = {
          lastMonth: trackerData.value.lastMonth,
          days: { ...trackerData.value.days }
        };
        console.log('Saving balance data:', dataToSave);
        await balanceTrackerStore.updateData(dataToSave);
      } catch (e) {
        console.error('Failed to save tracker data', e);
      }
    };

    const getDayKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

    const isSphereCompleted = (sphereId) => {
      const dayKey = getDayKey(currentDate.value);
      return trackerData.value.days?.[dayKey]?.spheres?.includes(sphereId) || false;
    };

    const toggleSphere = async (sphereId) => {
      const dayKey = getDayKey(currentDate.value);
      
      // Создаем копию объекта для мутации
      const newDays = { ...trackerData.value.days };
      
      if (!newDays[dayKey]) {
        newDays[dayKey] = {
          spheres: [],
          date: currentDate.value.toISOString()
        };
      }
      
      const spheres = [...(newDays[dayKey].spheres || [])];
      const index = spheres.indexOf(sphereId);
      
      if (index === -1) {
        spheres.push(sphereId);
      } else {
        spheres.splice(index, 1);
      }
      
      newDays[dayKey] = {
        ...newDays[dayKey],
        spheres
      };
      
      // Обновляем локальное состояние
      trackerData.value = {
        ...trackerData.value,
        days: newDays
      };
      
      // Сохраняем в базу
      await saveData();
    };

    const completedCount = computed(() => {
      const dayKey = getDayKey(currentDate.value);
      return trackerData.value.days?.[dayKey]?.spheres?.length || 0;
    });

    const completedPercentage = computed(() => (completedCount.value / spheres.length) * 100);

    const isPrevDayDisabled = computed(() => {
      const prevDate = new Date(currentDate.value);
      prevDate.setDate(prevDate.getDate() - 1);
      return prevDate.getMonth() !== currentDate.value.getMonth() || prevDate < new Date(today.getFullYear(), today.getMonth(), 1);
    });

    const isNextDayDisabled = computed(() => {
      const nextDate = new Date(currentDate.value);
      nextDate.setDate(nextDate.getDate() + 1);
      return nextDate.getMonth() !== currentDate.value.getMonth() || nextDate > today;
    });

    const prevDay = () => { 
      if (!isPrevDayDisabled.value) { 
        const d = new Date(currentDate.value); 
        d.setDate(d.getDate() - 1); 
        currentDate.value = d; 
      } 
    };
    
    const nextDay = () => { 
      if (!isNextDayDisabled.value) { 
        const d = new Date(currentDate.value); 
        d.setDate(d.getDate() + 1); 
        currentDate.value = d; 
      } 
    };

    const checkScroll = () => {
      if (scrollContainer.value) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value;
        canScrollLeft.value = scrollLeft > 0;
        canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 5;
      }
    };
    
    const scrollLeft = () => { 
      if (scrollContainer.value) { 
        scrollContainer.value.scrollBy({ left: -300, behavior: 'smooth' }); 
        setTimeout(checkScroll, 300); 
      } 
    };
    
    const scrollRight = () => { 
      if (scrollContainer.value) { 
        scrollContainer.value.scrollBy({ left: 300, behavior: 'smooth' }); 
        setTimeout(checkScroll, 300); 
      } 
    };

    const formatDate = (date) => {
      const todayDate = new Date();
      const yesterday = new Date(todayDate);
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === todayDate.toDateString()) return 'Сегодня';
      if (date.toDateString() === yesterday.toDateString()) return 'Вчера';
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    };

    const formatMonth = (date) => date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });

    const openStats = () => { showStatsModal.value = true; };
    const closeStats = () => { showStatsModal.value = false; };
    const openPhoto = (photo) => { selectedPhoto.value = photo; showPhotoModal.value = true; };
    const closePhotoModal = () => { showPhotoModal.value = false; selectedPhoto.value = null; };

    const daysInMonth = computed(() => {
      const year = currentDate.value.getFullYear();
      const month = currentDate.value.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const days = [];
      for (let d = new Date(firstDay); d <= lastDay && d <= today; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
      }
      return days;
    });

    const totalDaysInMonth = computed(() => daysInMonth.value.length);

    const markedDaysCount = computed(() => daysInMonth.value.filter(date => {
      const dayKey = getDayKey(date);
      return trackerData.value.days?.[dayKey]?.spheres?.length > 0;
    }).length);

    const totalCompletions = computed(() => {
      let total = 0;
      daysInMonth.value.forEach(date => {
        const dayKey = getDayKey(date);
        total += trackerData.value.days?.[dayKey]?.spheres?.length || 0;
      });
      return total;
    });

    const averageSpheresPerDay = computed(() => {
      if (markedDaysCount.value === 0) return 0;
      return (totalCompletions.value / markedDaysCount.value).toFixed(1);
    });

    const bestDay = computed(() => {
      let maxCount = 0, bestDate = null;
      daysInMonth.value.forEach(date => {
        const dayKey = getDayKey(date);
        const count = trackerData.value.days?.[dayKey]?.spheres?.length || 0;
        if (count > maxCount) { maxCount = count; bestDate = date; }
      });
      return { count: maxCount, date: bestDate };
    });

    const bestDayCount = computed(() => bestDay.value.count);

    const spheresWithStats = computed(() => {
      return spheres.map(sphere => {
        let count = 0;
        daysInMonth.value.forEach(date => {
          const dayKey = getDayKey(date);
          if (trackerData.value.days?.[dayKey]?.spheres?.includes(sphere.id)) count++;
        });
        return { ...sphere, count, percentage: Math.round((count / totalDaysInMonth.value) * 100) };
      }).sort((a, b) => b.count - a.count);
    });

    const chartData = computed(() => ({
      labels: spheresWithStats.value.map(s => s.title),
      datasets: [{
        data: spheresWithStats.value.map(s => s.count),
        backgroundColor: spheresWithStats.value.map(s => s.color),
        borderWidth: 0,
        cutout: '70%',
      }]
    }));

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const sphere = spheresWithStats.value[context.dataIndex];
              return `${sphere.title}: ${sphere.count} дней (${sphere.percentage}%)`;
            }
          }
        }
      }
    };

    const currentStreak = computed(() => {
      let streak = 0;
      const sortedDays = [...daysInMonth.value].reverse();
      for (const date of sortedDays) {
        if (trackerData.value.days?.[getDayKey(date)]?.spheres?.length > 0) streak++;
        else break;
      }
      return streak;
    });

    // Загружаем данные при монтировании
    onMounted(async () => {
      console.log('BalanceTracker mounted, loading data...');
      await loadData();
      checkScroll();
      if (scrollContainer.value) scrollContainer.value.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkMobile);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile);
    });

    watch(currentDate, async (newDate, oldDate) => {
      if (newDate.getMonth() !== oldDate.getMonth()) {
        console.log('Month changed, reloading data...');
        await loadData();
      }
    });

    return {
      spheres,
      currentDate,
      showNewMonthMessage,
      showStatsModal,
      showPhotoModal,
      selectedPhoto,
      scrollContainer,
      canScrollLeft,
      canScrollRight,
      isMobile,
      isLoading,
      isSphereCompleted,
      toggleSphere,
      completedCount,
      completedPercentage,
      isPrevDayDisabled,
      isNextDayDisabled,
      prevDay,
      nextDay,
      scrollLeft,
      scrollRight,
      formatDate,
      formatMonth,
      openStats,
      closeStats,
      openPhoto,
      closePhotoModal,
      totalDaysInMonth,
      markedDaysCount,
      averageSpheresPerDay,
      bestDayCount,
      spheresWithStats,
      chartData,
      chartOptions,
      currentStreak
    };
  }
}
</script>

<style scoped>
.balance-tracker {
  max-width: 1400px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 24px;
  padding: 1rem;
  border: 1px solid rgba(26, 59, 59, 0.08);
  margin-bottom: 1.5rem;
}

.tracker-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 0.75rem;
}
.tracker-title { font-size: 1.1rem; font-weight: 350; color: #1a3b3b; margin: 0; }

.stats-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid var(--card-border);
  border-radius: 30px;
  padding: 0.5rem 1rem;
  color: var(--accent-color);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.stats-button:hover {
  background: var(--button-hover);
  transform: translateY(-2px);
}

.stats-button svg {
  stroke: currentColor;
}

.date-navigation-full {
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(255, 255, 255, 0.5); border-radius: 40px; padding: 0.25rem;
  margin-bottom: 1rem; border: 1px solid rgba(26, 59, 59, 0.05);
}

.nav-button {
  width: 36px; height: 36px; border-radius: 50%; background: transparent;
  border: none; color: #1a3b3b; cursor: pointer; font-size: 1.2rem; opacity: 0.6;
}
.nav-button:hover:not(:disabled) { background: rgba(26, 59, 59, 0.1); opacity: 1; }
.nav-button:disabled { opacity: 0.2; }

.current-date { font-size: 0.95rem; color: #1a3b3b; flex: 1; text-align: center; }

.spheres-wrapper { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
.scroll-button {
  width: 32px; height: 32px; border-radius: 50%; background: white;
  border: 1px solid rgba(26, 59, 59, 0.1); color: #1a3b3b; cursor: pointer;
  font-size: 1rem; flex-shrink: 0;
}
.scroll-button:hover:not(:disabled) { background: #1a3b3b; color: white; }
.scroll-button:disabled { opacity: 0.3; }
.scroll-button.mobile-hidden { display: none; }

.spheres-scroll { flex: 1; overflow-x: auto; scrollbar-width: none; }
.spheres-scroll::-webkit-scrollbar { display: none; }
.spheres-container { display: flex; gap: 0.75rem; padding: 0.25rem; }

.sphere-item {
  min-width: 180px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(4px);
  border-radius: 20px; padding: 1rem; border: 1px solid rgba(26, 59, 59, 0.08);
  display: flex; flex-direction: column; gap: 0.5rem;
}
.sphere-item.completed { background: rgba(26, 59, 59, 0.05); }

.sphere-header { display: flex; align-items: center; gap: 0.5rem; }
.sphere-emoji { font-size: 1.2rem; }
.sphere-title { font-size: 0.9rem; font-weight: 400; color: #1a3b3b; }
.sphere-description { font-size: 0.7rem; color: #8a9a9a; }

.checkbox-container {
  display: flex; align-items: center; cursor: pointer; user-select: none;
  position: relative; width: 20px; height: 20px;
}
.checkbox-container input { position: absolute; opacity: 0; }
.checkmark {
  position: absolute; top: 0; left: 0; height: 20px; width: 20px;
  background: transparent; border: 2px solid rgba(26, 59, 59, 0.3); border-radius: 5px;
}
.checkbox-container:hover input ~ .checkmark { border-color: #1a3b3b; }
.checkbox-container input:checked ~ .checkmark { background: #1a3b3b; border-color: #1a3b3b; }
.checkmark:after {
  content: ""; position: absolute; display: none;
  left: 5px; top: 2px; width: 5px; height: 9px;
  border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg);
}
.checkbox-container input:checked ~ .checkmark:after { display: block; }

.tracker-footer {
  display: flex; align-items: center; gap: 0.75rem;
}
.progress-bar { flex: 1; height: 4px; background: rgba(26, 59, 59, 0.1); border-radius: 2px; overflow: hidden; }
.progress-fill { height: 100%; background: #1a3b3b; }
.stats-text { font-size: 0.8rem; color: #8a9a9a; min-width: 45px; }

.chart-container {
  position: relative; width: 250px; height: 250px; margin: 0 auto 1.5rem;
}
.chart-center {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  text-align: center;
}
.center-value { font-size: 2rem; font-weight: 350; color: #1a3b3b; display: block; }
.center-label { font-size: 0.8rem; color: #8a9a9a; }

.pie-legend {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.5rem; margin-bottom: 1.5rem; padding: 0.75rem;
  background: rgba(26, 59, 59, 0.02); border-radius: 20px;
}
.legend-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.25rem; }
.legend-color { width: 10px; height: 10px; border-radius: 3px; }
.legend-emoji { font-size: 0.9rem; }
.legend-name { font-size: 0.8rem; color: #1a3b3b; flex: 1; }
.legend-value { font-size: 0.7rem; color: #8a9a9a; }

.metrics-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; margin-bottom: 1.5rem;
}
.metric-card {
  background: rgba(26, 59, 59, 0.03); border-radius: 20px; padding: 1rem; text-align: center;
}
.metric-value { font-size: 1.5rem; font-weight: 350; color: #1a3b3b; display: block; }
.metric-label { font-size: 0.7rem; color: #8a9a9a; }

.new-month-message {
  position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
  background: #1a3b3b; color: white; padding: 0.75rem 1.5rem; border-radius: 40px;
  animation: messageFade 2s ease forwards; z-index: 1000; font-size: 0.9rem;
}

@keyframes messageFade {
  0% { opacity: 0; transform: translate(-50%, -30%); }
  15% { opacity: 1; transform: translate(-50%, -50%); }
  85% { opacity: 1; transform: translate(-50%, -50%); }
  100% { opacity: 0; transform: translate(-50%, -70%); }
}

@media (max-width: 768px) {
  .balance-tracker { padding: 0.75rem; }
  .sphere-item { min-width: 160px; }
}
</style>
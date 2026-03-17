<template>
  <div id="app">
    <TopPanels 
      :visible="navVisible"
      @open-settings="openSettings"
      @open-note="openNoteTool"
      @open-list="openListTool"
      @open-photo="openPhotoTool"
      @open-progress="openProgressTool"
      @open-timer="openTimerTool"
    />
    <NavBar @visibility-change="updateNavVisibility" />
    <FloatingActionButton />
    
    <div class="content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- Модальное окно настроек -->
    <ModalWindow :is-open="showSettings" @close="closeSettings" title="Настройки" size="medium">
      <div class="modal-form">
        <div class="settings-card">
          <h3>Фон страницы</h3>
          
          <ImageUploader v-model="backgroundImage" @change="handleBackgroundChange" />
          
          <div class="background-actions">
            <button class="reset-button" @click="resetBackground" :disabled="!backgroundImage">
              Сбросить
            </button>
          </div>
          
          <p class="settings-note">Изображение будет растянуто на весь фон страницы</p>
        </div>
        
        <div class="settings-card">
          <h3>О приложении</h3>
          <p>May — пространство для осознанной жизни</p>
          <p class="version">Версия 1.0.0</p>
        </div>
      </div>
    </ModalWindow>

    <!-- Модальное окно для заметки -->
    <ModalWindow :is-open="showNoteModal" @close="closeNoteModal" title="Быстрая заметка" size="small">
      <div class="modal-form">
        <input 
          v-model="noteTitle" 
          type="text" 
          placeholder="Заголовок (необязательно)"
          class="modal-input"
          ref="titleInput"
        />
        
        <textarea 
          v-model="noteContent" 
          placeholder="Текст заметки..."
          rows="4"
          class="modal-textarea"
          maxlength="500"
        ></textarea>
        
        <ImageUploader v-model="noteImage" @change="handleNoteImageChange" />
        
        <div class="modal-actions">
          <button class="modal-button primary" @click="saveNote">Создать</button>
          <button class="modal-button secondary" @click="closeNoteModal">Отмена</button>
        </div>
      </div>
    </ModalWindow>

    <!-- Модальное окно для списка -->
    <ModalWindow :is-open="showListModal" @close="closeListModal" title="Новый список" size="small">
      <div class="modal-form">
        <input 
          v-model="listTitle" 
          type="text" 
          placeholder="Название списка"
          class="modal-input"
          ref="listTitleInput"
        />
        
        <div class="modal-items-list">
          <div v-for="(item, index) in initialItems" :key="index" class="modal-item-row">
            <input 
              v-model="item.text" 
              type="text" 
              placeholder="Пункт списка"
              class="modal-item-input"
              @keyup.enter="addInitialItem"
            />
            <button 
              v-if="initialItems.length > 1" 
              class="modal-item-remove" 
              @click="removeInitialItem(index)"
              title="Удалить пункт"
            >✕</button>
          </div>
        </div>
        
        <button v-if="initialItems.length < 25" class="modal-add-button" @click="addInitialItem">
          <span class="plus-icon">+</span> Добавить пункт
        </button>
        <div v-else class="modal-limit-note">Максимум 25 пунктов</div>
        
        <div class="modal-actions">
          <button class="modal-button primary" @click="saveList">Создать</button>
          <button class="modal-button secondary" @click="closeListModal">Отмена</button>
        </div>
      </div>
    </ModalWindow>

    <!-- Модальное окно для фото -->
    <ModalWindow :is-open="showPhotoModal" @close="closePhotoModal" title="Добавить фото" size="small">
      <div class="modal-form">
        <ImageUploader v-model="photoImage" @change="handlePhotoModalChange" />
        
        <div class="modal-actions">
          <button class="modal-button secondary" @click="closePhotoModal">Отмена</button>
        </div>
      </div>
    </ModalWindow>

    <!-- Модальное окно для прогресс-бара -->
    <ModalWindow :is-open="showProgressModal" @close="closeProgressModal" title="Новый прогресс" size="small">
      <div class="modal-form">
        <input 
          v-model="progressTitle" 
          type="text" 
          placeholder="Название (необязательно)"
          class="modal-input"
          ref="progressTitleInput"
        />
        
        <div class="modal-settings-grid">
          <div class="settings-row">
            <label>От</label>
            <input 
              v-model.number="progressMin" 
              type="number" 
              class="modal-number-input"
            />
          </div>
          <div class="settings-row">
            <label>До</label>
            <input 
              v-model.number="progressMax" 
              type="number" 
              class="modal-number-input"
            />
          </div>
          <div class="settings-row">
            <label>Шаг</label>
            <input 
              v-model.number="progressStep" 
              type="number" 
              step="0.1"
              class="modal-number-input"
            />
          </div>
          <div class="settings-row">
            <label>Ед.</label>
            <input 
              v-model="progressUnit" 
              type="text" 
              placeholder="шт"
              class="modal-text-input"
            />
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="modal-button primary" @click="saveProgress">Создать</button>
          <button class="modal-button secondary" @click="closeProgressModal">Отмена</button>
        </div>
      </div>
    </ModalWindow>

    <!-- Модальное окно для таймера -->
    <ModalWindow :is-open="showTimerModal" @close="closeTimerModal" title="Новый таймер" size="small">
      <div class="modal-form">
        <input 
          v-model="timerTitle" 
          type="text" 
          placeholder="Название события"
          class="modal-input"
          ref="timerTitleInput"
        />
        
        <div class="timer-modal-datetime">
          <div class="modal-input-group">
            <label>Дата</label>
            <input 
              type="date" 
              v-model="timerDate"
              class="modal-input"
              :min="todayDate"
            />
          </div>
          <div class="modal-input-group">
            <label>Время</label>
            <input 
              type="time" 
              v-model="timerTime"
              class="modal-input"
              step="1"
            />
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="modal-button primary" @click="saveTimer">Создать</button>
          <button class="modal-button secondary" @click="closeTimerModal">Отмена</button>
        </div>
      </div>
    </ModalWindow>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import TopPanels from './components/TopPanels.vue';
import NavBar from './components/NavBar.vue'
import FloatingActionButton from './components/FloatingActionButton.vue'
import ModalWindow from './components/ModalWindow.vue'
import ImageUploader from './components/ImageUploader.vue'
import { settingsStore } from './stores/settingsStore';
import { toolsStore } from './stores/toolsStore';
import { initDB } from './db/db';

// Импортируем стили
import './styles/global-styles.css';
import './styles/modal-styles.css';
import './styles/settings-styles.css';
import './styles/pwa-styles.css'; // Добавляем PWA стили

export default {
  name: 'App',
  components: {
    TopPanels,
    NavBar,
    FloatingActionButton,
    ModalWindow,
    ImageUploader
  },
  
  setup() {
    const route = useRoute();
    const showSettings = ref(false);
    const backgroundImage = ref(null);
    const isInitialized = ref(false);
    const navVisible = ref(true);
    
    // Инструменты
    const showNoteModal = ref(false);
    const showListModal = ref(false);
    const showPhotoModal = ref(false);
    const showProgressModal = ref(false);
    const showTimerModal = ref(false); // Только одно объявление
    
    // Данные для заметки
    const noteTitle = ref('');
    const noteContent = ref('');
    const noteImage = ref(null);
    const titleInput = ref(null);
    
    // Данные для списка
    const listTitle = ref('');
    const initialItems = ref([{ text: '' }]);3
    const listTitleInput = ref(null);
    
    // Данные для фото
    const photoImage = ref(null);
    
    // Данные для прогресса
    const progressTitle = ref('');
    const progressMin = ref(0);
    const progressMax = ref(100);
    const progressStep = ref(1);
    const progressUnit = ref('шт');
    const progressTitleInput = ref(null);
    
    // Данные для таймера
    const timerTitle = ref('');
    const timerDate = ref('');
    const timerTime = ref('00:00:00');
    const timerTitleInput = ref(null);

    // Текущая дата для атрибута min
    const todayDate = computed(() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });

    const updateNavVisibility = (visible) => {
      navVisible.value = visible;
    };

    const applyBackground = (image) => {
      if (image) {
        document.body.style.backgroundImage = `url(${image})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundRepeat = 'no-repeat';
      } else {
        document.body.style.backgroundImage = '';
      }
    };

    const loadSettings = async () => {
      try {
        await settingsStore.ready();
        const settings = settingsStore.getSettings();
        backgroundImage.value = settings.background || null;
        applyBackground(backgroundImage.value);
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    };

    const saveSettings = async () => {
      try {
        await settingsStore.updateSettings({
          background: backgroundImage.value
        });
      } catch (e) {
        console.error('Failed to save settings', e);
      }
    };

    const handleBackgroundChange = async (image) => {
      backgroundImage.value = image;
      applyBackground(image);
      await saveSettings();
    };

    const resetBackground = async () => {
      backgroundImage.value = null;
      applyBackground(null);
      await saveSettings();
    };

    const openSettings = () => {
      showSettings.value = true;
    };

    const closeSettings = () => {
      showSettings.value = false;
    };

    const initializeApp = async () => {
      try {
        await initDB();
        await loadSettings();
        isInitialized.value = true;
      } catch (e) {
        console.error('Failed to initialize app', e);
      }
    };

    // Инструмент заметки
    const openNoteTool = () => {
      showNoteModal.value = true;
      noteTitle.value = '';
      noteContent.value = '';
      noteImage.value = null;
      setTimeout(() => {
        if (titleInput.value) titleInput.value.focus();
      }, 100);
    };

    const closeNoteModal = () => {
      showNoteModal.value = false;
    };

    const handleNoteImageChange = (image) => {
      noteImage.value = image;
    };

    const saveNote = async () => {
      const currentPage = route.path.replace('/', '') || 'ya';
      await toolsStore.addTool(currentPage, {
        type: 'note',
        data: {
          title: noteTitle.value.trim(),
          content: noteContent.value.trim(),
          image: noteImage.value,
          createdAt: new Date().toISOString()
        }
      });
      closeNoteModal();
    };

    // Инструмент списка
    const openListTool = () => {
      showListModal.value = true;
      listTitle.value = '';
      initialItems.value = [{ text: '' }];
      setTimeout(() => {
        if (listTitleInput.value) listTitleInput.value.focus();
      }, 100);
    };

    const closeListModal = () => {
      showListModal.value = false;
    };

    const addInitialItem = () => {
      if (initialItems.value.length < 25) {
        initialItems.value.push({ text: '' });
      }
    };

    const removeInitialItem = (index) => {
      initialItems.value.splice(index, 1);
    };

    const saveList = async () => {
      const items = initialItems.value
        .filter(i => i.text.trim())
        .map(i => ({
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          text: i.text.trim(),
          completed: false
        }));
      
      const currentPage = route.path.replace('/', '') || 'ya';
      await toolsStore.addTool(currentPage, {
        type: 'list',
        data: {
          title: listTitle.value.trim() || 'Список',
          items,
          createdAt: new Date().toISOString()
        }
      });
      closeListModal();
    };

    // Инструмент фото
    const openPhotoTool = () => {
      photoImage.value = null;
      showPhotoModal.value = true;
    };

    const closePhotoModal = () => {
      showPhotoModal.value = false;
    };

    const handlePhotoModalChange = (image) => {
      if (image) {
        const currentPage = route.path.replace('/', '') || 'ya';
        toolsStore.addTool(currentPage, {
          type: 'photo',
          data: {
            image: image,
            createdAt: new Date().toISOString()
          }
        });
        closePhotoModal();
        photoImage.value = null;
      }
    };

    // Инструмент прогресс
    const openProgressTool = () => {
      showProgressModal.value = true;
      progressTitle.value = '';
      progressMin.value = 0;
      progressMax.value = 100;
      progressStep.value = 1;
      progressUnit.value = 'шт';
      setTimeout(() => {
        if (progressTitleInput.value) progressTitleInput.value.focus();
      }, 100);
    };

    const closeProgressModal = () => {
      showProgressModal.value = false;
    };

    const saveProgress = async () => {
      const currentPage = route.path.replace('/', '') || 'ya';
      await toolsStore.addTool(currentPage, {
        type: 'progress',
        data: {
          title: progressTitle.value.trim(),
          min: progressMin.value,
          max: progressMax.value,
          step: progressStep.value,
          unit: progressUnit.value,
          current: progressMin.value
        }
      });
      closeProgressModal();
    };

    // Инструмент таймер
    const openTimerTool = () => {
      console.log('Opening timer modal'); // Для отладки
      showTimerModal.value = true;
      timerTitle.value = '';
      timerDate.value = todayDate.value;
      timerTime.value = '00:00:00';
      setTimeout(() => {
        if (timerTitleInput.value) timerTitleInput.value.focus();
      }, 100);
    };

    const closeTimerModal = () => {
      showTimerModal.value = false;
    };

    const saveTimer = async () => {
      if (!timerDate.value) {
        alert('Пожалуйста, выберите дату');
        return;
      }

      const currentPage = route.path.replace('/', '') || 'ya';
      await toolsStore.addTool(currentPage, {
        type: 'timer',
        data: {
          title: timerTitle.value.trim(),
          date: timerDate.value,
          time: timerTime.value,
          createdAt: new Date().toISOString()
        }
      });
      closeTimerModal();
    };

    onMounted(async () => {
      await initializeApp();
      window.addEventListener('open-settings', openSettings);
    });

    return {
      showSettings,
      backgroundImage,
      isInitialized,
      navVisible,
      closeSettings,
      handleBackgroundChange,
      resetBackground,
      openSettings,
      updateNavVisibility,
      // Инструменты
      showNoteModal,
      showListModal,
      showPhotoModal,
      showProgressModal,
      showTimerModal,
      noteTitle,
      noteContent,
      noteImage,
      listTitle,
      initialItems,
      photoImage,
      progressTitle,
      progressMin,
      progressMax,
      progressStep,
      progressUnit,
      timerTitle,
      timerDate,
      timerTime,
      timerTitleInput,
      todayDate,
      titleInput,
      listTitleInput,
      progressTitleInput,
      openNoteTool,
      closeNoteModal,
      handleNoteImageChange,
      saveNote,
      openListTool,
      closeListModal,
      addInitialItem,
      removeInitialItem,
      saveList,
      openPhotoTool,
      closePhotoModal,
      handlePhotoModalChange,
      openProgressTool,
      closeProgressModal,
      saveProgress,
      openTimerTool,
      closeTimerModal,
      saveTimer
    };
  }
}
</script>

<style>
/* Глобальные стили уже импортированы из файлов */

.timer-modal-datetime {
  display: flex;
  gap: 1rem;
}

.modal-input-group {
  flex: 1;
}

.modal-input-group label {
  display: block;
  font-size: 0.8rem;
  color: #8a9a9a;
  margin-bottom: 0.25rem;
}

@media (max-width: 480px) {
  .timer-modal-datetime {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
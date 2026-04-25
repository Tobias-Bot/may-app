<!-- filepath: /src/components/modals/CreateCardModal.vue -->
<template>
  <ModalWindow :is-open="isOpen" @close="close" title="Создать карточку" size="medium">
    <div class="modal-form">
      <div class="create-options">
        <div class="option-section">
          <h3>Пустая карточка</h3>
          <p class="option-desc">Создайте карточку и наполните её блоками</p>
          <button class="option-button primary" @click="createEmpty">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5V19M5 12H19"/>
            </svg>
            <span>Создать пустую карточку</span>
          </button>
        </div>
        
        <div class="option-section">
          <h3>Шаблоны</h3>
          <p class="option-desc">Используйте готовые шаблоны</p>
          <div class="templates-grid">
            <button 
              v-for="template in templates" 
              :key="template.id"
              class="template-card"
              @click="createFromTemplate(template)"
            >
              <span class="template-icon" v-html="template.icon"></span>
              <span class="template-name">{{ template.name }}</span>
              <span class="template-desc">{{ template.description }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </ModalWindow>
</template>

<script>
import ModalWindow from '../ModalWindow.vue';

export default {
  name: 'CreateCardModal',
  components: { ModalWindow },
  props: { isOpen: Boolean },
  emits: ['close', 'create'],
  
  setup(props, { emit }) {
    const templates = [
      {
        id: 'note',
        name: 'Заметка',
        description: 'Заголовок и текст',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17 3L21 7L7 21H3V17L17 3Z"/><path d="M14 6L18 10"/></svg>',
        blocks: [
          { type: 'title', data: { content: 'Моя заметка' } },
          { type: 'text', data: { content: '' } }
        ]
      },
      {
        id: 'list',
        name: 'Список',
        description: 'Заголовок и пункты списка',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 6H20M4 12H20M4 18H14"/></svg>',
        blocks: [
          { type: 'title', data: { content: 'Мой список' } },
          { type: 'listItem', data: { text: '', completed: false } },
          { type: 'listItem', data: { text: '', completed: false } }
        ]
      },
      {
        id: 'photo',
        name: 'Фотоальбом',
        description: 'Фото и описание',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="4"/><circle cx="17" cy="7" r="2"/><path d="M2 16L7 11L12 15L17 10L22 14"/></svg>',
        blocks: [
          { type: 'photo', data: { image: null } },
          { type: 'text', data: { content: '' } }
        ]
      },
      {
        id: 'daily',
        name: 'Дневник дня',
        description: 'Заголовок, текст, пункты задач',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4H20V20H4V4Z"/><path d="M8 8H16M8 12H12"/></svg>',
        blocks: [
          { type: 'title', data: { content: 'Мой день' } },
          { type: 'text', data: { content: '' } },
          { type: 'listItem', data: { text: '', completed: false } },
          { type: 'listItem', data: { text: '', completed: false } }
        ]
      },
      {
        id: 'project',
        name: 'Проект',
        description: 'Заголовок, прогресс, пункты задач',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12L7 8L11 12L17 6L21 10"/><path d="M3 20H21"/></svg>',
        blocks: [
          { type: 'title', data: { content: 'Новый проект' } },
          { type: 'progress', data: { title: 'Общий прогресс', min: 0, max: 100, step: 1, unit: '%', current: 0 } },
          { type: 'listItem', data: { text: '', completed: false } },
          { type: 'listItem', data: { text: '', completed: false } }
        ]
      },
      {
        id: 'timer',
        name: 'Таймер задач',
        description: 'Таймер и пункты задач',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7V12L15 15"/></svg>',
        blocks: [
          { type: 'timer', data: { title: 'Фокус-сессия', totalSeconds: 1500 } },
          { type: 'listItem', data: { text: '', completed: false } },
          { type: 'listItem', data: { text: '', completed: false } }
        ]
      },
      {
    id: 'table',
    name: 'Таблица данных',
    description: 'Таблица 3×3 для данных',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3V21M15 3V21M3 9H21M3 15H21"/></svg>',
    blocks: [
      { type: 'title', data: { content: 'Мои данные' } },
      { type: 'table', data: { rows: 3, cols: 3, data: null } }
    ]
  },
  {
    id: 'reminder_card',
    name: 'Напоминания',
    description: 'Важные события и даты',
    icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 2V6M16 2V6M3 10H21"/></svg>',
    blocks: [
      { type: 'title', data: { content: 'Важные даты' } },
      { type: 'reminder', data: { title: 'Встреча', date: '', time: '10:00', triggered: false } },
      { type: 'reminder', data: { title: 'День рождения', date: '', time: '00:00', triggered: false } }
    ]
  }
    ];

    const close = () => {
      emit('close');
    };

    const createEmpty = () => {
      emit('create', { type: 'builder', data: { title: 'Новая карточка', blocks: [] } });
      close();
    };

    const createFromTemplate = (template) => {
      emit('create', { 
        type: 'builder', 
        data: { 
          title: template.name, 
          blocks: template.blocks.map(block => ({
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            ...block
          }))
        } 
      });
      close();
    };

    return { templates, close, createEmpty, createFromTemplate };
  }
}
</script>

<style scoped>
.create-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.option-section h3 {
  font-size: 1rem;
  font-weight: 500;
  color: #1a3b3b;
  margin-bottom: 0.25rem;
}

.option-desc {
  font-size: 0.8rem;
  color: #8a9a9a;
  margin-bottom: 1rem;
}

.option-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: rgba(26, 59, 59, 0.05);
  border: 1px dashed rgba(26, 59, 59, 0.25);
  border-radius: 40px;
  color: #1a3b3b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.option-button.primary {
  background: #1a3b3b;
  color: white;
  border: none;
}

.option-button.primary:hover {
  background: #2a4b4b;
  transform: translateY(-2px);
}

.option-button:hover:not(.primary) {
  background: rgba(26, 59, 59, 0.1);
  border-color: #1a3b3b;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.template-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(26, 59, 59, 0.03);
  border: 1px solid rgba(26, 59, 59, 0.08);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.template-card:hover {
  background: rgba(26, 59, 59, 0.08);
  transform: translateY(-2px);
}

.template-icon svg {
  width: 32px;
  height: 32px;
  stroke: #1a3b3b;
}

.template-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: #1a3b3b;
}

.template-desc {
  font-size: 0.7rem;
  color: #8a9a9a;
}

@media (max-width: 480px) {
  .templates-grid {
    grid-template-columns: 1fr;
  }
}
</style>
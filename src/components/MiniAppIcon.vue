<!-- filepath: /src/components/MiniAppIcon.vue -->
<template>
  <svg v-if="icon === 'balance'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12L7 8L11 12L17 6L21 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3 20H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
  </svg>
  <svg v-else-if="icon === 'gratitude'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.54L12 21.35Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
  </svg>
  <svg v-else-if="icon === 'mood'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
    <path d="M8 14C9 16 11 17 12 17C13 17 15 16 16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="9" cy="10" r="1.5" fill="currentColor"/>
    <circle cx="15" cy="10" r="1.5" fill="currentColor"/>
  </svg>
  <svg v-else-if="icon === 'habits'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4V20H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M8 8L12 12L8 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16 8L12 12L16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <svg v-else-if="icon === 'finance'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
    <path d="M12 6V18M15 9C14 7.5 13 7 12 7C10 7 9 8 9 9C9 11 12 11 12 13C12 14 11 15 9 15C8 15 7 14.5 6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
  <svg v-else-if="icon === 'chores'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 4L12 7L15 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4 12H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <rect x="4" y="12" width="16" height="8" rx="1" stroke="currentColor" stroke-width="1.5"/>
  </svg>
  <svg v-else-if="icon === 'shopping'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 6L8 3H16L18 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="3" y="6" width="18" height="15" rx="1" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="9" cy="13" r="1.5" fill="currentColor"/>
    <circle cx="15" cy="13" r="1.5" fill="currentColor"/>
  </svg>
  <svg v-else-if="icon === 'plants'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4V12M12 12L9 9M12 12L15 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 22V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
  </svg>
  <svg v-else-if="icon === 'birthdays'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15 6L12 10L9 6L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    <rect x="4" y="10" width="16" height="12" rx="1" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="12" cy="16" r="2" fill="currentColor"/>
  </svg>
  <svg v-else-if="icon === 'calls'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 16.92V19C22 20.1 21.1 21 20 21C10.6 21 3 13.4 3 4C3 2.9 3.9 2 5 2H7.08C7.54 2 7.93 2.34 7.99 2.79L8.48 6.67C8.53 7.07 8.33 7.45 7.99 7.64L5.58 9.11C6.97 12.54 9.46 15.03 12.89 16.42L14.36 14.01C14.55 13.67 14.93 13.47 15.33 13.52L19.21 14.01C19.66 14.07 20 14.46 20 14.92Z" stroke="currentColor" stroke-width="1.5"/>
  </svg>
  <svg v-else-if="icon === 'gifts'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="8" width="18" height="14" rx="1" stroke="currentColor" stroke-width="1.5"/>
    <path d="M8 8V5C8 3.5 9 2 12 2C15 2 16 3.5 16 5V8" stroke="currentColor" stroke-width="1.5"/>
    <path d="M12 8V22" stroke="currentColor" stroke-width="1.5"/>
    <path d="M3 12H21" stroke="currentColor" stroke-width="1.5"/>
  </svg>
  <svg v-else-if="icon === 'network'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/>
    <path d="M5 20V19C5 15.6863 7.68629 13 11 13H13C16.3137 13 19 15.6863 19 19V20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="18" cy="5" r="2" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="6" cy="5" r="2" stroke="currentColor" stroke-width="1.5"/>
  </svg>
  <svg v-else-if="icon === 'events'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
    <path d="M8 2V6M16 2V6M3 10H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="12" cy="14" r="1.5" fill="currentColor"/>
    <circle cx="16" cy="14" r="1.5" fill="currentColor"/>
    <circle cx="8" cy="14" r="1.5" fill="currentColor"/>
  </svg>
  <svg v-else-if="icon === 'all'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
  </svg>
  <svg v-else-if="icon === 'self'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/>
    <path d="M5 20V19C5 15.6863 7.68629 13 11 13H13C16.3137 13 19 15.6863 19 19V20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
  <svg v-else-if="icon === 'social'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 20V19C17 16.2386 14.7614 14 12 14H7C4.23858 14 2 16.2386 2 19V20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="9.5" cy="7.5" r="3.5" stroke="currentColor" stroke-width="1.5"/>
    <path d="M22 20V19C22 16.2386 19.7614 14 17 14H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="17" cy="7.5" r="3.5" stroke="currentColor" stroke-width="1.5"/>
  </svg>
  <svg v-else-if="icon === 'catalog'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4H20V20H4V4Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M8 8H16M8 12H13M8 16H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
  <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
    <path d="M12 8V12L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
</template>

<script>
export default {
  name: 'MiniAppIcon',
  props: { icon: { type: String, default: 'balance' } }
}
</script>
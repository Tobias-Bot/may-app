<!-- filepath: /src/components/SpaceIcon.vue -->
<template>
  <svg v-if="icon === 'person'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/>
    <path d="M5 20V19C5 15.6863 7.68629 13 11 13H13C16.3137 13 19 15.6863 19 19V20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
  <svg v-else-if="icon === 'home'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 10L12 3L21 10V20H3V10Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <svg v-else-if="icon === 'people'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 20V19C17 16.2386 14.7614 14 12 14H7C4.23858 14 2 16.2386 2 19V20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="9.5" cy="7.5" r="3.5" stroke="currentColor" stroke-width="1.5"/>
    <path d="M22 20V19C22 16.2386 19.7614 14 17 14H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="17" cy="7.5" r="3.5" stroke="currentColor" stroke-width="1.5"/>
  </svg>
  <svg v-else-if="icon === 'heart'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.54L12 21.35Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
  </svg>
  <svg v-else-if="icon === 'star'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
  </svg>
  <svg v-else-if="icon === 'work'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
    <path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke="currentColor" stroke-width="1.5"/>
  </svg>
  <svg v-else-if="icon === 'book'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="currentColor" stroke-width="1.5"/>
    <path d="M8 8H16M8 12H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
  <svg v-else-if="icon === 'smile'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
    <path d="M8 14C8.5 16 10 17 12 17C14 17 15.5 16 16 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="9" cy="10" r="1" fill="currentColor"/>
    <circle cx="15" cy="10" r="1" fill="currentColor"/>
  </svg>
  <svg v-else-if="icon === 'flower'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8C10 8 8 9.5 8 12C8 14.5 10 16 12 16C14 16 16 14.5 16 12C16 9.5 14 8 12 8Z" stroke="currentColor" stroke-width="1.5"/>
    <path d="M12 4V2M12 22V20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="12" cy="12" r="2" stroke="currentColor" stroke-width="1.5"/>
  </svg>
  <svg v-else-if="icon === 'music'" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18V5L21 3V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.5"/>
    <circle cx="18" cy="16" r="3" stroke="currentColor" stroke-width="1.5"/>
  </svg>
  <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
    <path d="M12 8V12L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
</template>

<script>
export default {
  name: 'SpaceIcon',
  props: { icon: { type: String, default: 'star' } }
}
</script>
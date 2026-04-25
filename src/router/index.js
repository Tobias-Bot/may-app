// filepath: /src/router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'
import SpaceView from '../views/SpaceView.vue'
import MiniAppPage from '../views/MiniAppPage.vue'
import CatalogPage from '../views/CatalogPage.vue'

const router = createRouter({
  history: createWebHashHistory('/may-app/'),
  routes: [
    {
      path: '/',
      redirect: '/space'
    },
    {
      path: '/space/:id',
      name: 'space',
      component: SpaceView,
      props: true
    },
    {
      path: '/catalog/:spaceId',
      name: 'catalog',
      component: CatalogPage,
      props: true
    },
    {
      path: '/mini-apps/:type',
      name: 'mini-app',
      component: MiniAppPage
    }
  ]
})

export default router
import { createRouter, createWebHashHistory } from 'vue-router'
import YaView from '../views/YaView.vue'
import DomView from '../views/DomView.vue'
import BlizkieView from '../views/BlizkieView.vue'
import PeopleView from '../views/PeopleView.vue'
import MiniAppPage from '../views/MiniAppPage.vue'

const router = createRouter({
  history: createWebHashHistory('/may-app/'),
  routes: [
    {
      path: '/',
      redirect: '/ya'
    },
    {
      path: '/ya',
      name: 'ya',
      component: YaView
    },
    {
      path: '/dom',
      name: 'dom',
      component: DomView
    },
    {
      path: '/blizkie',
      name: 'blizkie',
      component: BlizkieView
    },
    {
      path: '/people',
      name: 'people',
      component: PeopleView
    },
    {
      path: '/mini-apps/:type',
      name: 'mini-app',
      component: MiniAppPage
    }
  ]
})

export default router
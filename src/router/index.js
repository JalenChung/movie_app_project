import Vue from 'vue'
import VueRouter from 'vue-router'



const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: () => import('../views/Main.vue'),
    children: [
      {
        path: '/home',
        alias: '',
        name: 'Home',
        component: () => import('../views/Home.vue')
      },
      {
        path: '/movie',
        name: 'Movie',
        component: () => import('../views/Movie.vue')
      },
      {
        path: '/cinema',
        name: 'Cinema',
        component: () => import('../views/Cinema.vue')
      },
      {
        path: '/user',
        name: 'User',
        component: () => import('../views/User.vue')
      },
    ],
  },
  ////////////////////////////////////////////////////////
  {
    path: '/movieDetail',
    name: 'MovieDetail',
    component: () => import('../views/MovieDetail.vue')
  },
  {
    path: '/chooseCinema',
    name: 'ChooseCinema',
    component: () => import('../views/ChooseCinema.vue')
  },
  {
    path: '/selectSession',
    name: 'SelectSession',
    component: () => import('../views/SelectSession.vue')
  },
  {
    path: '/selectSeat',
    name: 'SelectSeat',
    component: () => import('../views/SelectSeat.vue')
  },
  {
    path: '/QRcode',
    name: 'QRcode',
    component: () => import('../views/QRcode.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('../views/Setting.vue')
  },
  {
    path: '/ticketsList',
    name: 'TicketsList',
    component: () => import('../views/TicketsList.vue')
  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import {
  Tabbar,
  TabbarItem,
  Button,
  Popup,
  Cell,
  Area,
  Swipe,
  SwipeItem,
  Lazyload,
  Overlay,
  DropdownMenu,
  DropdownItem,
} from 'vant';
import axios from 'axios'

Vue.prototype.axios = axios;
Vue.config.productionTip = false

Vue
  .use(Tabbar)
  .use(TabbarItem)
  .use(Button)
  .use(Popup)
  .use(Cell)
  .use(Area)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload)
  .use(VideoPlayer)
  .use(Overlay)
  .use(DropdownMenu)
  .use(DropdownItem)
new Vue({
  router,
  store,
  axios,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to,from,next)=>{
  console.log(to);
  let logged = JSON.parse(window.localStorage.getItem("userInfoList"))?.logged
  console.log(logged);
  if (to.path == '/selectSeat' && !logged) {
    next('/login')
  }
  next()
})

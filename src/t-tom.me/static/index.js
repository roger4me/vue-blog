import Vue from 'vue'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'
import vueStore from './vuex/store'
import VueMap from './router'
import App from './app.vue'

Vue.use(VueRouter);

Vue.transition('page-fade', {
  enterClass: 'fadeIn',
  leaveClass: 'fadeOut',
  type: 'animation'
});

Vue.transition('page-slide', {
  enterClass: 'fadeInRight',
  leaveClass: 'fadeOutRight',
  type: 'animation'
});

const router = new VueRouter({
  hashbang: true,
  //history: true,
  saveScrollPosition: false,
  transitionOnLoad: true,
  linkActiveClass: 'v-link-active'
});
Vue.config.debug = process.env.NODE_ENV == "development";

VueMap(router);

sync(vueStore, router);

router.beforeEach(transition => {
  //header是否监听滚动和滚动距离和是否打开小屏幕下的header菜单
  transition.to.router.app.$store.dispatch('SET_HEADER_LIMIT', 0);
  if (transition.to.auth) {
    transition.next();
    console.info('当前路由需要进行身份验证!');
  } else {
    transition.next();
  }
});

router.afterEach(transition=> {
});


router.start(App, "app");

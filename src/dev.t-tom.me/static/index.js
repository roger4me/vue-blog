import Vue from 'vue'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'
import vueStore from './vuex/store'
import VueMap from './router'
import App from './app.vue'

const env = require('../config').env;

Vue.use(VueRouter);

Vue.config.debug = (env == "development");

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

VueMap(router);

sync(vueStore, router);

router.beforeEach(transition => {
  if (transition.to.auth) {
    transition.next();
    console.info('当前路由需要进行身份验证!');
  } else {
    transition.next();
  }
});

router.afterEach(transition=> {
  console.log('成功浏览到:' + transition.to.path);
});


router.start(App, "app");

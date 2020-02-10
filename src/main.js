import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/scss/style.scss'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import VeeValidate from 'vee-validate';
import zhTW from 'vee-validate/dist/locale/zh_TW'
import VueI18n from 'vue-i18n'

import App from './App.vue'
import router from './router'
import './bus'
import currencyFilter from './filters/currency'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(ViewUI);
// Vue.use(Loading);
Vue.component('Loading', Loading);
Vue.filter('currency', currencyFilter);
// Vue.use(VeeValidate);
// VeeValidate.Validator.localize('zh-TW', zhTW);
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'zhTW'
})
Vue.use(VeeValidate, {
  events: 'input|blur', 
  i18n,
  dictionary: {
    zhTW
  }
})

axios.defaults.withCredentials = true;

new Vue({
  i18n,
  el: "#app",
  router,
  render: h => h(App)
}).$mount('#app')


router.beforeEach((to, from, next) => {
  console.log('to', to, 'from', from, 'next', next );  
  // ...
  if(to.meta.requiresAuth){
    const api = `${process.env.VUE_APP_APIPATH}/api/user/check`;
    axios.post(api).then((response) => {    
      console.log(response.data); 
      if(response.data.success){
          // vm.$router.push('/');
          next();  
      }else{
        next({
          path: '/login',
        })
      }
    }) 
    
  }else{    
    next();
  }
  
})


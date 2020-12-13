import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import ant from 'ant-design-vue';
import axios from 'axios';
import 'ant-design-vue/dist/antd.css';
import VueKonva from 'vue-konva' //基于canvas的2d绘图插件 网址：https://konvajs.org/docs/vue/

Vue.prototype.$axios = axios

Vue.use(VueKonva);
Vue.use(ant);
Vue.config.productionTip = false
new Vue({
    router,
    render: h => h(App),
}).$mount('#app')

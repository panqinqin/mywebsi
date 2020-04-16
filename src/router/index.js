import Router from 'vue-router'
import Vue from "vue";

Vue.use(Router);
let menu = [
    {
        path: '/',
        name:"home",
        redirect: '/login',
    },
    {
        path: '/login',
        name:"login",
        component:()=>import("@/views/login.vue"),
        // component: resolve => {
        //     require(['@/views/login.vue'], resolve) //懒加载，预加载
        // }
    }
];

const router = new Router({routes: menu});

export default router;
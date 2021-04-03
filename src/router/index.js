import Router from 'vue-router'
import Vue from "vue";

Vue.use(Router);
let menu = [
    {
        path: '/',
        name:"/",
        redirect: '/login',
    },
    {
        path: '/login',
        name:"login",
        component: resolve => {
            require(['@/views/login.vue'], resolve) //懒加载，预加载
        }
    },
    {
        path: '/home',
        name:"home",
        component: ()=> import ('@/components/empty.vue'),
        children:[
            {
                path: '/loveTrack',
                name:"loveTrack",
                component: resolve => {
                    require(['@/views/codepen/loveTrack.vue'], resolve) //懒加载，预加载
                }
            },
            {
                path: '/images',
                name:"images",
                component: resolve => {
                    require(['@/views/images.vue'], resolve) //懒加载，预加载
                }
            },
            {
                path: '/konva',
                name:"konva",
                component: resolve => {
                    require(['@/views/codepen/konva.vue'], resolve) //懒加载，预加载
                }
            },
            {
                path: '/building',
                name:"building",
                component: resolve => {
                    require(['@/views/building/building.vue'], resolve) //懒加载，预加载
                }
            }
        ]
    },

];

const router = new Router({routes: menu});

export default router;
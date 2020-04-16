<template>
    <div id="app">
        <transition name="fade" mode="out-in">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </transition>
    </div>
</template>

<script>

    export default {
        name: 'App',
        components: {}
    }
</script>

<style>
    #app {
        width: 100%;
        height: 100%;
    }
</style>

<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    import { Component , Vue} from 'vue-property-decorator'

    @Component({
        name: 'App'
    })
    export default class extends Vue {}
</script>


<style>
      #app {
          width: 100%;
          height: 100%;
      }
</style>

<template>
    <div style="width: 100%;height: 100%" class="images">ddddd
        <img :src="require('../views/images/'+item.src)" v-for="(item,index) in images" :key="index"/>
    </div>
    
</template>

<script>
    export default {
        name: "images",
        data(){
            return {
                images:[
                    {src:"微信图片_20201226002736.jpg"},
                    {src:"微信图片_20201226002811.jpg"},
                    {src:"微信图片_20201226002819.jpg"},
                    {src:"微信图片_20201226002826.jpg"},
                    {src:"微信图片_20201226002833.jpg"},
                    {src:"微信图片_20201226002840.jpg"},
                    {src:"微信图片_20201226002847.jpg"},
                    {src:"微信图片_20201226002855.jpg"},
                    {src:"微信图片_20201226002903.jpg"},
                    {src:"微信图片_20201226002911.jpg"},


                    {src:"微信图片_20201226002919.jpg"},
                    {src:"微信图片_20201226002926.jpg"},
                    {src:"微信图片_20201226002948.jpg"},
                    {src:"微信图片_20201226002956.jpg"},
                    {src:"微信图片_20201226003400.jpg"},
                    {src:"微信图片_202012260034001.jpg"},
                    {src:"微信图片_202012260034002.jpg"},
                    {src:"微信图片_202012260034003.jpg"},
                    {src:"微信图片_202012260034004.jpg"},
                    {src:"微信图片_202012260034005.jpg"},



                ]
            }
        }
    }
</script>

<style scoped>
    .images img{
        width: 100%;
        margin-bottom: 20px;
    }
</style>
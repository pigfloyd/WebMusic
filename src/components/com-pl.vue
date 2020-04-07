<template>
    <div class="bg">
        <router-link :to="{name:'playlist-detail',params:{playlistInfo: {id: playlistId, name: name, pic: picUrl, date: date, coverId: coverId}}}">
            <img :src="picUrl === null ? require('../assets/images/cd.png') : picUrl" alt="">
        </router-link>
        <p :title="name">{{ name }}</p>
    </div>
</template>

<script>
export default {
    props:['name', 'picUrl', 'playlistId', 'date', 'coverId']
}
</script>
<style scoped>
    .bg{
        width:170px;
        height:150px;
        text-align: center;
        margin: 2px;
        margin-top:10px; 
    }
    .bg img{
        height:120px;
        width:120px;
        border: 1px solid #dcdcdc;
        box-shadow: 0px 20px 35px -10px  rgba(0, 0, 0, 0.2);
        border-radius: 6px; 
        cursor: pointer;
    }
    .bg p{
        padding: 0;
        margin-top: 8px;
        font-size:12px;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #808080;
    }
</style>
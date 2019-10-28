<template id="album">
    <div class="bg">
        <img :src="picUrl" alt="">
        <p :title="albumName">{{ albumName }}</p>
    </div>
</template>

<script>
export default {
    props:['albumName','picUrl'],
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
        box-shadow: 0px 5px 15px 1px rgba(0, 0, 0, 0.4);
        border-radius: 6px; 
    }
    .bg p{
        padding: 0;
        margin-top: 8px;
        font-size:11px;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
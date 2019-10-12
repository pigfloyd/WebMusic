<template id="album">
    <div class="bg">
        <img :src="picUrl" alt="">
        <p>{{ albumName }}</p>
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

    }
    .bg img{
        height:120px;
        width:120px;
        box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.25);
    }
    .bg p{
        padding: 0;
        margin-top: 8px;
        font-size:15px;
        font-weight: bold;
        font-style: italic;
    }
</style>
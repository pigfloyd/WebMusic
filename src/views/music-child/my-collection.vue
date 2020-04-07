<template>
    <div class="collection-bd">
        <div class="header">我收藏的专辑</div>
        <div class="album">
            <com-album v-for="(item, index) in userAlbum"
                :key="index"
                :name="item.albumName"
                :pic="item.albumPic"
                :albumId="item.albumId">
            </com-album>
        </div>
    </div>
</template>

<script>
import album from '../../components/com-album.vue'
export default {
    props: ['userAlbum'],
    beforeRouteLeave(to, from, next){
        switch(to.name) {
            case 'search': {
                this.$emit('setMenuBtn', 1)
                break
            }
            case 'explore': {
                this.$emit('setMenuBtn', 2)
                break
            }
            case 'my-playlist': {
                this.$emit('setMenuBtn', 3)
                break
            }
            default: break
        }
        next()
    },
    methods: {

    },
    components:{
        'com-album': album,
    }
    
}
</script>

<style scoped>
    .collection-bd{
        height: 100%;
        width: 100%;
        padding: 10px;
    }
     .header {
        height: auto;
        line-height: auto;
        width: 100%;
        font-size: 30px;
        font-weight: bold;
        color: black;
        padding-bottom: 10px;
        border-bottom: 1px solid rgb(235, 235, 235);
    }
    .album {
        padding: 8px;
        display: flex;
        flex-flow:row wrap;
        border-top: 2px solid rgb(235, 235, 235);
        width: 100%;
        height: auto;
    }
</style>
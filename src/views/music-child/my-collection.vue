<template>
    <div class="collection-bd">
        <div class="header">我收藏的专辑</div>
        <div class="album" v-show="currentSelect === 1">
            <album v-for="(item,index) in albumList"
                :key="index"
                :name="item.name"
                >
            </album>
        </div>
    </div>
</template>

<script>
import album from '../../components/com-album.vue'
export default {
    name:'collection',
    data(){
        return{
           isLoginOpen: false
        }
    },
    methods: {
        show() {
            this.isLoginOpen = true
        },
        close() {
            this.isLoginOpen = false
        },
    },
    components:{
        'album': album,
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
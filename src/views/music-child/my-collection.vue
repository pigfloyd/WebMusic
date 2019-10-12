<template>
    <div class="collection">
        <album v-for="(item,index) in count"
            :key="index"
            :albumName="count[index].albumName"
            :picUrl="count[index].picUrl">
        </album>
    </div>
</template>

<script>
import album from '../../components/album.vue'
export default {
    name:'collection',
    data(){
        return{
            count:[
                {id:1,albumName:'Meddle',picUrl:require("../../assets/images/album/meddle.jpg")},
                {id:2,albumName:'The Dark Side of the Moon',picUrl:require("../../assets/images/album/dark.jpg")},
                {id:3,albumName:'Wish You Were Here',picUrl:require("../../assets/images/album/wish.jpg")},
                {id:4,albumName:'The Wall',picUrl:require("../../assets/images/album/wall.jpg")},
                {id:5,albumName:'Pulse',picUrl:require("../../assets/images/album/pulse.jpg")},
                {id:6,albumName:'Nevermind',picUrl:require("../../assets/images/album/mind.jpg")},
            ]
        }
    },
    components:{
        album
    }
    
}
</script>

<style scoped>
    .collection{
        display: flex;
        padding: 11px;
        padding-top: 20px; 
        flex-flow: row wrap;
    }
</style>
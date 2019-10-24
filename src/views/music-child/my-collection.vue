<template>
    <div class="collection-bd">
        <button @click="show">按钮</button>
        <div class="my-collection">
            <com-album v-for="(item,index) in count"
                :key="index"
                :albumName="count[index].albumName"
                :picUrl="count[index].picUrl">
            </com-album>
            <p>sdasd12dadsads,</p>
            <p>sd123sdadsadsaadadsad,s</p>
            <p>撒旦和期望</p>
        </div>
        <transition name="fade">
            <com-login class="my-login" v-if="loginFlag"></com-login>
        </transition>
    </div>
</template>

<script>
import album from '../../components/com-album.vue'
import login from '../../components/com-login.vue'
export default {
    name:'collection',
    data(){
        return{
           loginFlag: false
        }
    },
    methods: {
        show(){
            this.loginFlag = true
        }
    },
    components:{
        'com-album': album,
        'com-login': login
    }
    
}
</script>

<style scoped>
    .collection-bd{
        height: 100%;
        width: 100%;
        padding: 10px;
    }
    .my-collection{
        height: 100%;
        width: 100%;
        display: flex;
        padding: 11px;
        padding-top: 20px; 
        flex-flow: row wrap;
        filter: blur(2px);
    }
    .my-login{
        position: absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0.5;
    }

</style>
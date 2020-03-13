<template>
    <el-scrollbar style="height:100%">
        <div class="pldetail-bd">
            <div class="pl-header">
                <router-link to="/music/my-playlist">
                    <i class="fa fa-arrow-left fa-2x"></i>
                </router-link>
                <span>歌单详情</span>
            </div>
            <vue-loading type="spin" color="#DCDCDC" :size="{ width: '50px', height: '50px' }" v-show="loadFlag" style="margin-top: 200px"></vue-loading>    
            <div class="result" v-show="resultFlag">
                    <div class="desc">
                        <div class="mask"></div>
                        <img src="../../assets/images/test.png" alt="" class="bg-img">
                        <div class="content-left">
                            <img src="../../assets/images/test.png" alt="">
                        </div>
                        <div class="content-right">
                            <p class='title'>用音乐保持你每天的嘴角上扬</p>
                            <p class="create-time">于 2020-03-11 创建</p>
                            <div class="play-all-btn">
                                <i class="fa fa-play"></i>
                                播放全部
                            </div>
                        </div>
                    </div>
                    <table class="table">
                        <thead class="th-color">
                            <tr>
                                <th scope="col"></th>
                                <th scope="col"></th>
                                <th scope="col">歌名</th>
                                <th scope="col">艺术家</th>
                                <th scope="col">专辑</th>
                            </tr>
                        </thead>
                        <transition-group name="fade" tag="tbody">
                            <tr v-for="(item,index) in playListDetail" :key="item"
                            @mouseover="mouseOver(index)"
                            @mouseleave="mouseLeave">
                                <td>
                                    <img src="../../assets/images/cd.png" alt="" v-show="!(index==current)">
                                    <i class="fa fa-play fa-lg play-btn" style="cursor:pointer" v-show="index==current" @click="play(item.id,item.name,item.ar[0].name,item.al.name,item.al.id,index)"></i>
                                </td>
                                <td>
                                    <i class="fa fa-plus fa-lg item" aria-hidden="true" @click="addToList(item)"></i>
                                </td>
                                <td v-text="item.name"></td>
                                <td v-text="item.ar[0].name" @click="goToArtist" class="item"></td>
                                <td v-text="item.al.name" @click="goToAlbum" class="item"></td>
                            </tr>
                        </transition-group>
                    </table>
                </div>
        </div>
    </el-scrollbar>
</template>
<script>
import { VueLoading } from 'vue-loading-template'
export default {
    data(){
        return {
            playListDetail:[],
            loadFlag: true,
            resultFlag: false,
            current:'-1'
        }
    },
    beforeRouteLeave(to, from, next){
        if(to.name === 'my-playlist'){
            from.meta.ifDoFresh = true
            next()
        } else {
            next()
        }
    },
    //重新加载歌单详情数据
    activated() {
        if(this.$route.meta.ifDoFresh){
            this.$route.meta.ifDoFresh = false;
            this.resultFlag = false
            this.loadFlag = true
            this.$axios.get('/playlist/detail?id=' + this.$route.params.playlistId)
            .then(res => {
                var str = ''
                for(let i = 0; i < res.data.privileges.length; i++){
                    str = str + res.data.privileges[i].id + ','
                }
                str = str.slice(0,str.length-1)
                //获取指定歌单详细信息
                return this.$axios.get('/song/detail?ids=' + str)
            })
            .then(res => {
                this.resultFlag = true
                this.loadFlag = false
                this.playListDetail = res.data.songs
                this.$emit('setPl',this.playListDetail)
            })
            .catch(err => {
                console.log(err)
            })
        }
    },
    mounted(){
        this.$axios.get('/playlist/detail?id=' + this.$route.params.playlistId)
        .then(res => {
            var str = ''
            for(let i = 0; i < res.data.privileges.length; i++){
                str = str + res.data.privileges[i].id + ','
            }
            str = str.slice(0,str.length-1)
            //获取指定歌单详细信息
            return this.$axios.get('/song/detail?ids=' + str)
        })
        .then(res => {
            this.resultFlag = true
            this.loadFlag = false
            this.playListDetail = res.data.songs
            this.$emit('setPl',this.playListDetail)
        })
        .catch(err => {
            console.log(err)
        })
    },
    methods:{
        mouseOver(index){
            this.current = index
        },
        mouseLeave(){
            this.current = -1
        },
        //播放歌曲
        play(id,name,art,albumName,albumId,index){
            this.$emit('myBlur')
            this.$emit('setIndex',index)
            var albumPicUrl
            this.$axios.get('/album?id=' + albumId)
            //搜索对应的专辑图片
            .then((res) => {
                albumPicUrl = res.data.album.picUrl
                this.$emit('loadImg',albumPicUrl)
            })
            .catch((err) => {
            console.log(err)
            })
            this.$axios.get('/song/url?id=' + id)
            .then((res) => {
                this.$emit('func',res.data.data[0].url,name,art,albumName,id,index)
            })
            .catch((err) => {
            console.log(err)
            })
        },
        //加入待播列表
        addToList(item){
            this.$emit('addToList', item)
        },
        //转跳到艺术家详情路由
        goToArtist(){
            this.$router.push('artist-detail')
        },
        //转跳到专辑详情路由
        goToAlbum(){
            this.$router.push('album-detail')
        },
    },
    components:{
            VueLoading
    },
}
</script>
<style scoped>
    .pldetail-bd{
        height: 100%;
        min-height: 90vh;
        width: 100%;
        padding: 10px;
        padding-left: 14px;
        box-shadow:inset 0px 0px 15px 1px #DCDCDC;
    }
    .pl-header{
        height: 50px;
        width: 100%;
        background-color: #fff;
    }
    .pl-header span {
        margin-left: 20px; 
        font-size: 28px;
        font-weight: bold;
    }
    tbody{
        font-size:14px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.5);
    }
    tbody tr:hover{
        box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, .19);
    }
    tbody img{
        height:25px;
        width:25px;
    }
    .th-color {
        background-color: rgb(240, 240, 240);
    }
    .result .desc {
        position: relative;
        width: 100%;
        height: 260px;
        overflow: hidden;
        border-radius: 15px 15px 0 0;
    }
    .mask{
        position: absolute;
        top     : 0;
        left    : 0;
        bottom  : 0;
        right   : 0;
        background:rgba(0,0,0,.5);
        z-index: 998;
    }
    .bg-img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        filter: blur(8px);
        background-size: cover;
        zoom: 1.1;
    }
    .content-left {
        position: absolute;
        left: 0;
        width: 30%;
        height: 260px;
        z-index: 999;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .content-left img {
        height: 220px;
        width: 220px;
        border: 1px solid gray;
        box-shadow: 0 0px 25px 2px gray;
    }
    .content-right {
        position: absolute;
        right: 0;
        width: 70%;
        height: 260px;
        z-index: 999;
        padding-top: 16px;
    }
    .content-right .title {
        color: white;
        font-weight: bold;
        font-size: 30px;
    }
    .content-right .create-time {
        color: white;
        font-weight: bold;
        font-size: 22px;
    }
    .content-right .play-all-btn {
        width: 180px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
        border-radius: 4px;
        font-weight: bold;
        color: white;
        background-image: linear-gradient(rgb(255, 99, 71), rgb(220, 64, 36));
        margin-top: 10px;
    }
    .item{
        cursor: pointer;
    }
    .item:hover {
        color: rgb(30, 144, 255);
    }
    .fade-enter-active, .fade-leave-active {
        transition: all 0.7s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
        transform: translateY(-20px);
    }
</style>
<template>
    <el-scrollbar style="height:100%">
        <div class="pldetail-bd">
            <div class="pl-header">
                <router-link to="/music/my-playlist">
                    <i class="fa fa-arrow-left fa-2x"></i>
                </router-link>
                <span>歌单详情</span>
            </div>
            <div class="result">
                    <div class="desc">
                        <div class="mask"></div>
                        <img :src="coverPic === null ? require('../../assets/images/cd.png') : $route.params.playlistInfo.pic" alt="" class="bg-img">
                        <div class="content-left">
                            <img :src="coverPic === null ? require('../../assets/images/cd.png') : $route.params.playlistInfo.pic" alt="">
                        </div>
                        <div class="content-right">
                            <p class='title' v-text="$route.params.playlistInfo.name"></p>
                            <p class="create-time">于 {{ $route.params.playlistInfo.date }} 创建</p>
                            <div class="play-all-btn" @click="play(songInfo[0].song.songId, songInfo[0].song.songName, songInfo[0].artist.singerName, songInfo[0].album.albumName, songInfo[0].song.songPic, 0)">
                                <i class="fa fa-play"></i>
                                播放全部
                            </div>
                            <div class="delete">
                                <div class='delete-btn' @click="showDelete">
                                    <i class="fa fa-trash-o fa-lg" aria-hidden="true"></i> 
                                    {{ deleteText }}
                                </div>
                                <transition name="delete">
                                    <div class="yes-no" v-show="isShowDelete" @click="closeDelete"><i class="fa fa-times fa-lg" aria-hidden="true"></i></div>
                                </transition>
                                <transition name="delete">
                                    <div class="yes-no" v-show="isShowDelete" @click="deletePl"><i class="fa fa-check fa-lg" aria-hidden="true" style="color: #8FBC8F"></i></div>
                                </transition>
                            </div>
                        </div>
                    </div>
                    <vue-loading type="spin" color="#DCDCDC" :size="{ width: '50px', height: '50px' }" v-show="loadFlag" style="margin-top: 140px"></vue-loading>    
                    <table class="table" v-show="resultFlag">
                        <thead class="th-color">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">歌名</th>
                                <th scope="col">艺术家</th>
                                <th scope="col">专辑</th>
                                <th scope="col">操作</th>
                            </tr>
                        </thead>
                        <transition-group name="fade" tag="tbody">
                            <tr v-for="(item, index) in songInfo" :key="item"
                            @mouseover="mouseOver(index)"
                            @mouseleave="mouseLeave">
                                <td>
                                    <img :src="item.song.songPic" alt="" v-show="!(index==current)">
                                    <i class="fa fa-play fa-lg" style="cursor:pointer; margin-right: 10px" v-show="index==current" @click="play(item.song.songId, item.song.songName, item.artist.singerName, item.album.albumName, item.song.songPic, index)"></i>
                                </td>
                                <td v-text="item.song.songName"></td>
                                <td v-text="item.artist.singerName" @click="goToArtist(item.artist.singerId)" class="item"></td>
                                <td v-text="item.album.albumName" @click="goToAlbum(item.album.albumId)" class="item"></td>
                                <td><i class="fa fa-trash-o fa-lg item" aria-hidden="true" @click="unSave(item.id, item.song.songId)"></i></td>
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
            coverPic: '',
            songInfo: [],
            loadFlag: true,
            resultFlag: false,
            current:'-1',
            isShowDelete: false,
            deleteText: '删除歌单',
        }
    },
    beforeRouteLeave(to, from, next){
        if(to.name === 'search'){
            this.$emit('setMenuBtn', 1)
        } else if(to.name === 'explore'){
            this.$emit('setMenuBtn', 2)
        } else if(to.name === 'my-playlist'){
            this.$emit('setMenuBtn', 3)
        } else if(to.name === 'my-collection'){
            this.$emit('setMenuBtn', 4)
        }
        if(to.name !== 'artist-detail' || to.name !== 'album-detail'){
            from.meta.ifDoFresh = true
        } else {
            to.meta.ifDoFresh = true
        }
        next()
    },
    //重新加载歌单详情数据
    activated() {
        if(this.$route.meta.ifDoFresh){
            this.coverPic = this.$route.params.playlistInfo.pic
            this.$route.meta.ifDoFresh = false
            this.resultFlag = false
            this.deleteText = '删除歌单'
            this.isShowDelete = false
            this.loadFlag = true
            this.$axios.get('/api/server/playlistDetail.php/songInfo?playlistId=' + this.$route.params.playlistInfo.id, {
                headers: {
                    'Authorization': this.$cookies.get('token')                         
                }
            })
            .then(res => {
                this.songInfo = res.data.songInfo
                this.resultFlag = true
                this.loadFlag = false
            })
        }
    },
    mounted(){
        this.coverPic = this.$route.params.playlistInfo.pic
        this.$axios.get('/api/server/playlistDetail.php/songInfo?playlistId=' + this.$route.params.playlistInfo.id, {
            headers: {
                'Authorization': this.$cookies.get('token')                         
            }
        })
        .then(res => {
            this.songInfo = res.data.songInfo
            this.resultFlag = true
            this.loadFlag = false
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
        play(id, name, art, albumName, pic, index){
            if(this.songInfo.length !== 0){
                this.$emit('myBlur')
                this.$axios.get('/api/server/song_resource.php/songResource?songId=' + id)
                .then(res => {
                    this.$emit('func', res.data.songUrl, name, art, albumName, id, pic, index)
                    this.$emit('setPl', this.songInfo, false)
                })
                .catch((err) => {
                    console.log(err)
                })
            }
        },
        //转跳到艺术家详情路由
        goToArtist(id){
            this.$router.push({
                name: 'artist-detail',
                params: {
                    singerId: id
                }
            })
        },
        //转跳到专辑详情路由
        goToAlbum(id){
            this.$router.push({
                name: 'album-detail',
                params: {
                    albumId: id
                }
            })        
        },
        //展示删除按钮
        showDelete(){
            this.isShowDelete = !this.isShowDelete
            this.deleteText = '确认删除？'
        },
        //取消删除操作
        closeDelete(){
            this.isShowDelete = false
            this.deleteText = '删除歌单'
        },
        //删除歌单
        deletePl(){
            this.$axios.get('/api/server/deletePlaylist.php/deletePlaylist?playlistId=' + this.$route.params.playlistInfo.id, {
                headers: {
                    'Authorization': this.$cookies.get('token')                         
                }
            })
            .then(res => {
                if(res.data.status === 1){
                    this.$emit('getUserPl')
                    this.$router.push('my-playlist')
                }
            })
        },
        //取消收藏
        unSave(id, songId){
            let refreshId
            //let coverPic
            if(this.songInfo.length === 1){
                refreshId = null
            }
            else if(id === this.$route.params.playlistInfo.coverId){
                refreshId = this.songInfo[this.songInfo.length - 2].id
                //coverPic = this.songInfo[this.songInfo.length - 2].song.songPic
            } else {
                refreshId = 0
            }
            this.$axios.get(`/api/server/deleteSong.php/deleteSong?deleteId=${id}&refreshId=${refreshId}&playlistId=${this.$route.params.playlistInfo.id}`, {
                headers: {
                    'Authorization': this.$cookies.get('token')                         
                }
            })
            .then(res => {
                if(res.data.status === 1){
                    this.songInfo = this.songInfo.filter(item => item.song.songId !== songId)
                    //如果歌单封面改变，则重新获取歌单
                    if(refreshId){
                        this.$emit('getUserPl')
                    } else if(refreshId === null){
                        this.coverPic = null
                        this.$emit('getUserPl')
                    }
                }
            })
            .catch(err => {
                console.log(err)
            })
        }  
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
        background-color: rgb(30, 144, 255);
        color: white;
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
        z-index: 899;
    }
    .bg-img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        filter: blur(8px);
        background-size: cover;
        zoom: 1.4;
    }
    .content-left {
        position: absolute;
        left: 0;
        width: 30%;
        height: 260px;
        z-index: 900;
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
        z-index: 900;
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
        margin-top: 28px;
    }
    .content-right .delete {
        height: auto;
        width: auto;
        display: flex;
        margin-top: 28px;
    }
    .content-right .delete-btn {
        height: 30px;
        line-height: 30px;
        width: 80px;
        font-size: 12px;
        text-align: center;
        font-weight: bold;
        color: grey;
        background-color: white;
        border-radius: 4px;
        cursor: pointer;
    }
    .yes-no {
        color: rgb(255, 99, 71);
        margin-left: 6px;
        height: 30px;
        width: 30px;
        text-align: center;
        line-height: 30px;
        background-color: white;
        font-size: 12px;
        cursor: pointer;
        border-radius: 4px;
    }
    .item{
        cursor: pointer;
    }
    .fade-enter-active, .fade-leave-active {
        transition: all 0.4s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
        transform: translateY(-20px);
    }
    .delete-enter-active, .delete-leave-active {
        transition: all 0.4s;
    }
    .delete-enter, .delete-leave-to {
        opacity: 0;
        transform: translateX(-10px);
    }
    .td img {
        content: url(../../assets/images/cd.png)
    }
</style>
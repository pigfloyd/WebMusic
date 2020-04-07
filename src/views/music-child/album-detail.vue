<template>
    <div class="album-detail-bd">
        <div class="header"><i class="fa fa-arrow-left fa-2x" style="color: rgb(30, 144, 255); cursor: pointer" @click="goBack"></i><span>专辑详情</span></div>
        <vue-loading type="spin" color="#DCDCDC" :size="{ width: '50px', height: '50px' }" v-show="loadFlag" style="margin-top: 200px"></vue-loading>    
        <div class="content" v-show="!loadFlag">
            <div class="left">
                <img :src="albumPic">
                <span class="album-name" v-text="albumName"></span>
                <span class="album-artist">艺术家：{{ albumArtist }}</span>
                <span class="album-artist">发行于 {{ albumRelease }}</span>
                <div class="play-all-btn" @click="playAll">
                    <i class="fa fa-play"></i>
                    播放全部
                </div>
                <div class="my-divider"></div>
                <div class="intro">
                    <div class="title">专辑介绍</div>
                    <div class="text" v-text="albumProfile"></div>
                </div>
            </div>
            <div class="right">
            <div class="r-header">
                <div class="title">共 {{ songs.length }} 首歌</div>
                <div class="collect-btn" @click="collect" v-text="collectText"></div>
            </div>
            <table class="table">
                <thead>
                    <tr class="th-color">
                        <th scope="col">#</th>
                        <th scope="col">歌名</th>
                        <th scope="col">艺术家</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in songs" :key="index">
                        <td>
                            <i class="fa fa-play fa-lg play-btn" @click="playSong(item.song.songId, item.song.songName, item.artist.singerName, albumPic, albumName, index)"></i>
                        </td>
                        <td v-text="item.song.songName"></td>
                        <td v-text="item.artist.singerName"></td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
        <transition name="tip">
            <div class="collect-success" v-show="isCollectOk">
                <i class="fa fa-check-circle fa-lg" aria-hidden="true" style="color: #8FBC8F"></i>
                专辑已收藏
            </div>
        </transition>
        <transition name="tip">
            <div class="collect-success" v-show="isRemove">
                <i class="fa fa-exclamation-circle fa-lg" aria-hidden="true" style="color: rgb(255, 99, 71);"></i>
                已取消收藏
            </div>
        </transition>
    </div>
</template>
<script>
import { VueLoading } from 'vue-loading-template'
const collected = '已收藏'
const collect = '收藏专辑'
export default {
    props: ['userAlbum'],
    data(){
        return {
            loadFlag: true,
            albumPic: '',
            albumName: '',
            albumArtist: '',
            albumRelease: '',
            albumProfile: '',
            songs: [],
            collectText: '',
            isCollectOk: false,
            isRemove: false
        }
    },
    beforeRouteLeave(to, from, next){
        if(to.name === 'my-playlist'){
            if(this.$cookies.isKey("token")){
                this.$emit('setMenuBtn', 3)
                next()
            } else {
                this.$emit('showLogin')
            }
        } else if(to.name === 'my-collection'){
            if(this.$cookies.isKey("token")){
                this.$emit('setMenuBtn', 4)
                next()
            } else {
                this.$emit('showLogin')
            }
        } else if(to.name === 'search'){
            this.$emit('setMenuBtn', 1)
            next()
        } else if(to.name === 'explore'){
            this.$emit('setMenuBtn', 2)
            next()
        } else {
            next()
        }
        from.meta.ifDoFresh = true
    },
    //重新加载专辑信息
    activated(){
        if(this.$route.meta.ifDoFresh){
            if(this.userAlbum.some(item => item.albumId === this.$route.params.albumId)){
                this.collectText = collected
            } else {
                this.collectText = collect
            }
            this.$route.meta.ifDoFresh = false
            this.loadFlag = true
            this.$axios.get('/api/server/album.php/albumInfo?albumId=' + this.$route.params.albumId)
            .then(res => {
                this.albumPic = res.data.album[0].albumPic
                this.albumName = res.data.album[0].albumName
                this.albumArtist = res.data.album[0].albumArtist
                this.albumRelease = res.data.album[0].albumRelease
                this.albumProfile = res.data.album[0].albumProfile
                this.songs = res.data.album[1]
                this.loadFlag = false
            })
        }
    },
    mounted(){
        if(this.userAlbum.some(item => item.albumId === this.$route.params.albumId)){
            this.collectText = collected
        } else {
            this.collectText = collect
        }
        this.$axios.get('/api/server/album.php/albumInfo?albumId=' + this.$route.params.albumId)
        .then(res => {
            this.albumPic = res.data.album[0].albumPic
            this.albumName = res.data.album[0].albumName
            this.albumArtist = res.data.album[0].albumArtist
            this.albumRelease = res.data.album[0].albumRelease
            this.albumProfile = res.data.album[0].albumProfile
            this.songs = res.data.album[1]
            this.loadFlag = false
        })
        .catch(err => {
            console.log(err)
        })
    },
    methods:{
        goBack() {
            this.$router.go(-1)
        },
        playSong(id, name, artist, albumPic, albumName, index) {
            this.$axios.get('/api/server/song_resource.php/songResource?songId=' + id)
            .then(res => {
                this.$emit('func',res.data.songUrl, name, artist, albumName, id, albumPic)
                this.$emit('setPl', this.songs, true)
                this.$emit('setIndex', index)
            })
            .catch((err) => {
                console.log(err)
            })
        },
        playAll() {
            this.$axios.get('/api/server/song_resource.php/songResource?songId=' + this.songs[0].song.songId)
            .then(res => {
                this.$emit('func',res.data.songUrl, this.songs[0].song.songName, this.albumArtist, this.albumName, this.songs[0].song.songId, this.albumPic)
                this.$emit('setPl', this.songs, true)
                this.$emit('setIndex', 0)
            })
            .catch((err) => {
                console.log(err)
            })
        },
        collect(){
            if(this.$cookies.isKey('token')){
                this.$axios.get('/api/server/operateAlbum.php/operateAlbum?albumId=' + this.$route.params.albumId, {
                    headers: {
                        'Authorization': this.$cookies.get('token')        
                    }
                })
                .then(res => {
                    console.log(res.data)
                    if(res.data.status === 1){
                        this.$emit('getUserAlbum')
                        this.collectText = collected
                        this.isCollectOk = true
                        setTimeout(() => {
                            this.isCollectOk = false
                        }, 2000)
                    } else if(res.data.status === 2){
                        this.$emit('getUserAlbum')
                        this.collectText = collect
                        this.isRemove = true
                        setTimeout(() => {
                            this.isRemove = false
                        }, 2000)
                    }
                })
            } else {
                this.$emit('showLogin')
            }
        }
    },
    components: {
        VueLoading
    }
}
</script>
<style scoped>
    .album-detail-bd {
        height: 100%;
        width: 100%;
        padding: 10px;
        padding-left: 14px;
        overflow: auto;
        position: relative;
    }
    .header {
        height: 50px;
        width: 100%;
        background-color: #fff;
        border-bottom: 1px solid rgb(235, 235, 235);
    }
    .header span {
        margin-left: 20px; 
        font-size: 28px;
        font-weight: bold;
    }
    .content {
        height: auto;
        width: 100%;
        min-width: 1000px;
        display: flex;
        position: relative;
    }
    .content .left {
        flex: 4;
        padding-top: 10px;
        flex: flex;
        flex-flow: column wrap;
        text-align: center;
    }
    .content .left img {
        height: 280px;
        width: 280px;
        border-radius: 10px;
        box-shadow: 0px 30px 45px -20px  rgba(0, 0, 0, 0.2);
    }
    .content .left .album-name {
        display: block;
        font-weight: bold;
        font-size: 30px;
        margin-top: 18px;
    }
    .content .left .album-artist {
        margin-top: 4px;
        font-weight: bold;
        color: #A9A9A9;
        display: block;
        font-size: 14px;
    }
    .content .play-all-btn {
        display: inline-block;
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
    .content .left .my-divider {
        width: 320px;
        margin-left: calc((100% - 320px) / 2);
        margin-top: 14px;
        height: 0px;
        border-bottom: 1px solid rgb(235, 235, 235);
    }
    .content .left .intro {
        display: inline-block;
        width: 320px;
        height: auto;
        margin-top: 10px;
    }
    .content .left .intro .title {
        width: 320px;
        padding-left: 1px;
        text-align: start;
        font-size: 14px;
        font-weight: bold;
    }
    .content .left .intro .text {
        padding: 4px;
        width: 320px;
        font-size: 12px;
        text-align: start;
    }
    .content .right {
        flex: 6;
        padding-top: 12px;
    }
    .content .right .r-header {
        display: flex;
        justify-content: space-between;
    }
    .content .right .title {
        margin-bottom: 10px;
        text-align: start;
        font-weight: bold;
        color: #A9A9A9;
        font-size: 18px;
    }
    .th-color {
        color: black;
    }
    .collect-btn {
        height: 30px;
        width: 80px;
        padding: 4px;
        font-size: 14px;
        display: inline-block;
        text-align: center;
        cursor: pointer;
        border-radius: 4px;
        font-weight: bold;
        color: black;
        background-image: linear-gradient(#fff, rgb(230, 230, 230));
        box-shadow: 0 1px 3px 1px  rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
    }
    .play-btn {
        cursor: pointer;
    }
    .collect-success {
        position: absolute;
        right: 10px;
        top: 2%;
        height: 40px;
        line-height: 40px;
        width: auto;
        padding-left: 20px;
        padding-right: 20px;
        border-radius: 6px;
        border: 1px solid #dcdcdc;
        box-shadow: 0 15px 15px -10px rgba(0, 0, 0, .19);
        font-weight: bold;
        text-align: center;
        color: gray;
    }
    .tip-enter-active, .tip-leave-active {
        transition: opacity 0.5s;
    }
    .tip-enter, .tip-leave-to {
        opacity: 0;
    }
</style>
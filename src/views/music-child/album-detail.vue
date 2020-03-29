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
                <div class="collect-btn"><i class="fa fa-plus-square-o fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;收藏</div>
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
    </div>
</template>
<script>
import { VueLoading } from 'vue-loading-template'
export default {
    props: ['loadSongs'],
    data(){
        return {
            loadFlag: true,
            albumPic: '',
            albumName: '',
            albumArtist: '',
            albumRelease: '',
            albumProfile: '',
            songs: [],
        }
    },
    beforeRouteLeave(to, from, next){
        if(to.name === 'search'){
            from.meta.ifDoFresh = true
            next()
        } else {
            next()
        }
    },
    //重新加载专辑信息
    activated(){
        if(this.$route.meta.ifDoFresh){
            this.$route.meta.ifDoFresh = false
            this.loadFlag = true
            this.loadSongs = false
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
                if(!this.loadSongs){
                    this.$emit('setPl', this.songs)
                }
                this.$emit('setIndex', index)
            })
            .catch((err) => {
                console.log(err)
            })
        },
        playAll() {
            this.$axios.get('/api/server/song_resource.php/songResource?songId=' + this.songs[0].song.songId)
            .then(res => {
                console.log(this.songs)
                this.$emit('func',res.data.songUrl, this.songs[0].song.songName, this.albumArtist, this.albumName, this.songs[0].song.songId, this.albumPic)
                if(!this.loadSongs){
                    this.$emit('setPl', this.songs)
                }
                this.$emit('setIndex', 0)
            })
            .catch((err) => {
                console.log(err)
            })
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
</style>
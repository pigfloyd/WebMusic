<template>
    <div class="bd">
        <div class="left-content">
            <div class="list-group">
                <div class="user-content" @click="showLogin">
                    <img :src='user.pic_url' alt="" class="user">
                    <span v-text="user.nickname" v-show="isLogin"></span>
                    <span v-show="!isLogin">登录 / 注册</span>
                </div>
                <router-link to="/music/search" :class="[menuBtn === 1 ? 'my-list clicked' : 'my-list']">
                    <i class="fa fa-search fa-lg" aria-hidden="true"></i>
                </router-link>
                <router-link to="/music/explore" :class="[menuBtn === 2 ? 'my-list clicked' : 'my-list']">发现音乐</router-link>      
                <router-link to="/music/my-playlist" :class="[menuBtn === 3 ? 'my-list clicked' : 'my-list']">我的歌单</router-link>
                <router-link to="/music/my-collection" :class="[menuBtn === 4 ? 'my-list clicked' : 'my-list']">收藏柜</router-link>
            </div>
        </div>
        <div class="right-content">
            <div class="right-content-bg">
                <transition name="login">
                    <com-login v-show="loginFlag" class="my-login" @close="closeLogin" @login="logined" @getUserPl="getUserPl" @getUserAlbum="getUserAlbum"></com-login>
                </transition>
                <transition name="login">
                    <com-user v-show="userFlag" class="my-login" @close="closeUser" @logout="logout" :username="user.nickname"></com-user>
                </transition>
                <router-view ref="child"
                    @func="playSong" 
                    @loadImg="loadImg"
                    @myBlur="myBlur"
                    @setPl="setPl"
                    @setIndex="setIndex"
                    @newPl="newPl"
                    @showLogin="showLogin"
                    @setMenuBtn="setMenuBtn"
                    @getUserPl="getUserPl"
                    :class="{'my-blur' : loginFlag}"
                    :audioId="audio.id"
                    :albumPicUrl="audio.albumPicUrl"
                    :alName="audio.albumName"
                    :sName="audio.name"
                    :artist="audio.art"
                    :userPlaylist="userPlaylist"
                    :userAlbum="userAlbum"
                    v-if="!$route.meta.keepAlive">
                </router-view>
                <keep-alive>
                    <router-view ref="child"
                    @func="playSong" 
                    @setPl="setPl"
                    @loadImg="loadImg"
                    @setIndex="setIndex"
                    @myBlur="myBlur"
                    @getUserPl="getUserPl"
                    @showLogin="showLogin"
                    @setMenuBtn="setMenuBtn"
                    @newPl="newPl"
                    @getUserAlbum="getUserAlbum"
                    :userAlbum="userAlbum"
                    :class="{'my-blur' : loginFlag}"
                    :audioId="audio.id"
                    :albumPicUrl="audio.albumPicUrl"
                    :alName="audio.albumName"
                    :sName="audio.name"
                    :artist="audio.art"
                    :userPlaylist="userPlaylist"
                    v-if="$route.meta.keepAlive">
                </router-view>
                </keep-alive>
            </div>
        </div>
        <div class="bottom-bar">
            <audio 
            ref="audio"
            @timeupdate="onTimeupdate"
            @loadedmetadata="onLoadedmetadata">
                <source :src='audio.url' type=audio/mp3> 
            </audio>
            <div class="song-field">
            <div  class="default-img" v-show="!flag"></div>
            <router-link
            :to="{name:'song-detail',
            params:{id:audio.id, picUrl:audio.albumPicUrl, songName:audio.name, art : audio.art,albumName:audio.albumName }}">
                <transition name="fade">
                    <img  :src='audio.albumPicUrl' alt="" v-show="flag" :class="{'my-blur' : blurFlag }">
                </transition>
            </router-link>
            <div class="song-content">
                <p style="height:17px;line-height:17px;font-size:17px;font-weight:bold;"
                    v-show="flag"
                    :class="{'my-blur' : blurFlag == true}"
                    >
                    {{ audio.name | ellipsis }}
                    </p>
                <p style="opacity: 0.5;" v-text="audio.art" v-show="flag" :class="{'my-blur' : blurFlag == true}"></p>
                <el-slider
                v-show="flag"
                style="margin-left:10px;margin-bottom: 2px"
                v-model="sliderTime"
                :max='audio.duration'
                @change="changeTime"
                :format-tooltip="formatTooltip">
                </el-slider>
            </div>
            </div>
            <div class="btn-field">
                <button class="step-btn" style="margin-right:20px;" @click="prev">
                    <i class="fa fa-step-backward fa-1x"></i>
                </button>  
                <button class="play-btn" @click="play">
                    <i class="fa fa-play fa-lg" v-show="btnPlay" style="margin-left: 3px"></i>
                    <i class="fa fa-pause fa-lg" v-show="!btnPlay"></i>
                </button>
                <button class="step-btn" style="margin-left:20px;" @click="next">
                    <i class="fa fa-step-forward fa-1x"></i>
                </button>
            </div>
            <div class="vol-field">
                <button class="vol-btn" @click="mute">
                    <i class="fa fa-volume-up fa-1x" v-show="btnVol"></i>
                    <i class="fa fa-volume-off fa-1x" v-show="!btnVol"></i> 
                </button>
                <range-slider 
                class="slider"
                min="0"
                max="100"
                step="1"
                v-model="audio.volValue">
                </range-slider>
                <button class="random-btn" @click="switchPlayMode">
                    <i class="fa fa-random fa-1x" v-show="isRandom"></i>
                    <i class="fa fa-arrows-h fa-1x" v-show="isNormal"></i>
                    <i class="fa fa-repeat fa-1x" v-show="isCircle"></i>
                </button>
                 <button :class="[isListOpen ? 'random-btn active' : 'random-btn']" @click="openList">
                    <i class="fa fa-list fa-1x" ></i>
                </button>
            </div>
        </div>
        <transition name="slide" mode="out-in">
            <div class="to-play-list" v-show="isListOpen">
                <div class="header">
                    <div class="title">待播列表</div>
                </div>
                <div class="desc">
                    <span style="font-size: 16px; color: #C0C0C0; font-weight: bold">共 {{ toPlayList.length }} 首歌</span>
                    <div :class="[toPlayList.length === 0 ? 'clear-btn unable' : 'clear-btn']" @click="clearList">
                        <i class="fa fa-trash-o" aria-hidden="true"></i> 
                        清空
                    </div>
                </div>
                <el-scrollbar style="height:100%" ref="listScroll">
                    <table class="table table-striped" v-show="toPlayList.length !== 0">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">歌名</th>
                                <th scope="col">艺术家</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in toPlayList" :key="item">
                                <td>
                                    <i class="fa fa-play-circle" aria-hidden="true" v-show="current === index"></i> 
                                </td>
                                <td>{{ item.song.songName | ellipsis2 }}</td>
                                <td>{{ item.artist.singerName | ellipsis2 }}</td>
                            </tr>
                        </tbody>
                    </table>
                </el-scrollbar>
            </div>  
        </transition>
        <transition name="fade">
            <div class="play-mode-tip" v-show="isTipOpen">
                <span v-text="tips"></span>
                <div class="out"></div>
                <div class="in"></div>
            </div>
        </transition>
        <transition name="regi">
            <div class="register-tip" v-show="isTip2Open" v-text="toast"></div>
        </transition>
        
    </div>
</template>

<script>
import RangeSlider from 'vue-range-slider'
import 'vue-range-slider/dist/vue-range-slider.css'
export default {
    mounted(){
        this.toPlayList = this.regularList
        //检测是否登录
        if(this.$cookies.isKey("token")){
            this.isLogin = true
            this.user.nickname = this.$cookies.get("username")
            this.user.pic_url = require('../assets/images/test.png')
            //获取用户歌单
            this.getUserPl()
            //获取用户收藏专辑
            this.getUserAlbum()
        } else {
            this.user.pic_url = require('../assets/images/user.png')
        }
    },
    name:'music',
    data(){
        return{
            menuBtn: 1,
            btnPlay:true,
            btnVol:true,
            audio:{
                id:'',
                url:'',
                albumPicUrl:'',
                albumId: '',
                albumName:'',
                name:'',
                art:'',
                duration:'',
                currentTime:'0',
                isPlaying:false,
                volValue: 100, 
            },
            user:{
                pic_url:'',
                nickname:''
            },
            flag:false,
            blurFlag:false,
            loginFlag:false,
            sliderTime:'',
            keyWord:'',
            toPlayList: [],
            regularList: [],
            randList: [],
            current: null, //目前歌的索引
            isListOpen: false,
            isTipOpen: false, //控制播放模式提示
            tips: '',
            tipsTimer: null, //提示框定时器
            isTip2Open: false, //注册成功
            toast: '',
            isLogin: false,
            userFlag: false,
            userPlaylist: [], //用户的歌单
            userAlbum: [], //用户收藏的专辑
            isRandom: false,
            isNormal: true,
            isCircle: false
        }
    },
    filters: {
        ellipsis (value) {
            if (!value) return ''
            if (value.length > 33) {
                return value.slice(0,33) + '...'
            }
            return value
        },
        ellipsis2 (value) {
            if (!value) return ''
            if (value.length > 20) {
                return value.slice(0, 20) + '...'
            }
            return value
        }
    },
    components: {
        RangeSlider,
        'com-login': () => import('../components/com-login.vue'),
        'com-user': () => import('../components/com-user.vue')
    },
    methods:{
        //播放
        playSong(url, name, art, albumName, id, albumPic, index){
            this.flag = true
            this.$refs.audio.src = url
            if(albumName !== null){
                this.audio.albumName = albumName
            }
            this.audio.name = name
            if(art !== null){
                this.audio.art = art
            }
            this.audio.id = id
            this.current = index
            this.$refs.audio.play()
            this.audio.isPlaying = true
            this.btnPlay = false
            if(albumPic !== null){
                this.audio.albumPicUrl = albumPic
            }
            this.blurFlag = false
        },
        //加载专辑封面
        loadImg(albumPicUrl){
            this.audio.albumPicUrl = albumPicUrl
            //加载后解除模糊
            this.blurFlag = false
        },
        //模糊封面
        myBlur(){
            this.blurFlag = true
        },
        //自动补零
        refixInteger(num, m) {
            return (Array(m).join(0) + num).slice(-m);
        },
        //格式化时间
        formatTooltip(index){
            var min = Math.floor( index / 60)
            var sec = index - min * 60
            return this.refixInteger(min,2) + ':' + this.refixInteger(sec,2)
        },
        //播放与暂停
        play(){
            if(!this.audio.isPlaying){
                this.$refs.audio.play()
                this.audio.isPlaying = true
                this.btnPlay = false
            }
            else{
                this.$refs.audio.pause()
                this.audio.isPlaying = false
                this.btnPlay = true
            }
        },
        //切到下一首歌
        next(){
            if(this.toPlayList.length >= 2){
                if(this.current == this.toPlayList.length - 1){
                    this.current = 0
                } else {
                    this.current++
                }
                this.playNext(this.current)
            }
        },
        //切到上一首歌
        prev(){
            if(this.toPlayList.length >= 2 ){
                if(this.current == 0){
                    this.current = this.toPlayList.length - 1
                } else {
                    this.current--
                }
                this.playNext(this.current)
            }
        },
        //静音
        mute(){
            this.$refs.audio.muted = !this.$refs.audio.muted
            this.btnVol = !this.btnVol
            if(!this.btnVol){
                this.audio.volValue = 0 
            }
            else{
                this.audio.volValue = 100
            }
        },
        //拖动进度条
        changeTime(index){
            this.$refs.audio.currentTime = index /  this.audio.duration * this.$refs.audio.duration
        },
        //加载歌曲信息
        onLoadedmetadata(){
            this.audio.duration = parseInt(this.$refs.audio.duration) 
        },
        //更新时间
        onTimeupdate(){
            this.audio.currentTime = parseInt(this.$refs.audio.currentTime)
            if(this.$refs.audio.currentTime == this.$refs.audio.duration){
                this.btnPlay = !this.btnPlay
                if(this.isCircle){
                    this.playNext(this.current)
                }
                else if(this.toPlayList.length !== 0){
                    //播放待播列表的下一首
                    this.current++
                    if(this.current == this.toPlayList.length){
                        this.current = 0
                    }
                    this.playNext(this.current)
                }                
            }
            this.sliderTime =  parseInt(this.audio.currentTime) 
            //歌词同步
            for( var i in this.$refs.child.oLRC.ms){
                if( this.audio.currentTime == Math.round(this.$refs.child.oLRC.ms[i].t))
                    this.$refs.child.focusLRC(i)
            }
        },
        //切歌
        playNext(index){
            this.myBlur() //模糊封面
            this.audio.albumId = this.toPlayList[index].song.songId
            this.audio.name = this.toPlayList[index].song.songName
            //获取歌曲信息
            this.$axios.get('/api/server/song_resource.php/songResource?songId=' + this.toPlayList[index].song.songId)
            .then(res => {
                //若是专辑歌单
                if(!this.toPlayList[0].album){
                    this.playSong(res.data.songUrl, 
                    this.toPlayList[index].song.songName, 
                    null,
                    null, 
                    this.toPlayList[index].song.songId,
                    null, 
                    index)
                } 
                //若是用户歌单
                else {
                    this.playSong(res.data.songUrl, 
                    this.toPlayList[index].song.songName, 
                    this.toPlayList[index].artist.singerName,
                    this.toPlayList[index].album.albumName, 
                    this.toPlayList[index].song.songId,
                    this.toPlayList[index].song.songPic, 
                    index)
                }
            })
        },
        //打开登录框或用户框
        showLogin(){
            if(this.isLogin){
                this.userFlag = true
            } else {
                this.loginFlag = true
            }
        },
        //关闭登录框
        closeLogin(){
            this.loginFlag = false
        },
        //关闭用户框
        closeUser(){
            this.userFlag = false
        },
        //登出
        logout(){
            this.userFlag = false
            this.isLogin = false
            this.user.pic_url = require('../assets/images/user.png')
            this.$cookies.remove("token");
            this.$cookies.remove("username");
            this.userPlaylist = []
            this.userAlbum = []
            this.$router.push('explore')
            this.setMenuBtn(2)
        },
        //切换至随机播放模式或正常模式
        switchPlayMode(){
            //切换至随机模式
            if(this.isNormal){
                this.randList.sort(this.random)
                if(this.randList.length > 1 && this.randList.length <= 10){
                    while(JSON.stringify(this.randList) == JSON.stringify(this.regularList)){
                        this.randList.sort(this.random)
                    }
                }
                this.isNormal = false
                this.isRandom = true
                this.toPlayList = this.randList
                this.tips = '随机播放'
            }
            //切换至单曲循环 
            else if(this.isRandom){
                this.isRandom = false
                this.isCircle = true
                this.tips = '单曲循环'
            }
            //切换至顺序模式
            else {
                this.isCircle = false
                this.isNormal = true
                this.toPlayList = this.regularList
                this.tips = '顺序播放'
            }
            //获取当前歌曲索引: 解决 bac abc 问题
            for(let count = 0; count < this.toPlayList.length; count++){
                if(this.audio.id === this.toPlayList[count].song.songId){
                    this.current = count
                    break
                }
            }
            clearTimeout(this.timer)
            this.isTipOpen = true
            this.timer = setTimeout(() => {
                this.isTipOpen = false
            }, 1800)
        },
        //设置待播列表
        setPl(playListDetail){
            this.regularList = this.deepClone(playListDetail)
            this.randList = this.deepClone(playListDetail)
            if(this.isNormal){
                this.toPlayList = this.regularList
            } else {
                this.randList.sort(this.random)
                this.toPlayList = this.randList            
            }
        },
        //生成随机数回调
        random(){
            return Math.random() - 0.5
        },
        //设置当前歌曲索引
        setIndex(index){
            this.current = index
        },
        //深拷贝
        deepClone(obj){
            var o;
            // 如果  他是对象object的话  , 因为null,object,array  也是'object';
            if (typeof obj === 'object') {
                
                // 如果  他是空的话
                if (obj === null) {
                o = null;
                }
                else {
            
                // 如果  他是数组arr的话
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                    o.push(this.deepClone(obj[ i ]));
                    }
                }
                // 如果  他是对象object的话
                else {
                    o = {};
                    for (var j in obj) {
                        o[ j ] = this.deepClone(obj[ j ]);
                    }
                }
                }
            }
            else {
                o = obj;
            }
            return o;
        },
        //打开待播列表
        openList(){
            this.isListOpen = !this.isListOpen
        },
        // //添加至待播列表
        // addToList(item){
        //     if(this.toPlayList.length === 0){
        //         if(this.playModeFlag){
        //             this.toPlayList = this.regularList
        //         } else {
        //             this.toPlayList = this.randList
        //         }
        //     }
        //     let result = {
        //         name: item.name,
        //         ar: [{name: item.artists[0].name}]
        //     }
        //     this.regularList.push(result)
        //     this.randList.push(result)
        // },
        //清空待播列表
        clearList() {
            this.toPlayList = []
            // this.regularList = []
            // this.randList = []
        },
        //登录成功
        logined(username){
            this.toast = '登录成功'
            this.loginFlag = false
            this.isLogin = true
            this.isTip2Open = true
            this.user.nickname = username
            this.user.pic_url = require("@/assets/images/test.png")
            setTimeout(() => {
                this.isTip2Open = false
            }, 3000);
        },
        //获取用户歌单
        getUserPl(){
            //获取用户歌单
            this.$axios.get('/api/server/playlist.php', {
                headers: {
                    'Authorization': this.$cookies.get('token')        
                }
            })
            .then(res => {
                if(!res.data.playlists === null){
                    this.userPlaylist = []
                } else {
                    this.userPlaylist = res.data.playlists
                }
            })
            .catch(err => {
                console.log(err)
            })
        },
        //新增歌单
        newPl(result){
            this.userPlaylist.push(result)
        },
        //设置当前的 menubtn
        setMenuBtn(n){
            this.menuBtn = n
        },
        getUserAlbum(){
            this.$axios.get('/api/server/albumColl.php', {
                headers: {
                    'Authorization': this.$cookies.get('token')        
                }
            })
            .then(res => {
                if(res.data.collections === null){
                    this.userAlbum = []
                } else {
                    this.userAlbum = res.data.collections
                }
            })
        }
    },
    watch: {
        //监听音量
       'audio.volValue':function(){
           this.$refs.audio.volume = this.audio.volValue / 100
           if(this.audio.volValue == 0){
               this.btnVol = false
           }
           if(this.btnVol == false && this.audio.volValue > 0){
               this.btnVol = true
               this.$refs.audio.muted = false
           }
       },
      
    },
}
</script>
<style scoped>
    .bg{
        position: absolute;
        width: 100%;
        height: 100%;
        background-size: 100% ;
        min-width: 1500px;
        min-height:700px;
    }
    .bd{
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }
    .left-content{
        position: absolute;
        background-color: #F5F5F5;
        box-shadow: 0px 2px 2px 0px  rgba(0, 0, 0, 0.2);
        width: 260px;
        height: 100vh;
        left: 0;
        padding: 10px;
        padding-top: 30px;
        border: 1px solid #DCDCDC;
    }
    .left-content .user-content{
        margin-bottom: 10px;
        background-color: #F5F5F5;
        cursor: pointer;
    }
    .left-content .user-content span{
        margin-left:20px;
        font-size: 16px;
        font-weight: bold; 
    }
    .right-content{
        position: absolute;
        background-color: rgb(226, 220, 220);
        width: calc( 100vw - 260px );
        height: 90vh;
        top: 10vh;
        right: 0;
    }
    .right-content-bg{
        position: relative;
        height:100%;
        width:100%;
        background-color: white;
        box-shadow: 0px 0px 15px 0px inset grey;
        border-radius:10px;
        box-shadow:inset 0px 0px 15px 1px #DCDCDC;
    }
    .bottom-bar{
        display: flex;
        position: absolute;
        background-color:white;
        width: calc( 100vw - 260px);
        height: 10vh;
        top: 0;
        right: 0vw;
        text-align: center;
        vertical-align: middle;
        border: 1px solid #DCDCDC;
    }
    .play-btn{
        width:45px;
        height:45px;  
        cursor: pointer;
        text-decoration: none;
        outline: none;
        color: black;
        border: none;
        border-radius: 50%; 
        background-image: linear-gradient(#fff, rgb(230, 230, 230));
        box-shadow: 0 1px 3px 1px  rgba(0, 0, 0, 0.19), inset 0 1px 0 rgba(255, 255, 255, .4);
        line-height: 2px;
    }
    .step-btn{
        width:30px;
        height:30px;
        display: inline-block;
        cursor: pointer;
        text-decoration: none;
        outline: none;
        color: black;
        border: none;
        border-radius: 50%;
        background-image: linear-gradient(#fff, rgb(230, 230, 230));
        box-shadow: 0 1px 3px 1px  rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
        vertical-align: middle;
        line-height: 1px;
        font-size: 13px;
    }
    .vol-btn{
        width:30px;
        height:30px;
        display: inline-block;
        cursor: pointer;
        text-decoration: none;
        outline: none;
        color: black;
        border: none;
        border-radius: 50%;
        background-image: linear-gradient(#fff, rgb(230, 230, 230));
        box-shadow: 0 1px 3px 1px  rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
        vertical-align: middle;
        line-height: 15px;
    }
    .random-btn {
        margin-left: 60px; 
        width:40px;
        height:40px;
        display: inline-block;
        cursor: pointer;
        text-decoration: none;
        outline: none;
        color: black;
        border: none;
        border-radius: 50%;
        background-image: linear-gradient(#fff, rgb(230, 230, 230));
        box-shadow: 0 1px 3px 1px  rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
        vertical-align: middle;
        line-height: 15px;
    }
    .play-btn:active,.step-btn:active{
        background-image: linear-gradient(rgb(238, 238, 238), #fff);
        box-shadow: 0 1px 1px 1px  rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
    }
    .vol-btn:active,.random-btn:active{
        background-image: linear-gradient(rgb(238, 238, 238), #fff);
        box-shadow: 0 1px 1px 1px  rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
    }

    .active {
        background-image: linear-gradient(rgb(238, 238, 238), #fff);
        box-shadow: 0 1px 1px 1px  rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
    }
   
    .vol-field{
        line-height: 9vh;
        width: calc((100vw - 260px) / 3 );
        min-width: 400px;
    }
    .btn-field{
        line-height: 9vh;
        width: calc((100vw - 260px) / 3 );
        min-width: 400px;
    }
    .song-field{
        width: calc((100vw - 260px) / 3 );
        text-align: center;
        min-width: 400px;
    }
    .song-field img{
        float: left;
        width:60px;
        height:60px;
        background-size: 100% ;
        border: none;
        box-shadow: 0px 2px 5px -1px grey;
        margin: 10px;
        margin-top: 5px;
        border-radius: 8px;
    }
    .my-blur{
        filter: blur(4px);
    }
    .song-field .default-img{
        float: left;
        width:60px;
        height:60px;
        background: url(../assets/images/cd.png) no-repeat;
        background-size: 100% ;
        margin: 10px;
        margin-top: 5px; 
    }
    .song-field .song-content{
        float: left;
        width: 290px;
        height: 80px;
        margin-top: 2px;
        text-overflow: ellipsis;
    }
    .song-field .song-content p{
        height:12px;
        line-height: 12px;
        font-size:12px;
        margin: 0px;
        padding: 0px;
        margin-top:6px;
        font-family: 'Franklin Gothic medium', 'Arial Narrow', Arial, sans-serif;
    }
    ::-webkit-input-placeholder { /* WebKit browsers */
        color: lightgray;
        font-size: 16px;
        font-weight: bold;
    }
    .list-group{
        padding: 0px;
        background-color: #F5F5F5;
    }
    .user{
        margin-left: 12px;
        height:60px;
        width:60px;
        border-radius: 50%; 
        box-shadow: 0 1px 3px rgba(0, 0, 0, .19);
        cursor: pointer;
    }
    .my-login{
        position: absolute;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
        z-index: 999;
    }
    .my-list{
        height:50px;
        width:220px;
        line-height:45px;
        vertical-align: center;
        text-align: center;
        text-decoration: none;
        margin-top: 10px;
        margin-left: 10px;
        border: none;
        font-weight: bold;
        background-color: white;
        border-radius: 5px;
        color: black;
        box-shadow: 0 2px 8px -1px  rgba(0, 0, 0, 0.19), inset 0 1px 0 rgba(255, 255, 255, .4);
    }
    .clicked {
        background-image: linear-gradient(rgb(238, 238, 238), #fff);
        box-shadow: 0 1px 1px  1px rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
    }
    .input-group-prepend span{
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 0px 3px 0px  rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);        
    }
    .form-control{
        border: none;
        box-shadow: 0px 0px 5px 1px inset rgba(0, 0, 0, .19);
    }
    .login-enter-active, .login-leave-active {
        transition: opacity .4s;
    }
    .login-enter, .login-leave-to {
        opacity: 0;
    }
    .to-play-list {
        width: 500px;
        height: 90vh;
        background: white;
        position: absolute;
        bottom: 0;
        right: 0;
        box-shadow: -15px 30px 45px 0px  rgba(0, 0, 0, 0.1);
        border-radius: 10px 0 0 10px;
        z-index: 999;
    }
    .to-play-list .header {
        height: 60px;
        width: 100%;
        border-radius: 10px 0 0 0;
        background-image: linear-gradient(rgb(30, 144, 255), rgb(5, 119, 230));
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 15px;
        padding-right: 15px;
    }
    .to-play-list .header .title {
        font-size: 22px;
        font-weight: bold;
        color: white;
    }
    .to-play-list .desc {
        height: 40px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 15px;
        padding-right: 15px;
        border: 1px solid #f5f5f5;
    }
    .clear-btn {
        height: 28px;
        line-height: 28px;
        width: 60px;
        font-size: 12px;
        text-align: center;
        font-weight: bold;
        color: white;
        background-color: rgb(255, 99, 71);
        border-radius: 4px;
        cursor: pointer;
    }
    .slide-enter-active, .slide-leave-active {
        transition: transform .4s ease;
    }
    .slide-enter, .slide-leave-to {
        transform: translateX(500px);
    }
    .fade-enter-active, .fade-leave-active {
        transition: all 0.7s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
        transform: translateY(-20px);
    }
    .regi-enter-active, .fade-leave-active {
        transition: all 0.7s;
    }
    .regi-enter, .fade-leave-to {
        transform: translateY(80px);
    }
    .unable {
        opacity: 0.5;
        cursor: auto;
    }
    .play-mode-tip {
        width:120px;
        height:40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #808080;
        font-weight: bold;
        border:1px solid #DCDCDC;
        background-color: #FFF;
        position: absolute;
        right: 6vw;
        top: 11vh;
        border-radius: 6px;
        box-shadow: 0px 10px 30px -5px rgba(0, 0, 0, .19);
        z-index: 999;
    }
    .play-mode-tip .out,.in {
        position:absolute;
        width: 0;
        height: 0;
    }
    .play-mode-tip .out {
        border:12px solid transparent;
        border-bottom-color: #DCDCDC;
        top:-25px;
        left: 47px;
    }
    .play-mode-tip .in{
        border:11px solid transparent;
        border-bottom-color:#fff;
        top:-22px;
        left: 48px;
    }
    .register-tip {
        width: 160px;
        height:50px;
        text-align: center;
        line-height: 50px;
        color: white;
        font-weight: bold;
        border:1px solid #DCDCDC;
        background-color: #21bf73;
        position: absolute;
        left: 50px;
        bottom: 40px;
        border-radius: 6px;
        box-shadow: 0px 10px 30px -5px rgba(0, 0, 0, .19);
        z-index: 999;
    }
</style>
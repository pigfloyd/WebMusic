<template>
    <div class="bg">
        <div class="bd">
            <div class="left-content">
                <div class="list-group">
                    <div class="user-content">
                        <img :src='user.pic_url' alt="" class="user" @click="showLogin">
                        <span v-text="user.nickname"></span>
                    </div>
                    <router-link to="/music/search" class="my-list" @click.native="closeLogin">
                        <i class="fa fa-search fa-lg" aria-hidden="true"></i>
                    </router-link>
                    <router-link to="/music/my-playlist" class="my-list" @click.native="closeLogin">我的歌单</router-link>
                    <router-link to="/music/my-collection" class="my-list" @click.native="closeLogin">xxxxx</router-link>
                    <router-link to="/music/song" class="my-list" @click.native="closeLogin">xxxxx</router-link>      
                </div>
            </div>
            <div class="right-content">
                <div class="right-content-bg">
                    <transition name="fade">
                        <com-login v-if="loginFlag" class="my-login" @close="closeLogin"></com-login>
                    </transition>
                    <router-view ref="child"
                        @func="playSong" 
                        @loadImg="loadImg"
                        @myBlur="myBlur"
                        @setPl="setPl"
                        @setIndex="setIndex"
                        :class="{'my-blur' : loginFlag}"
                        v-if="!$route.meta.keepAlive">
                    </router-view>
                    <keep-alive>
                        <router-view ref="child"
                        @func="playSong" 
                        @loadImg="loadImg"
                        @myBlur="myBlur"
                        :class="{'my-blur' : loginFlag}"
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
                     v-if="flag"
                     :class="{'my-blur' : blurFlag == true}"
                     >
                        {{ audio.name | ellipsis}}
                     </p>
                    <p style="opacity: 0.5;" v-text="audio.art" v-if="flag" :class="{'my-blur' : blurFlag == true}"></p>
                    <div class="default-p" v-if="!flag"></div>
                    <div class="default-p" style="height:11px;width:140px;margin-left:77px;" v-if="!flag"></div>
                    <el-slider
                    style="margin-left:10px;"
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
                        <i class="fa fa-play fa-lg" v-show="btnPlay"></i>
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
                        <i class="fa fa-random fa-1x" v-show="!playModeFlag"></i>
                        <i class="fa fa-arrows-h fa-1x" v-show="playModeFlag"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import RangeSlider from 'vue-range-slider'
import 'vue-range-slider/dist/vue-range-slider.css'
import login from '../components/com-login.vue'
export default {
    mounted(){
        this.$axios.get('/login/status')
        .then(res => {
            this.user.pic_url = res.data.profile.avatarUrl
            this.user.nickname = res.data.profile.nickname
        }).catch(err => {
            console.log(err)
        })
    },
    name:'music',
    data(){
        return{
            btnPlay:true,
            btnVol:true,
            playModeFlag: true,
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
            current: 0 //目前歌的索引
        }
    },
    filters: {
        ellipsis (value) {
        if (!value) return ''
        if (value.length > 33) {
            return value.slice(0,33) + '...'
        }
        return value
        }
    },
    components: {
        RangeSlider,
        'com-login': login
    },
    methods:{
        //播放
        playSong(url,name,art,albumName,id,index){
            this.flag = true
            this.$refs.audio.src = url
            this.audio.albumName = albumName
            this.audio.name = name
            this.audio.art = art
            this.audio.id = id
            this.current = index
            this.$refs.audio.play()
            this.audio.isPlaying = true
            this.btnPlay = false
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
            if(this.current == this.toPlayList.length -1){
                this.current = 0
                this.playNext(this.current)
            } else {
                this.current++
                this.playNext(this.current)
            }
        },
        //切到上一首歌
        prev(){
            if(this.current == 0){
                this.current = this.toPlayList.length
            } else {
                this.current--
                this.playNext(this.current)
            }
            console.log(this.current)
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
                if(this.toPlayList.length != 0){
                    //播放待播列表的下一首
                    this.current++
                    if(this.current == this.toPlayList.length){
                        this.current = 0
                    }
                    this.playNext(this.current)
                }                
            }
            this.sliderTime =  parseInt(this.audio.currentTime) 
            //匹配时间
            for( var i in this.$refs.child.oLRC.ms){
                if( this.audio.currentTime == Math.round(this.$refs.child.oLRC.ms[i].t))
                    this.$refs.child.focusLRC(i)
            }
        },
        playNext(index){
            this.myBlur() //模糊封面
            this.audio.albumId = this.toPlayList[index].al.id
            this.audio.id = this.toPlayList[index].id
            this.$axios.get('/album?id=' + this.audio.albumId)
            //搜索对应的专辑图片
            .then((res) => {
                this.audio.albumPicUrl = res.data.album.picUrl
                this.loadImg(this.audio.albumPicUrl)
            })
            .catch((err) => {
            console.log(err)
            })
            this.$axios.get('/song/url?id=' + this.audio.id)
            .then((res) => {
                this.playSong(res.data.data[0].url,this.toPlayList[index].name
                ,this.toPlayList[index].ar[0].name,this.toPlayList[index].al.name
                ,this.toPlayList[index].id,index)
            })
            .catch((err) => {
            console.log(err)
            })

        },
        //打开登录框
        showLogin(){
            this.loginFlag = !this.loginFlag
        },
        //关闭登录框
        closeLogin(){
            this.loginFlag = false
        },
        //切换至随机播放模式或正常模式
        switchPlayMode(){
            function random(){
                return Math.random() - 0.5
            }
            if(this.playModeFlag){
                this.randList.sort(random)
                this.toPlayList = this.randList
            } else {
                this.toPlayList = this.regularList
                //获取当前歌曲索引
                for(let count = 0; count < this.regularList.length; count++){
                    if(this.audio.id == this.toPlayList[count].id){
                        this.current = count
                        break
                    }
                }
                
                
            }
            this.playModeFlag = !this.playModeFlag
        },
        //设置待播列表
        setPl(playListDetail){
            this.regularList = this.deepClone(playListDetail)
            this.randList = this.deepClone(playListDetail)
            this.toPlayList = this.regularList
            function random(){
                return Math.random() - 0.5
            }
            if(!this.playModeFlag){
                this.random.sort(random)
                this.toPlayList = this.randList
            } 
        },
        //设置当前歌曲索引
        setIndex(index){
            this.current = index
        },
        //深拷贝
        deepClone(obj){
            return JSON.parse(JSON.stringify(obj))
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
        background: url(../assets/images/wood.png) no-repeat;
        background-size: 100% ;
        min-width: 1500px;
        min-height:700px;
    }
    .bd{
        position: absolute;
        width:1350px;
        height:640px;
        top:50%;
        left:50%;
        transform: translate(-50%, -50%);
        background-color: rgb(226, 220, 220);
        box-shadow: 0px 4px 30px 1px rgba(0, 0, 0, 0.788);
        border-radius: 10px;
    }
    .left-content{
        position: absolute;
        background-color:white;
        box-shadow: 0px 1px 10px 1px rgba(0, 0, 0, .19);
        width:18%;
        height:78%;
        border-radius:10px; 
        left:1%;
        top:2%;
        padding: 10px;
        padding-top: 30px;
    }
    .left-content .user-content{
        margin-bottom: 10px; 
    }
    .left-content .user-content span{
        margin-left:20px;
        font-size: 16px;
        font-weight: bold; 
    }
    .right-content{
        position: absolute;
        background-color: rgb(226, 220, 220);
        width:79%;
        height:78%;  
        right:1%;
        top:2%;
        
    }
    .right-content-bg{
        position: relative;
        height:100%;
        width:100%;
        background-color: white;
        box-shadow: 0px 0px 15px 0px inset grey;
        border-radius:10px;
    }
    .bottom-bar{
        display: flex;
        position: absolute;
        background-color:white;
        width:98%;
        height:16%;
        line-height: 100px;
        bottom: 2%;
        left:1%;
        border-radius:10px; 
        text-align: center;
        vertical-align: middle;
        box-shadow: 0px 0px 10px 0px gray;
    }
    .play-btn{
        width:65px;
        height:65px;  
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
        width:45px;
        height:45px;
        display: inline-block;
        cursor: pointer;
        text-decoration: none;
        outline: none;
        color: black;
        border: none;
        border-radius: 50%;
        background-image: linear-gradient(#fff, rgba(230, 230, 230));
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
        background-image: linear-gradient(#fff, rgba(230, 230, 230));
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
        background-image: linear-gradient(#fff, rgba(230, 230, 230));
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
    .vol-field{
        flex:5;
        height:100px;
    }
    .btn-field{
        flex:5;
        height:100px;
    }
    .song-field{
        flex:5;
        height:100px;
        text-align: center;
    }
    .song-field img{
        float: left;
        width:80px;
        height:80px;
        background-size: 100% ;
        border: none;
        box-shadow: 0px 2px 5px -1px grey;
        margin: 10px;
        margin-top: 12px;
        border-radius: 8px;
    }
    .my-blur{
        filter: blur(2px);
    }
    .song-field .default-img{
        float: left;
        width:80px;
        height:80px;
        background: url(../assets/images/cd.png) no-repeat;
        background-size: 100% ;
        margin: 10px;
        margin-top: 12px; 
    }
    .song-field .song-content{
        float: left;
        width: 290px;
        height: 80px;
        margin-top: 10px;
        text-overflow: ellipsis;
    }
    .song-field .song-content p{
        height:12px;
        line-height: 12px;
        font-size:12px;
        margin: 0px;
        padding: 0px;
        margin-top:10px;
        font-family: 'Franklin Gothic medium', 'Arial Narrow', Arial, sans-serif;
        
    }
    ::-webkit-input-placeholder { /* WebKit browsers */
        color: lightgray;
        font-size: 16px;
        font-weight: bold;
    }
    .list-group{
        padding: 0px;
        background-color: white;
    }
    .user{
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
        border: none;
        font-weight: bold;
        background-color: #fff;
        border-radius: 4px;
        color: black;
        box-shadow: 0 1px 2px 1px  rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, .4);
    }
    .my-list:hover{
        background-color: lightseagreen;
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
    .default-p{
        height:16px;
        width:220px;
        background-color: lightgrey;
        border-radius: 2px;
        margin-left:40px; 
        margin-top: 10px;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .4s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
    .my-blur{
        filter: blur(2px);
    }
   
</style>
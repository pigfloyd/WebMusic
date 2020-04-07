<template>
    <div class="bg2" ref="bg2">
        <div class="lyrics" id="lyrics">
            <div class="left">
                <div class="header"><i class="fa fa-arrow-left fa-2x" style="color: rgb(30, 144, 255); cursor: pointer" @click="goBack"></i></div>
                <div class="song-img">
                    <div class="cd-img"></div>
                    <img alt="" :src="picUrl">
                </div>
                <p>{{songName}}</p>
                <span>艺术家：{{art}}</span>
                <span>专辑：{{albumName}}</span>
                <div class="comments-btn" @click="goToComments">评论区</div>
            </div>
            <div class="right">
                <el-scrollbar style="height:100%; " ref="myScrollbar">
                    <ul> 
                        <li v-for="(item, index) in oLRC.ms" :key="index" class="my-list" :class="{'focus-lrc':current == index}">{{ item.c }}</li>
                    </ul>
                </el-scrollbar>
            </div>
        </div>
        <div class="comments">
            <div class="send-comment clearfix">
                 <div class="input-group mb-3" >
                        <img src="../../assets/images/user.png" alt="" class="avatar">
                        <input ref="search"
                        type="text"
                        style="display: inline-block"
                        class="form-control"
                        placeholder="发表评论"
                        v-model="toSendComment">
                </div>
                <div class="btn-contain">
                    <div class="send-btn" @click="sendComment">发表</div>
                </div>
            </div>
            <com-comment 
                @addComment="addComment"
                v-for="(item, index) in comments"
                :key="index"
                :time="item.commentTime"
                :comment="item.commentCont"
                :username="item.reviewerName"
                :replyCont="item.replyCont"
                :replyName="item.replyName"
                :commentId="item.commentId"
                >
            </com-comment>
        </div>
    </div>
</template>

<script>
import '../../assets/css/song.css'
import comment from '../../components/com-comment.vue'
export default {
    name: 'song',
    data(){
        return{
            oLRC:{
                ar: "", //演唱者
                al: "", //专辑名
                by: "", //歌词制作人
                ms: [] //歌词数组{t:时间,c:歌词}
            },
            myP: 'myP',
            current:null,
            picUrl:'',
            songName:'',
            art:'',
            albumName:'',
            toSendComment: '',
            comments: [],
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
            from.meta.ifDoFresh = true
            this.$emit('setMenuBtn', 1)
            next()
        } else if(to.name === 'explore'){
            this.$emit('setMenuBtn', 2)
            next()
        } else {
            next()
        }
    },
    mounted() {
        //按 id 搜索歌词
        this.$axios.get('/api/server/lyric.php/lyric?songId=' + this.$route.params.id)
            .then((res) => {
                this.createLrcObj(res.data.songLyric)
            })
            .catch((err) => {
                console.log(err)    
            })
        this.picUrl = this.$route.params.picUrl
        this.songName = this.$route.params.songName
        this.art = this.$route.params.art
        this.albumName = this.$route.params.albumName
        //按 id 搜索歌曲评论
        this.getComments()
   },
    methods: {
        //解析lrc
        createLrcObj(lrc){
            if(lrc.length==0) return;
            var lrcs = lrc.split('\n');//用回车拆分成数组
            for(let i in lrcs) {//遍历歌词数组
                lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
                var t = lrcs[i].substring(lrcs[i].indexOf("[") + 1, lrcs[i].indexOf("]"));//取[]间的内容
                var s = t.split(":");//分离:前后文字
                if(isNaN(parseInt(s[0]))) { //不是数值
                    for ( i in this.oLRC) {
                        if (i != "ms" && i == s[0].toLowerCase()) {
                            this.oLRC[i] = s[1];
                        }
                    }
                }else { //是数值
                    var arr = lrcs[i].match(/\[(\d+:.+?)\]/g);//提取时间字段，可能有多个
                    var start = 0;
                    for(var k in arr){
                        start += arr[k].length; //计算歌词位置
                    }
                    var content = lrcs[i].substring(start);//获取歌词内容
                    for ( k in arr){
                         t = arr[k].substring(1, arr[k].length-1);//取[]间的内容
                         s = t.split(":");//分离:前后文字
                        this.oLRC.ms.push({//对象{t:时间,c:歌词}加入ms数组
                            t: (parseFloat(s[0])*60+parseFloat(s[1])).toFixed(3),
                            c: content
                        });
                    }
                }
            }
            // this.oLRC.ms.sort(function (a, b) {//按时间顺序排序
            //     return a.t-b.t;
            // });
        },
        //歌词滚动同步
        focusLRC(index){
            this.current = index
            this.$refs['myScrollbar'].wrap.scrollTop = -240 + index * 48
        },
        //滚动到评论区
        goToComments(){
            this.$refs.bg2.scrollTop = document.getElementById("lyrics").offsetHeight
        },
        //发送评论
        sendComment(){
            if(!this.$cookies.isKey('token')){
                this.$emit('showLogin')
            } else {
                this.$axios.get(`/api/server/addComment.php/addComment?commentCont=${this.toSendComment}&songId=${this.$route.params.id}&replyId=${null}`, {
                    headers: {
                        'Authorization': this.$cookies.get('token')                         
                    }
                })
                .then(res => {
                    console.log(res.data)
                    if(res.data.status === 1){
                        let result = {
                            reviewerName: this.$cookies.get('username'),
                            commentCont: this.toSendComment,
                            commentTime: '刚刚',
                            commentId: res.data.commentId
                        }
                        this.comments.unshift(result)
                        this.toSendComment = ''
                    }
                })
            }  
        },
        addComment(username, time, cont, replyCont, reviewerName, commentId){
            let result = {
                commentCont: cont,
                commentTime: time,
                replyCont: replyCont,
                replyName: username,
                reviewerName: reviewerName,
                commentId: commentId
            }
            this.comments.unshift(result)
        },
        goBack() {
            this.$router.go(-1)
        },
        //获得歌曲评论
        getComments(){
            this.$axios.get(`/api/server/comment.php/showComment?songId=` + this.audioId)
            .then(res => {
                if(res.data.status === 1){
                    this.comments = res.data.commentsInfo
                    this.comments.forEach(item => {
                        if(item.replyId !== null){
                            for(let a of res.data.commentsInfo){
                                if(item.replyId === a.commentId){
                                    item.replyCont = a.commentCont
                                    item.replyName = a.reviewerName
                                    break
                                }
                            }
                        }
                    })
                }
                console.log(this.comments)
            })
        }
    },
    props: ['audioId','albumPicUrl','alName','sName','artist'],
    watch:{
        'audioId': function(){
            this.oLRC.ar = ''
            this.oLRC.al = ''
            this.oLRC.by = ''
            this.oLRC.ms = []
            //按 id 搜索歌词
            this.$axios.get('/api/server/lyric.php/lyric?songId=' + this.audioId)
            .then((res) => {
                this.createLrcObj(res.data.songLyric)
            })
            .catch((err) => {
                console.log(err)    
            })
            //获取评论
            this.getComments()
        },
        'albumPicUrl': function(){
            this.picUrl = this.albumPicUrl
        },
        'alName': function(){
            this.albumName = this.alName
        },
        'sName': function(){
            this.songName = this.sName
        },
        'artist': function(){
            this.art = this.artist
        }
    },
    components: {
        'com-comment': comment
    }
}
</script>

<style scoped>
    .bg2 {
        height:100%;
        width:100%;
        overflow:auto;
    }
    .lyrics{
        display: flex;
        height:100%;
        width:100%;
        text-align: center;
    }
    .comments {
        width:100%;
        height: 300px;
        margin-top: 30px;
    }
    .left{
        height:100%;
        width:40%;  
        padding-top:10px;
        text-align: center;
    }
    .left .header {
        text-align: start;
        height: 50px;
        width: 100%;
        margin-left: 14px;
        margin-top: 5px;
        margin-bottom: 5px;
        background-color: #fff;
    }
    .left .comments-btn {
        display: inline-block;
        margin-top: 13px;
        margin-left: 40px;
        height: 40px;
        width: 200px;
        line-height: 40px;
        font-size: 14px;
        color: black;
        background-color: #fff;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
        border: 1px solid #DCDCDC;
        box-shadow: 0 10px 25px -8px rgba(0, 0, 0, .19);
    }
    .left p{
        margin: 0;
        margin-left: 40px;
        padding: 0;
        margin-top: 105px;
        font-size: 32px;
        text-shadow: 0px 7px 5px lightgray;
        font-weight: bold;
        font-family: 'Franklin Gothic medium', 'Arial Narrow', Arial, sans-serif;
    }
   
    .left span{
        color:black;
        display:block;
        margin-top:10px;
        margin-left: 40px;
        font-weight: bold;
        font-family:  'Franklin Gothic medium' 'Arial Narrow', Arial, sans-serif;
        opacity: 0.5;
    }
    .song-img{
        position: relative;
        height: 250px;
        width:100%;        
    }
    .cd-img{
        height: 330px;
        width: 330px;
        background: url(../../assets/images/cd.png) no-repeat;
        background-size: 100%;
        margin-left: 156px;
        transition: all 0.3s ease;
        z-index: 1;
    }
    .cd-img:hover{
        transform: translateX(20px);
    }
    .song-img img{
        position: absolute; 
        top: -5px;
        left: 100px;  
        height: 340px;
        width:340px;
        border-radius: 15px; 
        box-shadow: 0px 50px 45px -40px  rgba(0, 0, 0, 0.3);
        z-index: 999;
        border: 1px solid #dcdcdc;
    }
    .right{
        height:100%;
        width:60%;
        letter-spacing:0.5px;
    }
    .right ul{
        padding:25px;
    }
    .my-list{
        list-style: none;
        margin: 0px;
        padding: 0px;
        color: rgba(0, 0, 0, 0.877);
        font-size:26px;
        line-height: 48px;
        height: 48px;
        color:rgba(128, 128, 128, 0.75);
    }
    .focus-lrc{
        color:black;
        text-shadow: 0px 7px 5px lightgray;
        font-size:32px;
    }
    .comments {
        height: auto;
        padding: 30px;
    }
    .comments .send-comment {
        height: auto;
        width: 100%;
        margin-bottom: 10px;
    }
    .comments .send-comment .avatar{
        height:60px;
        width:60px;
        border-radius: 50%;
        background-color: #DCDCDC;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .19);
    }
    .comments .send-comment .form-control{
        height: 60px;
        margin-left: 20px;
        border: 1px solid #DCDCDC;
        font-weight: bold;
        border-radius: 7px; 
    }
    .comments .send-comment .btn-contain {
        width: 100%;
        height: auto;
    }
    .comments .send-comment .btn-contain .send-btn {
        float: right;
        width: 90px;
        height: 40px;
        line-height: 40px;  
        text-align: center;  
        cursor: pointer;
        text-decoration: none;
        outline: none;
        color: black;
        border: none;
        border-radius: 4px; 
        font-weight: bold;
        background-image: linear-gradient(#fff, rgb(230, 230, 230));
        box-shadow: 0 1px 3px 1px  rgba(0, 0, 0, 0.19), inset 0 1px 0 rgba(255, 255, 255, .4);
    }
    .comments .send-comment .btn-contain .send-btn:active {
        background-image: linear-gradient(rgb(238, 238, 238), #fff);
        box-shadow: 0 1px 1px 1px  rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
    }
    .clearfix:after {
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }
</style>
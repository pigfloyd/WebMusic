<template>
    <div class="bg2">
        <div class="left">
            <div class="song-img">
                <div class="cd-img"></div>
                <img alt="" :src="picUrl">
            </div>
            <p>{{songName}}</p>
            <span>艺术家：{{art}}</span>
            <span>专辑：{{albumName}}</span>
        </div>
        <div class="right">
            <el-scrollbar style="height:100%" ref="myScrollbar">
                <ul> 
                    <li v-for="(item,index) in oLRC.ms" :key="index" class="my-list" :class="{'focus-lrc':current == index}">{{ item.c }}</li>
                </ul>
            </el-scrollbar>
            
        </div>
    </div>
</template>

<script>
import '../../assets/css/song.css'
export default {
    name:'song',
    data(){
        return{
            lrc:'0',
            oLRC:{
                ar: "", //演唱者
                al: "", //专辑名
                by: "", //歌词制作人
                offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
                ms: [] //歌词数组{t:时间,c:歌词}
            },
            myP:'myP',
            current:null,
            picUrl:'',
            songName:'',
            art:'',
            albumName:''
            
        }
    },
    mounted() {
        //按 id 搜索歌词
        this.$axios.get('/lyric?id=' + this.$route.params.id)
            .then((res) => {
                this.lrc = res.data.lrc.lyric
                this.createLrcObj(this.lrc)

            })
            .catch((err) => {
                console.log(err)    
            })
        this.picUrl = this.$route.params.picUrl
        this.songName = this.$route.params.songName
        this.art = this.$route.params.art
        this.albumName = this.$route.params.albumName

    },
    methods: {
        //解析lrc文本
        createLrcObj(lrc){
            if(lrc.length==0) return;
            var lrcs = lrc.split('\n');//用回车拆分成数组
            for(var i in lrcs) {//遍历歌词数组
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
            this.oLRC.ms.sort(function (a, b) {//按时间顺序排序
                return a.t-b.t;
            });
        },
        //歌词同步
        focusLRC(index){
            this.current = index
            if( index < 10){
                this.$refs['myScrollbar'].wrap.scrollTop = index * 12
            }
            else{
                this.$refs['myScrollbar'].wrap.scrollTop = index * 23
            }
        }
    },
}
</script>

<style scoped>
    .bg2{
        display: flex;
        height:100%;
        width:100%;
        text-align: center;
    }
    .left{
        height:100%;
        width:40%;  
        padding-top:55px;
        text-align: center;
        
    }
    .left p{
        margin: 0;
        padding: 0;
        margin-top: 35px;
        font-size:25px;
        font-weight: bold;
        font-family: 'Franklin Gothic medium', 'Arial Narrow', Arial, sans-serif;
    }
   
    .left span{
        color:black;
        display:block;
        margin-top:10px;
        font-weight: bold;
        font-family:  'Franklin Gothic medium' 'Arial Narrow', Arial, sans-serif;
        opacity: 0.5;
    }
    .song-img{
        height: 250px;
        width:100%;        
    }
    .cd-img{
        height: 248px;
        width: 248px;
        background: url(../../assets/images/cd.png) no-repeat;
        background-size: 100%;
        margin-left: 140px;
        transition: all 0.3s ease;
    }
    .cd-img:hover{
        transform: translateX(20px);
    }
    .song-img img{
        position: absolute; 
        top:52px;
        left: 84px;  
        height: 260px;
        width:260px;
        border-radius: 8px; 
        box-shadow: 0px 8px 30px 5px  rgba(0, 0, 0, 0.35);
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
        line-height:1.5em;
        color:rgba(128, 128, 128, 0.75);
        
    }
    .focus-lrc{
        color:black;
        text-shadow: 0px 7px 5px lightgray;
        font-size:32px;
    }
</style>
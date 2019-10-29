<template>
    <el-scrollbar style="height:100%">
        <div class="load-container load3" v-if="false">
                    <div class="loader"></div>
        </div>
        <div class="mypl-bd" v-show="list_flag">
            <com-pl v-for="(item,index) in playList"
                :key="index"
                :albumName="playList[index].name"
                :picUrl="playList[index].coverImgUrl"
                :playlistId="playList[index].id">
            </com-pl>
        </div>
        <router-view @hide="hide"
                     @func="func"
                     @loadImg="loadImg"
                     @myBlur="myBlur">
        </router-view>
    </el-scrollbar>
</template>
<script>
import play_list from '../../components/com-album.vue'
import '../../assets/css/search.css'
import '../../assets/css/load3.css'
export default {
    created(){
        this.login()
    },
    data(){
        return {
            phoneNum:'15362145526',
            passWord:'',
            flag:'true',
            load_flag:'false',
            list_flag:'true',
            playList:[]
        }
    },
    watch:{
        $route(now,old){
            if(now.path == "/music/my-playlist/playlist-detail" && old.path =="/music/my-playlist"){
                this.list_flag = false
            } else{
                this.list_flag = true
            }
        }
    },
    components:{
        'com-pl':play_list,
    },
    filters: {
        //省略多余字符  
        ellipsis (value) {
        if (!value) return ''
        if (value.length > 56) {
            return value.slice(0,56) + '...'
        }
        return value
        }
    },
    methods:{
        login(){
            //登录
            this.$axios.post('/login/status')
            .then((res) => { 
                return this.$axios.get('/user/playlist?uid=' + res.data.profile.userId)
            }).then((res) => {
                //获取歌单信息
                this.load_flag = !this.load_flag
                this.playList = res.data.playlist
            }).catch(err => {
                console.log(err)
            })
        },
        //播放歌曲
        play(id,name,art,albumName,albumId){
            this.$emit('myBlur')
            var albumPicUrl
            this.$axios.get('/album?id=' + albumId)
            //搜索对应的专辑图片
            .then((res) => {
                albumPicUrl = res.data.album.picUrl
                this.$emit('loadImg',albumPicUrl)
            }).catch((err) => {
                console.log(err)
            })
            this.$axios.get('/song/url?id=' + id)
            .then((res) => {
                this.$emit('func',res.data.data[0].url,name,art,albumName,id)
            })
            .catch((err) => {
            console.log(err)
            })
        },
        hide(){
            this.list_flag = false
        },
        myBlur(){
            this.$emit('myBlur')
        },
        loadImg(albumPicUrl){
            this.$emit('loadImg',albumPicUrl)
        },
        func(url,name,art,albumName,id){
            this.$emit('func',url,name,art,albumName,id)
        }
    }
}
</script>
<style scoped>
    .mypl-bd{
        width: 100%;
        height:100%;
        padding: 10px;
        display: flex;
        flex-flow:row wrap;
    }
    thead{
        font-style:italic;
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
  
    
</style>
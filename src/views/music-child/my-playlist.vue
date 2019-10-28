<template>
    <el-scrollbar style="height:100%">
         <div class="load-container load3" v-if="load_flag">
                    <div class="loader"></div>
        </div>
        <div class="mypl-bd" v-if="!load_flag">
            <com-pl v-for="(item,index) in playList"
                :key="index"
                :albumName="playList[index].name"
                :picUrl="playList[index].coverImgUrl">
            </com-pl>
        </div>
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
            load_flag:'true',
            playList:[]
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
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
            // }).then((res) => {
            //      var str = ''
            //      for(let i = 0; i < res.data.privileges.length; i++){
            //          str = str + res.data.privileges[i].id + ','
            //      }
            //      str = str.slice(0,str.length-1)
            //      //获取指定歌单详细信息
            //      return this.$axios.get('/song/detail?ids=' + str)
            // }).then((res) => {
            //     this.flag = false
            //     this.songsList = res.data.songs
            // }).catch((err) => {
            //     console.log(err)
            // })
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
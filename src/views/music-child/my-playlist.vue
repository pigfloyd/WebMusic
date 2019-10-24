<template>
    <el-scrollbar style="height:100%">
        <div class="mypl-bd">
            <div class="content" v-if="flag">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="输入手机号" v-model="phoneNum">
                </div>
                <div class="input-group mb-3" >
                    <input type="password" class="form-control" placeholder="输入密码" v-model="passWord">
                </div>
                <button type="button" class="my-btn" @click="login">登录</button>
            </div>
            <div class="result" v-if="!flag">
                <table class="table">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col"></th>
                            <th scope="col" >歌名</th>
                            <th scope="col">艺术家</th>
                            <th scope="col">专辑</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in songsList" :key="index">
                            <td>
                                <i class="fa fa-play fa-lg play-btn" style="cursor:pointer;"
                                 @click="play(item.id,item.name,item.ar[0].name,item.al.name,item.al.id)">
                                 </i>
                            </td>
                            <td>{{ item.name | ellipsis}}</td>
                            <td v-text="item.ar[0].name"></td>
                            <td v-text="item.al.name"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </el-scrollbar>
</template>
<script>
export default {
    data(){
        return {
            phoneNum:'15362145526',
            passWord:'',
            flag:'true',
            songList:[]
        }
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
            this.$axios.post('/login/cellphone?phone=' + this.phoneNum + '&password=' + this.passWord)
            .then((res) => { 
                return this.$axios.get('/user/playlist?uid=' + res.data.account.id )
            }).then((res) => {
                //获取歌单信息
                console.log(res)
                return this.$axios.get('/playlist/detail?id=79174219')
            }).then((res) => {
                 var str = ''
                 for(let i = 0; i < res.data.privileges.length; i++){
                     str = str + res.data.privileges[i].id + ','
                 }
                 str = str.slice(0,str.length-1)
                 //获取指定歌单详细信息
                 return this.$axios.get('/song/detail?ids=' + str)
            }).then((res) => {
                this.flag = false
                this.songsList = res.data.songs
            }).catch((err) => {
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
        }
    }
}
</script>
<style scoped>
    .mypl-bd{
        width: 100%;
        height:100%;
        padding: 10px;
    }
    .content{
        width: 400px;
        height:400px;
        text-align: center;
        margin:0 auto;
    }
    .my-btn{
        width:130px;
        height:55px;
        display: inline-block;
        cursor: pointer;
        text-decoration: none;
        outline: none;
        color: white;
        border: none;
        border-radius: 4px;
        background-image: linear-gradient(rgb(66, 184, 131), rgba(36, 154, 101));
        box-shadow: 0 1px 2px 1px  rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
        vertical-align: middle;
        line-height: 1px;
        font-size: 14px;
        font-weight: bold;
    }
    .my-btn:active,.step-btn:active{
        background-image: linear-gradient(rgba(36, 154, 101),rgb(66, 184, 131));
        box-shadow: 0 1px 2px 1px  rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
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
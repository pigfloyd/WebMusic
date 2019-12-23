<template>
    <div class="pldetail-bd">
        <div class="pl-header">
            <router-link to="/music/my-playlist">
                <i class="fa fa-arrow-left fa-2x"></i>
            </router-link>
            <span>歌单详情</span>
        </div>
        <div class="result" v-if="resultFlag">
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
                        <tr v-for="(item,index) in playListDetail" :key="index"
                         @mouseover="mouseOver(index)"
                         @mouseleave="mouseLeave">
                            <td>
                                <img src="../../../assets/images/cd.png" alt="" v-show="!(index==current)">
                                <i class="fa fa-play fa-lg play-btn" style="cursor:pointer" v-show="index==current" @click="play(item.id,item.name,item.ar[0].name,item.al.name,item.al.id,index)"></i>
                            </td>
                            <td v-text="item.name" ></td>
                            <td v-text="item.ar[0].name"></td>
                            <td v-text="item.al.name"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            playListDetail:[],
            resultFlag:'false',
            current:'-1'
        }
    },
    mounted(){
        //刷新该页面时让父路由隐藏
        if(this.$route.path == "/music/my-playlist/playlist-detail"){
            this.$emit('hide')
        }
        this.$axios.get('/playlist/detail?id=' + this.$route.params.playlistId)
        .then(res => {
            var str = ''
            for(let i = 0; i < res.data.privileges.length; i++){
                str = str + res.data.privileges[i].id + ','
            }
            str = str.slice(0,str.length-1)
            //获取指定歌单详细信息
            return this.$axios.get('/song/detail?ids=' + str)
        })
        .then(res => {
            this.resultFlag = true
            this.playListDetail = res.data.songs
            this.$emit('setPl',this.playListDetail)
        })
        .catch(err => {
            console.log(err)
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
        play(id,name,art,albumName,albumId,index){
            this.$emit('myBlur')
            this.$emit('setIndex',index)
            var albumPicUrl
            this.$axios.get('/album?id=' + albumId)
            //搜索对应的专辑图片
            .then((res) => {
                albumPicUrl = res.data.album.picUrl
                this.$emit('loadImg',albumPicUrl)
            })
            .catch((err) => {
            console.log(err)
            })
            this.$axios.get('/song/url?id=' + id)
            .then((res) => {
                this.$emit('func',res.data.data[0].url,name,art,albumName,id,index)
            })
            .catch((err) => {
            console.log(err)
            })
        },
    }
}
</script>
<style scoped>
    .pldetail-bd{
        height:100%;
        width:100%;
        padding: 20px;
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
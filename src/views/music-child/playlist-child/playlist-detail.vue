<template>
    <div class="pldetail-bd">
        <div class="pl-header">
            <router-link to="/music/my-playlist">wqeqwe</router-link>
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
                        <tr v-for="(item,index) in playList" :key="index"
                         @mouseover="mouseOver(index)"
                         @mouseleave="mouseLeave">
                            <td>
                                <img src="../../../assets/images/cd.png" alt="" v-show="!(index==current)">
                                <i class="fa fa-play fa-lg play-btn" style="cursor:pointer" v-show="index==current" @click="play(item.id,item.name,item.ar[0].name,item.al.name,item.al.id)"></i>
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
            playList:'',
            resultFlag:'false',
            current:'-1'
        }
    },
    created(){
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
            this.playList = res.data.songs
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
        play(id,name,art,albumName,albumId){
            this.$emit('myBlur')
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
    .pldetail-bd{
        height:100%;
        width:100%;
        padding: 20px;
    }
    .pl-header{
        height: 80px;
        width: 100%;
        background-color: lightgreen;
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
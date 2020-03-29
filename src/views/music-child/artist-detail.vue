<template>
    <el-scrollbar style="height:100%">
        <div class="artist-detail-bd">
            <div class="header"><i class="fa fa-arrow-left fa-2x" style="color: rgb(30, 144, 255); cursor: pointer" @click="goBack"></i><span>艺术家详情</span></div>
            <div class="desc">
                <img :src="pic" alt="">
                <div class="name" v-text="name"></div>
            </div>
            <div class="title">发行专辑</div>
            <div class="albums">
                <album v-for="(item,index) in albums"
                    :key="index"
                    :name="item.album.albumName"
                    :picUrl="item.album.albumPic"
                    :albumId="item.album.albumId"
                    >
                </album>
            </div>
            <div class="title">简介</div>
            <div class="intro" v-text="profile"></div>
        </div>
    </el-scrollbar>
</template>
<script>
import album from '../../components/com-album.vue'
export default {
    data(){
        return {
            name: '',
            pic: '',
            albums: [],
            profile: ''
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
    activated() {
        this.$axios.get('/api/server/singer.php/singer?singerId=' + this.$route.params.singerId)
        .then(res => {
            this.name = res.data.singer[0].singerName
            this.pic = res.data.singer[0].singerPic
            this.profile = res.data.singer[0].singerProfile
            this.albums = res.data.singer[1]
        })
        .catch(err => {
            console.log(err)
        })
    },
    mounted(){
        this.$axios.get('/api/server/singer.php/singer?singerId=' + this.$route.params.singerId)
        .then(res => {
            this.name = res.data.singer[0].singerName
            this.pic = res.data.singer[0].singerPic
            this.profile = res.data.singer[0].singerProfile
            this.albums = res.data.singer[1]
        })
        .catch(err => {
            console.log(err)
        })
    },
    methods:{
        goBack() {
            this.$router.go(-1)
        }
    },
    components:{
        'album': album,
    },
}
</script>
<style scoped>
    .artist-detail-bd {
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
    .desc {
        width: 100%;
        height: auto;
        display: flex;
        flex-flow: column;
        align-items: center;
        padding-top: 20px;
    }
    .desc img {
        height: 180px;
        width: 180px;
        border-radius: 50%;
        box-shadow: 0 30px 25px -15px rgba(0, 0, 0, 0.2);
        background-size: 100% 100%;
        border: 1px solid #DCDCDC;
    }
    .desc .name {
        font-size: 42px;
        font-weight: bold;
        text-shadow: 0 15px 12px rgba(0, 0, 0, 0.2);
    }
    .albums {
        padding: 8px;
        width: 100%;
        height: auto;
        display: flex;
        flex-flow:row wrap;
    }
    .title {
        font-weight: bold;
        font-size: 20px;
        margin-top: 10px;
        padding-bottom: 2px;
        border-bottom: 1px solid rgb(235, 235, 235);
        width: calc(100% - 70px);
        margin-left: 35px;
    }
    .intro {
        padding-top: 10px;
        width: calc(100% - 70px);
        margin-left: 35px;
        font-size: 16px;
        padding-bottom: 40px;
    }
</style>
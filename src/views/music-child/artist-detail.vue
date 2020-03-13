<template>
    <el-scrollbar style="height:100%">
        <div class="artist-detail-bd">
            <div class="header"><i class="fa fa-arrow-left fa-2x" style="color: rgb(30, 144, 255); cursor: pointer" @click="goBack"></i><span>艺术家详情</span></div>
            <div class="desc">
                <img src="../../assets/images/artist.jpg" alt="">
                <div class="name">Pink Floyd</div>
            </div>
            <div class="title">发行专辑</div>
            <div class="albums">
                <album v-for="(item,index) in albumList"
                    :key="index"
                    :albumName="item.name"
                    >
                </album>
            </div>
            <div class="title">简介</div>
            <div class="intro">平克·弗洛伊德是英国摇滚乐队，他们最初以迷幻与太空摇滚音乐赢得知名度，而后逐渐发展为前卫摇滚音乐。平克·弗洛伊德以哲学的歌词、音速实验、创新的专辑封面艺术与精致的现场表演闻名。他们名列最成功的摇滚乐队之一，并在全球坐拥超过二亿的唱片销售量，其中美国就包办了7450万。</div>
        </div>
    </el-scrollbar>
</template>
<script>
import album from '../../components/com-album.vue'
export default {
    data(){
        return {
            albumList: [
                {
                    name: 'test1'
                },
                {
                    name: 'test2'
                },
                {
                    name: 'test3'
                },
                {
                    name: 'test4'
                },
                {
                    name: 'test4'
                },
                {
                    name: 'test4'
                },
                {
                    name: 'test4'
                },
                {
                    name: 'test4'
                },
                {
                    name: 'test4'
                },
                {
                    name: 'test4'
                },
            ]
        }
    },
    mounted(){
     
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
        font-size: 46px;
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
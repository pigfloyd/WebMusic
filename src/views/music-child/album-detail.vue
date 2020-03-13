<template>
    <div class="album-detail-bd">
        <div class="header"><i class="fa fa-arrow-left fa-2x" style="color: rgb(30, 144, 255); cursor: pointer" @click="goBack"></i><span>艺术家详情</span></div>
        <div class="content">
            <div class="left">
                <img src="../../assets/images/test.png" ref="albumImg">
                <span class="album-name">Jinji Kikko</span>
                <span class="album-artist">艺术家：落日飞车</span>
                <div class="play-all-btn">
                <i class="fa fa-play"></i>
                播放全部
                </div>
                <div class="my-divider"></div>
                <div class="intro">
                    <div class="title">专辑介绍</div>
                    <div class="text">金桔希子是落日飞车沈寂五年后的新作品,在成员的更迭后,重新探索新的曲风,从以往六零年代的车库摇滚晃入了七零年代的成人抒情,但仍然不改飞车轻松惬意,浪漫中又带着戏谑的情境氛围。
                    金桔希子是集结过去、现在与未来的可爱女性角色,爱与昙花一现的具体想像。三首歌都是对她而唱,勃根地红是邀请希子随着微风乘上飞车,凝聚爱的能量,在黄昏的魔幻时刻,就能拥有穿越时空的超能力。第二首歌金桔,时光飞梭到了不可考的时代,这里是人类第一个文明聚落,宫殿里的公主金桔正在轻轻地召那唤能征服时间的恋人。
                    最后一首歌金桔带着纽药回到未来,高度理性化的人类已没有情绪与爱的能力,而纽药就是让人类重新拥有爱的能力的良方。音乐风格受到了七零年代的白人抒情的影响,从Steely Dan, Hall & Oates, Wham, The Alan Parsons Project到Bobby Caldwell都是这张EP的概念原型,也预告了未来飞车可能的音乐路线。</div>
                </div>
            </div>
            <div class="right">
            <div class="r-header">
                <div class="title">共 {{ albumList.length }} 首歌</div>
                <div class="collect-btn"><i class="fa fa-plus-square-o fa-lg" aria-hidden="true"></i>&nbsp;&nbsp;收藏</div>
            </div>
            <table class="table">
                <thead>
                    <tr class="th-color">
                        <th scope="col">#</th>
                        <th scope="col">歌名</th>
                        <th scope="col">时长</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in albumList" :key="index">
                        <td>
                            <i class="fa fa-play fa-lg play-btn"></i>
                        </td>
                        <td v-text="item.name"></td>
                        <td v-text="item.duration"></td>
                    </tr>
                </tbody>
            </table>
            </div>
        </div>
    </div>
</template>
<script>
import ColorThief from '../../../node_modules/colorthief/dist/color-thief.mjs'
export default {
    data(){
        return {
            albumList: [
                {
                    name: 'Burgundy Red',
                    duration: '06:17'
                },
                {
                    name: 'My Jinji',
                    duration: '06:40'
                },
                {
                    name: 'New Drug',
                    duration: '04:44'
                }
            ]
        }
    },
    mounted(){
        //设置专辑图片阴影
        setTimeout(() => {
            const colorThief = new ColorThief();
            let img = this.$refs.albumImg
            let color = colorThief.getColor(img)
            img.style.boxShadow = `0px 30px 45px -10px  rgba(${color[0]}, ${color[1]}, ${color[2]}, 1)`
        }, 0)
    },
    methods:{
        goBack() {
            this.$router.go(-1)
        }
    }
}
</script>
<style scoped>
    .album-detail-bd {
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
    .content {
        height: auto;
        width: 100%;
        min-width: 1000px;
        display: flex;
        position: relative;
    }
    .content .left {
        flex: 4;
        padding-top: 10px;
        flex: flex;
        flex-flow: column wrap;
        text-align: center;
    }
    .content .left img {
        height: 280px;
        width: 280px;
        border-radius: 10px;
        box-shadow: 0px 30px 45px -20px  rgba(0, 0, 0, 0.2);
    }
    .content .left .album-name {
        display: block;
        font-weight: bold;
        font-size: 34px;
        margin-top: 18px;
    }
    .content .left .album-artist {
        font-weight: bold;
        color: #A9A9A9;
        display: block;
        font-size: 14px;
    }
    .content .play-all-btn {
        display: inline-block;
        width: 180px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
        border-radius: 4px;
        font-weight: bold;
        color: white;
        background-image: linear-gradient(rgb(255, 99, 71), rgb(220, 64, 36));
        margin-top: 10px;
    }
    .content .left .my-divider {
        width: 320px;
        margin-left: calc((100% - 320px) / 2);
        margin-top: 14px;
        height: 0px;
        border-bottom: 1px solid rgb(235, 235, 235);
    }
    .content .left .intro {
        display: inline-block;
        width: 320px;
        height: auto;
        margin-top: 10px;
    }
    .content .left .intro .title {
        width: 320px;
        padding-left: 1px;
        text-align: start;
        font-size: 14px;
        font-weight: bold;
    }
    .content .left .intro .text {
        padding: 4px;
        width: 320px;
        font-size: 12px;
        text-align: start;
    }
    .content .right {
        flex: 6;
        padding-top: 12px;
    }
    .content .right .r-header {
        display: flex;
        justify-content: space-between;
    }
    .content .right .title {
        margin-bottom: 10px;
        text-align: start;
        font-weight: bold;
        color: #A9A9A9;
        font-size: 18px;
    }
    .th-color {
        color: black;
    }
    .collect-btn {
        height: 30px;
        width: 80px;
        padding: 4px;
        font-size: 14px;
        display: inline-block;
        text-align: center;
        cursor: pointer;
        border-radius: 4px;
        font-weight: bold;
        color: black;
        background-image: linear-gradient(#fff, rgb(230, 230, 230));
        box-shadow: 0 1px 3px 1px  rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
    }
</style>
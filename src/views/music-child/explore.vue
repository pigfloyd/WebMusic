<template>
    <div class="explore-bd">
        <div class="songs">
          <div class="title">推荐专辑</div>
          <div class="swiper-container">
            <swiper class="swiper" :options="swiperOption">
              <swiper-slide>Slide 1</swiper-slide>
              <swiper-slide>Slide 2</swiper-slide>
              <swiper-slide>Slide 3</swiper-slide>
              <swiper-slide><img src="../../assets/images/test.png" alt="" @click="goToAlbum"></swiper-slide>
              <swiper-slide>Slide 5</swiper-slide>
              <swiper-slide>Slide 6</swiper-slide>
              <swiper-slide>Slide 7</swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </div>
        </div>
        <div class="songs" style="margin-top: 16px">
          <div class="title">推荐单曲</div>
          <div class="songs-content">
            <div class="item" v-for="(item, index) in songs" :key="index" @mouseover="itemHover = index" @mouseleave="itemHover = null">
              <div class="mask" v-show="index === itemHover"><i class="fa fa-play-circle fa-2x" aria-hidden="true" style="color: red"></i></div>
              <div class="left"><img src="../../assets/images/test.png" alt="" :class="[index === itemHover ? 'blur': '']"></div>
              <div class="right">
                <span class="song-name">Time</span>
                <span class="song-art">Pink Floyd</span>
              </div>
            </div>
            
          </div>
        </div>
        <div class="songs" style="margin-top: 16px">
            <div class="title">推荐艺术家</div>
            <div class="song-content" style="padding-top: 10px">
              <div class="art">
                  <img src="../../assets/images/artist.jpg" alt="" @click="goToArtist">
                  <div class="name">Pink Floyd</div>
              </div>
            </div>
        </div>
    </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
    data() {
      return {
        swiperOption: {
          effect: 'coverflow',
          grabCursor: true,
          initialSlide: 3,
          centeredSlides: true,
          slidesPerView: 'auto',
          coverflowEffect: {
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows : true
          },
          pagination: {
            el: '.swiper-pagination'
          },
        },
        itemHover: null,
        songs: [
          {name: '1'},
          {name: '2'},
          {name: '3'},
          {name: '4'},
        ],
        artists: [
          {singerName: 'Pink Floyd'}
        ]
      }
    },
    mounted() {
      
    },
    methods:{
      goToAlbum(){
        this.$router.push('album-detail')
      },
      goToArtist(){
        this.$router.push('artist-detail')
      },
    },
    components: {
      swiper,
      swiperSlide
    },
}
</script>
<style scoped>
    .explore-bd {
        height: 100%;
        width: 100%;
        padding: 10px;
        overflow: auto;
    }
    .songs {
      width: 100%;
      height: auto;
      padding-left: 20px;
      padding-right: 20px;
    }
    .songs .title {
      text-align: start;
      color: gray;
      font-weight: bold;
      font-size: 20px;
      border-bottom: 1px solid rgb(235, 235, 235);
      margin-bottom: 8px;
    }
    .songs .songs-content {
      height: auto;
      width: 100%;
      display: flex;
      flex-flow: wrap;
    }
    .songs .songs-content .item {
      height: 70px;
      width: 50%;
      display: flex;
      position: relative;
    }
    .item .mask {
      position: absolute;
      height: 70px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 70px;
      z-index: 999;
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.2)
    }
    .item .left {
      width: 70px;
      height: 70px;
      margin-right: 10px;
      overflow: hidden;
    }
    .item:nth-child(odd) {
      border: 1px solid #dcdcdc;
      border-right: none;
    }
    .item:nth-child(even) {
      border: 1px solid #dcdcdc;
    }
    .left img {
      height: 70px;
      width: 70px;
    }
    .blur {
      filter: blur(4px);
    }
    .item .right {
      flex: 1;
    }
    .right .song-name {
      display: block;
      line-height: 35px;
      border-bottom: 1px solid #f5f5f5;
      font-weight: bold;
    }
    .right .song-art {
      line-height: 35px;
      font-weight: bold;
      color: gray;
      font-size: 12px;
    }
    .swiper-container {
      width: 100%;
      height: 260px;
    }
    .swiper {
      height: 100%;
      width: 100%;
    }
    .swiper-slide {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 260px;
      height: 260px;
      text-align: center;
      font-weight: bold;
      font-size: 20px;
      background-color: #2C8DFB;
      background-position: center;
      background-size: cover;
      color: white;
    }
    .swiper-slide img {
      height: 260px;
      width: 260px;
    }
    .art {
      width:170px;
      height:150px;
      display: flex;
      flex-flow: column;
      align-items: center;
    }
    .art img {
      height: 120px;
      width: 120px;
      border-radius: 50%;
      box-shadow: 0px 20px 35px -10px  rgba(0, 0, 0, 0.2);
      margin-bottom: 10px;
      cursor: pointer;
    }
    .art .name{
      font-size:12px;
      font-weight: bold;
      color: #808080;
    }
</style>
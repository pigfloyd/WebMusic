<template>
    <div class="explore-bd">
        <div class="header">发现音乐</div>
        <div class="swiper-container">
            <!-- swiper -->
            <swiper :options="swiperOption">
                <img src="../../assets/images/1.jpg" alt="" class="swiper-slide">
                <img src="../../assets/images/2.jpg" alt="" class="swiper-slide">
                <img src="../../assets/images/3.jpg" alt="" class="swiper-slide">
                <img src="../../assets/images/4.jpg" alt="" class="swiper-slide">
                <img src="../../assets/images/5.jpg" alt="" class="swiper-slide">
                <img src="../../assets/images/6.jpg" alt="" class="swiper-slide">
                <div class="swiper-pagination" slot="pagination"></div>
                <div class="swiper-button-prev" slot="button-prev"></div>
                <div class="swiper-button-next" slot="button-next"></div>
            </swiper>
        </div>
    </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import { swiper } from 'vue-awesome-swiper'

export default {
    data() {
      return {
        swiperOption: {
          slidesPerView: 1,
          loop: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        }
      }
    },
    mounted() {
        setInterval(() => {
            if (this.swiperSlides.length < 7) {
                this.swiperSlides.push(this.swiperSlides.length + 1)
            }
        }, 3000)
    },
    methods:{
      
    },
    components: {
        swiper
    },
}
</script>
<style scoped>
    .explore-bd {
        height: 100%;
        width: 100%;
        padding: 10px;
    }
    .header {
        height: auto;
        line-height: auto;
        width: 100%;
        font-size: 30px;
        font-weight: bold;
        color: black;
        padding-bottom: 10px;
        border-bottom: 1px solid rgb(235, 235, 235);
    }
    .swiper-container {
        padding-top: 5px;
        padding-left: 150px;
        padding-right: 150px;
        box-sizing: border-box;
    }
</style>
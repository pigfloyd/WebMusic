<template>
    <el-scrollbar style="height:100%;">
        <div class="search-bd" @click.self="closeKwh">
            <div class="header">
                <div class="input-group mb-3">
                        <input ref="search"
                        type="text"
                        class="form-control"
                        placeholder="搜索歌曲"
                        @click="checkKw"
                        v-model="keyword"
                        v-on:keyup.enter="search">
                        <div class="input-group-prepend">
                            <span
                            @click="search"
                            class="input-group-text"
                            style="cursor: pointer;border-radius:0px 4px 4px 0px;border-left:0px;text-decoration:none;">
                                <i class="fa fa-search" aria-hidden="true"></i>
                            </span>
                        </div>
                </div>
            </div>
            <div class="haha">你可以试着搜索歌曲“诚实”或者专辑“台风”再或者艺术家“野外”。^_^</div>
            <vue-loading type="spin" color="#DCDCDC" :size="{ width: '50px', height: '50px' }" v-show="loadFlag" style="margin-top: 180px"></vue-loading>    
            <div class="result" v-show="flag">
                <div class="selection">
                    <span :class="[currentSelect === 0 ? 'item active' : 'item']" @click="select(0)">歌曲</span>
                    <span :class="[currentSelect === 1 ? 'item active' : 'item']" @click="select(1)">专辑</span>
                    <span :class="[currentSelect === 2 ? 'item active' : 'item']" @click="select(2)">艺术家</span>
                </div>
                <table class="table" v-if="currentSelect === 0" @click="closeKwh">
                    <thead class="th-color">
                        <tr>
                            <th scope="col"></th>
                            <th scope="col"></th>
                            <th scope="col">歌名</th>
                            <th scope="col">艺术家</th>
                            <th scope="col">专辑</th>
                            <th scope="col">收藏</th>
                        </tr>
                    </thead>
                    <transition-group name="fade" tag="tbody">
                        <tr v-for="(item,index) in songs" :key="item"
                         @mouseover="mouseOver(index)"
                         @mouseleave="mouseLeave">
                            <td>
                                <img :src="item.albumPic" alt="" v-show="!(index==current)" class="songPic">
                                <i class="fa fa-play fa-lg play-btn"  v-show="index==current" @click="play(item.songId,item.songName,item.songSinger,item.albumName, item.albumPic)"></i>
                            </td>
                            <td>
                                <i class="fa fa-plus fa-lg item" aria-hidden="true" @click="addToList(item)"></i>
                            </td>
                            <td v-text="item.songName" ></td>
                            <td v-text="item.songSinger" @click="goToArtist" class="item"></td>
                            <td v-text="item.albumName" @click="goToAlbum(item.albumId)" class="item"></td>
                            <td><i class="fa fa-plus-square-o fa-lg item" aria-hidden="true" @click="saveToPl"></i></td>
                        </tr>
                    </transition-group>
                </table>
                <div class="album" v-if="currentSelect === 1">
                    <album v-for="(item,index) in albumList"
                        :key="index"
                        :name="item.albumName"
                        :albumId="item.albumId"
                        :picUrl="item.albumPic"
                        >
                    </album>
                </div>
                <div class="artist" v-if="currentSelect === 2">
                    <div class="art"
                         v-for="(item,index) in artists"
                        :key="index">
                        <img :src="item.singerPic" alt="" @click="goToArtist(item.singerId)">
                        <div class="name">{{ item.singerName}}</div>
                    </div>
                </div>
            </div>
            <transition name="fade2">
                <div class="keywords-bd" v-show="kwhFlag && kwHistory.length !== 0">
                    <div class="tri"></div>
                    <div class="header">
                        <span>历史搜索</span>
                        <div class="icon" @click="deleteHistory">
                            <i class="fa fa-trash-o icon" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div class="content">
                        <span 
                        class="keyword"
                        v-for="(item, index) in kwHistory"
                        :key="index"
                        @click="clickKeyword(item)">
                        {{ item }}
                        </span>
                    </div>
                </div>
            </transition>
        </div>
        <b-modal
            id="my-modal"
            ref="modal"
            title="收藏至歌单"
            @show="resetModal"
            @hidden="resetModal"
            @ok="handleOk"
            >
            <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group
                :state="nameState"
                label="我的歌单"
                label-for="name-input"
                >
                    <b-form-radio v-model="selected" name="some-radios" value="A">Option A</b-form-radio>
                    <b-form-radio v-model="selected" name="some-radios" value="B">Option B</b-form-radio>
                </b-form-group>
            </form>
        </b-modal>
    </el-scrollbar> 
</template>
<script>
import '../../assets/css/search.css'
import { VueLoading } from 'vue-loading-template'
import album from '../../components/com-album.vue'
export default {
    name:'search',
    data(){
        return{
            keyword:'',
            songs:'',
            flag: false,
            loadFlag: false,
            kwhFlag: true,
            kwHistory: [],
            current:'-1',
            currentSelect: 0,
            albumList: [],
            artists: [], 
            selected: ''
        }
    },
    mounted () { 
        this.$refs.search.focus();
        this.kwHistory = JSON.parse(localStorage.getItem('kwHistory'))
        if(this.kwHistory === null){
            this.kwhFlag = false
        } else {
            this.kwhFlag = true
        }
    },
    methods: {
        //搜索歌曲
        search(bool = true){
            if(bool){
                if(localStorage.getItem('kwHistory') === null){
                    let str = JSON.stringify([this.keyword])
                    localStorage.setItem('kwHistory', str)
                } else {
                    let arr = JSON.parse(localStorage.getItem('kwHistory'))
                    if(!arr.some(item => item === this.keyword)){
                        let result = JSON.stringify(arr.concat([this.keyword]))
                        localStorage.setItem('kwHistory', result)
                        this.kwHistory = arr.concat([this.keyword])
                    }
                    
                }
            }
            this.kwhFlag = false
            this.flag = false
            this.loadFlag = true
            if(this.currentSelect === 0){
                this.$axios.get('/api/server/search.php/search?type=1&keywords=' + this.keyword)
                .then((res) => {
                    this.loadFlag = false
                    this.songs = res.data.songs
                    this.flag = true
                    //this.$emit('setPl', this.arr)
                })
                .catch((err) => {
                    console.log(err)
                })
            } else if(this.currentSelect === 1){
                this.$axios.get('/api/server/search.php/search?type=10&keywords=' + this.keyword)
                .then((res) => {
                    this.loadFlag = false
                    this.albumList = res.data.albums
                    this.flag = true
                    //this.$emit('setPl', this.arr)
                })
                .catch((err) => {
                    console.log(err)
                })
            } else {
                this.$axios.get('/api/server/search.php/search?type=100&keywords=' + this.keyword)
                .then((res) => {
                    this.loadFlag = false
                    this.artists = res.data.singers
                    this.flag = true
                    //this.$emit('setPl', this.arr)
                })
                .catch((err) => {
                    console.log(err)
                })
            }
        },
        //点击搜索词
        clickKeyword(kw){
            this.keyword = kw
            this.search(false)
        },
        getImgUrl(id){
            return this.picUrl + id + this.picUrl2
        },
        mouseOver(index){
            this.current = index
        },
        mouseLeave(){
            this.current = -1
        },
        //播放歌曲
        play(id, songName, songSinger, albumName, albumPic){
            this.$emit('myBlur')
            // var albumPicUrl
            // this.$axios.get('http://106.52.206.154:3000/album?id=' + albumId)
            // //搜索对应的专辑图片
            // .then((res) => {
            //     console.log(res.data)
            //     albumPicUrl = res.data.album.picUrl
            //     this.$emit('loadImg',albumPicUrl)
            // })
            // .catch((err) => {
            //     console.log(err)
            // })
            this.$axios.get('/api/server/song_resource.php/songResource?songId=' + id)
            .then((res) => {
                console.log(res.data)
                this.$emit('func', res.data.songUrl, songName, songSinger, albumName, id, albumPic)
            })
            .catch((err) => {
                console.log(err)
            })
        },
        //加入待播列表
        addToList(item){
            console.log('846')
            this.$emit('addToList', item)
        },
        //转跳到艺术家详情路由
        goToArtist(id){
            this.$router.push({
                name: 'artist-detail',
                params: {
                    singerId: id
                }
            })
        },
        //转跳到专辑详情路由
        goToAlbum(id){
            this.$router.push({
                name: 'album-detail',
                params: {
                    albumId: id
                }
            })
        },
        //选择搜索
        select(index){
            this.currentSelect = index
            if(this.currentSelect === 1){
                this.$axios.get('/api/server/search.php/search?type=10&keywords=' + this.keyword)
                .then((res) => {
                    console.log(res.data)
                    this.loadFlag = false
                    this.flag = true
                    this.albumList = res.data.albums
                    //this.$emit('setPl', this.arr)
                })
                .catch((err) => {
                    console.log(err)
                })
            } else {
                this.$axios.get('/api/server/search.php/search?type=100&keywords=' + this.keyword)
                .then((res) => {
                    console.log(res.data)
                    this.loadFlag = false
                    this.flag = true
                    this.artists = res.data.singers
                    //this.$emit('setPl', this.arr)
                })
                .catch((err) => {
                    console.log(err)
                })
            }
        },
        //点击其他地方关闭历史搜索
        closeKwh() {
            this.kwhFlag = false
        },
        checkKw() {
            this.kwhFlag = true
        },
        //删除搜索历史纪录
        deleteHistory() {
            localStorage.setItem('kwHistory', JSON.stringify([]))
            this.kwHistory = []
        },
        checkFormValidity() {
            const valid = this.$refs.form.checkValidity()
            this.nameState = valid
            return valid
        },
        resetModal() {
            this.name = ''
            this.nameState = null
        },
        handleOk(bvModalEvt) {
            // Prevent modal from closing
            bvModalEvt.preventDefault()
            // Trigger submit handler
            this.handleSubmit()
        },
        handleSubmit() {
            // Exit when the form isn't valid
            if (!this.checkFormValidity()) {
                return
            }
            // Hide the modal manually
            this.$nextTick(() => {
                this.$bvModal.hide('my-modal')
            })
        },
        //收藏
        saveToPl() {
            this.$bvModal.show('my-modal')
        }
    },
    components: {
        VueLoading,
        'album': album,
    },
}
</script>
<style scoped>
    .search-bd{
        min-height: 90vh;
        width:100%;
        padding: 20px;
        position: relative;
    }
    .header{
        display: block;
        width:480px;
        height:60px;
        margin: 0 auto;
        padding-top:10px;
    }
    .selection {
        margin: 0 auto;
        margin-bottom: 12px;
        height: 40px;
        width: 480px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border: 1px solid #dcdcdc;
        border-radius: 6px;
    }
    .selection .item {
        height: 40px;
        line-height: 40px;
        width: 160px;
        cursor: pointer;
        color: black;
        text-align: center;
        font-weight: bold;
        box-shadow: 0 1px 3px 0px  rgba(0, 0, 0, 0.19), inset 0 1px 0 rgba(255, 255, 255, .4);
    }
    .selection .item:first-child{
        border-radius: 6px 0 0 6px;
    }
    .selection .item:last-child{
        border-radius: 0 6px 6px 0;
    }
    .selection .item:active{
        background-image: linear-gradient(rgb(240, 240, 240), #fff);
        box-shadow: 0 1px 1px 0px  rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
    }
    .active {
        background-image: linear-gradient(rgb(238, 238, 238), #fff);
        box-shadow: 0 1px 1px 1px  rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
    }
    tbody{
        font-size:14px;
        font-weight: bold;
        color: rgba(0, 0, 0, 0.5);
    }
    tbody tr:hover{
        background-color: rgb(30, 144, 255);
        color: white;
        box-shadow: 0px 1px 4px 1px rgba(0, 0, 0, .19);    
    }
    tbody img{
        height:25px;
        width:25px;
    }
    .form-control{
        border: 1px solid #DCDCDC;
        font-weight: bold;
    }
    .input-group-prepend span{
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 0px 3px 0px  rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);        
    }
    .play-btn{
        color: black;
        cursor: pointer;
    }
    .keywords-bd {
        z-index: 999;
        position: absolute;
        left: 50%;
        top: 80px;
        transform: translateX(-50%);
        height: 400px;
        width: 38%;
        background-color: white;
        border-radius: 10px;
        border:1px solid #dcdcdc;
        box-shadow: 0 30px 45px -20px rgba(0, 0, 0, 0.2);
    }
    .keywords-bd .tri {
        position: absolute;
        top: -7%;
        left: 50%;
        margin-left: -20px;
        height: 0;
        width: 0;
        border: 20px solid transparent;
        border-bottom: 20px solid rgb(30, 144, 255);
    }
    .keywords-bd .header {
        height: 50px;
        width: 100%;
        border-radius: 10px 10px 0 0;
        background-image: linear-gradient(rgb(30, 144, 255), rgb(5, 119, 230));
        color: white;
        font-weight: bold;
        text-align: center;
        font-size: 18px;
        position: relative;
    }
    .keywords-bd .header .icon {
        position: absolute;
        right: 5%;
        top: 50%;
        margin-top: -14px;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
        width: 28px;
        color: white;
        border-radius: 4px;
        background-color: #FA8072;
        box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.5);
    }
    .keywords-bd .content {
        overflow: auto;
    }
    .keywords-bd .content .keyword {
        display: inline-block;
        border: 1px solid rgb(30, 144, 255);
        background-color: rgb(30, 144, 255);
        color: white;
        font-weight: bold;
        border-radius: 8px;
        margin: 10px;
        padding: 5px;
        padding-left: 20px;
        padding-right: 20px;
        cursor: pointer;
    }
    .result .album {
        padding: 8px;
        display: flex;
        flex-flow:row wrap;
        border-top: 2px solid rgb(235, 235, 235);
        width: 100%;
        height: auto;
    }
    .result .artist {
        padding: 8px;
        display: flex;
        flex-flow:row wrap;
        border-top: 2px solid rgb(235, 235, 235);
        width: 100%;
        height: 400px;
    }
    .result .artist .art {
        width:170px;
        height:150px;
        display: flex;
        flex-flow: column;
        align-items: center;
    }
    .result .artist .art img {
        height: 120px;
        width: 120px;
        border-radius: 50%;
        box-shadow: 0px 20px 35px -10px  rgba(0, 0, 0, 0.2);
        margin-bottom: 10px;
        cursor: pointer;
    }
    .result .artist .art .name{
        font-size:12px;
        font-weight: bold;
        color: #808080;
    }
    .item{
        cursor: pointer;
    }
    .th-color {
        color: #FFF;
        background-image: linear-gradient(rgb(30, 144, 255), rgb(5, 119, 230));
    }
    .fade-enter-active, .fade-leave-active {
        transition: all 0.7s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
        transform: translateY(-20px);
    }
    .fade2-enter-active, .fade2-leave-active {
        transition: opacity 0.3s;
    }
    .fade2-enter, .fade2-leave-to {
        opacity: 0;
    }
    .td img {
        content: url(../../assets/images/cd.png)
    }
    .songPic {
        height: 30px;
        width: 30px;
        border-radius: 2px;
    }
    .haha {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 40px;
        color: #dcdcdc;
        font-size: 20px;
        font-weight: bold;
    }
</style>
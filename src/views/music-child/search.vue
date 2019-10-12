<template>
    <el-scrollbar style="height:100%">
        <div class="search-bd">
            <div class="header">
                <div class="input-group mb-3">
                        <input ref="search"
                        type="text"
                        class="form-control"
                        placeholder="搜索歌曲"
                        v-model="keyWord"
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
            <div class="result" v-show="flag">
                <div class="load-container load3" v-show="showFlag">
                    <div class="loader"></div>
                </div>
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
                        <tr v-for="(item,index) in arr" :key="index">
                            <td><img :src='getImgUrl(item.album.picId)' alt=""></td>
                            <td v-text="item.name" ></td>
                            <td v-text="item.artists[0].name"></td>
                            <td v-text="item.album.name"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </el-scrollbar> 
</template>
<script>
import '../../assets/css/search.css'
import '../../assets/css/load3.css'
export default {
    name:'search',
    data(){
        return{
            keyWord:'',
            arr:'',
            flag: false,
            showFlag:false,
            picUrl:'http://p4.music.126.net/JzNK4a5PjjPIXAgVlqEc5Q==/',
            
            picUrl2:'.jpg?param=50y50'
        }
    },
    mounted () { 
        this.$refs.search.focus();
    },
    methods: {
        search(){
            this.showFlag = true
            this.$axios.get('/search?keywords=' + this.keyWord)
            .then((res) => {
                console.log(res.data.result.songs)
                this.showFlag = false
                this.arr = res.data.result.songs
                this.flag = true
            })
            .catch((err) => {
            console.log(err)
            })
        },
        getImgUrl(id){
            return this.picUrl + id + this.picUrl2;
        }

    },
   
}
</script>
<style scoped>
    .search-bd{
        height:100%;
        width:100%;
        padding: 20px;
    }
    .header{
        display: block;
        width:480px;
        height:60px;
        margin: 0 auto;
        padding-top:10px;
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
    .form-control{
        border: none;
        box-shadow: 0px 0px 5px 1px inset rgba(0, 0, 0, .19);
        font-weight: bold;
    }
    .input-group-prepend span{
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 0px 3px 0px  rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);        
    }
    
</style>
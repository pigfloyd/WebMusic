<template>
    <div class="overlay">
        <div class="user-bd">
            <button class="close-btn" @click="close">
                    <i class="fa fa-times" aria-hidden="true"></i> 
            </button>
            <div class="header">
                <span>用户：{{ username }}</span>
            </div>
            <div class="content">
                <div class="logout-btn" @click="logout">登出</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['username'],
    data() {
        
    },
    mounted() {
    },
    methods:{
        close(){
            this.$emit('close')
        },
        logout(){
            this.$emit('logout')
        }
    },

}
</script>
<style scoped>
    .overlay{
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, .3);
    }
    .user-bd {
        width: 400px;
        height: 200px;
        position: relative;
        top: 50%;
        left: 50%;
        margin-left: -200px;
        margin-top: -220px;
        box-shadow: 0 30px 45px -20px rgba(0, 0, 0, .5);
        z-index: 999;
    }
    .header{
        height:60px;
        width:400px;
        border-radius: 12px 12px 0 0; 
        background-image: linear-gradient(rgb(30, 144, 255), rgb(5, 119, 230));
        z-index: 997;
        display: flex;
    }
    .content{
        padding-top: 10px;
        height:140px;
        width:400px;
        padding:20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 0 0 12px 12px; 
        background-color: #fff;
        z-index: 990;
    }
    .header span{
        color: #fff;
        cursor: pointer;
        line-height: 60px;
        flex: 1;
        font-size:18px;
        font-weight: bold;
        text-align: center;
    }
    .close-btn{
        position: absolute;
        right: -6px;
        top: -6px;
        width:30px;
        height:30px;
        border-radius: 80%;
        outline: none;
        border: none;
        background-color: rgb(246, 103, 103);
        box-shadow: 0 1px 2px 1px  rgba(0, 0, 0, .19);
        color: white;
        z-index: 999;
    }
    .logout-btn {
        text-align: center;
        cursor: pointer;
        width:120px;
        height:40px;
        line-height: 40px;
        border-radius: 4px;
        outline: none;
        border: none;
        background-color: rgb(246, 103, 103);
        box-shadow: 0 1px 2px 1px  rgba(0, 0, 0, .19);
        color: white;
        font-weight: bold;
        z-index: 999;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.4s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>
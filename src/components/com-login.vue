<template>
    <div class="overlay">
         <div class="header">
                <span>登录账号</span>
                <button class="close-btn" @click="close">
                    <i class="fa fa-times" aria-hidden="true"></i> 
                </button>
            </div>
        <div class="login-bd">
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="输入手机号" v-model="phoneNum">
            </div>
            <div class="input-group mb-3" >
                <input type="password" class="form-control" placeholder="输入密码" v-model="password">
            </div>
            <button type="button" class="commit-btn" @click="login">登录</button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            phoneNum: '',
            password: ''
        }
    },
    methods:{
        close(){
            this.$emit('close')
        },
        login() {
            this.$axios.post(`/login/cellphone?phone=${this.phoneNum}&password=${this.password}`)
        }
    }
}
</script>
<style scoped>
    .overlay{
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, .5);
        border-radius: 8px;
    }
    .header{
        position: absolute;
        left:50%;
        transform: translate(-50%,140%);
        height:60px;
        width:400px;
        border-radius: 12px 12px 0 0; 
        background-color: rgb(226, 220, 220);
        box-shadow: 0 1px 15px  rgba(0, 0, 0, .5);
        z-index: 2;
    }
    .login-bd{
        position: absolute;
        left:50%;
        transform: translate(-50%,60%);
        height:240px;
        width:400px;
        padding:20px;
        text-align: center;
        border-radius: 0 0 12px 12px; 
        box-shadow: 0 3px 15px  rgba(0, 0, 0, .5);
        background-color: #fff;
        z-index: 1;
    }
    .header span{
        font-size:18px;
        font-weight: bold;
        margin-left: 160px; 
    }
    .form-control{
        font-weight: bold;
        box-shadow: inset 0 0 3px rgba(0, 0, 0, .1);
    }
    .close-btn{
        width:35px;
        height:30px;
        border-radius: 4px;
        outline: none;
        border: none;
        background-color: rgb(246, 103, 103);
        box-shadow: 0 1px 2px 1px  rgba(0, 0, 0, .19);
        color: white;
        margin-left: 105px; 
        margin-top: 15px; 
    }
    .close-btn:hover{
        background-image: linear-gradient(rgb(246, 103, 103), rgba(216, 71, 71));
    }
    .close-btn:active{
        background-image: linear-gradient(rgba(216, 71, 71), rgb(246, 103, 103));
    }
    .commit-btn{
        width:130px;
        height:55px;
        display: inline-block;
        cursor: pointer;
        text-decoration: none;
        outline: none;
        color: white;
        border: none;
        border-radius: 4px;
        background-image: linear-gradient(rgb(66, 184, 131), rgba(36, 154, 101));
        box-shadow: 0 1px 2px 1px  rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
        vertical-align: middle;
        line-height: 1px;
        font-size: 14px;
        font-weight: bold;
    }
    .commit-btn:active,.step-btn:active{
        background-image: linear-gradient(rgba(36, 154, 101),rgb(66, 184, 131));
        box-shadow: 0 1px 2px 1px  rgba(0, 0, 0, .19), inset 0 1px 0 rgba(255, 255, 255, .4);
    }
</style>
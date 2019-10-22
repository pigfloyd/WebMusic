<template>
    <div class="login-bd">
        <div class="content">
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="输入手机号" v-model="keyWord">
            </div>
            <div class="input-group mb-3" >
                <input type="password" class="form-control" placeholder="输入密码" v-model="keyWord">
            </div>
            <div class="input-group mb-3" style="text-align:center;">
                <button type="button" class="btn btn-success">Success</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .login-bd{
        width: 100%;
        height:100%;
        padding-top:70px;
    }
    .content{
        width: 600px;
        height:300px;
        text-align: center;
        border:1px red solid; 
        margin:0 auto;
    }
    .form-control{
        flex-wrap: wrap;
        border: none;
        box-shadow: 0px 0px 5px 1px inset rgba(0, 0, 0, .19);
        font-weight: bold;
    }
  
    
</style>
<template>
    <div class="overlay">
        <div class="login-bd">
            <button class="close-btn" @click="close">
                    <i class="fa fa-times" aria-hidden="true"></i> 
            </button>
            <div class="header">
                <span :class="[flag ? 'active' : '']" @click="switchLogin">登录</span>
                <span :class="[flag ? '' : 'active']" @click="switchRegister">注册</span>
            </div>
            <transition name="fade">
                <div class="fail-tip" v-show="regiFail" v-text="toast">
                </div>  
            </transition>
            <div class="content">
                <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="100px" style="padding-right: 40px;  padding-top: 20px" class="demo-ruleForm" v-show="flag">
                    <el-form-item label="用户名" >
                        <el-input v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
                <el-form :model="regiForm" status-icon :rules="rules" ref="regiForm" label-width="100px" style="padding-right: 40px;" class="demo-regiForm" v-show="!flag">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="regiForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pass">
                        <el-input type="password" v-model="regiForm.pass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="password" v-model="regiForm.checkPass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="register">注册</el-button>
                        <el-button @click="resetForm('regiForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        var checkUsername = (rule, value, callback) => {
            if (!value) {
            return callback(new Error('用户名不能为空'))
            }
            else {
                callback()
            }
        };
        var validatePass = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请输入密码'))
            } else {
            if (this.regiForm.checkPass !== '') {
                this.$refs.regiForm.validateField('checkPass');
            }
            callback()
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请再次输入密码'))
            } else if (value !== this.regiForm.pass) {
            callback(new Error('两次输入密码不一致!'))
            } else {
            callback()
            }
        };
        return {
            flag: true,
            loginForm: {
                password: '',
                username: ''
            },
            regiForm: {
                pass: '',
                checkPass: '',
                username: ''
            },
            rules: {
                pass: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
                username: [
                    { validator: checkUsername, trigger: 'blur' }
                ]
            },
            regiFail: false,
            toast: '',
        }
    },
    mounted() {
    },
    methods:{
        close(){
            this.$refs['loginForm'].resetFields()
            this.$refs['regiForm'].resetFields()
            this.$emit('close')
        },
        switchLogin() {
            this.flag = true
        },
        switchRegister() {
            this.flag = false
        },
        login(){
            this.$refs['loginForm'].validate((valid) => {
                if (valid) {
                    let params = new URLSearchParams();
                    params.append('username', this.loginForm.username)
                    params.append('password', this.loginForm.password)
                    this.$axios.post('/api/server/login.php', params)
                    .then(res => {
                        if(res.data.logintype === 1){
                            this.$refs['loginForm'].resetFields();
                            localStorage.setItem('token', JSON.stringify(res.data.token))
                            localStorage.setItem('username', JSON.stringify(res.data.account.userName))
                            console.log(localStorage.getItem('username'))
                            this.$emit('login', res.data.account.userName)
                        } else {
                            this.toast = '用户名或密码错误，登录失败！'
                            this.regiFail = true
                            setTimeout(() => {
                                this.regiFail = false
                            }, 2500)
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                } else {
                    return false;
                }
            });
            this.$refs['loginForm'].resetFields();
        },
        register() {
            this.$refs['regiForm'].validate((valid) => {
                if (valid) {
                    let params = new URLSearchParams();
                    params.append('username', this.regiForm.username)
                    params.append('password', this.regiForm.pass)
                    this.$axios.post('/api/server/register.php', params)
                    .then(res => {
                        console.log(res.data)
                        if(res.data.status === 2){
                            this.$refs['regiForm'].resetFields();
                            return this.$axios.post('/api/server/login.php', params)
                        } else {
                            this.toast = '用户名已注册，注册失败！'
                            this.regiFail = true
                            setTimeout(() => {
                                this.regiFail = false
                            }, 2500)
                        }
                    })
                    .then(res => {
                        console.log(res.data)
                        localStorage.setItem('token', JSON.stringify(res.data.token))
                        localStorage.setItem('username', JSON.stringify(res.data.account.userName))
                        this.$emit('login', res.data.account.userName)
                    })
                    .catch(err => {
                        console.log(err)
                    })
                } else {
                    return false
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
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
    .login-bd {
        width: 400px;
        height: 340px;
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
        height:280px;
        width:400px;
        padding:20px;
        text-align: center;
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
    .active {
        border-bottom: 3px solid white;
    }
    .form-control{
        font-weight: bold;
        box-shadow: inset 0 0 3px rgba(0, 0, 0, .1);
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
        background-color: rgb(66, 184, 131);
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
    .fail-tip {
        font-weight: bold;
        position: absolute;
        top: 0;
        height:60px;
        line-height: 60px;
        width:400px;
        border-radius: 12px 12px 0 0; 
        color: white;
        text-align: center;
        background-color: rgb(246, 103, 103);
        background-image: linear-gradient(rgb(246, 103, 103), rgb(221, 78, 78));
        z-index: 998;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.4s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>
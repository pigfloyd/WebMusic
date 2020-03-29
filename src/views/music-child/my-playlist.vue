<template>
    <el-scrollbar style="height:100%" class="pl-bg">
        <vue-loading type="spin" color="#DCDCDC" :size="{ width: '50px', height: '50px' }" v-show="loadFlag" style="margin-top: 230px"></vue-loading>    
        <div class="mypl-bd" v-show="list_flag">
            <div class="add">
                <button type="button" class="btn" v-b-modal.modal-prevent-closing><i class="fa fa-plus fa-2x" aria-hidden="true" style="color: white"></i></button>
            </div>
            <com-pl v-for="(item,index) in playList"
                :key="index"
                :name="playList[index].name"
                :picUrl="playList[index].coverImgUrl"
                :playlistId="playList[index].id">
            </com-pl>
        </div>
        <b-modal
            id="modal-prevent-closing"
            ref="modal"
            title="创建歌单"
            @show="resetModal"
            @hidden="resetModal"
            @ok="handleOk"
            >
            <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group
                :state="nameState"
                label="歌单标题"
                label-for="name-input"
                invalid-feedback="必须输入歌单标题"
                >
                <b-form-input
                    id="name-input"
                    v-model="name"
                    :state="nameState"
                    required
                ></b-form-input>
                </b-form-group>
            </form>
        </b-modal>
    </el-scrollbar>
</template>
<script>
import play_list from '../../components/com-pl.vue'
import '../../assets/css/search.css'
import { VueLoading } from 'vue-loading-template'
export default {
    created(){
        this.login()
    },
    data(){
        return {
            phoneNum:'15362145526',
            passWord:'',
            loadFlag: true,
            list_flag: false,
            playList: [],
            playListDetail: [],
            name: '',
            nameState: null,
            submittedNames: []
        }
    },
    components:{
        'com-pl':play_list,
        VueLoading
    },
    filters: {
        //省略多余字符  
        ellipsis (value) {
        if (!value) return ''
        if (value.length > 56) {
            return value.slice(0,56) + '...'
        }
            return value
        }
    },
    methods:{
        login(){
            //登录
            this.$axios.get(`http://106.52.206.154:3000/login/cellphone?phone=15362145526&password=sgl22222`)
            .then((res) => { 
                return this.$axios.get('http://106.52.206.154:3000/user/playlist?uid=' + res.data.profile.userId)
            }).then((res) => {
                //获取歌单信息
                this.list_flag = true
                this.loadFlag = false
                this.playList = res.data.playlist
            }).catch(err => {
                console.log(err)
            })
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
            let result = {
                name: this.name
            }
            this.playList.push(result)
            // Hide the modal manually
            this.$nextTick(() => {
                this.$bvModal.hide('modal-prevent-closing')
            })
        }
    }
}
</script>
<style scoped>
    .mypl-bd{
        width: 100%;
        height: 100%;
        padding: 10px;
        padding-left: 14px;
        padding-bottom: 200px;
        display: flex;
        flex-flow:row wrap;
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
    .add {
        display: inline-block;
        height: 150px;
        width: 170px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .add .btn {
        background-color: #1E90FF;
        border-radius: 50%;
        height: 60px;
        width: 60px;
        box-shadow: 0px 20px 45px -15px  #1E90FF;
        line-height: 58px;
        cursor: pointer;
    }
</style>
<template>
    <el-scrollbar style="height:100%" class="pl-bg">
        <vue-loading type="spin" color="#DCDCDC" :size="{ width: '50px', height: '50px' }" v-show="loadFlag" style="margin-top: 230px"></vue-loading>    
        <div class="mypl-bd" v-show="list_flag">
            <div class="add">
                <button type="button" class="btn" v-b-modal.modal-prevent-closing><i class="fa fa-plus fa-2x" aria-hidden="true" style="color: white"></i></button>
            </div>
            <com-pl v-for="(item, index) in userPlaylist"
                :key="index"
                :date="item.playlistDate"
                :name="item.playlistName"
                :picUrl="item.playlistCover"
                :playlistId="item.playlistId"
                :coverId="item.playlistCoverId">
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
    props: ['userPlaylist'],
    data(){
        return {
            loadFlag: false,
            list_flag: true,
            playListDetail: [],
            name: '',
            nameState: null,
            submittedNames: []
        }
    },
    beforeRouteLeave(to, from, next){
        switch(to.name) {
            case 'search': {
                this.$emit('setMenuBtn', 1)
                break
            }
            case 'explore': {
                this.$emit('setMenuBtn', 2)
                break
            }
            case 'my-collection': {
                this.$emit('setMenuBtn', 4)
                break
            }
            case 'playlist-detail': {
                to.meta.ifDofresh = true
                break
            }
            default: break
        }
        next()
    },
    components:{
        'com-pl': play_list,
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
            let plName = this.name
            // Exit when the form isn't valid
            if (!this.checkFormValidity()) {
                return
            }
            this.$axios.get('/api/server/createPlaylist.php/createPlaylist?playlistName=' + this.name, {
                headers: {
                    'Authorization': this.$cookies.get('token')                         
                }
            })
            .then(res => {
                if(res.data.status === 1){
                    console.log(res.data)
                    let result = {
                        playlistId: res.data.playlistId,
                        playlistName: plName,
                        playlistDate: res.data.creationDate,
                        playlistCover: null
                    }
                    this.$emit('newPl', result)
                }
            })
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
    .fade-enter-active, .fade-leave-active {
        transition: all 0.7s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>
<template>
    <div style="margin-bottom: 20px;">
        <div class="comment-bd">
            <img src="../assets/images/user.png" alt="" class="avatar">
            <div class="content">
                <div class="id-and-time">
                    <span class="id">{{ username }}</span>
                    <span class="time">{{ time }}</span>
                    <span class="reply" @click="showInput">回复</span>
                </div>
                <div class="user-comment">{{ comment }}</div>
            </div>
        </div>
        <div style="padding-left: 80px; padding-top: 8px" v-if="replyCont">
            <div class="reply-comment">@{{ replyName }}：{{ replyCont }}</div>
        </div>
        <transition name="fade">
            <div class="input-bd" v-if="isOpenInput">
                <div class="input-group mb-3">
                            <input
                            v-model="cont"
                            type="text"
                            class="form-control"
                            placeholder="">
                            <div class="input-group-prepend">
                                <span
                                @click="closeInput"
                                class="input-group-text"
                                style="backgroundColor: white;cursor: pointer;border-left:0px;text-decoration:none;">
                                    取消
                                </span>
                                <span
                                @click="send"
                                class="input-group-text"
                                style="cursor: pointer;border-radius:0px 4px 4px 0px;border-left:0px;text-decoration:none;">
                                    回复
                                </span>
                            </div>
                    </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: ['username', 'time', 'comment', 'replyCont', 'replyName', 'commentId'],
    data(){
        return {
            isOpenInput: false,
            cont: ''
        }
    },
    methods: {
        showInput(){
            this.isOpenInput = true
        },
        closeInput(){
            this.isOpenInput = false
        },
        send(){
            this.$axios.get(`/api/server/addComment.php/addComment?commentCont=${this.cont}&songId=${this.$route.params.id}&replyId=${this.commentId}`, {
                headers: {
                    'Authorization': this.$cookies.get('token')                         
                }
            })
            .then(res => {
                if(res.data.status === 1){
                    this.$emit('addComment', this.$cookies.get('username'), '刚刚', this.cont, this.comment, this.username, this.commentId)
                    this.isOpenInput = false
                    this.cont = ''
                }
            })
        }
    }
}
</script>
<style scoped>
    .comment-bd {
        height: auto;
        width: 100%;
        display: flex;
    }
    .avatar {
        display: inline-block;
        height:60px;
        width:60px;
        border-radius: 50%;
        background-color: #DCDCDC;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .19);
        margin-right: 20px;
    }
    .content {
        display: inline-block;
        flex: 1;
        height: auto;
    }
    .id-and-time {
        height: 24px;
        color: rgb(100, 100, 100);
    }
    .id-and-time .id {
        font-weight: bold;
        font-size: 18px;
        margin-right: 10px;
    }
    .id-and-time .time {
        color: #DCDCDC;
    }
    .user-comment {
        padding-top: 6px;
        font-size: 14px;
    }
    .reply {
        display: inline-block;
        margin-left: 16px;
        color: gray;
        cursor: pointer;
    }
    .input-bd {
        padding-left: 80px;
        margin-top: 10px;
    }
    .fade-enter-active, .fade-leave-active {
        transition: all 0.2s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
    .reply-comment {
        border-radius: 4px;
        background-color: rgb(245, 245, 249);
        height: auto;
        width: 100%;
        color: grey;
        padding: 10px;
        padding-left: 14px;
        padding-right: 14px;
    }
</style>
<template>
    <div class="comment-bd">
        <div class="avatar"></div>
        <div class="content">
            <div class="id-and-time">
                <span class="id">{{ id }}</span>
                <span class="time">{{ getTime() }}</span>
            </div>
            <div class="user-comment">{{ comment }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['id', 'time', 'comment'],
    methods: {
       getTime() {
            var dtCur = new Date();
            var yearCur = dtCur.getFullYear();
            var monCur = dtCur.getMonth() + 1;
            var dayCur = dtCur.getDate();
            var hCur = dtCur.getHours();
            var mCur = dtCur.getMinutes();
            var sCur = dtCur.getSeconds();
            var timeCur = yearCur + "-" + (monCur < 10 ? "0" + monCur : monCur) + "-"
                    + (dayCur < 10 ? "0" + dayCur : dayCur) + " " + (hCur < 10 ? "0" + hCur : hCur)
                    + ":" + (mCur < 10 ? "0" + mCur : mCur) + ":" + (sCur < 10 ? "0" + sCur : sCur);
            return timeCur;
       }
    }
}
</script>
<style scoped>
    .comment-bd {
        height: auto;
        width: 100%;
        display: flex;
        margin-bottom: 20px;
    }
    .avatar {
        display: inline-block;
        height:60px;
        width:60px;
        border-radius: 50%;
        background-color: #DCDCDC;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .19);
        margin-right: 20px;
    }
    .content {
        display: inline-block;
        flex: 1;
        height: auto;
    }
    .id-and-time {
        height: 24px;
    }
    .id-and-time .id {
        font-weight: bold;
        font-size: 16px;
        margin-right: 10px;
    }
    .id-and-time .time {
        color: #DCDCDC;
    }
    .user-comment {
        padding-top: 4px;
        font-size: 14px;
    }
</style>
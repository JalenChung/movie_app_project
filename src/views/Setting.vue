<template>
    <div class="setting">
        <!-- 顶部下拉框 -->
        <van-popup v-model="show" get-container="body" position="top" :style="{ height: '35%' }">
            <!-- 地址选择器 -->
            <van-area title="请选择地区" :area-list="areaList" @confirm="selectedAddress" @cancel="closeVanArea"
                columns-num="2" />
        </van-popup>
        <div class="top">
            <div class="back" @click="goBack">
                <img src="../assets/chevron-left-white.png" alt="">
            </div>
            <div class="save" @click="saveAll">
                <img src="../assets/floppy-disk.png" alt="">
            </div>
        </div>
        <div class="img-box">
            <img src="../assets/circle-user.png" alt="">
        </div>
        <div class="userNumber"><span style="text-align: center;">{{ userInfo.number }}</span></div>
        <div class="userName">
            <span>用户名:</span>
            <input type="text" disabled='disabled' v-model="name">
            <div class="img-box" @click="inpFn">
                <img src="../assets/pen-to-square.png" alt="">
            </div>
        </div>
        <div class="userText">
            <span>简介:</span>
            <input type="text" disabled='disabled' v-model="text">
            <div class="img-box" @click="inpFn">
                <img src="../assets/pen-to-square.png" alt="">
            </div>
        </div>
        <div class="userAddress">
            <span>地区:</span>
            <input type="text" disabled='disabled' v-model="address.nm">
            <div class="img-box" @click="show = true">
                <img src="../assets/pen-to-square.png" alt="">
            </div>
        </div>
        <div class="userText" v-if="oldPassInpShow">
            <span>原密码:</span>
            <input type="text" placeholder="请输入旧密码" v-model="oldPass" @keyup.enter="ComparePass">
            <div class="img-box" @click="ComparePass">
                <img :src="newPassInpShow ? oldPassInpImgs.check : oldPassInpImgs.question" alt="">
            </div>
        </div>
        <div class="userText" v-if="newPassInpShow">
            <span>新密码:</span>
            <input type="text" placeholder="请输入新密码" @keyup.enter="saveNewPass" v-model="newPass">
            <div class="img-box" @click="saveNewPass">
                <img src="../assets/floppy-disk.png" alt="">
            </div>
        </div>
        <div class="btn-box">
            <button @click="oldPassInpShow = true">修改密码</button>
            <button @click="logOut">退出登录</button>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant';
import { areaList } from '@vant/area-data';
export default {
    data() {
        return {
            userInfo: null,
            userInfoList: null,
            inp1: null,
            inp2: null,
            name: null,
            text: null,
            oldPassInpShow: false,
            newPassInpShow: false,
            oldPass: null,
            newPass: null,
            oldPassInpImgs: {
                question: require('../assets/question.png'),
                check: require('../assets/check.png')
            },
            areaList: null,
            show: false,
            address:null,
        }
    },
    created() {
        this.$store.commit('getUserInfo');
        this.$store.dispatch('getApiCityList');

        if (window.localStorage.getItem("userInfoList")) {
            this.userInfoList = JSON.parse(window.localStorage.getItem("userInfoList"))
        }

        this.userInfo = this.$store.state.userInfo
        this.name = this.userInfo.name
        this.text = this.userInfo.text

        this.areaList = areaList
        console.log(this.$store.state.userInfo.address);
        this.address = this.$store.state.userInfo.address
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        inpFn(e) {
            let dom = e.target.parentElement.parentElement.children[1]
            dom.removeAttribute('disabled')
        },
        ComparePass() {
            if (this.userInfo.pass == this.oldPass) {
                this.newPassInpShow = true
            } else {
                console.log('密码错误');
                Toast.fail('密码错误');
            }
        },
        toCustomIcon() {
            this.$toast({
                icon: 'star-o', // 找到自己需要的图标
                message: '我是提示文字'
            })
        },
        saveNewPass() {
            if (this.userInfo.pass == this.newPass) {
                Toast.fail('密码重复');
            } else {
                this.userInfo.pass = this.newPass
                Toast.success('密码更新');
                console.log(this.userInfo);
                this.oldPassInpShow = false;
                this.newPassInpShow = false
            }
        },
        saveAll() {
            for (let i = 0; i < this.userInfoList.data.length; i++) {
                // 找到暂存里的用户并更新
                if (this.userInfoList.data[i].number == this.userInfo.number) {
                    this.userInfo.name = this.name
                    this.userInfo.text = this.text
                    this.userInfoList.data[i] = this.userInfo
                }
            }
            // 暂存更新至存储
            window.localStorage.setItem("userInfoList", JSON.stringify(this.userInfoList))
            // 更新vuex
            this.$store.commit('getUserInfo');
            Toast.success('所有信息已经更新');
            this.$router.go(-1);
        },
        logOut() {
            Toast.success('已登出');
            this.userInfoList.logged = null;
            window.localStorage.setItem("userInfoList", JSON.stringify(this.userInfoList))
            this.$store.commit('getUserInfo');
            this.userInfo = this.$store.state.userInfo
            this.name = this.userInfo.name
            this.text = this.userInfo.text
            // this.$router.push({ name: 'Login' })
        },
        selectedAddress(e) {
            console.log(e[1]);
            this.$store.commit('getAddress', e[1])
            this.show = false;
        },
        closeVanArea() {
            this.show = false;
        },
    },
    // computed: {
    //     address() {
    //         return this.$store.state.userInfo.address
    //     },
    // },
}
</script>

<style lang="scss" scoped>
.setting::before {
    width: 100%;
    height: 40px;
    display: block;
    content: '';
}

.setting {
    width: 100vw;
    height: 100vh;
    position: relative;

    .top {
        width: calc(100% - 40px);
        margin: 0 20px;
        display: flex;
        justify-content: space-between;

        >div {
            width: 22px;
            min-height: 22px;
            padding: 10px;
            // margin: 0 10px;

            img {
                width: 100%;
            }
        }
    }


    .img-box {
        width: 70px;
        margin: 0 auto;

        img {
            width: 100%;
        }
    }

    >div {
        span {
            color: #fff;
        }

        width: calc(100% - 10%);
        margin: 5%;
        display: flex;
        justify-content: center;
        align-items: center;

        span:nth-child(1) {
            font-size: 17px;
            font-weight: bold;
            display: block;
            width: 80px;
            // letter-spacing: auto;
            text-align: justify;
        }

        input {
            color: #fff;
            font-size: 17px;
            background-color: transparent;
            // font-weight: bold;
            // border: none;
            // width: 140px;
            padding: 10px 0;
            border-radius: 10px;
            flex-grow: 1;
        }

        .img-box {
            width: 20px;
            margin-left: 10px;

            img {
                width: 100%;
            }
        }
    }

    .btn-box {
        position: absolute;
        bottom: 5%;
        display: flex;
        flex-direction: column;

        button {
            width: 70%;
            margin-top: 20px;
            height: 40px;
            border-radius: 10px;
            outline-style: none;
            border: none;
            font-weight: bolder;
        }


        button:nth-child(1) {
            color: #151517;
            background-color: #FDF070;
        }

        button:nth-child(2) {
            color: #fff;
            background-color: #e9493c;
        }
    }
}
</style>
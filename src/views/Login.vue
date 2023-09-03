<template>
    <div class="login">
        <h1>Login</h1>
        <div class="main">
            <div>
                <span>账号:</span>
                <input type="text" name="number" id="" v-model="number">
            </div>
            <div>
                <span>密码:</span>
                <input type="text" name="pass" id="" v-model="pass">
            </div>
            <button @click="login">登录/注册</button>
        </div>
        <div class="bottom">
            <span>用户条款</span>&nbsp;|&nbsp;<span>忘记密码</span>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant';
export default {
    name: 'login',
    data() {
        return {
            number: '',
            pass: '',
            userInfo: {
                number: this.number,
                pass: this.pass,
                name: '',
                text: '',
                address: {
                    id: 1,
                    nm: '北京',
                    py: 'beijing'
                },
                img: '../assets/circle-user.png',
                tickets: []
            },
            userInfoList: {
                logged: 0,
                data: [],
            }
        }
    },
    created() {
        if (window.localStorage.getItem("userInfoList")) {
            this.userInfoList = JSON.parse(window.localStorage.getItem("userInfoList"))
            console.log(this.userInfoList);
        }
    },
    methods: {
        login() {
            // 判断输入是否为空
            if (this.number != '' && this.pass != '') {

                let isHasUser = false

                for (let i = 0; i < this.userInfoList.data.length; i++) {
                    // 判断存储里是否已经有该用户
                    if (this.userInfoList.data[i].number == this.number) {
                        isHasUser = true
                        if (this.userInfoList.data[i].pass == this.pass) {
                            this.userInfo = this.userInfoList[i]
                            Toast.success('成功登录');
                        } else {
                            Toast.fail('密码错误');
                            return;
                        }
                    }
                }
                if (isHasUser == false) {
                    // 生成新用户
                    this.userInfo.number = this.number
                    this.userInfo.pass = this.pass
                    this.userInfo.name = "用户" + this.number
                    this.userInfo.text = '介绍一下自己吧'
                    // 将新用户放进储存
                    this.userInfoList.data.push(this.userInfo)
                    Toast.success('成功注册');
                }
                // 修改登录状态当前用户
                this.userInfoList.logged = this.number
                // 更新存储
                window.localStorage.setItem("userInfoList", JSON.stringify(this.userInfoList))
                console.log(JSON.parse(window.localStorage.getItem("userInfoList")));

            } else {
                console.log('请输入完整');
            }

            this.$router.push('Home')
        },
    }
}
</script>

<style lang="scss" scoped>
.login {
    width: 100vw;
    height: 100vh;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    h1 {
        padding-top: 30px;
    }

    .main {
        margin: 40% 0px;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;

        >div {
            margin: 20px 0px;
            display: flex;
            align-items: center;
            justify-content: center;

            span {
                font-size: 16px;
                font-weight: bold;
                margin-right: 10px;
            }

            input {
                height: 28px;
                width: 60%;
                border-radius: 5px;
                color: #000;
            }
        }

        button {
            outline-style: none;
            background-color: #FDF06E;
            width: max-content;
            padding: 10px 40px;
            margin: 0px auto;
            margin-top: 30%;
            color: #000;
            font-size: 17px;
            border-radius: 10px;
        }
    }

    .bottom {
        position: absolute;
        bottom: 40px;
    }
}
</style>
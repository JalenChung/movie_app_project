<template>
    <div class="QRcode">
        <div class="back" @click="goBack">
            <img src="../assets/chevron-left-white.png" alt="">
        </div>
        <div class="img-box">
            <img :src="movieData?.img" alt="">
        </div>
        <div class="content-box">
            <span>{{ movieData?.nm }}</span>
            <div class="seats-box">
                <span v-for="(item, index) in seats" :key="index">
                    {{ item.row }}排{{ item.col }}
                </span>
            </div>
            <div class="img-box1">
                <img :src="qr1" alt="">
            </div>
            <div class="img-box2">
                <img src="../assets/qrcode2.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            seats: [],
            movieId: 0,
            cinemaId: null,
            id: 0,
            movieData: null,
            qrContent: null,
            qr1: null,
            qr2: null,

        }
    },
    created() {
        this.seats = JSON.parse(this.$route.query.seats)
        this.movieId = this.$route.query.movieId
        this.cinemaId = this.$route.query.cinemaId
        this.axios.get("https://apis.netstart.cn/maoyan/movie/detail", {
            params: {
                movieId: this.movieId
            }
        }).then(res => {
            this.movieData = res.data.movie
        })


        this.qrContent = this.movieId + this.$route.query.seats
        this.qr1 = `https://api.qrtool.cn/?text=${this.qrContent}`

        // 拉取用户信息
        this.$store.commit('getUserInfo');
        // 更新用户列表
        for (let i = 0; i < this.$store.state.userInfoList.data.length; i++) {
            // 找到暂存里的用户并更新
            if (this.$store.state.userInfoList.data[i].number == this.$store.state.userInfoList.logged) {

                // 添加电影票到用户信息里
                this.$store.state.userInfoList.data[i].tickets.push({
                    seats: this.seats,
                    movieId: this.movieId,
                    cinemaId: this.cinemaId
                })
                break;
            }
        }
        // 暂存更新至存储
        window.localStorage.setItem("userInfoList", JSON.stringify(this.$store.state.userInfoList))

        // this.axios.get('https://sapi.k780.com/',{
        //     params:{
        //         app: "barcode.get",
        //         bc_text: this.qrContent,
        //         appkey:'10003',
        //         sign : 'b59bc3ef6191eb9f747dd4e83c99f2a4'
        //     }
        // }).then(res=>{
        //     this.qr2 = res.data.barCodeUrl
        // }).catch(err=>{
        //     console.log(err);
        // })
    },
    methods: {
        goBack() {
            if (this.$route.query.isGoBack) {
                this.$router.go(-1)
            } else {
                this.$router.push('home')
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.QRcode::before {
    width: 100%;
    min-height: 40px;
    display: block;
    content: '';
}

.QRcode {
    width: 100vw;
    height: 100vh;
    position: relative;

    .back {
        width: 22px;
        min-height: 22px;
        padding: 10px;
        margin: 0 10px;

        img {
            width: 100%;
        }
    }

    .img-box {
        width: 50vw;
        height: calc(50vw * 1.3957);
        position: absolute;
        top: 100px;
        left: 25%;
        border-radius: 10px;
        overflow: hidden;
        z-index: 2;
        box-shadow: 10px 10px 18px #0000003d;

        img {
            width: 100%;
        }
    }

    .content-box {
        width: calc(100% - 30%);
        margin: 0 15%;
        height: 60%;
        background-color: #fff;
        position: absolute;
        bottom: 7%;
        border-radius: 10px;
        z-index: 1;
        box-shadow: 5px 5px 18px #0000003d;

        >span {
            width: 100%;
            text-align: center;
            display: block;
            padding-top: 50%;
            font-size: 18px;
            font-weight: bolder;
        }

        .seats-box {
            width: 100%;
            display: flex;
            justify-content: center;
            font-size: 26px;
            font-weight: bolder;

            span {
                margin: 5px;
            }
        }

        .img-box1 {
            width: 35%;
            margin: 10px auto;

            img {
                width: 100%;
            }
        }

        .img-box2 {
            width: 60%;
            margin: 0px auto;
            margin-top: 20px;

            img {
                width: 100%;
            }
        }
    }
}
</style>
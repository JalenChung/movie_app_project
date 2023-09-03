<template>
    <div class="movie-detail">

        <div class="bg-box"
            :style="`background-image: url('${this.movieDetailList[this.movie_i] ? this.movieDetailList[this.movie_i].movie.img : ''}');`">
        </div>
        <div class="content-box">
            <div class="back" @click="goBack">
                <img :src="backImg.white" alt="">
            </div>

            <div class="movie-box" :style="`${showInfo ? 'height: 250px;' : ''}`">
                <div class="scroll-box" v-show="!showInfo" ref="scrollBox" @touchstart="touchstart" @touchmove="touchmove"
                    @touchend="touchend">
                    <div class="img-box" v-for="(item, index) in movieDetailList" :key="index">
                        <img :src="item.movie.img" alt="">
                    </div>
                </div>
                <div :class="imgBox_style" v-if="showInfo">
                    <img :src="movieDetailList[movie_i] ? movieDetailList[movie_i].movie.img : ''" alt="">
                </div>
            </div>

            <div :class="movieInfo_style" ref="movieInfo">
                <div class="movieInfo-primary">
                    <div class="title">
                        <span class="name-cn">
                            {{ movieDetailList[movie_i] ? movieDetailList[movie_i].movie.nm : '' }}
                        </span>
                        <span class="rt" v-if="showInfo">
                            {{ movieDetailList[movie_i] ? movieDetailList[movie_i].movie.rt : '' }}
                        </span>
                    </div>
                    <div class="name-en">{{ movieDetailList[movie_i] ? movieDetailList[movie_i].movie.enm : '' }}</div>
                    <Star class="star" :width="12"
                        :score="movieDetailList[movie_i] ? movieDetailList[movie_i].movie.sc : ''"></Star>
                    <div class="movie-type">
                        {{ movieDetailList[movie_i] ? movieDetailList[movie_i].movie.src : '' }}
                        &nbsp;|&nbsp;
                        {{ movieDetailList[movie_i] ? movieDetailList[movie_i].movie.cat : '' }}
                    </div>
                    <div class="introduce" v-if="showInfo">
                        {{ movieDetailList[movie_i] ? movieDetailList[movie_i].movie.dra : '' }}
                    </div>
                    <div class="moreInfo" v-if="showInfo">
                        <div class="nav">
                            <span v-for="(item, index) in nav" :class="index == nav_i ? 'active' : ''" :key="index"
                                @click="() => { nav_i = index }">{{ item
                                }}</span>
                        </div>
                        <div class="content">
                            <div class="creator" v-if="nav_i == 0">
                                <div v-for="(item, index) in movieDetailList[movie_i] ? movieDetailList[movie_i].celebrities : ''"
                                    :key="index">
                                    <div class="img-box">
                                        <img :src="item.avatar" alt="">
                                    </div>
                                    <span>{{ item.cnm }}</span>
                                    <!-- <span>{{ item.enm }}</span> -->
                                    <span>{{ item.desc }}</span>
                                </div>
                            </div>
                            <div class="preview" v-if="nav_i == 1">
                                <div class="overlay-btn"
                                    :style="`background-image: url('${movieDetailList[movie_i] ? movieDetailList[movie_i].movie.videoImg : ''}');`">
                                    <img src="../assets/play.png" alt="" @click="showOverlay = true">
                                </div>
                                <van-overlay :show="showOverlay">
                                    <div class="wrapper">
                                        <div class="block">
                                            <video-player class="video-player vjs-custom-skin" ref="videoPlayer"
                                                :playsinline="true" :options="playerOptions">
                                            </video-player>

                                        </div>
                                        <div class="close" @click="showOverlay = false">×</div>
                                    </div>
                                </van-overlay>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button class="arrow-btn" @click="unfold">
                <img :class="showInfo ? 'down' : 'up'" src="../assets/arrow.png" alt="">
            </button>

        </div>

        <button class="buy" @click="buyTickets">优惠购票</button>
    </div>
</template>

<script>
import Star from '@/components/Star.vue'
export default {
    name: 'MovieDetail',
    components: {
        Star,
    },
    data() {
        return {
            id: null,
            movieDetailList: [],
            backImg: {
                black: require('../assets/chevron-left-black.png'),
                white: require('../assets/chevron-left-white.png')
            },
            scrollBox: null,
            movieBox: null,
            movieInfo_style: 'unexpanded',
            imgBox_style: 'img-box-magnify',
            imgBox_s: null,
            overlayBtn: null,
            touch_x: 0,
            touch_x_now: 0,
            timer: null,
            left: 0,
            movie_i: 0,
            nav_i: 0,
            nav: [
                '主创',
                '预告',
                '评论',
            ],
            showOverlay: false,
            showInfo: false,
            playerOptions: {
                playbackRates: [0.5, 1.0, 1.5, 2.0], //可选择的播放速度
                autoplay: false, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [{
                    type: "video/mp4",
                    src: ''//url地址
                }],
                poster: "", //你的封面地址
                // width: document.documentElement.clientWidth,
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                    timeDivider: true,//当前时间和持续时间的分隔符
                    durationDisplay: true,//显示持续时间
                    remainingTimeDisplay: false,//是否显示剩余时间功能
                    fullscreenToggle: true  //全屏按钮
                }
            }
        }
    },
    created() {
        this.$nextTick(() => {
            this.bgBox = this.$refs.bgBox
            this.scrollBox = this.$refs.scrollBox
            this.movieBox = this.$refs.movieBox
            this.left = this.scrollBox.getBoundingClientRect().left
        })
        this.id = this.$route.query.id
        console.log(this.id);
        // 获取当前传进来id相对的电影
        this.getMovieDetail(this.id, () => {
            this.playerOptions.sources[0].src = this.movieDetailList[0].movie.videourl
        })

        if (this.$store.state.movieList) {
            this.getMovieList(this.$store.state.movieList)
        } else {
            this.$store.dispatch('getMovieList').then(res => {
                this.getMovieList(res)
            }).catch(err => {
                console.log(err);
            })
        }
    },
    methods: {
        getMovieList(data) {

            // 获取热映电影列表里的电影
            data.map(movie => {
                this.getMovieDetail(movie.id)
            })
        },
        getMovieDetail(id, callBack) {
            this.axios('https://apis.netstart.cn/maoyan/movie/detail', {
                params: {
                    movieId: id
                }
            }).then(res => {
                if (this.movieDetailList.length == 0) {
                    this.movie = res.data
                    this.movieDetailList.push(this.movie)
                }
                if (this.movie.movie.id != res.data.movie.id) {
                    this.movieDetailList.push(res.data)
                }
                if (callBack) {
                    callBack()
                }
            }).catch(err => {
                console.log(err);
            })
        },
        goBack() {
            this.$router.go(-1);
        },
        unfold() {
            this.showInfo = !this.showInfo;
            if (this.movieInfo_style == 'unexpanded') {
                this.movieInfo_style = 'expanded'
                this.imgBox_style = 'img-box-shrink'
            } else {
                this.movieInfo_style = 'unexpanded'
                this.imgBox_style = 'img-box-magnify'

                clearTimeout(window.timer2)
                clearTimeout(window.timer)
            }
        },
        buyTickets() {
            console.log(this.movieDetailList[this.movie_i].movie);
            this.$router.push({
                name: 'ChooseCinema', query: {
                    id: this.movieDetailList[this.movie_i].movie.id,
                    name: this.movieDetailList[this.movie_i].movie.nm,
                    name_en:this.movieDetailList[this.movie_i].movie.enm,
                    sc: this.movieDetailList[this.movie_i].movie.sc,
                    cat: this.movieDetailList[this.movie_i].movie.cat,
                    img: this.movieDetailList[this.movie_i].movie.img,
                }
            })
        },
        touchstart(e) {
            if (this.showInfo) {
                return
            }
            this.touch_x_now = parseFloat(this.scrollBox.style.left) ? parseFloat(this.scrollBox.style.left) : 0

            this.touch_x = e.touches[0].pageX;
            clearInterval(window.timer2)
            clearTimeout(window.timer)
        },
        touchmove(e) {
            if (this.showInfo) {
                return
            }
            let move_x = e.touches[0].pageX - this.touch_x
            let left = this.touch_x_now + move_x
            if (left > this.left) {
                return
            }
            if (left < -this.scrollBox.clientWidth + this.scrollBox.children[0].clientWidth + this.left + 20) {
                return
            }
            this.scrollBox.style.left = left + 'px'
        },
        touchend(e) {
            if (this.showInfo) {
                return
            }
            if (window.timer !== null) {
                clearTimeout(window.timer)
            }
            console.log("结束");
            // 一个scrollBox的宽度+margin
            let img_w = this.scrollBox.children[0].clientWidth + parseFloat(getComputedStyle(this.scrollBox.children[0], null).marginLeft) * 2
            // 计算出距离中央最近的图片是哪个
            let dist = (this.scrollBox.getBoundingClientRect().left - 33) / (img_w - 1)
            let i = Math.abs(Math.round(dist.toFixed('1')))
            console.log("match==>", i);
            // 当前屏幕中央电影的下标
            this.movie_i = i;
            console.log(this.movieDetailList[this.movie_i].movie.videourl);
            // this.playerOptions.sources[0].src = this.movieDetailList[this.movie_i].movie.videourl
            this.playerOptions.sources[0].src = this.movieDetailList[this.movie_i].movie.videourl
            // console.log(this.playerOptions.sources.src);
            // 即将修正到的值
            let w_dif = screen.width / 290 * 0.001
            console.log(w_dif);
            let left = -i * this.scrollBox.children[0].clientWidth * (1.0688 - w_dif) + 34
            this.animation(300, left)
        },
        animation(s, left) {
            window.timer = setTimeout(() => {
                // 纠正动画的函数
                window.timer2 = setInterval(() => {
                    // 当前值
                    let left_now = parseFloat(this.scrollBox.style.left)
                    let speed = (left - left_now) / 10;
                    if (left_now == left) {
                        clearInterval(window.timer2)
                    }
                    // 动画不断赋值
                    this.scrollBox.style.left = left_now + speed + 'px'
                }, 30)
                // 纠正后改变位置记录
                this.touch_x_now = parseFloat(this.scrollBox.style.left) ? parseFloat(this.scrollBox.style.left) : 0
            }, s);
        }
    },
    watch: {
        // movieDetailList(newVal, oldVal) {
        //     console.log(newVal);
        // }
    },
    computed: {

    }
}
</script>

<style lang="scss" scoped>
.movie-detail {
    width: 100vw;
    height: 100vh;
    position: relative;
    background: #162D38;

    .bg-box {
        width: 100%;
        height: 40%;
        background-size: cover !important;
        background-repeat: no-repeat !important;
        position: relative;
        transition: background-image .5s;
    }

    .bg-box::after {
        display: block;
        content: "";
        position: absolute;
        bottom: -1px;
        width: 100%;
        height: 50px;
        background: linear-gradient(to top, #162D38, #001c2700);
    }

    .content-box::before {
        width: 100%;
        height: 40px;
        display: block;
        content: '';
    }

    .content-box {
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;

        .back {
            width: 22px;
            padding: 10px;
            margin: 0 10px;

            img {
                width: 100%;
            }
        }

        .movie-box {
            position: absolute;
            z-index: 2000;
            width: 100%;
            height: 63%;
            overflow: hidden;
            transition: height .5s ease;

            .scroll-box {
                position: absolute;
                left: 33px;
                height: 100%;
                width: max-content;
                display: flex;

                .img-box {
                    height: 90%;
                    width: 290px;
                    margin: 0 10px;
                    margin-top: 10px;
                    border-radius: 20px;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    box-shadow: 10px 10px 16px #001c2753;
                    transition: border-radius 1s, box-shadow 1s, width .5s ease;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }

            .img-box-magnify {
                height: 90%;
                width: 290px;
                background-color: #00221F;
                position: fixed;
                z-index: 1900;
                overflow: hidden;
                border-radius: 20px;
                top: 90px;
                left: 40px;
                // transition: height 1s, margin 1s;

                img {
                    width: 100%;
                    height: 100%;

                }
            }

            .img-box-shrink {
                height: 220px;
                width: 145px;
                background-color: #00221F;
                position: fixed;
                z-index: 1900;
                overflow: hidden;
                border-radius: 10px;
                top: 90px;
                left: 115px;
                // transition: height 1s, margin 1s;

                img {
                    width: 100%;
                    height: 100%;

                }
            }
        }

        .unexpanded {
            height: 67%;
            background-color: #F8F8F8;
            margin: 40px auto;
            margin-bottom: 0px;
            position: relative;
            overflow: scroll;
            width: 60%;
            border-radius: 10px;
            transition: width .5s, border-radius 1s;

            .movieInfo-primary {

                padding: 20px;
                position: absolute;
                bottom: 0px;
                width: calc(100% - 40px);

                >div {
                    text-align: center;
                }

                .title {
                    font-size: 20px;
                    font-weight: bold;
                    color: #262626;
                }

                .name-en {
                    font-size: 10px;
                    color: #828282;
                }

                .movie-type {
                    font-size: 13px;
                    color: #828282;
                }

                .star {
                    margin: 5px auto 3px auto;
                }
            }

            @media screen and (max-width: 670px) {
                .movieInfo-primary {
                    padding: 10px;
                    width: calc(100% - 20px);
                }
            }

        }

        .expanded {
            height: 67%;
            background-color: #F8F8F8;
            margin: 40px auto;
            margin-bottom: 0px;
            position: relative;
            overflow: scroll;
            width: calc(100% - 60px);
            border-radius: 20px;
            transition: width .5s, border-radius 1s;


            .movieInfo-primary {
                padding: 20px;
                padding-bottom: 0;
                padding-top: 200px;

                .title {
                    .name-cn {
                        font-size: 20px;
                        font-weight: bolder;
                    }

                    .rt {
                        font-size: 12px;
                        color: #5f5f5f;
                        text-decoration: underline;
                    }
                }

                .name-en {
                    font-size: 10px;
                    color: rgb(129, 129, 129);
                }

                .star {
                    margin: 5px 0 3px 0;
                }

                .movie-type {
                    font-size: 12px;
                    color: rgb(129, 129, 129);
                    margin-bottom: 10px;
                }

                .introduce {
                    width: 100%;
                    height: 60px;
                    font-size: 10px;
                    font-weight: lighter;
                    color: rgb(126, 126, 126);
                }

                .moreInfo {
                    margin-top: 25px;

                    .nav {
                        color: rgb(129, 129, 129);
                        font-size: 15px;

                        span {
                            margin-right: 30px;
                        }

                        .active {
                            color: rgb(26, 26, 26);
                        }
                    }

                    .content {
                        width: 100%;
                        ////////////
                        height: 130px;
                        overflow: scroll;

                        .creator {
                            width: max-content;
                            height: 110px;
                            padding-top: 10px;

                            >div {
                                height: 100%;
                                width: 60px;
                                float: left;
                                margin-right: 10px;

                                // background: #342150;
                                .img-box {
                                    width: 60px;
                                    height: 60px;
                                    border-radius: 50%;
                                    margin: 0 auto;

                                    img {
                                        width: 100%;
                                    }
                                }

                                span {
                                    font-size: 10px;
                                    display: block;
                                    font-weight: lighter;
                                    transform: scale(0.9, 0.9);
                                    text-align: center;
                                }

                                span:last-child {
                                    display: block;
                                    opacity: .8;
                                    margin-top: -3px;
                                    transform: scale(0.8, 0.8);
                                }
                            }
                        }

                        .preview {
                            .van-overlay {
                                z-index: 3000;

                                .wrapper {
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    height: 100%;

                                }

                                .block {
                                    width: 100%;
                                    height: calc(100vw / 16 * 9);
                                    background-color: #fff;
                                }

                                .close {
                                    font-size: 30px;
                                    color: white;
                                    position: absolute;
                                    bottom: 50px;
                                    left: calc(50% - 15px);
                                }
                            }


                            .overlay-btn {
                                width: calc(16 * 12px);
                                height: calc(9 * 12px);
                                margin: 10px auto;
                                background: black;
                                position: relative;
                                background-size: cover;

                                img {
                                    position: absolute;
                                    top: calc(50% - 10px);
                                    left: calc(50% - 10px);
                                    display: block;
                                    width: 20px;
                                    opacity: .6;
                                }
                            }
                        }
                    }
                }
            }

        }


        .arrow-btn {
            width: 45px;
            background-color: #00B28A;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            margin: 0 calc(50% - 45px / 2);
            border: none;
            outline-style: none;
            height: 25px;

            img {
                width: 14px;
            }

            .down {
                transform: rotate(0);
                transition: transform .5s;
            }

            .up {
                transform: rotate(180deg);
                transition: transform .5s;
            }
        }

    }

    .buy {
        border: none;
        outline-style: none;
        background-color: #FDF06E;
        padding: 11px 0px 12px 0px;
        width: 88%;
        border-radius: 30px;
        position: absolute;
        bottom: 40px;
        color: #00221F;
        font-size: 18.5px;
        font-weight: bolder;
        left: calc(50% - 88% / 2);
    }
}
</style>
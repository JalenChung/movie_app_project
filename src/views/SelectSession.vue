<template>
    <div class="selectedSession">
        <div class="back" @click="goBack">
            <img src="../assets/chevron-left-white.png" alt="">
        </div>
        <div class="cinema-info">
            <span class="cinema-name">{{ sessionList ? sessionList.cinemaName : '' }}</span>
            <span class="cinema-address">地址: {{ cinemaInfo ? cinemaInfo.addr : '' }}</span>
        </div>
        <div class="movie-box">
            <div class="scroll-box" @touchmove="move">
                <div :class="index == movie_i ? 'active' : ''"
                    v-for="(item, index) in sessionList ? sessionList.movies : ''" :key="index">
                    <img :src="item.img" alt="">
                </div>
            </div>
        </div>
        <div class="movie-info">
            <p>{{ centerMovie ? centerMovie.nm : '' }}</p>
            <p>{{ centerMovie ? centerMovie.desc : '' }}</p>
        </div>
        <div class="date-list">
            <ul>
                <li :class="checked == index ? 'active' : ''" @click="checked = index" v-for="(item, index) in dates"
                    :key="index" v-text="processDate(item, index)"></li>
            </ul>
        </div>
        <div class="session-list">
            <div class="scroll-box">
                <div class="session" v-for="(item, index) in  session ? session : ''" :key="index"
                    @click="goSelectSeat(item)">
                    <div class="content">
                        <div>
                            <div>
                                <span>{{ item.tm }}</span>
                                <span>00:00散场</span>
                            </div>
                            <div>
                                <span>{{ item.lang + item.tp }}</span>
                                <span>{{ item.th }}</span>
                            </div>
                            <div>
                                <span>￥{{ Math.floor(item.vipPrice * 1.3) }}</span>
                                <span>{{ item.vipPriceName + " " + item.vipPrice }}</span>
                            </div>
                        </div>
                        <div>
                            <span>{{ item.tp }}</span>
                            <span>{{ item.extraDesc }}</span>
                        </div>
                    </div>
                    <div class="buy-btn">
                        购票
                    </div>
                    <div class="movie-type-box">
                        <span v-if="item.th.indexOf('杜比全景声') !== -1">杜比全景声厅</span>
                        <span v-if="item.th.indexOf('IAMX') !== -1">IMAX厅</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'selectedSession',
    data() {
        return {
            movieId: null,
            cinemaId: null,
            cinema: null,
            sessionList: null,
            cinemaInfo: null,
            movie_i: 0,
            // 选中日期的下标
            checked: 0
        }
    },
    created() {
        this.movieId = this.$route.query.movieId
        this.cinemaId = this.$route.query.cinemaId
        // console.log(this.$store.state.userInfo.address.id);
        this.getSession()
        this.$store.commit('getUserInfo');
        console.log(this.$store.state.userInfo);

    },
    methods: {
        getSession() {
            this.axios.get('https://apis.netstart.cn/maoyan/cinema/shows', {
                params: {
                    cinemaId: this.cinemaId,
                    ci: this.$store.state.userInfo.address.id,
                    channelId: 4
                }
            }).then(res => {
                let data = res.data.data;
                this.sessionList = data;
                // console.log(this.movieId);
                // console.log(this.sessionList);

                let movieList = this.sessionList.movies
                for (let i = 0; i < movieList.length; i++) {
                    if (movieList[i].id == this.movieId) {
                        let temp = { ...movieList[i] }
                        movieList[i] = movieList[0]
                        movieList[0] = temp
                        break;
                    }
                }

                this.getCinemaInfo(data)
            }).catch(err => {
                console.log(err);
            })
        },
        goBack() {
            this.$router.go(-1);
        },
        getCinemaInfo(data) {
            this.axios.get('https://apis.netstart.cn/maoyan/cinema/detail', {
                params: {
                    cinemaId: data.cinemaId
                }
            }).then(res => {
                this.cinemaInfo = res.data.data
            }).catch(err => {
                console.log(err);
            })
        },
        move(e) {
            let scrollBox = e.target.nodeName == 'IMG' ? e.target.parentElement.parentElement : e.target
            for (let i = 0; i < scrollBox.children.length; i++) {
                let imgBox = scrollBox.children[i]
                let imgBox_l = imgBox.getBoundingClientRect().left;
                let l = screen.width / 2 - 80
                let r = screen.width / 2
                // console.log('imgBox_l=>',imgBox_l);
                // console.log(l,r);
                if (imgBox_l > l && imgBox_l < r) {
                    this.movie_i = i
                }
            }
        },
        formatDate(date) {
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let week = date.getDay();
            var weekList = ["日", "一", "二", "三", "四", "五", "六"];
            return {
                y: year,
                m: month,
                d: day,
                w: weekList[week]
            };
        },
        processDate(date, i) {
            let s = ''
            let arr = ['今天', '明天', '后天'];
            if (i < 3) {
                s += arr[i]
            } else {
                s += "周" + date.w
            }
            s = s + date.m + '月' + date.d + '日'
            return s
        },
        goSelectSeat(session) {
            console.log(this.movieId);
            this.$router.push({
                name: 'SelectSeat', query: {
                    cinemaName: this.cinemaInfo.nm,
                    // session: session,
                    th: session.th,
                    tm: session.tm,
                    dt: session.dt,
                    tp: session.tp,
                    lang: session.lang,
                    cinemaId: this.cinemaId,
                    movieName: this.centerMovie.nm,
                    movieTime: parseInt(this.centerMovie.desc),
                    movieId: this.movieId,
                }
            })
        }
    },
    computed: {
        dates() {
            let dates = [];
            let today = new Date();
            dates.push(this.formatDate(today));
            for (let i = 1; i <= 6; i++) {

                let nextDay = new Date(today);
                nextDay.setDate(nextDay.getDate() + i);

                if (nextDay.getDate() === 1 && nextDay.getMonth() !== today.getMonth()) {
                    nextDay.setMonth(nextDay.getMonth() + 1);
                }

                if (nextDay.getMonth() === 0 && nextDay.getDate() === 1) {
                    nextDay.setFullYear(nextDay.getFullYear() + 1);
                }

                dates.push(this.formatDate(nextDay));
            }
            return dates
        },
        centerMovie() {
            return this.sessionList ? this.sessionList.movies[this.movie_i] : ''
        },
        session() {
            try {
                return this.sessionList ? this.sessionList.movies[this.movie_i].shows[this.checked].plist : ''
            } catch (error) {
                console.log(error);
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.selectedSession::before {
    width: 100%;
    min-height: 40px;
    display: block;
    content: '';
}

.selectedSession {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;

    .back {
        width: 22px;
        min-height: 22px;
        padding: 10px;
        margin: 0 10px;

        img {
            width: 100%;
        }
    }

    .cinema-info {
        width: calc(100% - 40px);
        margin: 0 20px;
        margin-top: 10px;
        color: #fff;
        display: flex;
        flex-direction: column;
        min-height: 60px;

        .cinema-name {
            opacity: .9;
            font-weight: bolder;
        }

        .cinema-address {
            font-size: 10px;
            opacity: .6;
        }
    }

    .movie-box {
        width: calc(100% - 40px);
        margin: 0 20px;
        min-height: 140px;
        overflow: scroll;
        position: relative;

        .scroll-box {
            position: absolute;
            left: 120px;
            width: min-content;
            height: 100%;
            display: flex;
            align-items: center;

            >div {
                width: 55px;
                height: calc(55px * 1.3957);
                margin-right: 10px;
                overflow: hidden;
                display: flex;
                justify-content: center;
                box-shadow: 0px 0px 15px rgba(208, 208, 208, 0.237);
                border-radius: 5px;

                img {
                    width: 100%;
                }
            }

            >div:first-child {
                margin-left: 10px;
            }

            .active {
                width: 80px;
                height: calc(80px * 1.3957);
            }
        }

        .scroll-box::after {
            width: 120px;
            height: calc(55px * 1.3957);
            display: block;
            content: '';
        }
    }

    .movie-info {
        min-height: 50px;
        width: 100%;

        p {
            display: block;
            text-align: center;
            color: #fff;
            margin: 0px;
        }

        p:nth-child(2) {
            opacity: .5;
            font-size: 10px;
        }
    }

    .date-list {
        width: 100%;
        margin: 20px;
        overflow: scroll;
        min-height: 20px;

        ul {
            display: flex;
            width: max-content;
            font-size: 13px;
            color: white;

            .active {
                opacity: .9 !important;
            }

            li {
                opacity: .35;
                margin-left: 20px;
                letter-spacing: 1px;
            }

            li:first-child {
                margin-left: 0px;
            }
        }
    }

    .session-list {
        // flex-grow: 1;
        height: calc(100% - 450px);
        width: 100%;
        overflow: scroll;

        .scroll-box {
            width: 100%;
            height: max-content;

            .session {
                height: 120px;
                position: relative;

                .content {
                    border-radius: 10px;
                    height: 110px;
                    width: calc(100% - 40px);
                    margin: 5px 20px;
                    background: #fff;

                    >div:nth-child(1) {
                        height: calc(100% - 20px - 40px);
                        margin: 20px;
                        margin-bottom: 0px;
                        display: flex;

                        >div {
                            width: calc(100% / 3);
                            display: flex;
                            flex-direction: column;

                            span:nth-child(1) {
                                font-weight: bold;
                            }

                            span:nth-child(2) {
                                padding-top: 10px;
                                font-size: 12px;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden;
                            }
                        }

                        >div:nth-child(1) {
                            color: #292929;

                            span:nth-child(1) {
                                font-size: 18px;
                            }
                        }

                        >div:nth-child(2) {
                            color: #3d3d3d;

                            span:nth-child(1) {
                                font-size: 15px;
                            }
                        }

                        >div:nth-child(3) {
                            align-items: center;
                            color: #292929;

                            span:nth-child(1) {
                                font-size: 18px;
                                // margin-bottom: 5px;
                                color: #e9343c;
                            }

                            span:nth-child(2) {
                                padding-top: 0px;
                                padding: 1px 5px;
                                border: 1px solid #f90;
                                border-radius: 3px;
                                color: #f90;
                            }
                        }
                    }

                    >div:nth-child(2) {
                        height: 20px;
                        margin-left: 20px;
                        margin-top: 10px;
                        font-size: 13px;
                        opacity: .6;
                    }

                    >div:nth-child(3) {
                        position: absolute;
                        right: 0px;
                    }
                }

                .buy-btn {
                    position: absolute;
                    right: calc(20px - 3px);
                    bottom: 20px;
                    background-color: #FDF070;
                    padding: 5px 15px;
                    font-size: 12px;
                    border-top-left-radius: 7px;
                    border-bottom-left-radius: 7px;
                }

                .movie-type-box {
                    position: absolute;
                    top: 2px;
                    right: 50px;
                    height: 20px;
                    width: max-content;
                    font-size: 10px;
                    color: #fff;
                    display: flex;

                    span {
                        display: block;
                        background-color: #564EF2;
                        height: 100%;
                        line-height: 20px;
                        padding: 0 10px;
                        margin: 0 5px;
                        border-bottom-right-radius: 7px;
                        border-bottom-left-radius: 7px;
                    }
                }
            }
        }
    }
}
</style>
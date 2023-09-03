<template>
    <div class="ticketsList">
        <div class="top">
            <div class="back" @click="goBack">
                <img src="../assets/chevron-left-white.png" alt="">
            </div>
            <span>我的电影票</span>
        </div>
        <div class="tickets-box">

            <div class="scroll-box">
                <div v-for="(item, index) in ticketList ? ticketList : ''" :key="index" @click="goQRcode(item)">
                    <div class="movie-info">
                        <div class="img-box">
                            <img :src="item[0].img" alt="">
                        </div>
                        <div class="text-box">
                            <span>{{ item[0].nm }}</span>
                            <span>{{ item[1].nm }}</span>
                        </div>
                    </div>
                    <div class="seat-info">
                        <div class="scroll-box">
                            <div v-for="(seat, index) in item[2]" :key="index">
                                {{ seat.row }}排{{ seat.col }}座
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tickets: null,
            ticketList: [],
        }
    },
    created() {
        this.$store.commit('getUserInfo');
        for (let i = 0; i < this.$store.state.userInfoList.data.length; i++) {
            // 找到暂存里的用户并更新
            if (this.$store.state.userInfoList.data[i].number == this.$store.state.userInfoList.logged) {

                // 添加电影票到用户信息里
                this.tickets = this.$store.state.userInfoList.data[i].tickets
                break;
            }
        }

        console.log(this.tickets);

        // this.cinemaName = this.getCinemaName(this.tickets.cinemaId)
        // this.movieName =  this.getMovie(this.tickets.movieId)[0]
        // this.movieImg =  this.getMovie(this.tickets.movieId)[1]
        for (let i = 0; i < this.tickets.length; i++) {

            // 内部向ticketList push
            this.getInfo(this.tickets[i].cinemaId, this.tickets[i].movieId, this.tickets[i].seats, i)

        }
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        },
        getInfo(cinemaId, movieId, seats, i) {
            let getMovie = this.axios.get('https://apis.netstart.cn/maoyan/movie/detail', {
                params: {
                    movieId: movieId
                }
            }).then(res => {
                return res.data.movie
            }).catch(err => {
                console.log(err);
            })

            let getCinema = this.axios.get('https://apis.netstart.cn/maoyan/cinema/detail', {
                params: {
                    cinemaId: cinemaId
                }
            }).then(res => {
                return res.data.data
            }).catch(err => {
                console.log(err);
            })

            Promise.all([getMovie, getCinema]).then(res => {
                res.push(seats)
                this.ticketList.push(res)
                console.log(this.ticketList);
                return res
            })
        },
        goQRcode(s) {
            console.log(s);
            let seats = JSON.stringify(s[2])
            this.$router.push({ name: 'QRcode', query: { seats: seats, movieId: s[0].id, cinemaId: s.cinemaId , isGoBack: true} })
        }
    }
}
</script>

<style lang="scss" scoped>
.ticketsList::before {
    width: 100%;
    height: 40px;
    display: block;
    content: '';
}

.ticketsList {
    width: 100vw;
    height: 100vh;

    .top {
        width: calc(100% - 40px);
        margin: 0 20px;
        position: relative;

        .back {
            width: 22px;
            min-height: 22px;
            padding: 10px;
            padding-left: 0px;

            img {
                width: 100%;
            }
        }

        span {
            position: absolute;
            height: 40px;
            width: 120px;
            line-height: 42px;
            text-align: center;
            color: #fff;
            font-size: 18px;
            font-weight: bolder;
            top: 0px;
            left: calc(50% - 120px / 2);
        }
    }

    .tickets-box {
        width: 100%;
        height: calc(100% - 100px);
        overflow: scroll;

        >.scroll-box {
            width: 100%;
            height: max-content;

            >div {
                width: calc(100% - 40px);
                margin: 20px;
                height: 140px;
                background-color: #fff;
                border-radius: 10px;

                .movie-info {
                    width: 100%;
                    height: 70%;
                    display: flex;
                    align-items: center;

                    .img-box {
                        width: 55px;
                        height: calc(55px * 1.3957);
                        border-radius: 5px;
                        margin: 0 10px;

                        img {
                            width: 100%;
                        }
                    }

                    .text-box {
                        display: flex;
                        flex-direction: column;

                        span:first-child {
                            font-size: 16px;
                            font-weight: bolder;
                        }

                        span:last-child {
                            font-size: 14px;
                        }
                    }
                }

                .seat-info {
                    width: 100%;
                    height: 30%;
                    overflow: scroll;

                    >.scroll-box {
                        height: calc(100% - 10px);
                        width: max-content;
                        margin: 0 10px;
                        margin-bottom: 10px;
                        display: flex;

                        >div {
                            background-color: #d5cfc080;
                            height: 100%;
                            width: 70px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 5px;
                            margin-right: 10px;
                        }

                        >div:last-child {
                            margin-right: 0px;
                        }
                    }
                }
            }
        }
    }

    // .scroll-box
}</style>
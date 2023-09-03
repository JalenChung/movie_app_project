<template>
    <div class="choose-cinema">
        <div class="top">
            <div class="back" @click="goBack">
                <img src="../assets/chevron-left-white.png" alt="">
            </div>
            <div class="address" @click="ctrlVanArea">
                <span>{{ address.nm }}</span>
                <img src="../assets/location-dot.png" alt="">
            </div>
            <van-popup v-model="show" get-container="body" position="top" :style="{ height: '35%' }">
                <!-- 地址选择器 -->
                <van-area title="请选择地区" :area-list="areaList" @confirm="selectedAddress" @cancel="ctrlVanArea"
                    columns-num="2" />
            </van-popup>
        </div>

        <div class="movie-box">
            <div class="movie-info">
                <div>
                    <span>{{ movieInfo.name }}</span>
                    <span>{{ movieInfo.name_en }}</span>
                    <Star class="star" :score="movieInfo.sc" :width="12"></Star>
                    <span>{{ movieInfo.cat }}</span>
                </div>
            </div>
            <img class="movie-img" :src="movieInfo.img" alt="">
        </div>

        <div class="date-list">
            <ul>
                <li :class="checked == index ? 'active' : ''" @click="checked = index" v-for="(item, index) in dates"
                    :key="index" v-text="processDate(item, index)"></li>
            </ul>
        </div>

        <CinemaList :list-data="cinemaList[checked]" :movie-id="movieInfo.id"></CinemaList>
    
    </div>
</template>

<script>
import Star from '@/components/Star.vue';
import CinemaList from '@/components/CinemaList.vue';
import { areaList } from '@vant/area-data';
export default {
    name: 'ChooseCinema',
    components: {
        Star,
        CinemaList,
    },
    data() {
        return {
            show: false,
            movieInfo: {},
            // 7天的电影院列表
            cinemaList: [],
            address: null,
            areaList: '',
            // 选中日期的下标
            checked:0
        }
    },
    created() {
        this.areaList = areaList;
        this.$store.dispatch('getApiCityList')
        this.movieInfo = this.$route.query;
        if (this.$store.state.userInfo.address) {
            this.address = this.$store.state.userInfo.address
            this.getCinemaList();
        } else {
            // 如果用户没有事先选择城市则打开城市选择器
        }
        console.log(this.dates);
        console.log(this.address);
    },
    methods: {
        goBack() {
            this.$router.go(-1);
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
        // 获取每天电影院列表
        getCinemaList() {
            this.cinemaList = []
            this.dates.forEach(date => {
                this.axios('https://apis.netstart.cn/maoyan/movie/select/cinemas', {
                    method: 'get',
                    params: {
                        showDate: date.y + '-' + date.m + '-' + date.d,
                        movieId: this.movieInfo.id,
                        cityId: this.address.id
                    },
                }).then(res => {
                    console.log(res.data.data.cinemas);
                    this.cinemaList.push(res.data.data.cinemas)
                }).catch(err => {
                    console.log(err);
                })
            })
        },
        // 通过传入选择器选中的城市来获取城市api中相对应的城市信息
        selectedAddress(e) {
            console.log(e);
            this.$store.commit('getAddress', e[1])
            // 更新当前地址
            this.address = this.$store.state.userInfo.address
            // 更新电影院信息
            this.getCinemaList()
            // 关闭选择器
            this.show = false;
        },
        ctrlVanArea() {
            this.show = !this.show;
        },
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
    },
}
</script>

<style lang="scss" scoped>
.choose-cinema {
    width: 100vw;
    height: 100vh;
    background-color: #162D38;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .top {
        display: flex;
        justify-content: space-between;
        margin-top: 40px;
        min-height: 50px;

        .back {
            width: 22px;
            padding: 10px;
            margin: 0 10px;

            img {
                width: 100%;
            }
        }

        .address {
            padding: 10px;
            margin: 0 10px;
            padding-top: 2px;

            >span {
                font-size: 16px;
                font-weight: 600;
                color: #f8f8f8;
                margin-right: 3px;
            }

            >img {
                width: 25px;
                margin-top: 6px;
            }


        }
    }

    .movie-box {
        padding-top: 30px;
        min-height: 115px;
        width: calc(100% - 40px);
        margin: 0 20px;
        position: relative;

        .movie-img {
            display: block;
            width: 80px;
            border-radius: 10px;
            position: absolute;
            bottom: 18px;
            left: 18px;
            box-shadow: 5px 5px 12px #162d3887;
        }

        .movie-info {
            background: #F8F8F8;
            width: 100%;
            border-radius: 10px;
            height: 115px;

            >div {
                margin-left: 115px;
                display: flex;
                flex-direction: column;

                >span:nth-child(1) {
                    font-size: 20px;
                    font-weight: bolder;
                    color: rgba(0, 0, 0, 0.907);
                    padding-top: 18px;
                }

                >span:nth-child(2) {
                    font-size: 10px;
                    color: rgba(0, 0, 0, 0.373);
                }

                .star {
                    margin: 0px;
                    color: #b5b5b5;
                    margin: 1px 0;
                }

                >span:nth-child(4) {
                    font-size: 10px;
                    color: rgba(0, 0, 0, 0.373);
                }
            }
        }
    }

    // .#D5E8F1
    .date-list {
        width: 100%;
        margin-top: 20px;
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

            li:last-child {
                margin-right: 20px;
            }
        }
    }

    .cinema-list {
        flex-grow: 1;
        margin: 0 20px;
        margin-bottom: 45px;
        margin-top: 10px;
        overflow: scroll;
        position: relative;
        width: calc(100% - 40px);

        .scroll-box {
            width: 100%;
            height: max-content;
            position: relative;

            // background-color: red;
            .cinema-box {

                width: 100%;
                height: calc(115px + 10px);
                position: relative;

                .cinema {
                    margin-top: 10px;
                    width: 100%;
                    height: calc(100% - 10px);
                    background-color: #F8F8F8;
                    border-radius: 10px;
                    position: relative;

                    .name {
                        padding: 20px;
                        font-weight: bolder;
                        padding-bottom: 5px;
                        width: 65%;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }

                    .address {
                        font-size: 10px;
                        padding-left: 20px;
                        color: #a5a5a5;
                        width: 72%;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }

                    .labels-box {
                        padding-left: 20px;
                        padding-top: 5px;
                        width: max-content;
                        display: flex;

                        span {
                            display: block;
                            font-size: 10px;
                            padding: 1px 5px;
                            border-radius: 3px;
                            width: max-content;
                            margin-right: 5px;
                        }
                    }

                    .time-box {
                        padding-left: 20px;
                        margin: 0px;
                        margin-top: 5px;
                        font-size: 10px;
                        color: #909090;
                    }

                    .price {
                        position: absolute;
                        right: 20px;
                        top: 20px;
                        font-size: 17px;
                        color: #e9343c;
                    }
                }

                .cinema-type {
                    position: absolute;
                    width: max-content;
                    height: 20px;
                    // background: blue;
                    top: 5px;
                    right: 30px;

                    span {
                        display: block;
                        flex-grow: 1;
                        font-size: 10px;
                        background-color: #564EF0;
                        margin-left: 10px;
                        width: max-content;
                        line-height: 20px;
                        padding: 0 10px;
                        color: rgba(255, 255, 255, 0.889);
                        height: 100%;
                        float: left;
                        border-bottom-left-radius: 6px;
                        border-bottom-right-radius: 6px;
                    }
                }
            }
        }


    }
}

.choose-cinema::after {
    display: block;
    content: '';
    width: calc(100% + 1px);
    height: 50px;
    position: absolute;
    bottom: 30px;
    left: 0px;
    background: linear-gradient(to top, #162D38, #162d3800);
}
</style>
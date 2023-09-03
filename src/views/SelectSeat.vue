<template>
    <div class="selectSeat">

        <div class="top">
            <div class="back" @click="goBack">
                <img src="../assets/chevron-left-white.png" alt="">
            </div>
            <span>{{ cinemaName}}</span>
        </div>

        <div class="seats-box">
            <div class="move-box" ref="movieBox" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
                <div class="screen" :style="`width: ${screenW}px; height: ${screenH}px`">
                    <img src="../assets/screen.png" alt="">
                </div>
                <p class="cinema-name">{{ th }}</p>
                <div class="seats">
                    <!-- {{ seatData ? seatData.seat : '' }} -->
                    <div class="row" v-for="(rowId, index) in seatData ? seatData.rowSize : ''" :key="index">
                        <div class="column" v-for="(columnId, index) in seatData ? seatData.columnSize : ''" :key="index">
                            <!-- 在这里判断能不能点 -->
                            <div class="seat" @click="setPreSeats(rowId, columnId)"
                                :style="`background-image: url(${getIcon(rowId, columnId).img}); opacity: ${getIcon(rowId, columnId).op};`">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bottom">
            <div class="seat-explain">
                <div v-for="(item, index) in icons" :key="index">
                    <div class="img-box">
                        <img :src="item.legendIcon" alt="">
                    </div>
                    <span>{{ item.legendName }}</span>
                </div>
            </div>
            <div class="movie-info">
                <span>{{ movieName }}</span>
                <span>{{ lang + tp }}</span>
                <span>{{ dt + " | " + tm + " - " + endTime }}</span>
                <div>
                    <div class="scroll-box">
                        <div v-for="(item, index) in preSeats" :key="index">
                            <span>{{ item.row }}排{{ item.col }}座</span>
                            <span>{{ price }}元</span>
                            <div class="delete-btn" @click="deleteSeat(item.row, item.col)">×</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pay-btn-box">
                <button class="pay-btn3" v-if="!payStatus" @click="selectPayMode"
                    :style="`opacity: ${preSeats.length ? 1 : '.5'};`">
                    ￥{{ price * preSeats.length }} 确认选座
                </button>
                <button class="pay-btn1" v-if="payStatus" @click="payStatus = false">
                    取消订单
                </button>
                <button class="pay-btn2" v-if="payStatus" @click="pay">
                    ￥{{ price * preSeats.length }} 提交订单
                </button>
            </div>
        </div>

        <div class="pay" v-if="payStatus">
            <div v-for="(item, index) in payMode" :key="index" :class="pay_i == index ? 'active' : ''"
                :style="`background: ${item.bgColor};`" @click="pay_i = index">
                <div class="img-box">
                    <img :src="item.img" alt="">
                </div>
                <span>{{ item.text }}</span>
            </div>
            <button>＋添加支付方式</button>
        </div>

    </div>
</template>

<script>
export default {
    data() {
        return {
            cinemaName: null,
            movieBox: null,
            move: {
                startX: 0,
                startY: 0,
                endX: 0,
                endY: 0,
            },
            seatData: null,
            icons: null,
            seats: [],
            movieInfo: null,
            preSeats: [],
            screenW: 200,
            screenH: 40,
            price: 28,
            payStatus: false,
            payMode: [
                {
                    text: "支付宝支付",
                    img: require('../assets/alipay.png'),
                    bgColor: '#1296db42'
                },
                {
                    text: '微信支付',
                    img: require('../assets/weixin.png'),
                    bgColor: '#01CD0D42'
                },
                {
                    text: 'PayPal支付',
                    img: require('../assets/cc-paypal.png'),
                    bgColor: '#13227a42'
                },
                {
                    text: '钱包支付',
                    img: require('../assets/sack-dollar.png'),
                    bgColor: '#FE8D0042'
                }
            ],
            th:null,
            tm:null,
            dt:null,
            tp:null,
            lang:null,
            movieName:null,
            movieTime:null,
            movieId  :null,
            pay_i: 0,
            cinemaId:null,
        }
    },
    created() {
        this.$nextTick(() => {
            this.movieBox = this.$refs.movieBox
        })

        
        this.cinemaName = this.$route.query.cinemaName
        this.th = this.$route.query.th
        this.tm = this.$route.query.tm
        this.dt = this.$route.query.dt
        this.tp = this.$route.query.tp
        this.lang = this.$route.query.lang
        // this.movieInfo = this.$route.query.movieInfo
        this.cinemaId = this.$route.query.cinemaId
        this.movieName=this.$route.query.movieName
        this.movieTime=this.$route.query.movieTime
        this.movieId  =this.$route.query.movieId


        if (this.th.indexOf("杜比") != -1 || this.th.indexOf("IMAX") != -1) {
            this.getSeatData('https://apis.netstart.cn/maoyan/cinema/seat-m.json')
            this.screenW = 320
            this.screenH = 60
        } else {
            this.getSeatData('https://apis.netstart.cn/maoyan/cinema/seat.json')
            this.screenW = 200
            this.screenH = 40
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        touchstart(e) {
            this.move.startX = e.changedTouches[0].pageX - this.move.endX
            if (this.move.startY != 0) {
                this.move.startY = e.changedTouches[0].pageY - this.move.endY + 100
            } else {
                this.move.startY = e.changedTouches[0].pageY - this.move.endY
            }
        },
        touchmove(e) {
            let moveX = e.changedTouches[0].pageX - this.move.startX
            let moveY = e.changedTouches[0].pageY - this.move.startY
            // console.log(moveX);
            this.movieBox.style.left = moveX + 'px'
            this.movieBox.style.top = moveY + 'px'
        },
        touchend(e) {
            this.move.endX = this.movieBox.getBoundingClientRect().left
            this.move.endY = this.movieBox.getBoundingClientRect().top
        },
        getSeatData(url) {
            this.axios.get(url).then(res => {
                this.seatData = res.data.data.seat.regions[0]
                console.log('seatData==>', this.seatData);
                let rows = this.seatData.rows
                for (let i = 0; i < rows.length; i++) {
                    let seats = rows[i].seats
                    for (let v = 0; v < seats.length; v++) {
                        this.seats.push(seats[v])
                    }
                }
                // console.log(this.seats);

                this.icons = res.data.data.seat.image.seatLegends


                console.log(this.icons);
            }).catch(err => {
                console.log(err);
            })

        },
        getIcon(rowId, columnId) {
            let obj = {
                img: '',
                op: 0
            }
            let colId = parseInt(columnId, 10)
            let seat = this.seats.filter(seat => {
                if (seat.columnId == colId && seat.rowId == rowId) {
                    return seat
                }
            })[0]
            // console.log(seat);
            if (seat) {
                switch (seat.seatStatus) {
                    case 1:
                        obj.img = this.icons[0].legendIcon
                        obj.op = 1
                        break;
                    case 2:
                        obj.img = require('../assets/icon2.png')
                        obj.op = 1
                        break;
                    case 3:
                        obj.img = this.icons[1].legendIcon
                        obj.op = 1
                        break;
                    case 4:
                        obj.img = this.icons[2].legendIcon
                        obj.op = '.5'
                        break;
                }
                return obj
            } else {
                return obj
            }
        },
        getSeatType(row, col) {
            console.log(this.seats);
        },
        addMinutes(time) {

            const [hours, mins] = time.split(':').map(v => parseInt(v));

            const totalMins = mins + this.tm;
            const addedHours = Math.floor(totalMins / 60);
            const addedMins = totalMins % 60;

            const addedTime = [
                hours + addedHours,
                addedMins < 10 ? '0' + addedMins : addedMins
            ].join(':');

            return addedTime;

        },
        setPreSeats(row, col) {
            // let selectable = false
            this.seats.map(e => {
                let colId = parseInt(e.columnId, 10)
                if (e.rowId == row && colId == col) {
                    if (e.seatStatus == 1 || e.seatStatus == 2) {
                        const index = this.preSeats.findIndex(o => o.row == row && o.col == col);
                        if (index !== -1) {
                            this.preSeats.splice(index, 1);
                            e.seatStatus = 1
                        } else if (index == -1) {
                            // 如果没有找到匹配的对象,则推入数组
                            this.preSeats.push({ row, col });
                            e.seatStatus = 2
                        }
                    }
                }
            })


        },
        deleteSeat(row, col) {
            const index = this.preSeats.findIndex(o => o.row == row && o.col == col);
            if (index !== -1) {
                // 如果找到匹配的对象,则删除它
                this.setPreSeats(row, col)

                this.preSeats.splice(index, 1);
            }
        },
        selectPayMode() {
            if (this.preSeats.length) {
                this.payStatus = true
            }
        },
        pay() {
            if (this.payStatus) {
                console.log(this.preSeats);
                let seats = JSON.stringify(this.preSeats)
                this.$router.push({ name: 'QRcode', query: { seats: seats, movieId: this.movieId,cinemaId:this.cinemaId ,isGoBack:false} })
            }
        }
    },
    computed: {
        endTime() {
            let movieTime = parseFloat(this.movieTime)
            let timeArr = this.tm.split(':')
            let hour = parseFloat(timeArr[0])
            let min = parseFloat(timeArr[1])
            min += movieTime
            hour += Math.floor(min / 60)
            min = min % 60

            if (hour < 10) {
                hour = "0" + hour
            }
            if (min < 10) {
                min = "0" + min
            }
            return hour + ':' + min
        }

    }
}
</script>

<style lang="scss" scoped>
.selectSeat::before {
    width: 100%;
    height: 40px;
    display: block;
    content: '';
}

.selectSeat {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;

    .top {
        width: calc(100% - 40px);
        margin: 0 20px;
        display: flex;

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
            line-height: 42px;
            color: #fff;
            font-size: 18px;
            font-weight: bolder;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }

    .seats-box {
        width: 100%;
        height: calc(100% - 82px);
        // border: 1px solid #fff;
        overflow: hidden;
        position: relative;

        .move-box {
            position: absolute;
            top: 0px;
            left: 0px;
            min-height: 100%;
            min-width: 100%;

            .screen {
                width: 200px;
                height: 40px;
                opacity: .6;
                margin: 20px auto;

                img {
                    width: 100%;
                }
            }

            .cinema-name {
                text-align: center;
                color: #fff;
                margin: 0px;
            }

            .seats {
                width: max-content;
                margin: 0 auto;

                .row {
                    display: flex;
                    flex-direction: row;

                    .column {
                        margin: 5px;
                        border: 1px solid #ffffff58;
                        border-radius: 8px;
                        // background-color: #049B7A;

                        .seat {
                            width: 28px;
                            height: 28px;

                            background-size: contain;
                        }
                    }

                }
            }

        }
    }


    .bottom {
        position: fixed;
        bottom: 0px;
        width: 100%;
        height: 320px;
        // border: 1px solid #fff;

        .seat-explain {
            width: 200px;
            height: 50px;
            display: flex;
            margin: 0 auto;
            justify-content: space-between;

            >div {
                display: flex;
                align-items: center;

                .img-box {
                    width: 25px;
                    height: 25px;
                    border-radius: 5px;

                    img {
                        width: 100%;
                    }
                }

                span {
                    color: #fff;
                    font-size: 13px;
                    white-space: nowrap;
                }
            }

            >div:nth-child(3) {
                .img-box {
                    opacity: .6;
                }
            }
        }

        .movie-info {
            width: calc(100% - 40px * 2);
            margin: 0 20px;
            height: max-content;
            background-color: #fff;
            border-radius: 10px;
            padding: 20px;
            display: flex;
            flex-direction: column;

            span:nth-child(1) {
                font-size: 18px;
                font-weight: bolder;
            }

            >div {
                width: 100%;
                // height: 40px;
                overflow: scroll;

                .scroll-box {
                    height: 100%;
                    width: max-content;
                    display: flex;

                    >div {
                        height: 100%;
                        width: 60px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        padding: 0 5px;
                        margin-right: 10px;
                        padding-right: 10px;
                        margin-top: 10px;
                        background-color: #eaeaea;
                        border-radius: 5px;
                        position: relative;

                        span {
                            font-size: 15px;
                            font-weight: lighter;
                        }

                        span:nth-child(2) {
                            font-size: 14px;
                        }

                        span:nth-child(2) {
                            font-size: 12px;
                        }

                        .delete-btn {
                            position: absolute;
                            right: 0px;
                            padding: 5px;
                        }
                    }
                }
            }
        }

        .pay-btn-box {
            width: calc(100% - 40px);
            margin: 20px;
            height: 45px;
            display: flex;

            button {
                flex-grow: 1;
                border: none;
                outline-style: none;
                border-radius: 10px;
                color: #001C10;
                font-weight: bolder;
                font-size: 16px;
            }

            .pay-btn1 {
                background-color: #7b7b7bcc;
            }

            .pay-btn2 {
                background-color: #FDF06E;
                margin-left: 10px;
            }

            .pay-btn3 {
                background-color: #FDF06E;

            }

            .pay-btn2:active {
                background-color: #fdf16ed2;
            }
        }
    }

    .pay {
        position: absolute;
        width: calc(100% - 40px);
        height: calc(100% - 320px - 100px);
        margin: 0 20px;
        background-color: #fff;
        border-radius: 12px;
        bottom: 320px;
        display: flex;
        flex-direction: column;

        >div {
            display: flex;
            width: calc(100% - 40px);
            padding: 20px;
            height: 8%;
            align-items: center;
            opacity: .6;
            transition: opacity .5s, height .5s;

            .img-box {
                width: 40px;
                transition: width .5s;
                background-color: none;

                img {
                    width: 100%;
                }
            }

            span {
                padding: 0 10px;
                padding-bottom: 4px;
                transition: font-size .5s, font-weight .5s, color .5s;

            }
        }

        >div:last-child {
            .img-box {
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    width: 80%;
                }
            }
        }

        .active {
            opacity: 1;
            height: 16%;
            transition: opacity .5s, height .5s;

            .img-box {
                width: 60px;
                transition: width .5s;
            }

            span {
                font-size: 22px;
                font-weight: bolder;
                color: rgba(44, 44, 44, 0.942);
                transition: font-size .5s, font-weight .5s, color .5s;
            }
        }

        button {
            background-color: #fff;
            outline-style: none;
            border: none;
            flex-grow: 1;
            font-weight: bolder;
            color: #000000ce;
        }
    }

}
</style>
<template>
    <div class="cinema-list" :style="`margin-bottom: ${marginBottom}px;`">
        <div class="scroll-box">
            <div class="cinema-box" v-for="(item, index) in ListData" :key="index" @click="goSelectSession(item)">
                <div class="cinema">
                    <div class="name">{{ item.name ? item.name : item.title }}</div>
                    <div class="address">{{ item.addr ? item.addr : item.location }}</div>
                    <div class="labels-box">
                        <div v-if="item.labels">
                            <div v-for="(label, index) in item.labels" :key="index">
                                <span v-if="label.name != '杜比全景声厅' && label.name != 'IMAX厅'"
                                    :style="`border: 1px solid ${label.color};color: ${label.color};`">
                                    {{ label.name }}
                                </span>
                            </div>
                        </div>
                        <div v-if="item.services">
                            <div v-for="(label, index) in item.services" :key="index">
                                <span v-if="label.text != '杜比全景声厅' && label.text != 'IMAX厅'"
                                    :style="`border: 1px solid rgb(87, 157, 175);color: rgb(87, 157, 175);`">
                                    {{ label.text }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <p class="time-box">
                        <span>{{ item.showTimes ? item.showTimes : '' }}</span>
                    </p>
                    <div class="price">{{ item.sellPrice ? item.sellPrice : item.price.n }}元起</div>
                </div>
                <div class="cinema-type">
                    <span v-if="hasDolby(item.labels ? item.labels : item.services)">杜比全景声</span>
                    <span v-if="hasIMAX(item.labels ? item.labels : item.services)">IMAX</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        ListData: [],
        marginBottom: {
            default: 45
        },
        movieId: {
            default: 0
        },
    },
    methods: {
        hasDolby(labels) {
            let isDolby = false;
            labels.map(label => {
                if (label.name == '杜比全景声厅' || label.text == '杜比全景声厅') {
                    isDolby = true
                }
            })
            return isDolby
        },
        hasIMAX(labels) {
            let isIMAX = false
            labels.map(label => {
                if (label.name == 'IMAX厅' || label.text == 'IMAX厅' ) {
                    isIMAX = true
                }
            })
            return isIMAX
        },
        goSelectSession(cinema) {
            console.log(cinema);
            let cinemaId = cinema.id ? cinema.id : cinema.cinemaId 
            this.$router.push({
                name: 'SelectSession',
                query: {
                    movieId: this.movieId,
                    cinemaId: cinemaId,
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.cinema-list {
    flex-grow: 1;
    margin: 0 20px;
    // margin-bottom: 45px;
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
                    margin-left: 20px;
                    padding-top: 5px;
                    width: 70%;
                    overflow: scroll;

                    >div {
                        display: flex;
                        width: max-content;
                    }

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
</style>
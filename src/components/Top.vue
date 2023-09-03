<template>
    <div class="top">
        <div class="address-box">
            <span class="address-name" @click="showPopup">{{ address ? address.nm : '选择地区' }}</span>
            <!-- 顶部下拉框 -->
            <van-popup v-model="show" get-container="body" position="top" :style="{ height: '35%' }">
                <!-- 地址选择器 -->
                <van-area title="请选择地区" :area-list="areaList" @confirm="selectedAddress" @cancel="closeVanArea"
                    columns-num="2" />
            </van-popup>
            <img src="../assets/chevron-down.png" alt="">
        </div>
        <div class="search">
            <input type="text" v-model="inpText">
            <div>
                <img :src="searchImg" alt="" @click="search">
            </div>
        </div>
    </div>
</template>

<script>
import { areaList } from '@vant/area-data';
import { Toast } from 'vant';
import axios from 'axios';
export default {
    props: {
        afterConfirm: {
            default: null,
            type: Function
        }
    },
    data() {
        return {
            areaList: null,
            show: false,
            searchImg: require('../assets/search.png'),
            inpText: null,
        }
    },
    methods: {
        showPopup() {
            this.show = true;
        },
        selectedAddress(e) {
            this.$store.commit('getAddress', e[1])
            this.show = false;
            if (this.afterConfirm) {
                afterConfirm()
            }
        },
        closeVanArea() {
            this.show = false;
        },
        search() {
            console.log(this.$store.state.movieList);
            let res = this.$store.state.movieList.filter(movie=>{
                return movie.nm.toLowerCase().indexOf(this.inpText.toLowerCase()) !== -1; 
            })
            console.log(res);
            if (res.length == 0) {
                Toast.fail('未找到该电影');
            }else{
                let id = res[0].id
                this.$router.push({ name: 'MovieDetail', query: { id: id, } })
            }
        },
    },
    computed: {
        address() {
            return this.$store.state.userInfo.address
        },
    },

    created() {
        this.areaList = areaList
        console.log(this.$store.state.userInfo.address);
    }
}
</script>

<style lang="scss" scoped>
$pub_padding: 20px;

.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc(100% - $pub_padding * 2);
    padding: 0 $pub_padding;
    padding-bottom: $pub_padding;
    padding-top: 40px;
    position: fixed;
    top: 0px;
    // z-index: 5000px;
    background-color: #001c27;

    .address-box {
        display: flex;
        align-items: center;

        .address-name {
            font-size: 22px;
            font-weight: bolder;
            color: #fff;
        }

        img {
            width: 20px;
            height: 22px;
            padding: 10px;
        }
    }

    .search {
        display: flex;

        input {
            background-color: transparent;
            border: none;
            border-bottom: 2px solid #fff;
        }

        >div {
            width: 23px;

            margin: calc(7px / 2);

            >img {
                width: 100%;
            }
        }

    }
}
</style>
<template>
    <div class="main">

        <div>
            <keep-alive :max="10">
                <router-view></router-view>
            </keep-alive>
        </div>

        <van-tabbar :route="true" fixed active-color="#FDF06E" inactive-color="#FDFFFF">
            <van-tabbar-item v-for="(item, index) in tabIcon " :key='index' :to="{ name: item.name }">
                <span>{{ item.text }}</span>
                <template #icon="props">
                    <img :src="props.active ? item.active : item.inactive" />
                </template>
            </van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
export default {
    name: "Main",
    data() {
        return {
            tabIcon: [
                {
                    text: '首页',
                    active: require('../assets/house_active.png'),
                    inactive: require('../assets/house_inactive.png'),
                    name: 'Home'
                },
                {
                    text: '电影',
                    active: require('../assets/glasses_active.png'),
                    inactive: require('../assets/glasses_inactive.png'),
                    name: 'Movie'
                },
                {
                    text: '影院',
                    active: require('../assets/couch_active.png'),
                    inactive: require('../assets/couch_inactive.png'),
                    name: 'Cinema'
                },
                {
                    text: '我的',
                    active: require('../assets/user_active.png'),
                    inactive: require('../assets/user_inactive.png'),
                    name: 'User'
                }
            ],
        }
    },
    created() {
        this.$store.dispatch('getMovieList');
        this.$store.dispatch('getApiCityList');
        this.$store.dispatch('getGoodReviewMovie');

        this.$store.commit('getUserInfo');

    },
    computed: {
    }
}
</script>

<style lang="scss" scoped>
$bottom_bg_color: #001c27e6;

.main {
    width: 100%;
    height: 100%;
    overflow: hidden;

    >div:first-child {
        width: 100%;
    }

    .van-tabbar {
        height: 60px;
        padding-bottom: 22px;
        background-color: $bottom_bg_color;

        .van-tabbar-item {
            background-color: #ffffff00;
            font-size: 10px;
        }

        .van-tabbar-item:nth-child(3) {
            img {
                width: 23px;
            }
        }
    }
}

[class*=van-hairline]::after {
    border: none !important;
}
</style>
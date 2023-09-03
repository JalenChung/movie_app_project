<template>
    <div class="star">
        <div v-if="score != 0">
            <img :style="`width:${width}px;`" v-for="i in count - scoreIsInteger" :key="i + '-img1'" :src="stars.light">
            <img :style="`width:${width}px;`" v-if="scoreIsInteger" :src="stars.half">
            <img :style="`width:${width}px;`" v-for="i in  5 - count" :key="i + '-img2'" :src="stars.dark">
            <span :style="`color: ${bg};`">{{ score }}</span>
        </div>
        <div class="t" v-else v-text="'即将上映'"></div>
    </div>
</template>

<script>
export default {
    props: {
        score: {
            default: 0
        },
        width: {
            default: 9
        },
        bg:{
            default: '#999'
        }
    },
    data() {
        return {
            stars: {
                light: require('../assets/star_light.png'),
                half: require('../assets/star_half.png'),
                dark: require('../assets/star_dark.png')
            },
            scoreIsInteger: 1
        }
    },
    computed: {
        count() {
            return Math.floor(this.score / 2)
        },
    },
    created() {
        if (Number.isInteger(Number(this.score))) {
            this.scoreIsInteger = 0
        }
    }
}
</script>

<style lang="scss" scoped>
.star {
    margin: 0 auto;
    width: max-content;
}

.star span {
    font-size: 12px;
    margin-left: 3px;
}

.star .t{
    opacity: .6;
    font-size: 13px;
}
</style>
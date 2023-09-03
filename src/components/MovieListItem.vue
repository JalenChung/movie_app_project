<template>
    <div class="movie-list-item-box" :style="`width:${width}px;height:${name ? height + 60 : height}px;`" @click="fn">
        <div class="img-box" :style="`width:${width}px;height:${height}px`">
            <img :src="img" alt="">
        </div>
        <div class="movieInfo" v-if="name" ref="movieInfo">
            <p>{{ name }}</p>
            <Star :score="score"></Star>
        </div>
    </div>
</template>

<script>
import Star from './Star.vue'
export default {
    name: 'MovieListItem',
    components:{
        Star,
    },
    props: {
        img: {
            default: ''
        },
        name: {
            default: null,
        },
        score: {
            default: 0
        },
        goDetail: {
            type: Function
        },
    },
    data() {
        return {
            width: null,
            height: null,
            scoreIsInteger: 1
        }
    },
    created() {
        this.width = this.$parent.width
        this.height = this.$parent.height

    },
    methods: {
        fn(){
           this.$emit('goDetail') 
        }
    },
}
</script>

<style>
.movie-list-item-box {
    margin-right: 20px;
    float: left;
}

.img-box {
    overflow: hidden;
    background: #FDFFFF;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    align-items: center;
}

.img-box img {
    width: 100%;
}

.movieInfo>p {
    text-align: center;
    padding: 12px 0 6px 0;
    margin: 0;
}

/* .star {
    margin: 0 auto;
    width: max-content;
}

.star>img {
    width: 9px;
}

.star>span {
    font-size: 12px;
    margin-left: 3px;
    color: #69838D;
} */
</style>
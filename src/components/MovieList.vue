<template>
    <div class="movie-list-box">
        <div ref="refContent" class="scroll-box">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MovieList',
    props: {
        width: {
            type: Number,
            default: 310
        },
        height: {
            type: Number,
            default: 165
        }
    },
    data() {
        return {
            b_img_box: null,
            MovieInfo_h: 0
        }
    },
    methods: {
    },
    created() {
    }
}
</script>

<style lang="scss" scoped>
.movie-list-box {
    overflow: scroll;
    width: 100%;
    height: max-content;

    .scroll-box {
        width: max-content;
        margin-left: 20px;
        float: left;
    }
}

.movie-list-box::-webkit-scrollbar {
    display: none
}</style>
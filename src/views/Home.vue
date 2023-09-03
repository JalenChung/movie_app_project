<template>
  <div class="home">
    <!-- 位置与搜索 -->
    <Top></Top>
    <div class="z"></div>

    <div class="content-box">

      <div class="scroll-box">

        <van-swipe @change="cutSwipe" ref="swipe" class="my-swipe" :autoplay="5000" indicator-color="white">
          <van-swipe-item v-for="(item, index) in HorPosters" :key="index" @click="goDetail(item.id)">
            <img v-lazy="item.img" />
          </van-swipe-item>
        </van-swipe>

        <div class="hot">
          <span>热映影片</span>
          <span>更多</span>
        </div>

        <MovieList :height="185" :width="135">
          <MovieListItem v-for="(item, index) in movieList" :key="index" :name="item.nm" :img="item.img" :score="item.sc"
            @goDetail='goDetail(item.id)'>
          </MovieListItem>
        </MovieList>

        <div class="hot">
          <span>最受好评</span>
          <span>更多</span>
        </div>

        <MovieList :height="185" :width="135">
          <MovieListItem v-for="(item, index) in goodReviewMovie" :key="index" :name="item.name" :img="item.poster"
            :score="item.score" @goDetail='goDetail(item.movieId)'>
          </MovieListItem>
        </MovieList>

      </div>

    </div>


  </div>
</template>

<script>
import MovieList from '@/components/MovieList.vue';
import MovieListItem from '@/components/MovieListItem.vue';
import Top from '@/components/Top.vue';
export default {
  name: 'Home',
  data() {
    return {
      // 横板海报
      HorizontalPosters: []
    }
  },
  components: {
    Top,
    MovieList,
    MovieListItem,
  },

  computed: {
    apiCityList() {
      return this.$store.state.apiCityList
    },
    address() {
      return this.$store.state.userInfo.address
    },
    movieList() {
      return this.$store.state.movieList
    },
    goodReviewMovie() {
      return this.$store.state.goodReviewMovie
    },
    HorPosters() {
      return this.$store.state.HorPosters
    }
  },
  methods: {
    cutSwipe(i) {
      if (i == 0) {
        this.$refs.swipe.swipeTo(0)
      }
    },
    // 跳转去影片细节页(列表类型[1为热映影片2为好评影片3为其他]，下标)
    goDetail(id) {
      console.log(id);
      this.$router.push({ name: 'MovieDetail', query: { id: id, } })
    }
  },
  created(){
    console.log(this.address);

  }
}
</script>

<style lang="scss" scoped>
$font-color: #FDFFFF;
$pub_padding: 20px;

.home::before {
  display: block;
  content: '';
  width: 100%;
  height: 110px;
}

.home {
  width: 100%;
  height: 100vh;
  color: $font-color;
  display: flex;
  flex-direction: column;

  .content-box {
    width: 100%;
    height: calc(100% - 110px);
    overflow: scroll;

    .scroll-box {
      width: 100%;
      height: max-content;


      .my-swipe {
        width: calc(100% - 20px * 2);
        height: 180px;
        margin: 0 auto;

        img {
          opacity: 1;
          width: 100%;
        }
      }

      .my-swipe .van-swipe-item {
        color: #fff;
        font-size: 20px;
        line-height: 150px;
        text-align: center;
        border-radius: 10px;
        overflow: hidden;
      }

      .hot {
        padding: 0 $pub_padding;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        letter-spacing: 1px;
      }
    }

    .scroll-box::after {
      display: block;
      content: '';
      width: 100%;
      height: 110px;
    }
  }
}
</style>

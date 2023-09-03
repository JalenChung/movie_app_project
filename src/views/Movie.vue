<template>
  <div class="movie">
    <Top></Top>
    <div class="nav">
      <div class="scroll-box">
        <span v-for="(item, index) in movieDataList" :key="index" :class="nav_i == index ? 'active' : ''"
          @click="nav_i = index">
          {{ item.title }}
        </span>
      </div>
    </div>
    <div class="movie-list">
      <div class="scroll-box">
        <div v-for="(item, index) in movieDataList[nav_i].data ? movieDataList[nav_i].data : ''" :key="index" @click="goDetail(item.id)">
          <div class="img-box">
            <img :src="item.img" alt="">
          </div>
          <div class="info-box">
            <span class="name-cn">{{ item.nameCn }}</span>
            <span class="name-en">{{ item.nameEn }}</span>
            <Star :score="item.sc" :width="10"></Star>
            <span class="cat">{{ item.cat + ' ' + item.lang }}</span>
          </div>
          <div class="buy-btn">购票</div>
        </div>
      </div>
    </div>

  </div>
</template>
  
<script>
import Top from '@/components/Top.vue';
import Star from '@/components/Star.vue';
export default {
  name: 'Movie',
  components: {
    Top,
    Star
  },
  data() {
    return {
      nav_i: 0,
      movieDataList: [
        {
          title: '热门电影',
          data: []
        },
        {
          title: '好评影片',
          data: []
        },
        {
          title: '最受期待',
          data: []
        }
      ]
    }
  },
  created() {
    this.$store.dispatch('getMovieList');
    this.$store.dispatch('getGoodReviewMovie');
    setTimeout(() => {
      this.$store.state.movieList.map(movie => {
        this.getMovie(0, movie.id)
      })
      this.$store.state.goodReviewMovie.map(movie => {
        this.getMovie(1, movie.movieId)
      })
      this.getExpectedMovie()
    }, 1000)

  },
  methods: {
    getExpectedMovie(callback) {
      this.axios.get('https://apis.netstart.cn/maoyan/index/mostExpected', {
        params: {
          ci: this.$store.state.userInfo.address.id
        }
      }).then(res => {
        console.log(res.data.coming);
        res.data.coming.map(movie => {
          this.getMovie(2, movie.id)
        })
        // return res.data.coming
      }).catch(err => {
        console.log(err);
      })
    },
    getMovie(i, id) {
      this.axios.get('https://apis.netstart.cn/maoyan/movie/detail', {
        params: {
          movieId: id
        }
      }).then(res => {
        console.log(res.data.movie);
        this.movieDataList[i].data.push({
          nameCn: res.data.movie.nm,
          nameEn: res.data.movie.enm,
          img: res.data.movie.img,
          lang: res.data.movie.oriLang,
          cat: res.data.movie.cat,
          sc: res.data.movie.sc,
          id: res.data.movie.id,
        })
      }).catch(err => {
        console.log(err);
      })
    },
    goDetail(id){
      this.$router.push({name:'MovieDetail',query:{id:id}})
    }
  }


}
</script>

<style lang="scss" scoped>
.movie::before {
  display: block;
  content: '';
  width: 100%;
  min-height: 100px;
}

.movie {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .nav {
    width: calc(100% - 40px);
    min-height: 30px;
    margin: 0 20px;
    overflow: scroll;

    .scroll-box {
      width: max-content;

      span {
        color: #fff;
        opacity: .6;
        font-size: 17px;
        margin-right: 20px;
      }

      .active {
        opacity: .95;
      }
    }
  }

  .movie-list {
    flex-grow: 1;
    width: 100%;
    overflow: scroll;

    .scroll-box {
      width: 100%;
      height: max-content;

      >div {

        width: 100%;
        height: 150px;
        // background: rgb(209, 209, 165);
        position: relative;

        .img-box {
          position: absolute;
          bottom: 30px;
          left: 40px;
          width: 80px;
          height: calc(80px * 1.3957);
          margin-right: 10px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          background-color: #fff;
          box-shadow: 5px 5px 15px rgba(50, 50, 50, 0.252);
          border-radius: 5px;

          img {
            width: 100%;
          }
        }

        .info-box {
          width: calc(100% - 40px - 120px);
          margin: 0 20px;
          margin-bottom: 10px;
          margin-top: 30px;
          padding-left: 120px;
          height: 110px;
          background: #fff;
          border-radius: 12px;
          display: flex;
          flex-direction: column;

          .name-cn {
            margin-top: 20px;
            font-size: 18px;
            font-weight: bolder;
          }

          .name-en {
            font-size: 10px;
            color: #999;
          }

          .star {
            margin: 0;

            span {
              color: #999;
            }
          }

          .cat {
            font-size: 10px;
            color: #999;
          }
        }

        .buy-btn {
          width: 60px;
          height: 28px;
          position: absolute;
          bottom: 30px;
          text-align: center;
          line-height: 30px;
          font-size: 13px;
          border-bottom-left-radius: 10px;
          border-top-left-radius: 10px;
          right: 17px;
          background-color: #FCF16E;
        }
      }
    }

    .scroll-box::after {
      display: block;
      content: '';
      width: 100%;
      height: 80px;
    }
  }
}
</style>
<template>
  <div class="user">
    <!-- <input type="text"> -->
    <div class="setting" @click="goSetting">
      <img src="../assets/gear.png" alt="">
    </div>
    <div class="user-info">
      <div class="img-box" @click="goLogin">
        <img src="../assets/circle-user.png" alt="">
      </div>
      <p>{{ userInfo.name }}</p>
      <p>{{ userInfo.text }}</p>
    </div>
    <div class="user-history">
      <div>
        <span>25</span>
        <span>看过的电影</span>
      </div>
      <div>
        <span>21</span>
        <span>收藏</span>
      </div>
      <div>
        <span>3</span>
        <span>去过的影院</span>
      </div>
    </div>
    <div class="vital-fun-box">
      <div v-for="(item, index) in vitalFun" :key="index" @click="goLogin">
        <div class="img-box" @click="goTicketsList(item.text)">
          <img :src="item.img" alt="">
        </div>
        <span>{{ item.text }}</span>
      </div>
    </div>
    <div class="more-fun-box">
      <div v-for="(item, index) in moreFun" :key="index" @click="goLogin">
        <div class="img-box">
          <img :src="item.img" alt="">
        </div>
        <span>{{ item.text }}</span>
        <img src="../assets/chevron-right.png" alt="">
      </div>
    </div>
  </div>
</template>
  
<script>

export default {
  name: 'User',
  components: {

  },
  data() {
    return {
      vitalFun: {
        card: {
          img: require('../assets/credit-card.png'),
          text: '卡包'
        },
        ticket: {
          img: require('../assets/ticket.png'),
          text: '电影票'
        },
        wallet: {
          img: require('../assets/sack-dollar.png'),
          text: '钱包'
        }
      },
      moreFun: {
        order: {
          img: require('../assets/clipboard.png'),
          text: '我的订单'
        },
        coupon: {
          img: require('../assets/coupon.png'),
          text: '优惠卷'
        },

      },
      userInfo: null,
      userInfoList: null
    }
  },
  methods: {
    goLogin() {
      if (!this.userInfo.number) {
        this.$router.push({ name: 'Login' })
      }
    },
    goSetting() {
      if (!this.userInfo.number) {
        this.$router.push({ name: 'Login' })
      }else{
        this.$router.push("Setting")
      }
    },
    goTicketsList(s){
      if (s == "电影票") {
      this.$router.push("TicketsList")
        
      }
    }
  },
  created() {
    this.$store.commit('getUserInfo');
    console.log(this.$store.state.userInfo);

    this.userInfo = this.$store.state.userInfo

    if (window.localStorage.getItem("userInfoList")) {
      this.userInfoList = JSON.parse(window.localStorage.getItem("userInfoList"))
      console.log(this.userInfoList);
    }

  }
}
</script>

<style lang="scss" scoped>
.user {
  width: calc(100vw - 40px);
  height: max-content;
  padding: 0 20px;
  position: relative;
  color: #FAFAFE;

  .setting {
    width: 22px;
    height: 22px;
    position: absolute;
    right: 20px;
    top: 40px;

    img {
      width: 100%;
      opacity: .9;
    }
  }

  .user-info {
    width: 100%;
    height: 250px;
    // background: #31f;

    .img-box {
      width: 75px;
      height: 75px;
      background: none;
      margin: 10px auto;
      margin-top: 90px;

      img {
        width: 100%;
      }
    }

    >p {
      text-align: center;
      margin: 0px;
    }

    >p:nth-child(2) {
      font-size: 18px;
      font-weight: bold;
    }

    >p:nth-child(3) {
      font-size: 10px;
      opacity: .6;
    }
  }

  .user-history {
    width: 100%;
    height: 50px;
    display: flex;

    >div {
      width: calc(100% / 3);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      >span:nth-child(1) {
        font-size: 25px;
      }

      >span:nth-child(2) {
        font-size: 10px;
        opacity: .4;
      }
    }
  }

  .vital-fun-box {
    width: 100%;
    height: 110px;
    background-color: #FAFAFE;
    border-radius: 12px;
    margin-top: 20px;
    display: flex;

    >div {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .img-box {
        width: 33px;
        height: 33px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 100%;
        }
      }

      span {
        color: #162D38;
        font-weight: bolder;
        padding-top: 5px;
      }
    }
  }

  .more-fun-box {
    width: 100%;
    height: max-content;
    margin-top: 10px;

    >div {
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      position: relative;
      margin: 10px 0;

      .img-box {
        width: 25px;
        height: 25px;

        img {
          width: 100%;
          opacity: .9;
        }
      }

      span {
        margin-left: 15px;
      }

      >img {
        width: 20px;
        position: absolute;
        right: 0px;
        opacity: .8;
      }
    }
  }
}
</style>
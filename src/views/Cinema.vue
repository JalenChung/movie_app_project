<template>
  <div class="cinema">
    <Top></Top>
    <div class="filter-box">

      <div class="scroll-box">
        <div v-for="(item, index) in filterList" :key="index" @click="selectFilter(index)">
          <div v-if="item">
            <span>{{ item.name }}({{ item.subItems[item.selected].name }})</span>
            <img src="../assets/chevron-down.png" alt="">
          </div>
        </div>
      </div>

      <div class="filter-box-sub" v-if="checked != -1">
        <div v-for="(item, index) in filterList[checked].subItems" :key="index" @click="selectSubFilter(index)">
          <span>
            {{ item.name }}
          </span>
          <span v-if="index == filterList[checked].selected">✓</span>
        </div>
      </div>

    </div>

    <div class="content-box">
      <div class="scroll-box">
        <CinemaList :list-data="cinemaList" :margin-bottom="90"></CinemaList>
      </div>
    </div>

  </div>
</template>
  
<script>
import Top from '@/components/Top.vue'
import CinemaList from '@/components/CinemaList.vue'
export default {
  name: 'Cinema',
  components: {
    Top,
    CinemaList,
  },
  data() {
    return {
      filterList: null,
      checked: -1,
      cinemaList: null,
    }
  },
  methods: {
    getFilterList(callback) {
      // let 
      this.axios.get('https://apis.netstart.cn/maoyan/index/filterCinemas', {
        params: {
          ci: this.address.id
        }
      }).then(res => {
        // console.log(res.data);
        let obj = res.data;
        for (const key in obj) {
          if (obj[key]) {
            obj[key].selected = 0
          }
        }
        this.filterList = obj
        // console.log(this.filterList);
        if (callback) {
          callback()
        }
      }).catch(err => {
        console.log(err);
      })
    },
    selectFilter(i) {
      if (this.checked != i) {
        this.checked = i
      } else {
        this.checked = -1
      }
    },
    selectSubFilter(i) {
      // 确认二级选择器是刷新列表
      this.filterList[this.checked].selected = i;
      this.checked = -1;
      console.log(this.filterList);
      this.getCinemaList();
    },
    getCinemaList() {
      this.axios.get('https://apis.netstart.cn/maoyan/index/moreCinemas', {
        params: {
          // 品牌
          brandId: this.filterList['brand'].subItems[this.filterList['brand'].selected].id,
          // 行政区
          districtId: this.filterList['district'].subItems[this.filterList['district'].selected].id,
          // 影厅类型
          hallType: this.filterList['hallType'].subItems[this.filterList['hallType'].selected].id,
          // 服务类型
          serviceId: this.filterList['service'].subItems[this.filterList['service'].selected].id,
          // 地铁
          lineId: this.filterList['subway'].subItems[this.filterList['subway'].selected].id,
          // 城市
          cityId: this.$store.state.userInfo.address.id,
          updateShowDay: true,
          reqId: 1636710166221,
        }
      }).then(res => {
        // console.log(res);
        this.cinemaList = res.data
      }).catch(err => {
        console.log(err);
      })
    },
  },
  created() {
    // 打开页面是首次渲染列表
    this.getFilterList(() => {
      this.getCinemaList()
    })

  },
  computed: {
    address() {
      return this.$store.state.userInfo.address
    },
    // filterList_pro(){
    //   return
    // }
  },
  watch: {
    // 地址发生改变时刷新列表
    address(newVal, oldVal) {
      this.getFilterList(() => {
        this.getCinemaList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.cinema::before {
  display: block;
  content: '';
  width: 100%;
  min-height: 100px;
}

.cinema {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .filter-box {
    width: 100%;
    overflow: scroll;
    min-height: 20px;
    padding-bottom: 10px;

    >.scroll-box {
      height: 100%;
      width: max-content;
      display: flex;
      padding-left: 20px;

      >div {
        color: #ffffff9c;
        display: flex;
        align-items: center;
        font-size: 14px;

        img {
          width: 10px;
          padding: 0 2px;
          padding-right: 15px;
        }
      }

      .active {
        color: #fff;
      }
    }

    .filter-box-sub {
      position: fixed;
      width: calc(100% - 40px);
      background: #001c27;
      padding: 10px 20px;
      color: #fff;
      height: 30%;
      overflow: scroll;
      z-index: 3000;
      opacity: .9;

      >div {
        display: flex;
        justify-content: space-between;
        border: 1px solid #fff;
        padding: 8px;
        margin-bottom: 10px;
        border-radius: 10px;
      }
    }
  }

  .content-box {
    width: 100%;
    flex-grow: 1;
    overflow: scroll;
    .scroll-box{
      height: max-content;
      width: 100%;
    }
  }

}
</style>
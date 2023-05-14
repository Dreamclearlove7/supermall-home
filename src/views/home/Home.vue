<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
        @tabClick="tabClick" ref="tabControl1"
         class="tab-control" v-show="isTabFixed"></tab-control>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore"
           >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行', '新款', '精选']"
        @tabClick="tabClick" ref="tabControl2"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>

    <!-- 组件不能直接监听原生事件,需要结合修饰符native使用 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>

  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper.vue";
import RecommendView from "./childComps/RecommendView.vue";
import FeatureView from "./childComps/FeatureView.vue";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop"

import { getHomeMultidata, getHomeGoods } from "network/home";
import {debounce} from 'common/utils'

export default {
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data() {
    return {
      banners: [],
      recommends: [],
      // 请求商品数据
      goods: {
        'pop': { page: 0, list: [] },
        'new': { page: 0, list: [] },
        'sell': { page: 0, list: [] },
      },
      currentType: "pop",
      isShowBackTop: false,
      tabOffSetTop: 0,
      isTabFixed: false,
      saveY: 0
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    this.$refs.scroll.refresh() // 防止切回后不能滚动
  },
  deactivated() {
    this.saveY = this.$refs.scroll.getScrollY()
  },
  // 组件创建之后就要发送请求
  created() {
    /* // 1. 请求多个数据
    getHomeMultidata().then(res => {
      // console.log(res)
      // 拿到数据最好保存起来
      this.banners = res.data.banner.list
      this.recommends = res.data.recommend.list
    }) */
    this.getHomeMultidata();

    // 2. 请求商品数据
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");

    // created里使用scroll对象很可能拿不到为undefined，尽量不要在这里使用
    // 3. 监听item中图片加载完成（事件总线）
    /* this.$bus.$on('itemImageLoad', () => {
      this.$refs.scroll.refresh()
    }) */
  },
  mounted() {
    // 3. 监听item中图片加载完成（事件总线）
    const refresh = debounce(this.$refs.scroll.refresh, 50)
    // refresh 是防抖函数的返回值
    this.$bus.$on('itemImageLoad', () => {
      // this.$refs.scroll.refresh()
      // 如果不使用防抖处理，refresh将会在短时间被多次调用
      // 可以将refresh函数传入到debounce函数中，生成一个新的函数
      refresh()
    })

    // 4. 获取tabControl的offsettop
    /* 组件没有offsetTop也就是说this.$refs.TabControl.offsetTop不存在
      那可以去拿组件中的模板元素，所有的组件都有一个属性$el： 用于获取
      组件中的元素，this.$refs.tabControl.$el.offsetTop,此时offsetTop
      的值不准确，因为挂载时图片可能没有加载完全,所以需要监听HomeSwiper
      中img的加载完成
    */ 
  },
  methods: {
    /* 
      事件监听相关的方法
    */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    backClick() {
      // this.$refs.scroll.scroll.scrollTo(0, 0, 500)
      // this.$refs.scroll组件对象 this.$refs.scroll.scroll组件对象里的scroll属性

      /* 在Scroll组件中定义方法就不用与上述写法一样 */
      /* this.$refs.scroll即Scroll组件 */
      this.$refs.scroll.scrollTo(0, 0)
    },
    contentScroll(position) {
      // 1. 判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000

      // 2. 决定tabControl是否吸顶（position：fixed）
      this.isTabFixed = (-position.y) > this.tabOffSetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad() {
      this.tabOffSetTop = this.$refs.tabControl2.$el.offsetTop
    },
    /* 
      网络请求相关的方法
    */
    getHomeMultidata() {
      getHomeMultidata().then((res) => {
        // console.log(res)
        // 拿到数据最好保存起来
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;

        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp()
      });
    },
  },
};
</script>

<style scoped>
/* scoped作用域 */
#home {
  position: relative;

  /* padding-top: 44px; */

  /* 100%视口高度 */
  height: 100vh;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /* 通过BS就不需要给home-nav添加fixed定位了，
  因为已经规定了滚动的范围 */
  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

/* 滚动时到达指定位置后固定不动 */
/* BS中失效 */
/* .tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
} */

/* 使用定位的方式来固定高度 */
.content {
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
  overflow: hidden;
}

.tab-control {
  position: relative;
  z-index: 9;
}

/*  
通过动态绑定class
:class="{fixed: isTabFixed}"
  此时出现两个问题：
    1. 往上滑时，下面的图片往上移动不平滑
    2. tab-control消失了
  原因：scroll滚动原理改变了translate属性，导致fixed定位发生了改变
  处理方法：偷天换日，多添加一个tab-control元素使其默认情况隐藏，滚动到第二个真正的
  tab-control位置时使其显示
*/
/* .fixed {
  position: fixed;
  left: 0;
  right: 0;
  top: 44px;
} */

</style>
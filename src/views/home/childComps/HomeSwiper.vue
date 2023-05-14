<template>
  <swiper>
    <swiper-item v-for="item in banners" :key='item.id'>
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad"/>
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
import {Swiper, SwiperItem} from 'components/common/swiper'

export default {
  props: {
    banners: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    Swiper,
    SwiperItem
  },
  data() {
    return {
      isLoad: false
    }
  },
  methods: {
    imageLoad() {
      // 确保轮播图加载完毕
      // 只需要发送一次事件
      if (!this.isLoad) {
        this.$emit('swiperImageLoad')
        this.isLoad = true
      }
    }
  }
};
</script>

<style>
</style>
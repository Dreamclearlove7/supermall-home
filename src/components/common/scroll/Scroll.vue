<template>
<!-- ref/children  -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null
    }
  },
  mounted() {
    // 1. 创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      // 要想div元素能被点击需要设置 click: true
      click: true,
      observeDom: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    })

    // 2. 监听滚动的位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on('scroll', position => {
        this.$emit('scroll', position)
      })
    }

    // 3. 监听scroll滚到底部
    if (this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')
      })
    }
  },
  methods: {
   scrollTo(x, y, time=300) {
    this.scroll.scrollTo(x, y, time)
   },
   finishPullUp() {
    this.scroll && this.scroll.finishPullUp()
   },
   refresh() {
    // this.scroll的意义在于防止scroll对象初始化之前被使用
    this.scroll && this.scroll.refresh()
   },
   getScrollY() {
    return this.scroll ? this.scroll.y : 0
   }
  }
}
</script>

<style>

</style>
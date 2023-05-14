<template>
<!-- 所有的item都展示同一个图片，同一个文字 
  想动态展示就用slot
-->
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
    </div>
    <div v-else>
      <slot name="item-icon-active"></slot>
    </div>
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>
    <!-- <slot :class="{active: isActive}" name="item-text"></slot> 
      因为slot会被替换，给slot绑定的属性会一起被替换所以不会生效，最佳实践
      是用div嵌套如上
    -->

    <!-- <img src="../../assets/img/tabbar/home.svg" alt="" />
    <div>首页</div> -->
  </div>
</template>

<script>
export default {
  props: {
    path: String,
    activeColor: {
      type: String,
      default: 'red'
    }
  },
  data() {
    return {
      // isActive: true
    }
  },
  computed: {
    isActive() {
      //  /home -> item(/home) <=> true
      //  /home -> item(/category) <=> false
      //  /home -> item(/cart) <=> false
      //  /home -> item(/profile) <=> false

      return this.$route.path.indexOf(this.path) !== -1
    },
    activeStyle() {
      return this.isActive ? {color: this.activeColor} : {}
    }
  },
  methods: {
    itemClick() {
      this.$router.replace(this.path)/* .catch(err => err) */
    }
  }
};
</script>

<style>
.tab-bar-item {
  flex: 1;
  text-align: center;
  height: 49px;
  font-size: 14px;
}

.tab-bar-item img {
  width: 24px;
  height: 24px;
  margin-top: 3px;
  vertical-align: middle;
  margin-top: 2px;
}

/* .active {
  color: red;
} */
</style>
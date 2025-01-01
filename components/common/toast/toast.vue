<template>
  <transition name="trans">
    <div class="common-fixed-toast" v-show="display">
      <div class="common-fixed-toast-mask" v-show="mask"/>
      <div class="common-fixed-toast-msg" :class="{sp: type}" :style="style">
        <i class="common-fixed-toast-icon" v-show="type"/>
        <div class="common-fixed-toast-content" v-html="content"/>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "common-fixed-toast",
  data () {
    return {
      display: false, // {{ boolean }} 显示
      mask: true, // {{ boolean }} 遮罩
      content: '', // {{ string }} 显示内容
      timer: null, // {{ number }} 计时器
      style: null, // {{ number }} 样式
      type: '', // {{ string }} 图标类型 tick / cross / warn
    }
  },
  methods: {
    show ({ content = '', time = 2000, style = {}, type = '', mask = false } = {}) {
      clearTimeout(this.timer)
      this.display = true
      this.content = content
      this.style = style
      this.type = type
      this.mask = mask
      this.timer = setTimeout(() => {
        this.display = false
      }, time)
    },
    hide () {
      clearTimeout(this.timer)
      this.display = false
    }
  }
}
</script>

<style lang="scss">
.common-fixed-toast {
  position: fixed;
  z-index: 5200;
  left: 0;
  top: 0;
  &-mask {
    position: fixed;
    left: 0;
    top: 0;
  }
  &-icon {
    @include wh(80);
    display: block;
    margin: 0 auto;
    &.tick {
      @include bg(url('img/tick.svg'));
    }
    &.cross {
      @include bg(url('img/cross.svg'));
    }
    &.warn {
      @include bg(url('img/warn.svg'));
    }
  }
  &-msg {
    background-color: rgba(12, 12, 12, .7);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: inline-block;
    max-width: 4.28rem;
    padding: .24rem;
    overflow-wrap: break-word;
    text-align: center;
    border-radius: .16rem;
    font-size: .2rem;
    color: #fff;
    &.sp {
      padding: .7rem .8rem;
      .ppw-toast-content {
        //margin-top: .16rem;
      }
    }
  }
}
</style>

<template>
  <transition name="validation">
    <div v-if="show" class="select-pop">
      <div class="select">
        <div class="select-title">
          <span>短信验证码</span>
          <img :src="require('@img/close.png')" @click="close" alt="">
        </div>
        <div class="validation">
          <Validation @validation="validation" />
        </div>
      </div>
    </div>
  </transition >
</template>

<script>
import Validation from './validation.vue'
export default {
  components: { Validation },
  props: {
    show: {
      type: Boolean,
      default: () => {
        return false
      }
    },
  },
  methods: {
    validation(data) {
      this.$emit('validation', data)
    },
    close () {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style scoped lang='scss'>
.validation-enter-active, .validation-leave-active {
  transition: all .3s;
}
.validation-enter, .validation-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.select-pop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  .select {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6rem;
    color: #880303;
    &-title {
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
      background: linear-gradient(90deg, #FFBD61, #FFEC98, #FFBD61);
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      span {
        font-size: .3rem;
      }
      img {
        width: 16px;
        cursor: pointer;
      }
    }
    .validation {
      background: #FFFFFF;
      border-radius: 0 0 6px 6px;
      padding: .4rem .2rem;
    }
  }
}
</style>

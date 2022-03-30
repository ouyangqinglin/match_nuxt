<template>
  <transition name="regular">
    <common-flex v-if="show" :key="`regular`" class="comp-promise" justify="center" align="center">
      <div class="content">
        <common-flex class="header" align="center" justify="center">
          <div>{{ letter.content.title }}</div>
          <img class="header-close" @click="close" :src="require('@img/close.png')" alt="">
          <common-flex class="header-countdown" direction="column" justify="space-around" align="center">
            <div>倒计时</div>
            <div>{{ countDown }}s</div>
          </common-flex>
        </common-flex>
        <div class="body">
          <div v-html="letter.content.content"></div>
        </div>
      </div>
    </common-flex>
  </transition>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "promise",
  props: ['show'],
  data () {
    return {
      timer: null,
      countDown: ''
    }
  },
  computed: {
    ...mapState({
      letter: 'commitment_letter'
    })
  },
  mounted () {
    this.countDown = JSON.parse(JSON.stringify(this.letter.content.countdown))
    this.timer = setInterval(() => {
      this.countDown--
      if (this.countDown < 1) clearInterval(this.timer)
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    close () {
      if (this.countDown <= 0) this.$emit('update:show', false)
      else this.$comp.toast.show({
        content: '阅读5秒以上才能关闭！'
      })
    }
  }
}
</script>

<style lang="scss">
.regular-enter, .regular-leave-to {
  opacity: 0;
  transform: translateY(-.1rem);
}
.regular-enter-active, .regular-leave-active {
  transition: all .3s;
}
.comp-promise {
  z-index: 521;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  overflow: hidden;
  .content {
    width: 80%;
    height: 7.5rem;
    border-radius: .12rem;
    background-color: #fff;
    .header {
      position: relative;
      height: .8rem;
      text-align: center;
      background-color: #dddddd;
      border-radius: .15rem .15rem 0 0;
      font-size: .3rem;
      color: rgb(51, 51, 51);
      font-weight: 600;
      &-close {
        position: absolute;
        right: .3rem;
        top: .3rem;
        width: .32rem;
        height: .32rem;
        cursor: pointer;
      }
      &-countdown {
        position: absolute;
        bottom: -1rem;
        right: .2rem;
        width: 1rem;
        height: 1rem;
        @include bg(url('~@img/countdown-bg.png'));
        :nth-child(1) {
          font-size: .14rem;
          color: #fff;
        }
        :nth-child(2) {
          font-size: .16rem;
          color: #333;
        }
      }
    }
    .body {
      padding: .75rem .3rem .3rem .3rem;
      max-height: 6rem;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 5px;
        height: 35px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background: #999999;
      }
      &::-webkit-scrollbar-track {
        border-radius: 3px;
        background: #EDEDED;
      }
      p {
        margin-top: .15rem;
        font-size: .26rem;
        color: #333;
        line-height: .45rem;
        word-break: break-all;
      }
    }
  }
}
</style>

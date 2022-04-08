<template>
  <transition name="regular">
    <common-flex v-if="show" :key="`regular`" class="comp-disclaimer" justify="center" align="center">
      <div class="content">
        <common-flex class="header" align="center" justify="center">
          <div>{{ letter.content.title }}</div>
          <img class="header-close" @click="close" :src="require('@img/close.png')" alt="">
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
  name: 'disclaimer',
  props: ['show'],
  computed: {
    ...mapState({
      letter: 'disclaimer'
    })
  },
  methods: {
    close () {
      this.$emit('update:show', false)
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
.comp-disclaimer {
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

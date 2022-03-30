<template>
  <transition name="fade">
    <div class="call" v-if="showCall">
      <div class="toast">
        <div class="title">拨打大赛组委会电话</div>
        <a href="tel:18221186388" v-for="i of phone">
          <div class="contact">
            <div><span v-if="i.name">{{ i.name }}：</span>{{ i.phone }}</div>
            <img :src="require('./contact-icon.svg')" alt="">
          </div>
        </a>
        <div class="btn-group">
          <div @click="hideToast">否</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: 'call',
  props: {
    showCall: {
      type: Boolean
    }
  },
  computed: {
    ...mapState({
      config: 'mobile_config'
    }),
    phone () {
      return JSON.parse(this.config.organize_contact)
    }
  },
  methods: {
    hideToast() {
      this.$emit('update:showCall', false)
    }
  }
}
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: all .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: scale(1.1);
}
.call{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9;
  background: rgba(60, 60, 60, .8);
  display: flex;
  align-items: center;
  justify-content: center;
  .toast{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 6.4rem;
    background: #fff;
    border-radius: .12rem;
    line-height: 1;
    color: #010101;
    .title{
      margin: .42rem 0 .5rem 0;
      width: 100%;
      text-align: center;
      font-size: .36rem;
    }
    .contact {
      margin-top: .15rem;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 5.89rem;
      height: 1.07rem;
      background: url('./contact-bg.png') center/100% 100%;
      div {
        font-size: .36rem;
        color: #333;
      }
      img {
        margin-left: .5rem;
        width: .63rem;
      }
    }
    .btn-group{
      margin-top: .38rem;
      margin-bottom: .38rem;
      width: 100%;
      display: flex;
      flex: 1;
      justify-content: center;
      >*{
        width: 5.89rem;
        height: 1.07rem;
        font-size: .36rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: url('./no-bg.png') center/100% 100%;
      }
    }

  }
}
</style>

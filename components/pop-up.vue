<template>
  <transition name="pop">
    <div class="pop-up" v-if="popUpShow">
      <div class="toast">
        <common-flex class="header" align="center" justify="space-between">
          <div class="left" @click="closePopUp">取消</div>
          <div class="right" @click="confirmGetTable">确认</div>
        </common-flex>
        <div class="content">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'comp-pop-up',
  props: {
    popUpShow: {
      type: Boolean
    }
  },
  methods: {
    closePopUp() {
      this.$emit('closePopUp')
    },
    confirmGetTable() {
      this.$emit('confirmGetTable')
    }
  }
}
</script>

<style lang="scss" scoped>
.pop-enter-active, .pop-leave-active {
  transition: all .3s;
}
.pop-enter, .pop-leave-to {
  opacity: 0;
}
.pop-up {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9;
  background: rgba(60, 60, 60, .8);
  .toast {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 6.85rem;
    background: #FBFBFB;
    .header {
      width: 100%;
      height: 1rem;
      background: #fff;
      box-sizing: border-box;
      padding: 0 .3rem;
      font-size: .3rem;
      color: #C00000 !important;
      line-height: 0;
      .center {
        width: 1.5rem;
        height: .6rem;
        border: 1px solid #666;
        border-radius: .04rem;
        font-size: .26rem;
        color: #333;
      }
    }
    .content {
      padding: .5rem .3rem .3rem;
      max-height: calc(100% - 1rem);
      overflow-y: auto;
    }
  }
  /deep/ .pop-up-slot {
    font-size: .26rem;
    .title{
      font-weight: bold;
      line-height: 1;
      span{
        color: #FF4455;
      }
      margin-bottom: .1rem;
    }
    .pop-up-item-box {
      margin: 0 .1rem;
      .item {
        display: inline-block;
        width: calc((100% - .35rem * 2) / 3);
        height: .7rem;
        line-height: .7rem;
        text-align: center;
        background: #fbfbfb;
        border: 1px solid #D7DAE2;
        border-radius: .1rem;
        margin-top: .2rem;
        margin-right: .35rem;
        &:nth-child(3n) {
          margin-right: 0;
        }
      }
      .item-dy {
        display: flex;
        flex-wrap: wrap;
        padding-bottom: .2rem;
        max-height: 2.8rem;
        overflow-y: auto;
        overflow-x: hidden;
      }
      .item-sub {
        display: inline-block;
        width: calc((100% - .35rem * 2) / 3);
        height: .7rem;
        line-height: .7rem;
        text-align: center;
        background: #fbfbfb;
        border: 1px solid #D7DAE2;
        border-radius: .1rem;
        margin-top: .2rem;
        margin-right: .35rem;
        &:nth-child(3n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>

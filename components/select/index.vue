<template>
  <div class="comp-select" :style="{color: themeColor}">
    <el-select disabled class="comp-select-form" type="text" :placeholder="placeholder"  :value="lableVal"/>
    <div class="open" @click="openSelect"></div>
    <transition name="toast">
      <common-flex justify="center" align="center" class="toast" v-if="toastShow">
        <div class="toast-body">
          <common-flex class="toast-body-title" justify="space-between" align="center">
            <div class="ellipsis txt">{{ placeholder }}</div>
            <img src="./close.png" alt="" @click="close">
          </common-flex>
          <div class="toast-body-search" v-if="parentList.length > 7">
            <input type="text" v-model="keyword" placeholder="请输入关键字搜索">
            <img src="./search.png" alt="">
          </div>
          <div class="toast-body-list">
            <common-flex justify="space-between" @click.native="choose(i)" :key="i.label" align="center" class="item" v-for="i of filterList">
              <span class="ellipsis li" v-html="toMark(i.label)"></span>
              <img v-if="i.children" src="./right.png" alt="">
            </common-flex>
          </div>
        </div>
      </common-flex>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "comp-select",
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    placeholder: String,
    recommend: String,
    selector: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      lableVal: '',
      showChild: false,
      toastShow: false,
      parentLabel: '',
      parentVal: '',
      keyword: '',
      childList: []
    }
  },
  watch: {
    recommend: {
      immediate: true,
      handler (v) {
        setTimeout(() => {
          if (v === 'recommend_name' && this.urlObj.channel === 'ppw') this.lableVal = '私募排排网'
        }, 1000)
      }
    }
  },
  computed: {
    parentList () {
      return this.showChild ? this.childList : this.selector
    },
    filterList () {
      return this.parentList.filter((i) => i.label.indexOf(this.keyword) !== -1)
    },
    ...mapState({
      themeColor: 'themeColor',
      urlObj: 'urlObj'
    })
  },
  methods: {
    toMark (str) {
      if (this.keyword) return str.split(this.keyword).join(`<span style="color: red">${this.keyword}</span>`)
      else return str
    },
    close () {
      this.toastShow = false
      this.toggleScroll(0)
      this.keyword = ''
      this.showChild = false
      this.parentLabel = ''
      this.parentVal = ''
    },
    openSelect () {
      this.toastShow = true
      this.toggleScroll(1)
    },
    toggleScroll (flag) {
      if (flag) {
        document.body.style.height = '100vh'
        document.body.style['overflow-y'] = 'hidden'
      } else {
        document.body.style.height = 'unset'
        document.body.style['overflow-y'] = 'auto'
      }
    },
    choose (i) {
      if (i.children) {
        this.showChild = true
        this.childList = i.children
        this.parentVal = i.value
        this.parentLabel = i.label
      } else {
        if (this.showChild) {
          this.lableVal = `${this.parentLabel}>${i.label}`
          let value = `${this.parentVal}>${i.value}`
          this.$emit('change', value)
        } else {
          this.lableVal = i.label
          this.$emit('change', i.value)
        }
        this.close()
      }
    }
  }

}
</script>

<style lang="scss">
.comp-select {
  position: relative;
  width: 100%;
  height: 1rem;
  .toast-enter, .toast-leave-to {
    opacity: 0;
    transform: translateY(-.1rem);
  }
  .toast-enter-active, .toast-leave-active {
    transition: all linear .2s;
  }
  &-form {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1rem;
    border-radius: .08rem;
    font-size: .3rem;
    color: #333;
    background-color: #fff;
  }
  .el-select {
    position: absolute;
    .el-input {
      flex-shrink: 0;
      width: 100%;
      font-size: .3rem;
      color: #333;
      input {
        height: 1rem;
        background: #fff;
        color: #333;
        border: .02rem solid #D7DAE2;
        &:disabled {
          background: #fff;
          color: #333;
        }
        &::placeholder {
          font-size: .3rem;
          color: #999;
        }
      }
    }
  }
  .open {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1rem;
  }
  .toast {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(#000, .3);
    z-index: 10;
    &-body {
      padding-bottom: .3rem;
      width: 6.7rem;
      max-height: 9.8rem;
      background-color: #fff;
      border-radius: .2rem;
      &-title {
        padding: 0 .3rem;
        height: .8rem;
        font-size: .3rem;
        background: linear-gradient(90deg, #FFBD61, #FFF8A7, #FFBD61);
        box-shadow: 0 .03rem .04rem 0 rgba(255, 255, 255, 0.5);
        border-radius: .2rem .2rem 0 0;
        .txt {
          max-width: 4.5rem;
        }
        img {
          width: .27rem;
          height: .27rem;
        }
      }
      &-search {
        position: relative;
        padding: 0 .34rem .1rem;
        input {
          width: 100%;
          height: .7rem;
          text-indent: .15rem;
          background-color: #EEEEEE;
          font-size: .3rem;
          color: #333;
          border-radius: 0.1rem;
          border: 1px solid #ddd;
          &::placeholder {
            font-size: .3rem;
            color: #999;
          }
        }
        img {
          position: absolute;
          right: .5rem;
          top: .65rem;
          width: .35rem;
          height: .35rem;
        }
      }
      &-list {
        padding: 0 .3rem;
        max-height: 6rem;
        overflow-y: auto;
        .item {
          width: 100%;
          height: .8rem;
          font-size: .3rem;
          color: #333;
          .li {
            max-width: 5rem;
          }
          img {
            width: .26rem;
            height: .2rem;
          }
        }
      }
    }
  }

}
</style>

<template>
  <div class="join-in">
    <div class="btn or contact" @click="showToast" :style="{borderColor: theme, color: theme}">
      <img :src="require('./img/contact.svg')" alt="" class="or">
      <span>联系我们</span>
    </div>
    <a :href="`${$store.state.apiHost}competition/mobile/apply?match_code=${$route.query.match_code}`" :style="{borderColor: theme, color: theme}" class="btn or apply">
      <img :src="require('./img/apply.svg')" alt="" class="or">
      <span>立即报名</span>
    </a>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: 'join-in',
  computed: {
    ...mapState({
      config: 'mobile_config'
    }),
    theme () {
      return this.config.theme_color
    }
  },
  methods: {
    showToast () {
      this.$emit('update:showCall', true)
    }
  }
}
</script>

<style lang="scss">
.join-in {
  padding: .11rem .32rem;
  width: 100vw;
  height: 1.1rem;
  display: flex;
  align-items: center;
  font-weight: 400;
  line-height: 1;
  box-shadow: 0px -.02rem 16px 1px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  background-color: #fff;
  .btn {
    font-size: .3rem;
    flex-grow: 1;
    align-self: stretch;
    border-radius: .2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    border: 1px solid;
    img {
      width: .6rem;
      height: .6rem;
      margin-right: .2rem;
    }
    &+.btn { margin-left: .2rem; }
  }


}
</style>

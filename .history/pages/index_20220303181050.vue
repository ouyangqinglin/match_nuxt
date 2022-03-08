<template>
  <div class="pages-index">
    <img class="pages-index-banner" @load="getOffsetTop" id="header-banner" :src="require('@img/header-bg.jpg')" alt="">
    <Nav />
    <nuxt-child />
    <img class="pages-index-banner" :src="require('@img/footer-banner.png')" alt="">
  </div>
</template>

<script>
import $ from 'jquery'
import Nav from '@comp/nav'

export default {
  name: 'index',
  components: { Nav },
  watch: {
    '$route.path': {
      handler (v) {
        console.log('v', v)
        if (v) $("html,body").animate({scrollTop: this.$store.state.scroTop}, 0)
      }
    }
  },
  methods: {
    getOffsetTop() {
      this.$nextTick(() => {
        this.offsetTop = document.getElementById('header-banner').clientHeight
        this.$store.commit('toTop', this.offsetTop)
      })
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   next((vm) => {
  //     if (from.name) {
  //       setTimeout(() => {
  //         $("html,body").animate({scrollTop: vm.$store.state.scroTop}, 0)
  //       },0)
  //     }
  //   })
  // }
}
</script>

<style lang="scss">
.pages-index {
  @include cImg();
  background-color: #990000;
  &-banner {
    object-fit: contain;
    width: 100%;
  }
}
</style>

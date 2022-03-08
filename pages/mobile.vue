<template>
  <div class="pages-mobile">
    <div v-if="!show"><Header :label="title" /></div>
    <nuxt-child></nuxt-child>
    <div class="footer"><Footer :showCall.sync="showCall" /></div>
    <Call :showCall.sync="showCall"/>
  </div>
</template>

<script>
import Header from '@comp/nav-header'
import Footer from '@comp/join-in'
import Call from '@comp/call'
export default {
  name: "mobile",
  components: { Header, Footer },
  head () {
    return {
      title: '私募大赛H5'
    }
  },
  data () {
    return {
      show: true,
      showCall: false,
      title: ''
    }
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler (v) {
        console.log('mobile', v)
        if (v === '/mobile/introduction') this.show = true
        else this.show = false
        if (v === '/mobile/apply') this.title = '报名申请'
        if (v === '/mobile/rank') this.title = '大赛排名'
        if (v === '/mobile/rule') this.title = '赛事规则'
        if (v === '/mobile/award') this.title = '大赛奖励'
        if (v === '/mobile/assign') this.title = '获奖名单'

      }
    }
  }
}
</script>

<style lang="scss">
.pages-mobile {
  padding-bottom: 1.2rem;
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
  }
}
</style>

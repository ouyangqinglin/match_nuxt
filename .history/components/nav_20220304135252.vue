<template>
  <div class="nav">
    <div id="fix" style="height: 1px" />
    <common-flex class="comp-nav" justify="center" align="center" :class="{fixed: fixed}">
      <nuxt-link v-for="i of navList" :key="i.route" :to="i.route">
        <div class="comp-nav-item" :class="{active: curNav === i.key}" @click="changeNav(i.key)">
          <span>{{ i.name }}</span>
          <img v-if="curNav === i.key" :src="require('@img/item-bg.png')" alt="">
        </div>
      </nuxt-link>
    </common-flex>
  </div>
</template>

<script>

export default {
  name: 'comp-nav',
  data () {
    return {
      curNav: '',
      fixed: false,
      navScrollTop: '',
      navList: [
        {
          name: '大赛简介',
          route: 'introduction',
          key: 'index-introduction'
        },
        {
          name: '申享智投',
          route: 'assign',
          key: 'index-assign'
        },
        {
          name: '大赛奖励',
          route: 'award',
          key: 'index-award'
        },
        {
          name: '大赛规则',
          route: 'rule',
          key: 'index-rule'
        },
        {
          name: '报名申请',
          route: 'apply',
          key: 'index-apply'
        },
        {
          name: '大赛排名',
          route: 'rank',
          key: 'index-rank.vue'
        },
        {
          name: '赛事报道',
          route: 'report',
          key: 'index-report'
        }
      ]
    }
  },
  mounted () {
    this.navScrollTop = document.getElementById('fix').offsetTop
    window.document.addEventListener('scroll', this.scrolling)
    console.log('xxx', this.$route)
    this.curNav = this.$route.name
  },
  beforeDestroy () {
    window.document.removeEventListener('scroll', this.scrolling)
  },
  methods: {
    scrolling () {
      let scrollTop = document.documentElement.scrollTop
      if (scrollTop > this.navScrollTop) this.fixed = true
      if (scrollTop < this.navScrollTop) this.fixed = false
    },
    changeNav (key) {
      console.log('11')
      this.curNav = key
    }
  }
}
</script>

<style lang="scss">
.nav {
  .comp-nav {
    margin-top: -8px;
    width: 100%;
    height: 60px;
    background: url("~@img/container-bg.jpg") center/100% 100%;
    &-item {
      position: relative;
      width: 161px;
      text-align: center;
      @include nFont(24 400 #880303);
      z-index: 2;
      cursor: pointer;
      border-right: solid 1px #7C5053;
      img {
        position: absolute;
        top: -8px;
        left: -2px;
        width: 163px;
        height: 79px;
        z-index: -1;
      }
    }
    :last-child {
      border-right: none;
    }
    .active {
      @include nFont(28 500 #FFF6B6)
    }
  }
  .fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 5;
  }
}
</style>

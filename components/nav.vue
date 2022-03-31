<template>
  <div class="nav">
    <div id="fix" style="height: 1px" />
    <common-flex class="comp-nav" justify="center" align="center" :class="{fixed: fixed}">
      <a :href="`${$store.state.apiHost}competition/${i.route}?match_code=${$route.query.match_code}&title=${i.title}`" v-for="i of navList" :key="i.route">
        <div class="comp-nav-item" :style="{color: curNav === i.key ? '#fff': theme}" :class="{active: curNav === i.key}" @click="changeNav(i.key)">
          <span>{{ i.title }}</span>
          <img v-if="curNav === i.key" :src="require('@img/item-bg.png')" alt="">
        </div>
      </a>
    </common-flex>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'comp-nav',
  data () {
    return {
      curNav: '',
      fixed: false,
      navScrollTop: '',
      solidNav: [
        {
          title: '报名申请',
          route: 'apply',
          key: 'index-apply'
        },
        {
          title: '大赛排名',
          route: 'rank',
          key: 'index-rank'
        },
        {
          title: '获奖名单',
          route: 'assign',
          key: 'index-assign'
        },
        {
          title: '赛事报道',
          route: 'report',
          key: 'index-report'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      dyNav: 'dyNav',
      theme: 'theme'
    }),
    navList () {
      return [...this.dyNav, ...this.solidNav]
    },
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.navScrollTop = document.getElementById('fix').offsetTop
      }, 300)
    })
    window.document.addEventListener('scroll', this.scrolling)
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
      this.curNav = key
    }
  }
}
</script>

<style lang="scss">
.nav {
  .comp-nav {
    margin-top: -30px;
    width: 100%;
    height: 60px;
    background: url("~@img/container-bg.jpg") center/100% 100%;
    &-item {
      position: relative;
      width: 161px;
      text-align: center;
      @include nFont(24 400);
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
      @include nFont(28 500 #FFFFFF)
    }
  }
  .fixed {
    margin-top: 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 5;
  }
}
</style>

<template>
  <div class="nav">
    <div id="fix" style="height: 1px" />
    <common-flex class="comp-nav" justify="center" align="center" :class="{fixed: fixed}">
      <a @click="navChange(i)" v-for="i of dyNav" :key="i.route">
        <div class="comp-nav-item" :style="{color: curNav === i.path ? '#fff': theme}" :class="{active: curNav === i.path}" @click="curNav = i.path">
          <span>{{ i.name }}</span>
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
    }
  },
  computed: {
    ...mapState({
      dyNav: 'dyNav',
      theme: 'theme'
    }),
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
    navChange (i) {
      if (this.$route.query.channel) {
        let query = []
        let temp
        for (let key in this.$route.query) {
          temp = `${key}=${this.$route.query[key]}`
          if (this.$route.query[key]) query.push(temp)
        }
        let urlParams = query.join('&')
        location.href = `${this.$store.state.apiHost}competition/${i.route}?${urlParams}&title=${i.name}`
      } else location.href = `${this.$store.state.apiHost}competition/${i.route}?match_code=${this.$route.query.match_code}&title=${i.name}`

    },
    scrolling () {
      let scrollTop = document.documentElement.scrollTop
      if (scrollTop > this.navScrollTop) this.fixed = true
      if (scrollTop < this.navScrollTop) this.fixed = false
    },
  }
}
</script>

<style lang="scss">
.nav {
  margin-top: -30px;
  height: 81px;
  .comp-nav {
    width: 100%;
    height: 81px;
    background: url("~@img/container-bg.jpg") center/100% 100%;
    &-item {
      position: relative;
      width: 170px;
      height: 81px;
      text-align: center;
      @include nFont(24 400 81);
      z-index: 2;
      cursor: pointer;
      border-right: solid 1px #7C5053;
      img {
        position: absolute;
        top: -24px;
        left: -4px;
        width: 170px;
        height: 81px;
        z-index: -1;
      }
    }
    :last-child {
      border-right: none;
    }
    .active {
      @include nFont(24 500 #FFFFFF);
      background: url("~@img/menu-bg.svg") center/100% 100%;
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

<template>
  <div class="nav">
    <div id="fix" style="height: 1px" />
    <common-flex class="comp-nav" justify="center" align="center" :class="{fixed: fixed}">
      <template v-for="i of dyNav">
        <div class="comp-nav-item" :style="{color: curNav === i.path ? '#fff': theme}" :class="{active: curNav === i.path}" @click="navChange(i)">
          <span>{{ i.name }}</span>
          <img v-show="curNav === i.path" :src="menuBg" alt="">
        </div>
      </template>
    </common-flex>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import $ from 'jquery'
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
      theme: 'theme',
      menuBg: 'menu_bg',
      match_code: 'match_code'
    })
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
      this.curNav = i.path
      if (this.$route.query.channel) {
        let query = []
        let temp
        for (let key in this.$route.query) {
          if (key === 'title' || key === 'match_code') {}
          else {
            temp = `${key}=${this.$route.query[key]}`
            if (this.$route.query[key]) query.push(temp)
          }
        }
        let urlParams = query.join('&')
        this.$router.push(`${i.route}?match_code=${this.match_code}&${urlParams}&title=${i.name}`)
      } else this.$router.push({
        path: i.route,
        query: {
          match_code: this.match_code,
          title: i.name
        }
      })
      $("html,body").animate({scrollTop: this.navScrollTop}, 300);
      // setTimeout( () => {
      //   $("html,body").animate({scrollTop: this.navScrollTop}, 300);
      // },0)
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
      img {
        position: absolute;
        top: 0;
        left: 0;
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

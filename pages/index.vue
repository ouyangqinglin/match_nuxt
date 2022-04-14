<template>
  <div class="pages-index" :style="{background: themeColor, color: themeColor}">
    <img class="pages-index-banner" @load="getOffsetTop" id="header-banner" :src="headerImg" alt="">
    <Nav />
    <nuxt-child />
    <div class="pages-index-ps">投资有风险，选择需谨慎</div>
    <div class="pages-index-right-float">
      <a class="pages-index-right-float-first" style="text-decoration: none" target="_blank" :href="`${$store.state.apiHost}single?code=${applyCode}`">
        <img :src="require('@img/index/float-login.png')" alt="">
        <div class="pages-index-right-float-first-txt">参赛登录</div>
      </a>
      <div style="height: 1px"></div>
      <a :href="`${$store.state.apiHost}competition/apply?match_code=${$route.query.match_code}&title=报名申请`" target="_blank">
        <div class="pages-index-right-float-first">
          <img :src="require('@img/index/now-apply.png')" alt="">
          <div class="pages-index-right-float-first-txt">立即报名</div>
        </div>
      </a>
      <div style="height: 1px"></div>
      <div class="pages-index-right-float-first" @click="toTop">
        <img :src="require('@img/index/to-top.png')" alt="">
        <div class="pages-index-right-float-first-txt">返回顶部</div>
      </div>
    </div>
    <common-flex justify="center" class="pages-index-footer">
      <img class="pages-index-banner footer-banner" :src="footerImg" alt="">
    </common-flex>
    <Disclaimer :show.sync="show" />
  </div>
</template>

<script>
import $ from 'jquery'
import Nav from '@comp/nav'
import Disclaimer from '@comp/disclaimer'

export default {
  name: 'index',
  components: { Nav, Disclaimer },
  head () {
    return {
      title: this.competitionName
    }
  },
  async asyncData ({ query, store, app }) {
    if (query.match_code) store.commit('saveCode', query.match_code)
    let config = await app.axios({
      url: `/competition/match/api/match/init?match_code=${query.match_code}&channel=pc`,
    })
    let data = config.data.data
    let themeColor = data.config.theme_color
    store.commit('saveTheme', themeColor)
    let competitionName = data.info.competition_name
    let time = {}
    time.start = data.info.apply_start_time
    time.end = data.info.apply_end_time
    store.commit('saveTime', time)
    let headerImg = data.section.header.content.image
    let footerImg = data.section.footer.content.image
    store.commit('savePage', data.page)
    if (data.section.commitment_letter) store.commit('saveLetter', data.section.commitment_letter)
    if (data.section.disclaimer) store.commit('saveDisclaimer', data.section.disclaimer)
    const menuActiveBg = data.config.menu_background
    store.commit('saveMenuBg', menuActiveBg)
    let menu = JSON.parse(data.config.menu)
    let list = [
      {
        props: 'introduction',
        route: 'introduction',
        key: 'index-introduction'
      },
      {
        props: 'service',
        route: 'service',
        key: 'index-service'
      },
      {
        props: 'reward',
        route: 'award',
        key: 'index-award'
      },
      {
        props: 'rule',
        route: 'rule',
        key: 'index-rule'
      },
      {
        props: 'apply',
        route: 'apply',
        key: 'index-apply'
      },
      {
        props: 'prize',
        route: 'assign',
        key: 'index-assign'
      },
      {
        props: 'report',
        route: 'report',
        key: 'index-report'
      },
      {
        props: 'rank',
        route: 'rank',
        key: 'index-rank'
      },
    ]
    let j = 0
    for (j; j < menu.length; j++) {
      for (let i = 0; i < list.length; i++) {
        if(list[i].props === menu[j].key) {
          menu[j].route = list[i].route
          menu[j].path = list[i].key
        }
      }
    }
    store.commit('saveNav', menu)
    return {
      themeColor,
      competitionName,
      headerImg,
      footerImg
    }
  },
  data () {
    return {
      show: false,
      applyCode: ''
    }
  },
  beforeRouteEnter (to, form, next) {
    next((vm) => {
      if (vm.$store.state.disclaimer) {
        if (to.path.includes('rank') || to.path.includes('assign')) {
          if (sessionStorage.getItem('disclaimer')) return
          vm.show = true
          sessionStorage.setItem('disclaimer', '1')
        }
      }
    })
  },
  mounted () {
    if (location.search) {
      let searchObj = this.getUrlObj(decodeURIComponent(location.search))
      if (location.search.includes('channel')) {
        this.$store.commit('saveUrlObj', searchObj)
      }
    }
    this.getMatchCode()
  },
  methods: {
    getMatchCode () {
      this.axios({
        url: '/competition/activity/backend/api/competition/getMatchLoginCode',
        data: { match_code: this.$route.query.match_code },
        success: ({ data }) => {
          this.applyCode = data.match_code
        }
      })
    },
    getUrlObj (url) {
      const jsonList = {}
      if(url.indexOf("?") !== -1){
        let str = url.slice(url.indexOf("?") + 1)
        let strs = str.split("&")
        for(let i = 0; i < strs.length; i++) {
          jsonList[strs[i].split("=")[0]] = strs[i].split("=")[1]
        }
      }
      return jsonList
    },
    getOffsetTop () {
      this.$nextTick(() => {
        this.offsetTop = document.getElementById('header-banner').clientHeight
        this.$store.commit('toTop', this.offsetTop)
      })
    },
    toTop () {
      $("html,body").animate({scrollTop: 200}, 0);
      setTimeout( () => {
        $("html,body").animate({scrollTop: 0}, 300);
      },0)
    },
  },
}
</script>

<style lang="scss">
.pages-index {
  position: relative;
  &-ps {
    margin-bottom: 45px;
    @include nFont(20 #fff 28);
    opacity: .59;
    text-align: center;
  }
  &-banner {
    object-fit: contain;
    width: 100%;
  }
  &-right-float {
    z-index: 998;
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    right: 0;
    bottom: 180px;
    width: 70px;
    height: 212px;
    border-radius: 4px 0 0 4px;
    &:hover {
      cursor: pointer;
    }
    &-first {
      width: 70px;
      height: 70px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #D8D8D8;
      &:hover {
        background: linear-gradient(0deg, #FFBD61, #FFEC98, #FFBD61);
      }
      >img {
        width: 24px;
        height: 24px;
        margin-bottom: 4px;
      }
      &-txt {
        font-size: 14px;
        font-weight: 400;
        line-height: 18px;
      }
    }
  }
  &-footer {
    .footer-banner {
      width: 100%;
    }
  }
}
</style>

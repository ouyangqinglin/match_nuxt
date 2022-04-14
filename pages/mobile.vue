<template>
  <div class="pages-mobile">
    <nuxt-child></nuxt-child>
    <div class="disclaimer-text" v-if="$route.query.match_code === 'zszq'">- 请详细阅读大赛相关免责声明 -</div>
    <div class="footer"><Footer :showCall.sync="showCall" /></div>
    <Call :showCall.sync="showCall"/>
    <Disclaimer :show.sync="show" />
  </div>
</template>

<script>
import Footer from '@comp/join-in'
import Call from '@comp/call'
import Disclaimer from '@comp/disclaimer'
export default {
  name: "mobile",
  components: { Footer, Call, Disclaimer },
  async asyncData ({ app, store, query }) {
    if (query.match_code) store.commit('saveCode', query.match_code)
    let config = await app.axios({
      url: `/competition/match/api/match/init?match_code=${query.match_code}&channel=h5`,
    })
    let data = config.data.data
    if (data.section.commitment_letter) store.commit('saveLetter', data.section.commitment_letter)
    if (data.section.disclaimer) store.commit('saveDisclaimer', data.section.disclaimer)
    let competitonName = data.info.competition_name
    let time = {}
    time.start = data.info.apply_start_time
    time.end = data.info.apply_end_time
    store.commit('saveTime', time)
    store.commit('saveConfig', data.config)
    store.commit('saveMobilePage', data.page)
    let menu = JSON.parse(data.config.menu)
    let i = 0, routeList = [
      {
        key: 'service',
        route: 'family',
      },
      {
        key: 'rule',
        route: 'rule'
      },
      {
        key: 'reward',
        route: 'award'
      },
      {
        key: 'apply',
        route: 'apply'
      },
      {
        key: 'rank',
        route: 'rank'
      },
      {
        key: 'prize',
        route: 'assign'
      },
    ]
    for (i; i < menu.length; i++) {
      for (let j = 0; j < routeList.length; j++) {
        if (menu[i].key === routeList[j].key) menu[i].route = routeList[j].route
      }
    }
    store.commit('saveMenu', menu)
    return {
      competitonName
    }
  },
  head () {
    return {
      title: this.competitonName
    }
  },
  data () {
    return {
      show: false,
      showCall: false,
      title: ''
    }
  },
  beforeRouteEnter (to, form, next) {
    next((vm) => {
      if (vm.$store.state.disclaimer) {
        if (to.path.includes('rank')) {
          if (sessionStorage.getItem('disclaimer-rank')) return
          vm.show = true
          sessionStorage.setItem('disclaimer-rank', '1')
        }
        if (to.path.includes('assign')) {
          if (sessionStorage.getItem('disclaimer-assign')) return
          vm.show = true
          sessionStorage.setItem('disclaimer-assign', '1')
        }
      }
    })
  },
  mounted () {
    if (location.search) {
      let searchObj = this.getUrlObj(decodeURIComponent(location.search))
      if (searchObj.channel) {
        this.$store.commit('saveUrlObj', searchObj)
      }
    }
  },
  methods: {
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
  }
}
</script>

<style lang="scss">
.pages-mobile {
  padding-bottom: 1rem;
  background-color: #F1F1F1;
  .disclaimer-text {
    height: 1rem;
    font-size: .24rem;
    color: #656565;
    text-align: center;
    line-height: .8rem;
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 521;
  }
}
</style>

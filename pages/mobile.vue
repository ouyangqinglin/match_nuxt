<template>
  <div class="pages-mobile">
    <nuxt-child></nuxt-child>
    <div class="footer"><Footer :showCall.sync="showCall" /></div>
    <Call :showCall.sync="showCall"/>
  </div>
</template>

<script>
import Footer from '@comp/join-in'
import Call from '@comp/call'
export default {
  name: "mobile",
  components: { Footer },
  async asyncData ({ app, store, query }) {
    if (query.match_code) store.commit('saveCode', query.match_code)
    let config = await app.axios({
      url: `/competition/match/api/match/init?match_code=${query.match_code}&channel=h5`,
    })
    let data = config.data.data
    let competitonName = data.info.competition_name
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
      show: true,
      showCall: false,
      title: ''
    }
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
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 521;
  }
}
</style>

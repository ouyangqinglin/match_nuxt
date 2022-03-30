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
    store.commit('saveConfig', data.config)
    store.commit('saveMobilePage', data.page)
    let menu = JSON.parse(data.config.menu)
    let i = 0, routeList = [
      {
        name: '规则',
        route: 'rule'
      },
      {
        name: '奖励',
        route: 'award'
      },
      {
        name: '报名',
        route: 'apply'
      },
      {
        name: '排名',
        route: 'rank'
      },
      {
        name: '名单',
        route: 'assign'
      },
    ]
    for (i; i < menu.length; i++) {
      if (!menu[i].name.includes('规则') && !menu[i].name.includes('奖励') && !menu[i].name.includes('报名') && !menu[i].name.includes('名单') && !menu[i].name.includes('排名')) {
        menu[i].route = 'family'
      }
      for (let j = 0; j < routeList.length; j++) {
        if (menu[i].name.includes(routeList[j].name)) menu[i].route = routeList[j].route
      }
    }
    store.commit('saveMenu', menu)
    console.log('menu', menu)
    console.log('h5-config', data)
    console.log(data.page)
  },
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
}
</script>

<style lang="scss">
.pages-mobile {
  padding-bottom: 1.2rem;
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 521;
  }
}
</style>

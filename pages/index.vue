<template>
  <div class="pages-index">
    <img class="pages-index-banner" @load="getOffsetTop" id="header-banner" :src="headerImg" alt="">
    <Nav />
    <nuxt-child />
    <div class="pages-index-ps">投资有风险，选择需谨慎</div>
    <img class="pages-index-banner footer-banner" :src="footerImg" alt="">
  </div>
</template>

<script>
import $ from 'jquery'
import Nav from '@comp/nav'

export default {
  name: 'index',
  components: { Nav },
  async asyncData ({ query, store, app }) {
    if (query.match_code) store.commit('saveCode', query.match_code)
    let config = await app.axios({
      url: `/match/api/match/init?match_code=${query.match_code}`,
    })
    let data = config.data.data
    let headerImg = data.section.header.content.image
    let footerImg = data.section.header.content.image
    store.commit('savePage', data.page)
    let list = [
      {
        title: '',
        route: 'introduction',
        key: 'index-introduction'
      },
      {
        title: '',
        route: 'service',
        key: 'index-service'
      },
      {
        title: '',
        route: 'award',
        key: 'index-award'
      },
      {
        title: '',
        route: 'rule',
        key: 'index-rule'
      },
    ]
    if (data.page.length < 3) list.splice(1, 1)
    let j = 0
    for (j; j < data.page.length; j++) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].route.includes('introduction') && data.page[j].title.includes('简介')) list[i].title = data.page[j].title
        if (list[i].route.includes('rule') && data.page[j].title.includes('规则')) list[i].title = data.page[j].title
        if (list[i].route.includes('award') && data.page[j].title.includes('奖励')) list[i].title = data.page[j].title
        if (list[i].route.includes('service') && (!data.page[j].title.includes('规则') && !data.page[j].title.includes('简介') && !data.page[j].title.includes('奖励'))) list[i].title = data.page[j].title
      }
    }
    store.commit('saveNav', list)
    return {
      headerImg,
      footerImg
    }
  },
  data () {
    return {
      comHeaderImg: '',
      comFooterImg: ''
    }
  },
  watch: {
    '$route.path': {
      handler (v) {
        if (v) $('html, body').animate({ scrollTop: this.$store.state.scroll_top }, 0)
      }
    }
  },
  mounted () {
    if (this.$route.query.match_code) window.localStorage.setItem('match_code', this.$route.query.match_code)
    let match_code = window.localStorage.getItem('match_code')
    this.axios({
      url: `/match/api/match/init`,
      type: 'get',
      data: { match_code },
      success: ({ data }) => {
        this.comHeaderImg = data.section.header.content.image
        this.comFooterImg = data.section.footer.content.image
        window.localStorage.setItem('page', JSON.stringify(data.page))
      }
    })
  },
  methods: {
    getOffsetTop () {
      this.$nextTick(() => {
        this.offsetTop = document.getElementById('header-banner').clientHeight
        this.$store.commit('toTop', this.offsetTop)
      })
    }
  },
}
</script>

<style lang="scss">
.pages-index {
  position: relative;
  background-color: #990000;
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
  .footer-banner {
    margin-bottom: -30px;
  }
}
</style>

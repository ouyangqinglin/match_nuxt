<template>
  <div class="pages-index" :style="{background: themeColor, color: themeColor}">
    <img class="pages-index-banner" @load="getOffsetTop" id="header-banner" :src="headerImg" alt="">
    <Nav />
    <nuxt-child />
    <div class="pages-index-ps">投资有风险，选择需谨慎</div>
    <div class="pages-index-right-float">
      <a class="pages-index-right-float-first" style="text-decoration: none" target="_blank" :href="`${$store.state.apiHost}single?code=${$route.query.match_code}`">
        <img :src="require('@img/index/float-login.png')" alt="">
        <div class="pages-index-right-float-first-txt">参赛登录</div>
      </a>
      <div style="height: 1px"></div>
      <a :href="`${$store.state.apiHost}competition/apply?match_code=${$route.query.match_code}`" target="_blank">
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
    <common-flex justify="center">
      <img class="pages-index-banner footer-banner" :src="footerImg" alt="">
    </common-flex>
  </div>
</template>

<script>
import $ from 'jquery'
import Nav from '@comp/nav'

export default {
  name: 'index',
  components: { Nav },
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
    console.log('11', config)
    let data = config.data.data
    let themeColor = data.config.theme_color
    store.commit('saveTheme', themeColor)
    let competitionName = data.info.competition_name
    let headerImg = data.section.header.content.image
    let footerImg = data.section.footer.content.image
    store.commit('savePage', data.page)
    store.commit('saveLetter', data.section.commitment_letter)
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
      themeColor,
      competitionName,
      headerImg,
      footerImg
    }
  },
  methods: {
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
  padding-bottom: 30px;
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

  .footer-banner {
    width: 1200px;
  }
}
</style>

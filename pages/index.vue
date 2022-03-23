<template>
  <div class="pages-index">
    <img class="pages-index-banner" @load="getOffsetTop" id="header-banner" :src="comHeaderImg" alt="">
    <Nav />
    <nuxt-child />
    <div class="pages-index-ps">投资有风险，选择需谨慎</div>
    <img class="pages-index-banner footer-banner" :src="comFooterImg" alt="">
  </div>
</template>

<script>
import $ from 'jquery'
import Nav from '@comp/nav'

export default {
  name: 'index',
  components: { Nav },
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

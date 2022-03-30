<template>
  <div class="mobile-introduction">
    <img :src="mobileConfig.index_banner" alt="">
    <common-flex justify="space-between" align="center" class="mobile-introduction-nav">
      <template v-for="(i, j) of menu">
        <a :href="`${$store.state.apiHost}competition/mobile/${i.route}?match_code=${$route.query.match_code}&title=${i.name}`">
          <common-flex direction="column" align="center" justify="center" class="mobile-introduction-nav-item">
            <img :src="i.icon" alt="">
            <div>{{ i.name }}</div>
          </common-flex>
        </a>
      </template>
    </common-flex>
    <img class="mobile-introduction-content" :src="i.image" alt="" v-for="i of currPage.content">
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "mobile-introduction",
  computed: {
    ...mapState({
      menu: 'menu',
      mobileConfig: 'mobile_config',
      mobilePage: 'mobile_page'
    }),
    currPage () {
      return this.mobilePage.find(i => i.title.includes('简介'))
    }
  }
}
</script>

<style lang="scss">
.mobile-introduction {
  @include cImg();
  &-nav {
    position: relative;
    z-index: 2;
    margin-top: -.8rem;
    padding: .2rem .14rem 0;
    background: url("./img/nav-bg.png") center/100% 100%;
    &-item {
      //width: 1.3rem;
      height: 2.36rem;
      font-size: .26rem;
      color: #000;
      font-weight: 500;
      line-height: .42rem;
      border-radius: .14rem;
      text-align: center;
      @include cImg();
      img {
        margin-bottom: .14rem;
        width: .93rem;
        height: .93rem;
      }
    }
  }
  &-content {
    margin-top: .25rem;
  }
}

</style>

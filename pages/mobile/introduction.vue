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
    <div class="mobile-introduction-blank"  v-for="(i, j) of currPage.content">
      <img class="mobile-introduction-content" :src="i.image" alt="">
      <common-flex direction="column" class="route-link" v-if="j === 3 && match_code === 'zszq'">
        <div class="item">
          <a class="img-link img-zszq" href="http://www.cmschina.com/" target="_blank"></a>
        </div>
        <div class="item">
          <a class="img-link img-zsqh" href="https://qh.newone.com.cn/" target="_blank"></a>
        </div>
        <div class="item">
          <a class="img-link img-ppw" href="https://mobile.simuwang.com/" target="_blank"></a>
        </div>
      </common-flex>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "mobile-introduction",
  computed: {
    ...mapState({
      match_code: 'match_code',
      menu: 'menu',
      mobileConfig: 'mobile_config',
      mobilePage: 'mobile_page'
    }),
    currPage () {
      console.log('mobilePage', this.mobilePage)
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
  &-blank {
    position: relative;
    .route-link {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 18rem;
      .item {
        position: relative;
        width: 100%;
        flex-grow: 1;
        .img-link {
          position: absolute;
          top: 1.7rem;
          left: 50%;
          transform: translateX(-50%);
          width: 2.6rem;
          height: 1.8rem;
        }
        .img-zsqh {
          top: .7rem;
        }
        .img-ppw {
          top: .09rem;
        }
      }
    }
  }
  &-content {
    margin-top: .25rem;
  }
}

</style>

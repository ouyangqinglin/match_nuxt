<template>
  <div class="mobile-introduction">
    <img :src="mobileConfig.index_banner" alt="">
    <common-flex justify="space-between" align="center" class="mobile-introduction-nav">
      <template v-for="(i, j) of menu">
        <nuxt-link :to="{path: i.route, query: {match_code: match_code, channel: channel, title: i.name}}">
          <common-flex direction="column" align="center" justify="center" class="mobile-introduction-nav-item">
            <img :src="i.icon" alt="">
            <div>{{ i.name }}</div>
          </common-flex>
        </nuxt-link>
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
      <common-flex direction="column" class="route-link ydzq" v-if="j === 3 && match_code === 'ydzq'">
        <div class="item">
          <a class="ydzq-link" href="http://www.ydzq.sgcc.com.cn/ydzq/index.html" target="_blank"></a>
        </div>
        <div class="item">
          <a class="ppw-link" href="https://www.simuwang.com" target="_blank"></a>
        </div>
        <div class="item">
          <a class="hs-link" href="https://www.hundsun.com/" target="_blank"></a>
        </div>
        <div class="item">
          <a class="lhhj-link" href="https://www.hongkingsystem.cn/" target="_blank"></a>
        </div>
        <div class="item">
          <a class="jjlh-link" href="https://www.myquant.cn/" target="_blank"></a>
        </div>
        <div class="item">
          <a class="ddrj-link" href="https://www.apexsoft.com.cn/index.jsp" target="_blank"></a>
        </div>
      </common-flex>
      <common-flex direction="column" class="route-link dbzq" v-if="j === 3 && match_code === 'dbzq'">
        <div class="item">
          <a class="dbzq-logo" href="https://www.nesc.cn/" target="_blank"></a>
        </div>
        <div class="item">
          <a class="bhqh-logo" href="https://www.bhfcc.com/" target="_blank"></a>
        </div>
        <div class="item">
          <a class="dzrh-logo" href="https://www.dzronghui.com" target="_blank"></a>
        </div>
        <div class="item">
          <a class="gttk-logo" href="https://www.sdictktrust.com/gttk/index.htm" target="_blank"></a>
        </div>
        <div class="item">
          <a class="xt-logo" href="http://www.thinktrader.net/" target="_blank"></a>
        </div>
        <div class="item">
          <a class="kfkj-logo" href="https://www.kafangtech.com/#/index" target="_blank"></a>
        </div>
        <div class="item">
          <a class="aklk-logo" href="https://www.accelecom.com/" target="_blank"></a>
        </div>
        <div class="item">
          <a class="fakj-logo" href="https://ft.tech/" target="_blank"></a>
        </div>
        <div class="item">
          <a class="ppw-logo" href="https://mobile.simuwang.com/" target="_blank"></a>
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
      return this.mobilePage.find(i => i.title.includes('简介'))
    },
    channel () {
      return this.$route.query.channel || ''
    }
  },
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
    .ydzq {
      height: 43rem;
      a {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 2.6rem;
        height: 1.8rem;
      }
      .ydzq-link {
        top: 1.7rem;
      }
      .ppw-link {
        top: 1.4rem;
      }
      .hs-link {
        width: 3rem;
        top: 2.6rem;
      }
      .lhhj-link {
        top: 3.3rem;
      }
      .jjlh-link {
        width: 4rem;
        top: 1.6rem;
      }
      .ddrj-link {
        width: 4rem;
        top: -.5rem;
      }
    }
    .dbzq {
      height: 50rem;
      a {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 2.6rem;
        height: 1.8rem;
      }
      .dbzq-logo {
        top: 1.2rem;
      }
      .bhqh-logo {
        top: 2.9rem;
      }
      .dzrh-logo {
        top: 2.6rem;
        width: 4.2rem;
      }
      .gttk-logo {
        top: 2rem;
        width: 4.2rem;
      }
      .xt-logo {
        top: 1.6rem;
      }
      .kfkj-logo {
        width: 3rem;
        top: .6rem;
      }
      .aklk-logo {
        width: 3.3rem;
        top: -.4rem;
      }
      .fakj-logo {
        width: 3.3rem;
        top: -1rem;
      }
      .ppw-logo {
        width: 3rem;
        top: -2.3rem;
      }
    }
  }
  &-content {
    margin-top: .25rem;
  }
}

</style>

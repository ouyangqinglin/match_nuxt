<template>
  <common-flex direction="column" align="center" class="pages-introduction">
    <div class="pages-introduction-blank" v-for="(i, j) of currPage.content">
      <img :src="i.image" :alt="i.title">
      <common-flex direction="column" class="route-link" v-if="i.title.includes('组委会') && match_code === 'zszq'">
        <div class="item">
          <a class="img-link img-zszq" href="http://www.cmschina.com/" target="_blank"></a>
          <a class="name-link name-zszq" href="http://www.cmschina.com/" target="_blank"></a>
        </div>
        <div class="item">
          <a class="img-link img-zsqh" href="https://qh.newone.com.cn/" target="_blank"></a>
          <a class="name-link name-zsqh" href="https://qh.newone.com.cn/" target="_blank"></a>
        </div>
        <div class="item">
          <a class="img-link img-ppw" href="https://www.simuwang.com/" target="_blank"></a>
          <a class="name-link name-ppw" href="https://www.simuwang.com/" target="_blank"></a>
        </div>
      </common-flex>
      <common-flex direction="column" class="route-link ydzq" v-if="i.title.includes('大赛组织') && match_code === 'ydzq'">
        <div class="item">
          <a class="ydzq-logo" href="http://www.ydzq.sgcc.com.cn/ydzq/index.html" target="_blank"></a>
          <a class="ydzq-name" href="http://www.ydzq.sgcc.com.cn/ydzq/index.html" target="_blank"></a>
        </div>
        <div class="item">
          <a class="ydzq-ppw-logo" href="https://www.simuwang.com" target="_blank"></a>
          <a class="ydzq-ppw-name" href="https://www.simuwang.com" target="_blank"></a>
        </div>
        <div class="item">
          <a class="ydzq-hs-logo" href="https://www.hundsun.com/" target="_blank"></a>
          <a class="ydzq-hs-name" href="https://www.hundsun.com/" target="_blank"></a>
        </div>
        <div class="item">
          <a class="ydzq-lhhj-logo" href="https://www.hongkingsystem.cn/" target="_blank"></a>
          <a class="ydzq-lhhj-name" href="https://www.hongkingsystem.cn/" target="_blank"></a>
        </div>
        <div class="item">
          <a class="ydzq-jjlh-logo" href="https://www.myquant.cn/" target="_blank"></a>
          <a class="ydzq-jjlh-name" href="https://www.myquant.cn/" target="_blank"></a>
        </div>
        <div class="item">
          <a class="ydzq-ddrj-logo" href="https://www.apexsoft.com.cn/index.jsp" target="_blank"></a>
          <a class="ydzq-ddrj-name" href="https://www.apexsoft.com.cn/index.jsp" target="_blank"></a>
        </div>
      </common-flex>
      <common-flex direction="column" class="route-link dbzq" v-if="i.title === '大赛组委会简介' && match_code === 'dbzq'">
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
          <a class="ppw-logo" href="https://www.simuwang.com/" target="_blank"></a>
        </div>
      </common-flex>
    </div>
  </common-flex>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'introduction',
  computed: {
    ...mapState({
      match_code: 'match_code',
      page: 'page'
    }),
    currPage () {
      return this.page.find(i => i.title.includes('简介'))
    }
  },
}
</script>

<style lang="scss">
.pages-introduction {
  position: relative;
  padding: 60px 0 30px 0;
  @include cImg();
  &-blank {
    position: relative;
    img {
      width: 1200px;
    }
    .route-link {
      position: absolute;
      top: 0;
      left: 0;
      width: 1200px;
      height: 1010px;
      .item {
        position: relative;
        flex-grow: 1;
        width: 100%;
        .img-link {
          position: absolute;
          left: 67px;
          top: 200px;
          width: 263px;
          height: 80px;
        }
        .name-link {
          position: absolute;
          left: 395px;
          top: 145px;
          width: 203px;
          height: 42px;
        }
        .img-zsqh {
          top: 134px;
        }
        .name-zsqh {
          top: 67px;
        }
        .img-ppw {
          top: 82px;
        }
        .name-ppw {
          top: -3px;
        }
      }
    }
    .ydzq {
      height: 2390px;
      .item {
        flex-grow: 1;
        position: relative;
        .ydzq-logo {
          position: absolute;
          left: 117px;
          top: 242px;
          width: 203px;
          height: 84px;
        }
        .ydzq-name {
          position: absolute;
          left: 395px;
          top: 145px;
          width: 203px;
          height: 42px;
        }
        .ydzq-ppw-logo {
          position: absolute;
          left: 117px;
          top: 270px;
          width: 203px;
          height: 84px;
        }
        .ydzq-ppw-name {
          position: absolute;
          left: 403px;
          top: 122px;
          width: 203px;
          height: 42px;
        }
        .ydzq-hs-logo {
          position: absolute;
          left: 105px;
          top: 325px;
          width: 228px;
          height: 84px;
          z-index: 10;
        }
        .ydzq-hs-name {
          position: absolute;
          left: 395px;
          top: 190px;
          width: 203px;
          height: 42px;
        }
        .ydzq-lhhj-logo {
          position: absolute;
          left: 105px;
          top: 280px;
          width: 228px;
          height: 84px;
          z-index: 10;
        }
        .ydzq-lhhj-name {
          position: absolute;
          left: 395px;
          top: 217px;
          width: 203px;
          height: 42px;
        }
        .ydzq-jjlh-logo {
          position: absolute;
          left: 105px;
          bottom: 165px;
          width: 228px;
          height: 84px;
        }
        .ydzq-jjlh-name {
          position: absolute;
          left: 395px;
          top: 88px;
          width: 303px;
          height: 42px;
        }
        .ydzq-ddrj-name {
          position: absolute;
          left: 395px;
          top: -40px;
          width: 303px;
          height: 42px;
        }
        .ydzq-ddrj-logo {
          position: absolute;
          left: 105px;
          top: 20px;
          width: 228px;
          height: 84px;
        }
      }
    }
    .dbzq {
      height: 3394px;
      .item {
        flex-grow: 1;
        position: relative;
        a {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .dbzq-logo {
          top: 140px;
          width: 215px;
          height: 116px;
        }
        .bhqh-logo {
          top: 170px;
          width: 271px;
          height: 139px;
        }
        .dzrh-logo {
          top: 161px;
          width: 425px;
          height: 126px;
        }
        .gttk-logo {
          top: 132px;
          width: 350px;
          height: 126px;
        }
        .xt-logo {
          top: 131px;
          width: 240px;
          height: 118px;
        }
        .kfkj-logo {
          top: 57px;
          width: 286px;
          height: 107px;
        }
        .aklk-logo {
          top: -14px;
          width: 286px;
          height: 114px;
        }
        .fakj-logo {
          top: -37px;
          width: 286px;
          height: 114px;
        }
        .ppw-logo {
          top: -102px;
          width: 286px;
          height: 114px;
        }
      }
    }
  }
}
</style>

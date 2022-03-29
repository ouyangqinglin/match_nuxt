<template>
  <div class="mobile-introduction">
    <img src="./img/banner.jpg" alt="">
    <common-flex justify="space-between" class="mobile-introduction-nav">
      <template v-for="(i, j) of navList">
        <a :href="`${$store.state.apiHost}competition/mobile/${i.route}?match_code=${$route.query.match_code}`">
          <common-flex direction="column" align="center" justify="center" class="mobile-introduction-nav-item">
            <img :src="i.src" alt="">
            <div>{{ i.label }}</div>
          </common-flex>
        </a>
      </template>
    </common-flex>
    <img class="mobile-introduction-content" :src="i" alt="" v-for="i of imgList">
  </div>
</template>

<script>
export default {
  name: "mobile-introduction",
  data () {
    return {
      navList: [
        { route: 'rule', label: '赛事规则', src: require('./img/icon-3.svg') },
        { route: 'award', label: '大赛奖励', src: require('./img/icon-1.svg') },
        { route: 'apply', label: '报名申请', src: require('./img/icon-2.svg') },
        { route: 'rank', label: '大赛排名', src: require('./img/icon-4.svg') },
        { route: 'assign', label: '获奖名单', src: require('./img/icon-0.svg') },
      ],
      imgList: [
        require('./img/intro/1.svg')
      ]
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
    margin: -1rem .3rem 0 .3rem;
    padding: .2rem .06rem;
    background: url("./img/nav-bg.png") center/100% 100%;
    &-item {
      width: 1.3rem;
      height: 1.62rem;
      font-size: .26rem;
      color: #000;
      font-weight: 500;
      line-height: .42rem;
      background: url("./img/nav-item-bg.png") center/100% 100%;
      border-radius: .14rem;
      text-align: center;
      img {
        margin-bottom: .14rem;
        width: .76rem;
        height: .76rem;
      }
    }
  }
  &-content {
    margin-top: .25rem;
  }
}

</style>

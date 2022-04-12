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
      console.log('page', this.page)
      return this.page.find(i => i.title.includes('简介'))
    }
  },
}
</script>

<style lang="scss">
.pages-introduction {
  position: relative;
  padding: 60px 0;
  @include cImg();
  &-blank {
    position: relative;
    img {
      margin-bottom: 55px;
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
  }
}
</style>

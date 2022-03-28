<template>
  <common-flex direction="column" align="center" class="pages-introduction">
    <img v-for="(i, j) of currPage.content" :key="j" :src="i.image" alt="">
  </common-flex>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'introduction',
  computed: {
    ...mapState({
      page: 'page'
    }),
    currPage () {
      return this.page.find(i => i.title.includes('简介'))
    }
  },
  mounted () {
    console.log('page', this.page)
  },
}
</script>

<style lang="scss">
.pages-introduction {
  padding: 60px 0;
  @include cImg();
  img {
    margin-bottom: 55px;
    width: 1200px;
  }
}
</style>

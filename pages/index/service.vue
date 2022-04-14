<template>
  <common-flex direction="column" align="center" class="pages-service">
    <img v-for="(i, j) of currPage.content" :key="j" :src="i.image" alt="">
  </common-flex>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'service',
  computed: {
    ...mapState({
      page: 'page'
    }),
    currPage () {
      return this.page.find(i => i.title === this.$route.query.title)
    }
  },
}
</script>

<style lang="scss">
.pages-service {
  padding: 60px 0 30px 0;

  @include cImg();
  img {
    margin-bottom: 55px;
    width: 1200px;
  }
}
</style>

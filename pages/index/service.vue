<template>
  <div class="pages-service">
    <img v-for="(i, j) of currPage.content" :key="j" :src="i.image" alt="">
  </div>
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
      return this.page.find(i => (!i.title.includes('奖励') && !i.title.includes('规则') && !i.title.includes('简介')))
    }
  },
}
</script>

<style lang="scss">
.pages-service {
  padding: 60px 0;
  @include cImg();
  background-color: #990000;
}
</style>

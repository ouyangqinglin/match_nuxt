<template>
  <div class="pages-introduction">
    <img v-for="(i, j) of currPage.content" :key="j" :src="i.image" alt="">
  </div>
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
}
</style>

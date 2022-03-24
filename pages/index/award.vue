<template>
  <div class="pages-award">
    <img v-for="(i, j) of currPage.content" :key="j" :src="i.image" alt="">
  </div>
</template>

<script>

import { mapState } from "vuex";

export default {
  name: 'award',
  computed: {
    ...mapState({
      page: 'page'
    }),
    currPage () {
      return this.page.find(i => i.title.includes('奖励'))
    }
  },
}
</script>

<style lang="scss">
.pages-award {
  padding: 60px 0;
  @include cImg();
  background-color: #990000;
}
</style>

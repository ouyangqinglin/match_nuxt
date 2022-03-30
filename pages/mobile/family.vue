<template>
  <div class="mobile-family">
    <Header :label="$route.query.title" />
    <div class="content"><img v-for="i of currPage.content" :src="i.image" alt=""></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Header from '@comp/nav-header'

export default {
  name: "family",
  components: { Header },
  computed: {
    ...mapState({
      page: 'mobile_page'
    }),
    currPage () {
      return this.page.find(i => i.title === this.$route.query.title)
    }
  }
}
</script>

<style lang="scss">
.mobile-family {
  .content {
    @include cImg();
  }
}
</style>

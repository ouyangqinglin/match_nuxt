<template>
  <div class="mobile-award">
    <Header :label="$route.query.title" />
    <div class="content"><img v-for="i of currPage.content" :src="i.image" alt=""></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Header from '@comp/nav-header'
export default {
  name: "mobile-award",
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
.mobile-award {
  .content {
    @include cImg();
  }
}
</style>

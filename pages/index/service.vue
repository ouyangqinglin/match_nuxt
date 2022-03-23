<template>
  <div class="pages-service">
    <img v-for="(i, j) of imgList" :key="j" :src="i" alt="">
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'service',
  data () {
    return {
      imgList: [
        require('@img/index/1.png'),
        require('@img/index/2.png'),
        require('@img/index/3.png'),
        require('@img/index/4.png'),
        require('@img/index/5.png'),
        require('@img/index/6.png'),
        require('@img/index/7.png'),
        require('@img/index/8.png')
      ]
    }
  },
  computed: {
    ...mapState({
      page: 'page'
    }),
    dynamicNav () {
      return this.page
    },
  },
  mounted () {
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

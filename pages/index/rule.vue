<template>
  <div class="pages-rule">
    <img v-for="(i, j) of imgList" :key="j" :src="i" alt="">
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: 'rule',
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
}
</script>

<style lang="scss">
.pages-rule {
  padding: 60px 0;
  @include cImg();
  background-color: #990000;
}
</style>

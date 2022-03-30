<template>
  <div class="mobile-page-header">{{ title }}</div>
</template>

<script>
export default {
  name: "mobile-page-title",
  props: ['title']
}
</script>

<style lang="scss">
.mobile-page-header {
  width: 4.11rem;
  height: .7rem;
  font-size: .38rem;
  line-height: .7rem;
  text-align: center;
  @include bg(url('~@img/mobile/apply-header-bg.svg'));
}

</style>

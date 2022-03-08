<template>
  <div class="nav-header">
    <img src="./img/back.png" alt="" @click="goBack">
    {{label}}
  </div>
</template>

<script>
export default {
  name: 'nav-header',
  props: {
    label: {
      type: String
    }
  },
  methods: {
    goBack() {
      history.back()
    }
  }
}
</script>

<style lang="scss">
.nav-header{
  height: .88rem;
  line-height: .88rem;
  text-align: center;
  box-shadow: 0 .1rem .2rem 0 rgba(75, 6, 0, 0.15);
  font-size: .36rem;
  position: relative;
  z-index: 3;
  img{
    position: absolute;
    top: calc(50% - .18rem);
    left: .3rem;
    width: .2rem;
    height: .36rem;
  }
}
</style>

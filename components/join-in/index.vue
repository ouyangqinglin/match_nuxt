<template>
  <div class="join-in">
    <div class="btn or contact" @click="showToast">
      <img :src="require('./img/contact.svg')" alt="" class="or">
      <span>联系我们</span>
    </div>
    <nuxt-link to="apply" class="btn or apply">
      <img :src="require('./img/apply.svg')" alt="" class="or">
      <span>立即报名</span>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'join-in',
  methods: {
    showToast () {
      this.$emit('update:showCall', true)
    }
  }
}
</script>

<style lang="scss">
.join-in {
  padding: .11rem .32rem;
  width: 100vw;
  height: 1.1rem;
  display: flex;
  align-items: center;
  font-weight: 400;
  line-height: 1;
  background: #B52525;
  box-shadow: 0px -.02rem 16px 1px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  .btn {
    font-size: .3rem;
    flex-grow: 1;
    align-self: stretch;
    border-radius: .2rem;
    color: #cc2d27;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(#fffaee, #FFE2A0);
    font-weight: 500;
    img {
      width: .6rem;
      height: .6rem;
      margin-right: .2rem;
    }
    &+.btn { margin-left: .2rem; }
  }


}
</style>

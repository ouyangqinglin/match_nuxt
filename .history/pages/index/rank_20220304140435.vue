<template>
  <div class="pc-rank">
    <common-flex dircetion="column" justify="center" class="ppw-w1200">
      <div class="title">大赛排名</div>
    </common-flex>
  </div>
</template>

<script>
import commonFlex from '../../components/common/common-flex.vue'
export default {
  components: { commonFlex },
  name: 'rank',
}
</script>

<style lang="scss">
.pc-rank {
  padding: 60px 0;
  .title {
    width: 359px;
    height: 60px;
    text-align: center;
    @include nFont(30 500 #470000 60);
    background: linear-gradient(90deg, #FFD585 0%, #FFEECD 47%, #FFD585 100%);
    border: 1px solid #F4BD77;
    border-radius: 0 0 20px 20px;
  }
}
</style>

<template>
  <div class="pc-rank">
    <common-flex dircetion="column" justify="center" class="ppw-w1200">
      <div>大赛排名</div>
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
}
</style>

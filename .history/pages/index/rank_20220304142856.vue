<template>
  <div class="pc-rank">
    <common-flex direction="column" justify="center" class="ppw-w1200 main">
      <div class="title">大赛排名</div>
      <div class="body">
        <common-flex class="strategy">
          <div><span>*</span>策略类型</div>
          <common-flex>
            <div>量化多投</div>
            <div>量化多投</div>
          </common-flex>
        </common-flex>
      </div>
    </common-flex>
  </div>
</template>

<script>
export default {
  name: 'rank',
}
</script>

<style lang="scss">
.pc-rank {
  padding: 60px 0;
  .main {
    padding-bottom: 120px;
    .title {
      margin-bottom: 30px;
      width: 359px;
      height: 60px;
      text-align: center;
      @include nFont(30 500 #470000 60);
      background: linear-gradient(90deg, #FFD585 0%, #FFEECD 47%, #FFD585 100%);
      border: 1px solid #F4BD77;
      border-radius: 0 0 30px 30px;
    }
    .body {
      padding: 0 30px;
    }
  }
}
</style>

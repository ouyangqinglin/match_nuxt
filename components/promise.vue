<template>
  <transition name="regular">
    <common-flex v-if="show" :key="`regular`" class="comp-promise" justify="center" align="center">
      <div class="content">
        <common-flex class="header" align="center" justify="center">
          <div>参赛承诺书</div>
          <img class="header-close" @click="close" :src="require('@img/close.png')" alt="">
          <common-flex class="header-countdown" direction="column" justify="space-around" align="center">
            <div>倒计时</div>
            <div>{{time}}s</div>
          </common-flex>
        </common-flex>
        <div class="body">
          <div v-html="text"></div>
        </div>
      </div>
    </common-flex>
  </transition>
</template>

<script>
export default {
  name: "promise",
  props: ['show'],
  data () {
    return {
      time: 5,
      timer: null,
      text: `<p style="font-weight: bold;">致：</p>
                      <p style="font-weight: bold;">山西证券股份有限公司</p>
                      <div style="height: .45rem"></div>
                      <p>本机构同意接受山西证券股份有限公司（以下简称“主办方”）《首届“山证杯”量化私募实盘大赛》参赛邀请。在确认参与大赛之前，已经仔细阅读并同意遵守本同意确认书。若主办方后续对大赛规则
                      有所调整，本机构均同意并接受。</p>
                      <div style="height: .45rem"></div>
                      <p>1、本机构已阅读并理解山西证券私募投资争霸赛参赛规则，同意遵守该参赛规则；本机构同意该次比赛的奖励、评分标准、方案、规则等最终解释权归主办方山西证券股份有限公司所有，主办方有权
                      根据实际情况进行修改或取消；</p>
                      <p>2、该比赛为阳光私募机构证券期货实盘账户交易比赛，参赛产品自行交易，自负盈亏，所有交易须遵守相关法律法规；本机构承诺在参加比赛过程中不会进行舞弊和操纵市场等行为；如主办方发现或
                      有人举报，经核实后确有相关行为的嫌疑，本机构接受主办方的处理；由此产生的一切后果由我司承担；</p>
                      <p>3. 参赛机构或其授权的外包服务机构需按要求及时、准确地报送参赛产品的净值等相关数据，并对提供数据信息行为的合法、合规性以及所提供数据信息的真实性和完整性负责；主办方有权对提供的
                      数据向其托管方进行复核，若出现提供的数据有误、影响比赛成绩等情况，主办方有权取消参赛私募基金管理人的参赛资格。</p>
                      <p>4. 本次大赛主办方将本着公平、公正、专业的原则保障大赛的顺利进行。但不对因不可抗力的因素或非大赛主办方所能控制的情况所导致的任何风险，因网络、计算机软件、通讯、电力、设备等多方
                      面原因对参赛选手收益率及排名产生的影响等承担任何责任。参赛机构必须保护好自己的账号密码，如因为密码丢失或被破解所导致的账户被窃而造成损失的，大赛主办方对此不承担任何责任。</p>
                      <p>5.本次大赛披露的排名等相关信息仅限大赛范围参考，不构成对任何主体的投资建议，市场有风险，投资需谨慎；大赛主办方接受参赛机构参与本次大赛，不代表大赛主办方对参赛机构及其管理的基金
                      产品的推荐、营销、宣传，不代表主办方与参赛机构之间存在基金产品销售委托代理关系。参赛机构不得利用主办方的名义、商标、商号或者本次大赛名义进行基金宣传、募集活动；对未经大赛主办方授权
                      不当使用相关信息造成的任何后果，与大赛主办方无关。</p>
                      <p>6. 主办方在比赛期间所提供的信息，资料及图标仅供参考并不构成对任何股票的收购、购买、认购、抛售或持有的邀约或意图，市场有风险，投资需谨慎。</p>
                      <p>7. 参赛的私募基金管理人必须严格遵守监管机构、交易所、主办方交易管理等各项规定、要求。</p>
                      <p>8. 本次大赛最终解释权归主办方所有。</p>
                      <div style="height: .45rem"></div>
                      <p style="font-weight: bold;">本机构已详细阅读并完全理解上述全部内容。本机构已确认、同意，并将积极配合，同时愿意承担因违反上述条款而产生的风险和损失。</p>
                      <div style="height: .45rem"></div>`
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      this.time--
      if (this.time < 1) clearInterval(this.timer)
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    close () {
      if (this.time <= 0) this.$emit('update:show', false)
      else this.$comp.toast.show({
        content: '阅读5秒以上才能关闭！'
      })
    }
  }
}
</script>

<style lang="scss">
.regular-enter, .regular-leave-to {
  opacity: 0;
  transform: translateY(-.1rem);
}
.regular-enter-active, .regular-leave-active {
  transition: all .3s;
}
.comp-promise {
  z-index: 521;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  overflow: hidden;
  .content {
    width: 80%;
    height: 7.5rem;
    border-radius: .12rem;
    background-color: #fff;
    .header {
      position: relative;
      height: .8rem;
      text-align: center;
      background-color: #dddddd;
      border-radius: .15rem .15rem 0 0;
      font-size: .3rem;
      color: rgb(51, 51, 51);
      font-weight: 600;
      &-close {
        position: absolute;
        right: .3rem;
        top: .3rem;
        width: .32rem;
        height: .32rem;
        cursor: pointer;
      }
      &-countdown {
        position: absolute;
        bottom: -1rem;
        right: .2rem;
        width: 1rem;
        height: 1rem;
        @include bg(url('~@img/countdown-bg.png'));
        :nth-child(1) {
          font-size: .14rem;
          color: #fff;
        }
        :nth-child(2) {
          font-size: .16rem;
          color: #333;
        }
      }
    }
    .body {
      padding: .3rem;
      max-height: 6rem;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        width: 5px;
        height: 35px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background: #999999;
      }
      &::-webkit-scrollbar-track {
        border-radius: 3px;
        background: #EDEDED;
      }
      p {
        font-size: .3rem;
        color: #333;
        line-height: .45rem;
      }
    }
  }
}
</style>

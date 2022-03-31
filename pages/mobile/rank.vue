<template>
  <div style="background-color: #fff">
    <Header label="大赛排名" />
    <div style="height: .45rem; background: #f1f1f1" />
    <div class="rank">
      <div class="header"><CommonTitle title="大赛排名"/></div>
      <div class="fake-input-box" v-for="(item, i) of fields" :key="i" @click="showPopUp(item.property)">
        <div class="label">
          <span class="star" v-if="item.required != 0">*</span>
          <span>{{item.name}}</span>
        </div>
        <div class="fake-input">
          <template v-if="item.type === 'select'">
            <div class="content">
              <span>{{item.viewValue}}</span>
            </div>
            <div class="tri" />
          </template>
          <template v-if="item.type === 'text'">
            <input v-model="keyword" type="text" :placeholder="item.placeholder">
            <i class="find" />
          </template>
        </div>
      </div>
      <div class="margin-box" />
      <div class="rank-form" v-if="trs.length">
        <div class="rank-form-thred">
          <div style="background: rgba(225, 137, 72, .12)" v-for="(t, i) in title_arr">
            {{t.label}}
          </div>
        </div>
        <div class="rank-form-content"  v-for="(item, i) of trs" :key="i">
          <div class="rank-form-content-item" :style="{background: i % 2 === 1? 'rgba(225, 137, 72, .04)':''}" v-for="(t, t_i) in title_arr" :key="i+''+t_i">
            <template v-if="t.prop==='rank_score'&&+item.rank_score === 1"><img src="./img/rank/no1.png" alt="">1</template>
            <template v-else-if="t.prop==='rank_score'&&+item.rank_score === 2"><img src="./img/rank/no2.png" alt="">2</template>
            <template v-else-if="t.prop==='rank_score'&&+item.rank_score === 3"><img src="./img/rank/no3.png" alt="">3</template>
            <template v-else-if="t.prop==='rank_score'"> {{item.rank_score}} </template>
            <template v-else-if="t_i===1">{{item[t.prop.name]}}</template>
            <template v-else-if="t_i===2">{{item[t.prop.name]}}</template>
            <template v-else-if="t.prop==='ret'"><span :style="{color: item[t.prop] > 0? '#C00000':'#009819'}">{{item[t.prop]}}%</span></template>
            <template v-else-if="t.prop==='ret_m'"><span :style="{color: item[t.prop] > 0? '#C00000':'#009819'}">{{item[t.prop]}}%</span></template>
            <template v-else-if="t.prop==='maxdown'"><span>{{item[t.prop]}}%</span></template>
            <template v-else>{{item[t.prop]}}</template>
          </div>
        </div>
      </div>
      <div class="empty-box" v-else>
        <img :src="require('./img/rank/empty.png')" alt="">
        <p>没有符合条件的产品或产品未上榜</p>
      </div>
      <pop-up :popUpShow="strategyPoPUpShow"
              @closePopUp="closePopUp"
              @cleanActive="cleanStrategyActive"
              @confirmGetTable="confirmGetTable('strategy')">
        <div class="pop-up-slot">
          <div class="title">
          <span v-if="
            fields[0] && fields[0].required !== '0'
          ">*</span>{{fields[0] && fields[0].name}}
          </div>
          <div class="pop-up-item-box">
            <div class="item" @click="strategySelected(i)"
                 v-for="(item, i) of strategy" :key="item.value"
                 :style="i === curStrategy && { color: '#470000', border: 'none', background: 'linear-gradient(#FFD585,#FFEECD,#FFD585)'}">
              {{item.label}}
            </div>
            <template v-if="strategy[curStrategy] && strategy[curStrategy].children">
              <div class="item-dy">
                <div class="item-sub" @click="substrategySelected(i)"
                     v-for="(item, i) of strategy[curStrategy].children" :key="i"
                     :style="i === subCurStrategy && { color: '#470000',  border: 'none', background: 'linear-gradient(#FFD585,#FFEECD,#FFD585)'}">
                  {{item.label}}
                </div>
              </div>
            </template>
          </div>
        </div>
      </pop-up>
      <pop-up :popUpShow="periodPopUpShow"
              @closePopUp="closePopUp"
              @cleanActive="cleanPeriodActive"
              @confirmGetTable="confirmGetTable('period')">
        <div class="pop-up-slot">
          <div class="title">
          <span v-if="
            fields[1] && fields[1].required !== '0'
          ">*</span>{{fields[1] && fields[1].name}}
          </div>
          <div class="pop-up-item-box">
            <div class="item" @click="periodSelected(i)"
                 v-for="(item, i) of period" :key="item.value"
                 :style="i === curPeriod && { color: '#470000',  border: 'none', background: 'linear-gradient(#FFD585,#FFEECD,#FFD585)'}">
              {{item.label}}
            </div>
            <template v-if="period[curPeriod]">
              <div class="item-dy" v-if="period[curPeriod].children" :style="{justifyContent: period[curPeriod].children.length > 2? 'space-between':''}">
                <div class="item-sub" @click="subPeriodSelected(i)"
                     v-for="(item, i) of period[curPeriod].children" :key="i"
                     :style="i === subCurPeriod && { color: '#470000',  border: 'none', background: 'linear-gradient(#FFD585,#FFEECD,#FFD585)'}">
                  {{item.label}}
                </div>
              </div>
            </template>
          </div>
        </div>
      </pop-up>
      <!-- <div class="tips">
        <p>备注说明</p>
        <span>过了报名有效期参赛的产品除了不参与当月排名，其他榜单均参与数据报送不全的产品不参与排名</span>
      </div> -->
    </div>
  </div>
</template>

<script>
import popUp from '@comp/pop-up'
import CommonTitle from '@comp/mobile-page-title'
import Header from '@comp/nav-header'

export default {
  name: 'rank',
  components: { popUp, CommonTitle, Header },
  data () {
    return {
      trs: [],
      fields: [], /* 页面配置 */
      configFields: [],
      strategyPoPUpShow: false,
      strategy: [], /* 策略 */
      curStrategy: 0,
      subCurStrategy: 0,
      periodPopUpShow: false,
      period: [], /* 周期 */
      curPeriod: 0,
      subCurPeriod: 0,
      scaleGroupPopUpShow: false,
      csearch_scale_group: 2,
      curScaleGroup: 0,
      /* params */
      csearch_strategy: '1',
      csearch_sub_strategy: '1',
      csearch_rank_range: '1m',
      csearch_end_date: '',
      keyword: '',
      page: 1,
      amountPerPage: '30',
      total_page: 0,
      /* 节流(请求充能中) */
      keywordTimer: null,
      title_arr: []
    }
  },
  computed: {
    getWidth () {
      return `width: calc((${document.documentElement.clientWidth}px - 1.8rem)/${(this.title_arr.length-1)})`
    }
  },
  watch: {
    keyword (newValue) {
      clearTimeout(this.keywordTimer)
      this.keywordTimer = setTimeout(() => {
        this.getTable()
      }, 300);
    }
  },
  mounted () {
    this.getSetting()
  },
  methods: {
    getTable (arg) {
      if (arg !== 'append') {
        this.trs = []
        this.page = 1
      }
      let params = {
        match_code: this.$route.query.match_code,
        source_type: 'h5',
        page: this.page,
        rows: this.amountPerPage
      }
      params['csearch_strategy'] = this.csearch_strategy
      params['csearch_rank_range'] = this.csearch_rank_range
      params['csearch_end_date'] = this.csearch_end_date
      params['csearch_fund_name'] = this.keyword
      this.axios({
        url: `/competition/activity/backend/api/competition/commonRankList`,
        type: 'get',
        data: params,
        success: (res) => {
          this.trs = this.trs.concat(res.data.data)
          this.title_arr = res.data.title_arr
          this.title_arr.forEach( (i) => {
            if(i.prop.name) {
              this.trs.forEach( j => {
                if(i.type_meta && i.type_meta.precision && 0 < i.type_meta.precision) {
                  j[i.prop.name] = Number(Number(j[i.prop.name])).toFixed(i.type_meta.precision)
                }
              })
            } else {
              this.trs.forEach( j => {
                if(i.type_meta && i.type_meta.precision && 0 < i.type_meta.precision) {
                  j[i.prop] = Number(Number(j[i.prop])).toFixed(i.type_meta.precision)
                }
              })
            }
          })
          this.total_page = +res.data.pager.total_page
        }
      })
    },
    getSetting () {
      this.axios({
        url: `/competition/activity/backend/api/competition/getRankSearchFields`,
        type: 'get',
        data: { match_code: this.$route.query.match_code },
        success: (res) => {
          this.configFields = res.data.fields
          this.fields = this.configFields.filter((i) => i.name !== '产品组别')
          this.strategy = res.data.option_definition[this.fields[0].property]
          this.period = res.data.option_definition[this.fields[1].property]
          if(this.strategy[0].children[0]) {
            this.fields[0].viewValue = `${this.strategy[0].label}>${this.strategy[0].children[0].label}`
          } else {
            this.fields[0].viewValue = this.strategy[0].label
          }
          this.fields[1].viewValue = this.period[0].label
          if (this.period[0].children.length) {
            this.fields[1].viewValue = this.period[0].label + '>' + this.period[0].children[0].label
            this.csearch_end_date = this.period[0].children[0].value
          }else {
            this.fields[1].viewValue = this.period[0].label
          }
          this.getTable()
        }
      })
    },

    strategySelected (i) {
      if (i === this.curStrategy) return
      this.curStrategy = i
      this.subCurStrategy = 0
    },
    substrategySelected (i) {
      if (i === this.subCurStrategy) return
      this.subCurStrategy = i
    },
    periodSelected (i) {
      if ( i === 2) this.period[i].children = []
      if (i === this.curPeriod) return
      this.subCurPeriod = 0
      this.curPeriod = i
    },
    subPeriodSelected (i) {
      if (i === this.subCurPeriod) return
      this.subCurPeriod = i
    },

    /* pop up */
    closePopUp () { /* 取消 */
      this.strategyPoPUpShow = false
      this.periodPopUpShow = false
      this.scaleGroupPopUpShow = false
    },
    cleanStrategyActive () { /* 清空筛选 */
      this.curStrategy = -1
    },
    cleanPeriodActive () {
      this.curPeriod = -1
      this.subCurPeriod = -1
    },
    confirmGetTable (type) { /* 确认 */
      this.closePopUp()
      if (type === 'strategy') {
        // 页面配置{策略}展示值
        if(this.strategy[this.curStrategy].children && this.strategy[this.curStrategy].children.length) {
          this.fields[0].viewValue = this.strategy[this.curStrategy].label + '>' + this.strategy[this.curStrategy].children[this.subCurStrategy].label
          this.csearch_strategy = this.strategy[this.curStrategy].value
          this.csearch_sub_strategy = this.strategy[this.curStrategy].children[this.subCurStrategy].value
        } else {
          this.fields[0].viewValue = this.strategy[this.curStrategy].label
          // 请求参数变化
          this.csearch_strategy = this.strategy[this.curStrategy].value
        }
      }
      if (type === 'period') {
        // 页面配置{周期}展示值
        this.fields[1].viewValue = this.period[this.curPeriod].label
        this.csearch_rank_range = this.period[this.curPeriod].value
        if (this.period[this.curPeriod].children && this.period[this.curPeriod].children.length) {
          this.fields[1].viewValue = this.period[this.curPeriod].label + '>' + this.period[this.curPeriod].children[this.subCurPeriod].label
          this.csearch_end_date = this.period[this.curPeriod].children[this.subCurPeriod].value
        } else this.csearch_end_date = ''
        // 请求参数变化
      }
      this.getTable()
    },

    showPopUp (prop) {
      prop === this.fields[0].property && (this.strategyPoPUpShow = true)
      prop === this.fields[1].property && (this.periodPopUpShow = true)
    },
  },
}
</script>

<style lang="scss">
.rank-form {
  margin: .5rem .3rem;
  display: flex;
  flex-direction: column;
  &-thred {
    display: flex;
    align-items: center;
    >div {
      flex: 0 0 auto;
      font-weight: 500;
      line-height: .6rem;
      font-size: .24rem;
    }
    >:nth-child(1) {
      width: .8rem;
      text-align: center;
    }
    >:nth-child(2) {
      flex: 1;
      padding-left: 0.2rem;
    }
    >:nth-child(3) {
      flex: 1;
      padding-left: 0.2rem;
    }
  }
  &-content {
    display: flex;
    align-items: center;
    &-item {
      position: relative;
      >img {
        position: absolute;
        top: .09rem;
        left: .2rem;
        width: .4rem;
        height: .5rem;
        z-index: -1;
      }
    }
    >div {
      flex: 0 0 auto;
      height: .8rem;
      font-weight: 400;
      line-height: .8rem;
      font-size: .24rem;
    }
    >:nth-child(1) {
      z-index: 1;
      width: .8rem;
      text-align: center;
    }
    >:nth-child(2) {
      flex: 1;
      padding-left: 0.2rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    >:nth-child(3) {
      flex: 1;
      padding-left: 0.2rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.fake-input-box {
  margin: 0 .4rem .6rem .3rem;
  display: flex;align-items: center;
  .label {
    display: flex;
    align-items: flex-start;
    width: 1.46rem;
    font-size: .26rem;
    font-weight: bold;
    line-height: 1;
    .star {
      color:#f45;
    }
  }
  .fake-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 .2rem;
    flex-grow: 1;
    height: 1rem;
    border: .02rem solid #D7DAE2;
    border-radius: .1rem;
    .tri {
      width: 0;
      height: 0;
      border-top: .2rem solid #999;
      border-left: .15rem solid transparent;
      border-right: .15rem solid transparent;
    }
  }
}
.margin-box{
  width: 100vw;
  height: .2rem;
  background: #eee;
}
.rank {
  position: relative;
  padding-top: 1rem;
  height: 100%;
  .header {
    position: absolute;
    left: 50%;
    top: -.15rem;
    transform: translateX(-50%);
  }
  .empty-box {
    width: 100%;
    height: 4rem;
    box-sizing: border-box;
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 1.17rem;
      height: .98rem;
      margin-bottom: .4rem;
    }
    p {
      text-align: center;
      font-size: .24rem;
      font-weight: 400;
      color: #999999;
    }
  }
  .colored-title+.fake-input-box {
    margin-top: .5rem;
  }

  .fake-input {
    font-size: .3rem;
    input::placeholder {
       font-size: .3rem;
      color: #999;
    }
    position: relative;
    input {
      width: calc(100% - .2rem - .32rem);
      &+i {
        position: absolute;
        width: .32rem;
        height: .32rem;
        right: .2rem;
        top: calc(50% - .16rem);
        background: url('./img/rank/find.png');
        background-size: 100% 100%;
      }
    }
  }
  .disabled {
    .fake-input {
      background: #f1f1f1;
    }
  }
  .no-wrap {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .sub-btn {
    width: 6.7rem;
    height: 1rem;
    line-height: 1rem;
    border-radius: .2rem;
    background: #FFEEEE;
    color: #C00000;
    text-align: center;
    font-size: .36rem;
    margin-left: .4rem;
    margin-bottom: .5rem;
  }
  .tips {
    margin-bottom: .8rem;
    padding: 0 .3rem;
    font-size: .24rem;
    color: #333;
    line-height: .4rem;
    p {
      font-weight: bold;
    }
  }
}

</style>

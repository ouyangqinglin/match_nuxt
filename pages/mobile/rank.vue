<template>
  <div style="background-color: #fff">
    <Header label="大赛排名" />
    <div style="height: .45rem; background: #f1f1f1" />
    <div class="rank">
      <div class="common-header"><CommonTitle title="大赛排名"/></div>
      <template v-for="(val, key) in option_definition">
        <common-flex class="fake-input-box" align="center">
          <common-flex class="label" align="flex-start">
            <span class="star">*</span>
            <span>{{ getName(key) }}:</span>
          </common-flex>
          <common-flex @click.native="openPop(key)" class="fake-input" justify="space-between" align="center">
            <div class="content"><span>{{ inputContent(key) }}</span></div>
            <div class="tri" />
          </common-flex>
        </common-flex>
      </template>
      <common-flex class="fake-input-box" align="center">
        <common-flex class="label" align="flex-start">
          <span>关键词:</span>
        </common-flex>
        <common-flex class="fake-input" justify="space-between" align="center">
          <input type="text" v-model.trim="csearch_fund_name" placeholder="请输入基金名称/所属机构关键字">
          <i class="find" />
        </common-flex>
      </common-flex>
      <div class="margin-box" />
      <div class="rank-form" v-if="dataList.length">
        <div class="rank-form-thred">
          <div style="background: rgba(225, 137, 72, .12)" v-for="(t, i) in itemList">
            {{t.label}}
          </div>
        </div>
        <div class="rank-form-content"  v-for="(item, i) of dataList" :key="i">
          <div class="rank-form-content-item" :style="{background: i % 2 === 1? 'rgba(225, 137, 72, .04)':''}" v-for="(t, t_i) in itemList" :key="i+''+t_i">
            <template v-if="t.prop==='rank_score'&&+item.rank_score === 1"><img :src="require('./img/rank/no1.png')" alt="">1</template>
            <template v-else-if="t.prop==='rank_score'&&+item.rank_score === 2"><img :src="require('./img/rank/no2.png')" alt="">2</template>
            <template v-else-if="t.prop==='rank_score'&&+item.rank_score === 3"><img :src="require('./img/rank/no3.png')" alt="">3</template>
            <template v-else-if="t.prop==='rank_score'"> {{item.rank_score}} </template>
            <template v-else-if="t.prop==='ret'"><span :style="{color: item[t.prop] > 0? '#C00000':'#009819'}">{{item[t.prop]}}%</span></template>
            <template v-else-if="t.prop==='ret_m'"><span :style="{color: item[t.prop] > 0? '#C00000':'#009819'}">{{item[t.prop]}}%</span></template>
            <template v-else-if="t.prop==='maxdown'"><span>{{item[t.prop]}}%</span></template>
            <template v-else>{{item[t.prop] || item[t.prop.name]}}</template>
          </div>
        </div>
      </div>
      <div class="empty-box" v-else>
        <img src="./img/rank/empty.png" alt="">
        <p>没有符合条件的产品或产品未上榜</p>
      </div>

      <pop-up :show.sync="strategyShow" @sure="getDataList">
        <div class="pop-up-slot">
          <div class="title"><span>*</span>策略类型</div>
          <div class="pop-up-item-box">
            <div class="item" v-for="(item, i) of option_definition['csearch_strategy']" :key="item.value" @click="curStra = i"
                 :style="i === curStra && { color: theme, border: 'none', background: 'linear-gradient(#FFD585,#FFEECD,#FFD585)'}">
              {{item.label}}
            </div>
            <template v-if="subStraList.length">
              <div class="item-dy">
                <div class="item-sub" v-for="(item, i) of subStraList" :key="i" @click="curSubStra = i"
                     :style="i === curSubStra && { color: theme,  border: 'none', background: 'linear-gradient(#FFD585,#FFEECD,#FFD585)'}">
                  {{item.label}}
                </div>
              </div>
            </template>
          </div>
        </div>
      </pop-up>

      <pop-up :show.sync="rangShow" @sure="getDataList">
        <div class="pop-up-slot">
          <div class="title"><span>*</span>排名周期</div>
          <div class="pop-up-item-box">
            <div class="item" v-for="(item, i) of option_definition['csearch_rank_range']" :key="item.value" @click="curRang = i"
                 :style="i === curRang && { color: theme, border: 'none', background: 'linear-gradient(#FFD585,#FFEECD,#FFD585)'}">
              {{item.label}}
            </div>
            <template v-if="subRangList.length">
              <div class="item-dy">
                <div class="item-sub" v-for="(item, i) of subRangList" :key="i" @click="curSubRang = i"
                     :style="i === curSubRang && { color: theme,  border: 'none', background: 'linear-gradient(#FFD585,#FFEECD,#FFD585)'}">
                  {{item.label}}
                </div>
              </div>
            </template>
          </div>
        </div>
      </pop-up>

      <pop-up :show.sync="scaleShow" @sure="getDataList">
        <div class="pop-up-slot">
          <div class="title"><span>*</span>产品分组</div>
          <div class="pop-up-item-box">
            <div class="item" v-for="(item, i) of option_definition['csearch_scale_group']" :key="item.value" @click="curScale = i"
                 :style="i === curScale && { color: theme, border: 'none', background: 'linear-gradient(#FFD585,#FFEECD,#FFD585)'}">
              {{item.label}}
            </div>
            <template v-if="subScaleList.length">
              <div class="item-dy">
                <div class="item-sub" v-for="(item, i) of subScaleList" :key="i" @click="curSubScale = i"
                     :style="i === curSubScale && { color: theme,  border: 'none', background: 'linear-gradient(#FFD585,#FFEECD,#FFD585)'}">
                  {{item.label}}
                </div>
              </div>
            </template>
          </div>
        </div>
      </pop-up>

    </div>
  </div>
</template>

<script>
import popUp from '@comp/pop-up'
import CommonTitle from '@comp/mobile-page-title'
import Header from '@comp/nav-header'
import {mapState} from "vuex";

export default {
  name: 'rank',
  components: { popUp, CommonTitle, Header },
  async asyncData ({ app, store, query }) {
    let res = await app.axios({
      url: '/competition/match/api/match/rank/query_options',
      type: 'get',
      data: { match_code: query.match_code }
    })
    let fields = res.data.data.fields, option_definition = res.data.data.option_definition
    return {
      fields,
      option_definition
    }
  },
  data () {
    return {
      curStra: 0,
      curSubStra: 0,
      curRang: 0,
      curSubRang: 0,
      curScale: 0,
      curSubScale: 0,
      csearch_fund_name: '',
      timer: null,
      maxPage: 0,
      itemList: [], // 表头
      dataList: [], // 表单
      pageParam: {
        page: 1,
        rows: 30
      },
      strategyShow: false,
      rangShow: false,
      scaleShow: false,
    }
  },
  computed: {
    ...mapState({
      match_code: 'match_code',
      theme: 'theme'
    }),
    subStraList () {
      return this.option_definition['csearch_strategy'] ? this.option_definition['csearch_strategy'][this.curStra].children || []: '' // 子策略
    },
    subRangList () {
      return this.option_definition['csearch_rank_range'] ? this.option_definition['csearch_rank_range'][this.curRang].children || [] : [] // 榜单下的排名日期
    },
    subScaleList () {
      return this.option_definition['csearch_scale_group'] ? this.option_definition['csearch_scale_group'][this.curScale].children || [] : [] // 榜单下的排名日期
    },
    strategyContent () {
      let c
      if (this.subStraList.length) c = `${this.option_definition['csearch_strategy'][this.curStra].label}>${this.subStraList[this.curSubStra].label}`
      else c = `${this.option_definition['csearch_strategy'][this.curStra].label}`
      return c
    },
    csearchContent () {
      let c
      if (this.subRangList.length) c = `${this.option_definition['csearch_rank_range'][this.curRang].label}>${this.subRangList[this.curSubRang].label}`
      else c = `${this.option_definition['csearch_rank_range'][this.curRang].label}`
      return c
    },
    scaleContent () {
      let c
      if (this.subScaleList.length) c = `${this.option_definition['csearch_scale_group'][this.curScale].label}>${this.subScaleList[this.curSubScale].label}`
      else c = `${this.option_definition['csearch_scale_group'][this.curScale].label}`
      return c
    },
    getWidth () {
      return `width: calc((${document.documentElement.clientWidth}px - 1.8rem)/${(this.itemList.length-1)})`
    },
  },
  watch: {
    csearch_fund_name () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getDataList()
      }, 500)
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    openPop (props) {
      if (props === 'csearch_strategy') this.strategyShow = true
      if (props === 'csearch_rank_range') this.rangShow = true
      if (props === 'csearch_scale_group') this.scaleShow = true
    },
    inputContent (props) {
      if (props === 'csearch_strategy') return this.strategyContent
      if (props === 'csearch_rank_range') return this.csearchContent
      if (props === 'csearch_scale_group') return this.scaleContent
    },
    getName (props) {
      let i = 0
      for (i; i < this.fields.length; i++) {
        if (this.fields[i].property === props) break
      }
      return this.fields[i].name
    },
    getDataList () {
      let csearch_strategy = this.option_definition['csearch_strategy'] ? this.option_definition['csearch_strategy'][this.curStra].value || '': '', csearch_sub_strategy,
        csearch_rank_range = this.option_definition['csearch_rank_range'] ? this.option_definition['csearch_rank_range'][this.curRang].value || '' : '', csearch_end_date,
        csearch_scale_group = this.option_definition['csearch_scale_group'] ? this.option_definition['csearch_scale_group'][this.curScale].value || '' : '',
        csearch_sub_scale_group

      if (this.subStraList.length) csearch_sub_strategy = this.subStraList[this.curSubStra].value || ''
      else csearch_sub_strategy = ''

      if (this.subRangList.length) csearch_end_date = this.subRangList[this.curSubRang].value || ''
      else csearch_end_date = ''

      if (this.subScaleList.length) csearch_sub_scale_group = this.subScaleList[this.curSubScale].value || ''
      else csearch_sub_scale_group = ''

      this.axios({
        url: '/competition/match/api/match/rank/common_list',
        type: 'get',
        data: {
          source_type: 'h5',
          match_code: this.match_code,
          csearch_strategy,
          csearch_sub_strategy,
          csearch_rank_range,
          csearch_end_date,
          csearch_scale_group,
          csearch_sub_scale_group,
          csearch_fund_name: this.csearch_fund_name,
          page: this.pageParam.page,
          rows: this.pageParam.rows
        },
        success: (res) => {
          this.itemList = res.data.title_arr
          this.dataList = res.data.list
          this.maxPage = Math.min(+res.data.pager.total_page, 3) * 10
        }
      })
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
  .common-header {
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

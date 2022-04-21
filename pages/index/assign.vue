<template>
  <div class="pc-assign">
    <common-flex direction="column" align="center" class="ppw-w1200 main">
      <div class="title">获奖名单</div>
      <div class="body">
        <common-flex class="strategy" v-for="(val, key) in option_definition" :key="key">
          <div class="strategy-type"><span>*</span>{{ getName(key) }}：</div>
          <div>
            <common-flex>
              <div style="margin-bottom: 30px" v-if="key === 'rank_range'" class="item"
                   @click="changeStra(i.value, key, index)" :class="{active: curRang === index}" v-for="(i, index) of val">
                {{ i.label }}</div>
              <div style="margin-bottom: 30px" v-if="key === 'scale_group'" class="item"
                   @click="changeStra(i.value, key, index)" :class="{active: curScale === index}" v-for="(i, index) of val">
                {{ i.label }}</div>
            </common-flex>
            <common-flex wrap="wrap" class="sub-strategy" v-if="key === 'rank_range'">
              <div class="item" @click="changeSub(index, i.value, key)" :class="{active: curSubRang === index}" v-for="(i, index) of subRangList">
                {{ i.label }}</div>
            </common-flex>
            <common-flex wrap="wrap" class="sub-strategy" v-if="key === 'scale_group'">
              <div class="item" @click="changeSub(index, i.value, key)" :class="{active: curSubScale === index}" v-for="(i, index) of subScaleList">
                {{ i.label }}</div>
            </common-flex>
          </div>
        </common-flex>
      </div>
      <div class="ppw-w1200 table">
        <common-flex class="th">
          <div :class="i.prop" v-for="i of itemList">{{ i.label }}</div>
        </common-flex>
        <template v-if="Object.keys(dataList).length">
          <template v-for="(s, index) of strategyType">
            <common-flex class="tr" :style="{background: index % 2 === 0 ? '#fff' : '#FFFBF0'}" v-if="dataList[s.value] ? dataList[s.value].length : false">
              <common-flex class="strategy" justify="center" align="center">
                <img :src="award_strategy_icon[s.value]" alt="">
              </common-flex>
              <common-flex justify="center" style="flex: 1" direction="column">
                <common-flex class="tr-item" style="flex-grow: 1; min-height: 60px" :key="k" v-for="(i, k) of dataList[s.value]">
                  <template v-for="prop of itemList.slice(1)">
                    <common-flex justify="center" align="center" :class="`${prop.prop}`">
                      <span class="ellipsis">{{ i[prop.prop] }}</span>
                      <template v-if="prop.prop === 'rank_score'">
                        <img v-show="+i[prop.prop] === 1" :src="require('@img/rank/rank-1.png')" alt="">
                        <img v-show="+i[prop.prop] === 2" :src="require('@img/rank/rank-2.png')" alt="">
                        <img v-show="+i[prop.prop] ===3" :src="require('@img/rank/rank-3.png')" alt="">
                      </template>
                    </common-flex>
                  </template>
                </common-flex>
              </common-flex>
            </common-flex>
          </template>
        </template>
        <template v-else>
          <common-flex class="empty" direction="column" justify="center" align="center">
            <img :src="require('@img/no-data.png')" alt="">
            <p>没有符合条件的产品或产品未上榜</p>
          </common-flex>
        </template>
        <p class="assign-ps" v-html="note" />
      </div>
    </common-flex>
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  name: 'assign',
  async asyncData ({ app, store, query }) {
    let res = await app.axios({
      url: `/competition/match/api/match/prize/query_options?match_code=${query.match_code}`,
    })
    let fields = res.data.data.fields, option_definition = res.data.data.optionDefinition
    return {
      fields,
      option_definition
    }
  },
  data () {
    return {
      loading: '',
      curStra: 0, // 策略索引
      curSubStra: 0, // 子策略索引
      curRang: 0,  // 排名种类索引
      curSubRang: 0, // 排名周期索引
      curScale: 0, // 分组
      curSubScale: 0, // 子分组
      timer: null,
      itemList: [], // 表头
      dataList: [],
      strategyType: [], // 策略类型
      pageParam: {
        page: 1,
        rows: 30
      }
    }
  },
  computed: {
    ...mapState({
      match_code: 'match_code',
      award_strategy_icon: 'award_strategy_icon'
    }),
    subStraList () {
      return this.option_definition['strategy']? this.option_definition['strategy'][this.curStra].children || [] : [] // 子策略
    },
    subRangList () {
      return this.option_definition['rank_range'] ? this.option_definition['rank_range'][this.curRang].children || [] : [] // 榜单下的排名日期
    },
    subScaleList () {
      return this.option_definition['scale_group'] ? this.option_definition['scale_group'][this.curScale].children || [] : '' // 榜单下的排名日期
    },
    note () {
      const note = this.option_definition['rank_range'][this.curRang].note
      return note
    }
  },
  mounted () {
    this.getDataList()
  },
  methods: {
    getName (props) {
      let i = 0
      for (i; i < this.fields.length; i++) {
        if (this.fields[i].property === props) break
      }
      return this.fields[i].name
    },
    changeStra (val, props, index) {
      if (props === 'strategy') {
        this.curStra = index
        this.curSubStra = 0
      }
      if (props === 'rank_range') {
        this.curRang = index
        this.curSubRang = 0
      }
      if (props === 'scale_group') {
        this.curScale = index
        this.curSubScale = 0
      }
      this.getDataList()
    },
    changeSub (index, val, props) {
      if (props === 'strategy') this.curSubStra = index
      if (props === 'rank_range') this.curSubRang = index
      if (props === 'scale_group') this.curSubScale = index
      this.getDataList()
    },
    openFullLoading (text = '加载中') {
      this.loading = this.$loading({
        text: `${text}...`,
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    getDataList () {
      this.openFullLoading()
      let strategy = this.option_definition['strategy'] ? this.option_definition['strategy'][this.curStra].value || '': '', sub_strategy,
        rank_range = this.option_definition['rank_range'] ? this.option_definition['rank_range'][this.curRang].value || '' : '', end_date,
        scale_group = this.option_definition['scale_group'] ? this.option_definition['scale_group'][this.curScale].value || '' : '', sub_scale_group


      if (this.subStraList.length) sub_strategy = this.subStraList[this.curSubStra].value || ''
      else sub_strategy = ''

      if (this.subScaleList.length) sub_scale_group = this.subScaleList[this.curSubScale].value || ''
      else sub_scale_group = ''

      if (this.subRangList.length) end_date = this.subRangList[this.curSubRang].value || ''
      else end_date = ''

      this.axios({
        url: `/competition/match/api/match/prize/common_list`,
        type: 'get',
        data: {
          match_code: this.match_code,
          strategy,
          sub_strategy,
          rank_range,
          end_date,
          scale_group,
          sub_scale_group,
          page: this.pageParam.page,
          rows: this.pageParam.rows
        },
        success: (res) => {
          this.loading.close()
          this.dataList = res.data.list
          this.strategyType = res.data.strategy_data
          this.itemList = res.data.title
        }
      })
    },
    changePage (data) {
      this.pageParam.page = data
      this.getDataList()
    }
  }
}
</script>

<style lang="scss">
$borderColor: #DDDDDD;
.pc-assign {
  padding: 60px 0;
  .el-pagination {
    margin-top: 40px;
    button {
      @include wh(92 38);
      .el-icon {
        font-size: 16px;
      }
    }
    .el-pager {
      li {
        @include wh(52 38);
        text-align: center;
        @include nFont(18 #333 400 38);
      }
    }
  }
  .main {
    padding-bottom: 52px;
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
      width: 100%;
      padding: 0 30px;
      .strategy, .range, .key {
        &-input {
          padding-left: 20px;
          width: 470px;
          height: 50px;
          background: #F8F8F8;
          border-radius: 4px;
          border: 1px solid #BBBBBB;
          @include nFont(20 #333 50);
          &::placeholder {
            @include nFont(20 #999 50)
          }
        }
        &-svg {
          position: absolute;
          right: 550px;
          top: 7px;
          @include wh(38);
          cursor: pointer;
        }
        &-type {
          flex-shrink: 0;
          margin-top: 10px;
          @include nFont(20 500 #333 28);
          span {
            color: #C00000;
          }
        }
      }
      .item {
        margin: 0 20px 20px 0;
        width: 150px;
        height: 50px;
        @include nFont(20 #333 50);
        text-align: center;
        border-radius: 4px;
        border: 1px solid #BBBBBB;
        cursor: pointer;
      }
      .active {
        border: 1px solid #F4BD77;
        color: #470000;
        background: linear-gradient(90deg, #FFD585 0%, #FFEECD 47%, #FFD585 100%);
      }
    }
    .table {
      margin-top: 40px;
      border-top: 1px solid $borderColor;
      .th {
        height: 60px;
        @include nFont(20 500 #333 60);
        background-color: #e8e8e8;
        div  {
          padding-right: 20px;
          flex-shrink: 0;
          text-align: right;
          border-right: 1px solid $borderColor;
        }
        .strategy {
          width: 277px;
          padding: 0;
          text-align: center;
        }
        .rank_score {
          padding-right: 0;
          width: 80px;
          text-align: center;
        }
        .product_register_number {
          padding: 0;
          width: 235px;
          text-align: center;
        }
        .company_name {
          text-indent: 36px;
          text-align: left;
          flex-grow: 1;
          border-right: none;
        }
      }
      .tr {
        @include nFont(20 #333 28);
        .strategy {
          width: 277px;
          border-right: 1px solid $borderColor;
          border-bottom: 1px solid $borderColor;
          img {
            @include wh(153 153)
          }
        }
        &-item {
          border-bottom: 1px solid $borderColor;
        }
        .rank_score {
          position: relative;
          padding-right: 0;
          width: 80px;
          justify-content: center;
          border-right: 1px solid $borderColor;
          span {
            position: relative;
            z-index: 1;
          }
          img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 35px;
            height: 35px;
            z-index: 0;
          }
        }
        .product_register_number {
          width: 235px;
          text-align: center;
          border-right: 1px solid $borderColor;
        }
        .company_name {
          text-indent: 36px;
          text-align: left;
          border-right: none;
        }
      }
    }
  }
  .empty {
    width: 100%;
    height: 599px;
    img {
      width: 152px;
      height: 100px;
    }
    p {
      margin-top: 20px;
      font-size: 18px;
      color: #666666;
    }
  }
  .assign-ps {
    margin: 45px 0 0 30px;
    @include nFont(20 36 #333 500)
  }
}
</style>

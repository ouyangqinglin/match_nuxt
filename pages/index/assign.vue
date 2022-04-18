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
          <div v-for="i of itemList">{{ i.label }}</div>
        </common-flex>
        <common-flex class="tr" v-for="(i, index) of 5" :style="{background: index % 2 === 0 ? '#fff' : '#FFFBF0'}">
          <common-flex class="strategy" justify="center" align="center">
            <img :src="require('@img/assign-strategy.png')" alt="">
          </common-flex>
          <common-flex justify="center" style="flex: 1" direction="column">
            <common-flex class="tr-item" style="flex-grow: 1; min-height: 60px" v-for="i of 5">
              <common-flex align="center" justify="center" class="rank">1</common-flex>
              <common-flex align="center" class="fund">参赛产品</common-flex>
              <common-flex align="center" class="company">所属机构</common-flex>
            </common-flex>
          </common-flex>
        </common-flex>
<!--        <template v-else>-->
<!--          <common-flex class="empty" direction="column" justify="center" align="center">-->
<!--            <img :src="require('@img/no-data.png')" alt="">-->
<!--            <p>没有符合条件的产品或产品未上榜</p>-->
<!--          </common-flex>-->
<!--        </template>-->
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
      fund_name: '',
      timer: null,
      itemList: [
        {
          prop: 'strategy_type',
          label: '策略类型'
        },
        {
          prop: 'rank_score',
          label: '排名'
        },
        {
          prop: 'fund_short_name',
          label: '参赛产品'
        },
        {
          prop: 'company_short_name',
          label: '所属机构'
        },
      ], // 表头
      dataList: [],
      pageParam: {
        page: 1,
        rows: 30
      }
    }
  },
  computed: {
    ...mapState({
      match_code: 'match_code'
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
  },
  watch: {
    fund_name () {
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
          fund_name: this.fund_name,
          page: this.pageParam.page,
          rows: this.pageParam.rows
        },
        success: (res) => {
          this.loading.close()
          this.dataList = res.data.list
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
        :first-child {
          width: 277px;
          padding: 0;
          text-align: center;
        }
        :nth-child(2) {
          padding-right: 0;
          width: 80px;
          text-align: center;
        }
        :nth-child(3) {
          width: 300px;
          text-indent: 20px;
          text-align: left;
        }
        :nth-child(4) {
          text-indent: 20px;
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
        .rank {
          padding-right: 0;
          width: 80px;
          border-right: 1px solid $borderColor;
        }
        .fund {
          width: 300px;
          text-indent: 20px;
          text-align: left;
          border-right: 1px solid $borderColor;
        }
        .company {
          text-indent: 20px;
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
}
</style>

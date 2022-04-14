<template>
  <div class="pc-assign">
    <common-flex direction="column" align="center" class="ppw-w1200 main">
      <div class="title">获奖名单</div>
      <div class="body">
        <common-flex class="strategy" v-for="(val, key) in option_definition" :key="key">
          <div class="strategy-type"><span>*</span>{{ getName(key) }}：</div>
          <div>
            <common-flex>
              <div style="margin-bottom: 30px" v-if="key === 'strategy'" class="item"
                   @click="changeStra(i.value, key, index)" :class="{active: curStra === index}" v-for="(i, index) of val">
                {{ i.label }}</div>
              <div style="margin-bottom: 30px" v-if="key === 'rank_range'" class="item"
                   @click="changeStra(i.value, key, index)" :class="{active: curRang === index}" v-for="(i, index) of val">
                {{ i.label }}</div>
              <div style="margin-bottom: 30px" v-if="key === 'scale_group'" class="item"
                   @click="changeStra(i.value, key, index)" :class="{active: curScale === index}" v-for="(i, index) of val">
                {{ i.label }}</div>
            </common-flex>
            <common-flex wrap="wrap" class="sub-strategy" v-if="key === 'strategy'">
              <div class="item" @click="changeSub(index, i.value, key)" :class="{active: curSubStra === index}" v-for="(i, index) of subStraList">
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
        <common-flex class="strategy" style="position: relative; margin-top: 10px">
          <div class="strategy-type" style="padding-left: 16px"><span>*</span>关键字：</div>
          <input class="strategy-input" type="text" v-model.trim="fund_name" placeholder="请输入基金名称/所属机构关键字">
          <img :src="require('@img/rank/search.svg')" class="strategy-svg" alt="">
        </common-flex>
      </div>
      <div class="ppw-w1200 table">
        <common-flex class="th">
          <div v-for="i of itemList">{{ i.label }}</div>
        </common-flex>
        <template v-if="dataList.length">
          <common-flex class="tr" v-for="(i, index) of dataList" :key="index" :style="{backgroundColor: index % 2 ? '#faf3ee' : '#fff'}">
            <template v-for="j of itemList">
              <template v-if="['ret', 'score'].includes(j.prop)">
                <div class="td ellipsis" v-if="j.prop === 'ret'" v-profit_handler.percent="i[j.prop]" />
                <div class="td ellipsis" v-else-if="j.prop === 'score'">{{ (i[j.prop] + '').slice(0, 5) }}</div>
              </template>
              <div class="td ellipsis" style="position: relative; z-index: 1" v-else-if="j.prop === 'rank_score'">
                <img class="rank-img" :src="require('@img/rank/rank-1.png')" alt="" v-if="+(i[j.prop]) === 1">
                <img class="rank-img" :src="require('@img/rank/rank-2.png')" alt="" v-if="+(i[j.prop]) === 2">
                <img class="rank-img" :src="require('@img/rank/rank-3.png')" alt="" v-if="+(i[j.prop]) === 3">
                {{ i[j.prop] }}
              </div>
              <div class="td ellipsis" v-else>{{ i[j.prop] || i[j.prop.name]}}</div>
            </template>
          </common-flex>
        </template>
        <template v-else>
          <common-flex class="empty" direction="column" justify="center" align="center">
            <img :src="require('@img/no-data.png')" alt="">
            <p>没有符合条件的产品或产品未上榜</p>
          </common-flex>
        </template>
      </div>
<!--      <el-pagination-->
<!--        v-if="dataList.length"-->
<!--        background-->
<!--        layout="prev, pager, next"-->
<!--        @current-change="changePage"-->
<!--        :total="maxPage">-->
<!--      </el-pagination>-->
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
          prop: 'rank_score',
          label: '排名'
        },
        {
          prop: 'fund_short_name',
          label: '基金名称'
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
      console.log(this.option_definition)
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
      border-bottom: 1px solid $borderColor;
      .th, .tr {
        height: 60px;
        @include nFont(20 500 #333 60);
        background-color: #e8e8e8;
        div  {
          padding-right: 20px;
          flex: .5;
          flex-shrink: 0;
          text-align: right;
          border-right: 1px solid $borderColor;
        }
        :first-child {
          padding-right: 0;
          flex: .3;
          text-align: center;
        }
        :nth-child(2), :nth-child(3) {
          flex: 1;
          text-indent: 20px;
          text-align: left;
        }
        :last-child {
          border-right: none;
        }
      }
      .tr {
        font-weight: 400;
        .rank-img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          @include wh(34);
          z-index: -1;
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

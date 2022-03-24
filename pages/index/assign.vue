<template>
  <div class="pc-assign">
    <common-flex direction="column" align="center" class="ppw-w1200 main">
      <div class="title">获奖名单</div>
      <div class="body">
        <common-flex class="strategy" v-for="(val, key) in option_definition" :key="key">
          <div class="strategy-type"><span>*</span>{{ getName(key) }}：</div>
          <div>
            <common-flex>
              <div v-if="key === 'csearch_rank_group_id'" class="item" @click="changeStra(i.value, key, index)" :class="{active: curStra === index}" v-for="(i, index) of val">
                {{ i.label }}</div>
              <div v-if="key === 'csearch_rank_range'" class="item" @click="changeStra(i.value, key, index)" :class="{active: curRang === index}" v-for="(i, index) of val">
                {{ i.label }}</div>
            </common-flex>
            <common-flex class="sub-strategy" v-if="key === 'csearch_rank_group_id'">
              <div class="item" @click="changeSub(index, i.value, key)" :class="{active: curSubStra === index}" v-for="(i, index) of subStraList">
                {{ i.label }}</div>
            </common-flex>
            <common-flex class="sub-strategy" v-if="key === 'csearch_rank_range'">
              <div class="item" @click="changeSub(index, i.value, key)" :class="{active: curSubRang === index}" v-for="(i, index) of subRangList">
                {{ i.label }}</div>
            </common-flex>
          </div>
        </common-flex>
      </div>
      <div class="ppw-w1200 table">
        <common-flex class="th">
          <div v-for="i of itemList">{{ i.label }}</div>
        </common-flex>
        <template v-if="dataList.length">
          <common-flex class="tr" v-for="(i, index) of dataList" :key="index" :style="{backgroundColor: index % 2 ? '#faf3ee' : '#fff'}">
            <template v-for="j of itemList">
              <div class="td ellipsis" v-if="j.key === 'ret'" v-profit_handler.percent="i[j.key]" />
              <div class="td ellipsis" v-else-if="j.key === 'score'">{{ (i[j.key] + '').slice(0, 5) }}</div>
              <div class="td ellipsis" style="position: relative; z-index: 1" v-else-if="j.key === 'rank_score'">
                <img class="rank-img" :src="require('@img/rank/rank-1.png')" alt="" v-if="+(i[j.key]) === 1">
                <img class="rank-img" :src="require('@img/rank/rank-2.png')" alt="" v-if="+(i[j.key]) === 2">
                <img class="rank-img" :src="require('@img/rank/rank-3.png')" alt="" v-if="+(i[j.key]) === 3">
                {{ i[j.key] }}
              </div>
              <div class="td ellipsis" v-else>{{ i[j.key]}}</div>
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
    </common-flex>
  </div>
</template>

<script>
export default {
  name: 'assign',
  async asyncData ({ app, store }) {
    console.log('store', store)
    let res = await app.axios({
      url: `/activity/backend/api/competition/xdzq/getXdzqPrizeCycleOption`,
      type: 'get',
      data: { match_code: 'xdzq' }
    })
    let fields = res.data.data.fields, option_definition = res.data.data.option_definition
    console.log('field', fields)
    console.log('option_definition', option_definition)
    return {
      fields,
      option_definition
    }
  },
  data () {
    return {
      subStraList: [],
      subRangList: [],
      curStra: 0,
      curSubStra: 0,
      curRang: 0,
      curSubRang: 0,
      itemList: [
        {
          label: '排名',
          key: 'rank_score'
        },{
          label: '获奖机构',
          key: 'company_short_name'
        },{
          label: '获奖产品',
          key: 'fund_short_name'
        }
      ],
      dataList: []
    }
  },
  mounted () {
    this.subStraList = this.option_definition['csearch_rank_group_id'][0].children || []
    this.subRangList = this.option_definition['csearch_rank_range'][0].children || []
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
      let parentList = this.option_definition[props]
      let i = 0
      for (i; i < parentList.length; i++) {
        if (parentList[i].value === val) break
      }
      if (props === 'csearch_rank_group_id') {
        this.curStra = index
        this.curSubStra = 0
        this.subStraList = parentList[i].children || []
      }
      else {
        this.curRang = index
        this.curSubRang = 0
        this.subRangList = parentList[i].children || []
      }
      this.getDataList()
    },
    changeSub (index, val, props) {
      console.log(index, val, props)
      if (props === 'csearch_rank_group_id') {
        this.curSubStra = index
      }
      else {
        this.curSubRang = index
      }
      this.getDataList()
    },
    getDataList () {
      let csearch_rank_group_id = this.option_definition['csearch_rank_group_id'][this.curStra].value || '', csearch_strategy,
        csearch_rank_range = this.option_definition['csearch_rank_range'][this.curRang].value || '', csearch_end_date

      if (this.subStraList.length) csearch_strategy = this.subStraList[this.curSubStra].value || ''
      else csearch_strategy = ''

      if (this.subRangList.length) csearch_end_date = this.subRangList[this.curSubRang].value || ''
      else csearch_end_date = ''

      this.axios({
        url: '/activity/backend/api/competition/xdzq/selectPrizeListData',
        type: 'get',
        data: {
          match_code: 'xdzq',
          csearch_rank_group_id,
          csearch_strategy,
          csearch_rank_range,
          csearch_end_date
        },
        success: ({ data }) => {
          console.log('结果', data)
          this.dataList = data.prize_list
        }
      })
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
        margin-top: 30px;
        &-type {
          margin-top: 10px;
          @include nFont(20 500 #333 28);
          span {
            color: #C00000;
          }
        }
      }
      .sub-strategy, .sub-range {
        margin-top: 20px;
      }
      .item {
        margin-right: 20px;
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
        background-color: #F4F4F4;
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

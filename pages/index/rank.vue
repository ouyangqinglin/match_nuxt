<template>
  <div class="pc-rank">
    <common-flex direction="column" align="center" class="ppw-w1200 main">
      <div class="title">大赛排名</div>
      <div class="body">
        <common-flex class="strategy" v-for="(val, key) in option_definition" :key="key">
          <div class="strategy-type"><span>*</span>{{ getName(key) }}：</div>
          <div>
            <common-flex>
              <div style="margin-bottom: 20px" v-if="key === fields[0].property" class="item"
                   @click="changeStra(i.value, key, index)" :class="{active: curStra === index}" v-for="(i, index) of val">
                {{ i.label }}</div>
              <div style="margin-bottom: 20px" v-if="key === 'csearch_rank_range'" class="item"
                   @click="changeStra(i.value, key, index)" :class="{active: curRang === index}" v-for="(i, index) of val">
                {{ i.label }}</div>
            </common-flex>
            <common-flex class="sub-strategy" v-if="key === fields[0].property">
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
              <template v-if="['ret', 'score'].includes(j.prop)">
                <!--              已登录-->
                <template v-if="logined">
                  <!--                已认证-->
                  <template v-if="certificated">
                    <div class="td ellipsis" v-if="j.prop === 'ret'" v-profit_handler.percent="i[j.prop]" />
                    <div class="td ellipsis" v-else-if="j.prop === 'score'">{{ (i[j.prop] + '').slice(0, 5) }}</div>
                  </template>
                  <!--                未认证-->
                  <template v-else>
                    <div @click="login()" class="td ellipsis" style="color: #C00000; cursor: pointer">认证可见</div>
                  </template>
                </template>
                <!--              未登录-->
                <template v-else>
                  <div @click="login()" class="td ellipsis" style="color: #C00000; cursor: pointer">登录可见</div>
                </template>
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
      <el-pagination
        v-if="dataList.length"
        background
        layout="prev, pager, next"
        @current-change="changePage"
        :total="maxPage">
      </el-pagination>
    </common-flex>
  </div>
</template>

<script>
import { mapState } from "vuex"
import util from '@js/util.js'

let loginScriptLoaded = false

export default {
  name: 'rank',
  head () {
    return {
      script: [
        { src: `https://www${this.$store.state.suffix}.simuwang.com/global/common/mt/simple/t/1558575004/force_login/0.html`, async: true, defer: true },
        { src: `https://passport${this.$store.state.suffix}.simuwang.com/Static/Passport/Js/smppw_auth_mc.1.6.1.js?v=1558573200&force_auth=0`, async: true, defer: true },
      ]
    }
  },
  async asyncData ({ app, store, query }) {
    let res = await app.axios({
      url: '/competition/activity/backend/api/competition/getRankSearchFields',
      type: 'get',
      data: { match_code: query.match_code }
    })
    console.log(res.data.data)
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
      logined: false,
      certificated: false,
      subStraList: [],
      subRangList: [],
      curStra: 0,
      curSubStra: 0,
      curRang: 0,
      curSubRang: 0,
      csearch_fund_name: '',
      timer: null,
      maxPage: 0,
      itemList: [],
      dataList: [],
      pageParam: {
        page: 1,
        rows: 10
      }
    }
  },
  computed: {
    ...mapState({
      match_code: 'match_code'
    })
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
    this.subStraList = this.option_definition['csearch_strategy'][0].children || [] // 子策略
    this.subRangList = this.option_definition['csearch_rank_range'][0].children || [] // 榜单下的排名日期
    this.getDataList()
    if (loginScriptLoaded) this.start()
  },
  methods: {
    start () {
      if (!window.muid || window.muid.toString() === "0") {
        this.logined = false
      } else {
        this.logined = true
        const isAuth = Number(util.cookie("certification"))
        const evaluation = Number(util.cookie('evaluation_result'))
        if (isAuth === 1 && evaluation > 0) {
          this.certificated = true
        } else {
          this.certificated = false
        }
      }
    },
    login () {
      window.gr_show_auth();
    },
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
      if (props === this.fields[0].property) {
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
      if (props === this.fields[0].property) {
        this.curSubStra = index
      }
      else {
        this.curSubRang = index
      }
      this.getDataList()
    },
    getDataList () {
      console.log('获取')
      let csearch_strategy = this.option_definition['csearch_strategy'][this.curStra].value || '', csearch_sub_strategy,
        csearch_rank_range = this.option_definition['csearch_rank_range'][this.curRang].value || '', csearch_end_date

      if (this.subStraList.length) csearch_sub_strategy = this.subStraList[this.curSubStra].value || ''
      else csearch_sub_strategy = ''

      if (this.subRangList.length) csearch_end_date = this.subRangList[this.curSubRang].value || ''
      else csearch_end_date = ''

      this.axios({
        url: '/competition/activity/backend/api/competition/commonRankList',
        type: 'get',
        data: {
          match_code: this.match_code,
          csearch_strategy,
          csearch_sub_strategy,
          csearch_rank_range,
          csearch_end_date,
          csearch_fund_name: this.csearch_fund_name,
          page: this.pageParam.page,
          rows: this.pageParam.rows
        },
        success: (res) => {
          console.log('res', res)
          this.itemList = res.data.title_arr
          this.dataList = res.data.data
          this.maxPage = Math.min(+res.data.pager.total_page, 3) * 10
          console.log('itemList', this.itemList)
          console.log('dataList', this.dataList)
        }
      })
    },
    changePage (data) {
      console.log('当前页码', data)
      this.pageParam.page = data
      this.getDataList()
    }
  }
}
</script>

<style lang="scss">
$borderColor: #DDDDDD;
.pc-rank {
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
        &-input {
          padding-left: 20px;
          width: 490px;
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
          right: 10px;
          top: 5px;
          @include wh(38);
          cursor: pointer;
        }
        &-type {
          margin-top: 10px;
          @include nFont(20 500 #333 28);
          span {
            color: #C00000;
          }
        }
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

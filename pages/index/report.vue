<template>
  <div class="pc-report">
    <common-flex direction="column" align="center" class="ppw-w1200 main">
      <div class="title">赛事报道</div>
      <div class="table">
        <template v-if="list.length">
          <common-flex class="tr" justify="space-between" align="center" v-for="(i, index) of list" :key="index">
            <a :href="i.url" target="_blank" :title="i.content" class="td ellipsis">{{ i.title }}</a>
            <div class="td">{{ DATE_FORMAT('yyyy-MM-dd', i.report_time * 1000) }}</div>
          </common-flex>
        </template>
        <template v-else>
          <common-flex class="empty" direction="column" justify="center" align="center">
            <img :src="require('@img/no-data.png')" alt="">
            <p>赛事正火速传播，媒体正在赶稿~</p>
          </common-flex>
        </template>
      </div>
      <el-pagination
        v-if="list.length"
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

export default {
  name: 'report',
  async asyncData ({ app, store, query }) {
    let list = await app.axios({
      url: `/competition/activity/backend/api/competition/getReportAllList`,
      data: {
        match_code: query.match_code,
        page: 1,
        rows: 10,
      }
    })
    return {
      list: list.data.data.data,
      maxPage: +(list.data.data.pager.total_page)
    }
  },
  computed: {
    ...mapState({
      match_code: 'match_code'
    })
  },
  methods: {
    getDataList (pageNum) {
      this.axios({
        url: `/competition/activity/backend/api/competition/getReportAllList`,
        type: 'get',
        data: {
          match_code: this.match_code,
          page: pageNum,
          rows: 10,
        },
        success: ({ data }) => {
          this.list = data.data
        }
      })
    },
    changePage (data) {
      this.getDataList(data)
    }
  }
}
</script>

<style lang="scss">
$borderColor: #DDDDDD;
.pc-report {
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
    .table {
      margin-top: 54px;
      padding: 0 30px;
      width: 100%;
      .tr {
        height: 60px;
        @include nFont(20 #333);
        border-bottom: 1px solid #DDDDDD;
        &:hover {
          color: #C00000;
          cursor: pointer;
        }
        a {
          max-width: 900px;
        }
        :last-child {
          color: #999;
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

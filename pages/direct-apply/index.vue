<template>
  <div class="direct-apply" :style="{background: themeColor, color: themeColor}">
    <img :src="headerBanner" alt="">
    <!--    公司信息-->
    <div class="top">
      <div class="title"><div>私募机构</div></div>
      <div class="top-box">
        <template v-for="i of companyFields">
          <common-flex class="form" align="center" v-if="i.type === 'text'">
            <div class="star" v-if="+i.required === 1" />
            <el-input v-if="i.property !== 'sms_code'" @blur="inputVerify(i, i.value)" :disabled="!!+(i.disabled)" v-model="i.value" :placeholder="i.placeholder" />
            <el-input id="message" style="flex: 1" v-else @blur="inputVerify(i, i.value)" :disabled="!!+(i.disabled)" v-model="i.value" :placeholder="i.placeholder" />
            <div class="msg-btn" @click="sendMsg" v-if="i.property === 'sms_code' && getCodeShow">获取验证码</div>
            <div class="msg-btn" @click="sendMsg" v-if="i.property === 'sms_code' && !getCodeShow">{{codeTxt}}s</div>
            <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
          </common-flex>
          <common-flex class="form" align="center" v-else-if="i.type === 'number'">
            <div class="star" v-if="+i.required === 1" />
            <el-input @blur="inputVerify(i, i.value)" type="number" v-model="i.value" :placeholder="i.placeholder"></el-input>
            <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
          </common-flex>
          <common-flex class="form" align="center" v-else-if="i.type === 'date'">
            <div class="star" v-if="+i.required === 1" />
            <el-date-picker value-format="yyyy-MM-dd" @blur="dateVerify(i, i.value)" @change="dateVerify(i, i.value)"
                            v-model="i.value" type="date" :placeholder="i.placeholder" />
            <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
          </common-flex>
          <common-flex class="form" align="center" v-else-if="i.type === 'select'">
            <div class="star" v-if="+i.required === 1" />
            <comp-select :value="i.value" :placeholder="i.placeholder" @change="getSelectVal($event, i)" :recommend="i.property" :selector="optionDefinition[i.property]" v-model="i.value" />
            <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
          </common-flex>
          <div class="form" v-else-if="i.type === 'radio'">
            <div class="star" style="top: -.6rem" v-if="+i.required === 1" />
            <div class="form-name" style="margin-top: .25rem">{{ i.name }}</div>
            <common-flex wrap="wrap">
              <template v-for="k of optionDefinition[i.property]">
                <el-radio @change="radioChange($event, i)" v-model="i.value" :label="k.value">{{ k.label }}</el-radio>
              </template>
            </common-flex>
            <common-flex align="center" class="form-errMsg"><span class="ellipsis">{{ i.errMsg }}</span></common-flex>
          </div>
          <common-flex direction="column" class="form" v-else-if="i.type === 'checkbox'">
            <div class="star" v-if="+i.required === 1" />
            <span class="form-name" style="margin-top: .25rem">{{ i.name }}</span>
            <div class="checkbox-container">
              <el-checkbox-group v-model="checkVal">
                <el-checkbox  @change="checkVerify(i)" v-for="o of optionDefinition[i.property]" :key="o.label" :label="o.label">{{ o.label}}
                  <el-input v-model.trim="otherVal" placeholder="请输入" @blur="checkVerify(i)" v-if="o.label === '其他' && checkVal.includes('其他')" />
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
          </common-flex>
        </template>
      </div>
    </div>
    <!--    // 产品信息-->
    <div class="bottom" style="margin-top: .45rem" v-for="(product, j) of productFields" :key="j">
      <div class="title"><div>参赛产品<span v-show="productFields.length > 1">({{ j + 1 }})</span></div></div>
      <div class="posi bottom-box">
        <span @click="deleteProduct(j)" :style="{color: themeColor}" v-show="productFields.length > 1" class="dele">删除</span>
        <template v-for="i of product">
          <common-flex class="form"  v-if="i.type === 'text'" align="center">
            <div class="star" v-if="+i.required === 1" />
            <el-input @blur="inputProVerify(i, j, i.value)" :disabled="!!+(i.disabled)" v-model="i.value" :placeholder="i.placeholder"></el-input>
            <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
          </common-flex>
          <common-flex class="form" v-else-if="i.type === 'select'">
            <div class="star" v-if="+i.required === 1" />
            <comp-select v-if="selectVisible" :value="i.value" :placeholder="i.placeholder" @change="getSelectVal($event, i, j)" :selector="optionDefinition[i.property]" v-model="i.value" />
            <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
          </common-flex>
          <div class="form" v-else-if="i.type === 'radio'">
            <div class="star" style="top: -.6rem" v-if="+i.required === 1" />
            <div class="form-name" style="margin-top: .25rem">{{ i.name }}</div>
            <common-flex wrap="wrap">
              <template v-for="k of optionDefinition[i.property]">
                <el-radio @change="radioChange($event, i, j)" v-model="i.value" :label="k.value">{{ k.label }}</el-radio>
              </template>
            </common-flex>
            <common-flex align="center" class="form-errMsg"><span class="ellipsis">{{ i.errMsg }}</span></common-flex>
          </div>
          <common-flex class="form" v-else-if="i.type === 'number'">
            <div class="star" v-if="+i.required === 1" />
            <el-input :disabled="!!+(i.disabled)" @blur="inputProVerify(i, j, i.value)" type="number" v-model="i.value" :placeholder="i.placeholder"></el-input>
            <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
          </common-flex>
        </template>
      </div>
    </div>
    <!--    按钮-->
    <common-flex class="btn-container" direction="column" align="center">
      <common-flex @click.native="addProduct" class="add" justify="center" align="center">
        <img :src="require('@img/add-icon.svg')" alt="">
        <div>添加参赛产品</div>
      </common-flex>
      <common-flex class="agree" justify="center" align="center">
        <common-flex align="center" justify="center" class="toggle-check" @click.native="agreeDetail(0)">
          <img v-if="agreeFlag" style="margin: .01rem 0 0 .02rem" :src="require('@img/agree-active.svg')" alt="">
        </common-flex>
        <div>我已阅读并同意</div>
        <div v-if="commitment_letter" class="book" @click="agreeDetail(1)">《参赛承诺书》</div>
        <div class="book" v-if="disclaimer" @click="agreeDetail(2)">《免责声明》</div>
      </common-flex>
      <div class="submit" @click="hasApply ? '': submit()">提交报名</div>
    </common-flex>
    <validation-toast :show.sync="validateShow" @validation="getValidation" />
    <promise-book :show.sync="promiseShow" v-if="promiseShow" />
    <Disclaimer :show.sync="disclaimerShow" v-if="disclaimerShow" />
  </div>
</template>

<script>
import mixin from '@js/apply'
import ValidationToast from '@comp/validationToast'
import PromiseBook from '@comp/promise'
import CompSelect from '@comp/select'
import Disclaimer from "@comp/apply-disclaimer";
import { mapState } from "vuex";
export default {
  name: 'apply',
  mixins: [mixin],
  components: {
    ValidationToast,
    PromiseBook,
    CompSelect,
    Disclaimer
  },
  head () {
    return {
      title: this.competitionName
    }
  },
  data () {
    return {

    }
  },
  async asyncData ({ app, query, store }) {
    let initData = await app.axios({
      url: `/competition/match/api/match/init?match_code=${query.match_code}&channel=h5`,
    })
    let init = initData.data.data
    let themeColor = init.config.theme_color
    let competitionName = init.info.competition_name
    const startTime = init.info.apply_start_time
    const endTime = init.info.apply_end_time
    let headerBanner = init.config.apply_banner
    if (init.section.commitment_letter) store.commit('saveLetter', init.section.commitment_letter)
    if (init.section.apply_disclaimer) store.commit('saveApplyDisclaimer', init.section.apply_disclaimer)
    store.commit('saveTheme', themeColor)
    let config = await app.axios({
      url: `/competition/activity/backend/api/competition/getMatchApplyFields`,
      data: { match_code: query.match_code }
    })
    let productFields = []

    let applyFields = config.data.data.fields
    let hiddenArr = ['validation', 'extend_attributes_recommend_person_name', 'product_code', 'extend_attributes_money_account', 'extend_attributes_money_account2']
    let i = 0
    for (i; i < applyFields.length; i++) {
      if (applyFields[i].parent_field) applyFields[i].type = 'hidden'
      if (applyFields[i].property === 'contacts_phone')  applyFields[i].type = 'number'
      if (hiddenArr.includes(applyFields[i].property)) applyFields[i].type = 'hidden'
      if (applyFields[i].property === 'email') applyFields[i].type = 'text'
      if (applyFields[i].property === 'product_name') applyFields[i].type = 'select'
    }
    let companyFields = applyFields.filter((i) => i.form_title === '私募机构信息')
    let productFieldsSingle = applyFields.filter((i) => i.form_title === '参赛产品信息')
    let optionDefinition = config.data.data.option_definition
    for(let v in optionDefinition) {
      optionDefinition[v].forEach(i => {
        if (i.children && !i.children.length) delete i.children
      })
    }


    let singleProduct = JSON.parse(JSON.stringify(productFieldsSingle))
    productFields.push(productFieldsSingle)
    return {
      match_code: query.match_code,
      themeColor,
      competitionName,
      headerBanner,
      singleProduct,
      companyFields,
      productFields,
      optionDefinition,
      startTime,
      endTime
    }
  },
  computed: {
    ...mapState({
      disclaimer: 'apply_disclaimer',
      commitment_letter: 'commitment_letter'
    })
  },
  mounted () {
    let current = (new Date().getTime())
    const curDate = this.DATE_FORMAT('yyyy-MM-dd', current)
    if (curDate < this.startTime.split(' ')[0]) {
      this.$alert(`报名未开始`, '提示')
      this.hasApply = true
    }
    if (curDate > this.endTime.split(' ')[0]) {
      this.$alert(`报名已结束`, '提示')
      this.hasApply = true
    }
    this.getChannelData()
  },
  methods: {
    getSelectVal (data, item, index) {
      this.$set(item, 'errMsg', '')
      if (item.property === 'recommend_name') {
        for (let i = 0; i < this.companyFields.length; i++) {
          if (this.companyFields[i].property === 'extend_attributes_recommend_person_name') {
            if (data.indexOf('/') !== -1) {
              this.$set(item, 'value', data.split('/'))
              this.$set(this.companyFields[i], 'type', 'text')
            } else {
              this.$set(item, 'value', data)
              this.$set(this.companyFields[i], 'type', 'hidden')
            }
          }
        }
      }
      if (item.form_title === '参赛产品信息') {
        if (item.property === 'product_name') {
          this.clearProductInfo(index+1)
          this.$set(item, 'value', data)
          this.$set(item, 'placeholder', data[0])
          for (let j = 0; j < this.productFields[index].length; j++) {
            if (this.productFields[index][j].property === 'product_register_number') {
              this.$set(this.productFields[index][j], 'value', data[1])
              this.$set(this.productFields[index][j], 'errMsg', '')
            }
            if (this.productFields[index][j].property === 'product_code') {
              this.$set(this.productFields[index][j], 'value', data[2])
              this.$set(this.productFields[index][j], 'errMsg', '')
            }
            if (this.productFields[index][j].property === 'product_manager') {
              this.$set(this.productFields[index][j], 'value', data[3])
              this.$set(this.productFields[index][j], 'errMsg', '')
            }
          }
        } else {
          if (data.includes('/')) this.$set(item, 'value', data.split('/'))
          else this.$set(item, 'value', data)
        }
      }
      if (['open_account', 'open_account2'].includes(item.property)) {
        let k = 0, p = 0
        for (k; k < this.companyFields.length; k++) {
          if (item.property === 'open_account' && this.companyFields[k].property === 'extend_attributes_money_account') {
            if (+item.value === 1) {
              this.companyFields[k].type = 'text'
              this.companyFields[k].required = '1'
            } else {
              this.companyFields[k].type = 'hidden'
              this.companyFields[k].required = '0'
              this.$set(this.companyFields[k], 'errMsg', '')
            }
          }
          if (item.property === 'open_account2' && this.companyFields[k].property === 'extend_attributes_money_account2') {
            if (+item.value === 1) {
              this.companyFields[k].type = 'text'
              this.companyFields[k].required = '1'
            } else {
              this.companyFields[k].type = 'hidden'
              this.companyFields[k].required = '0'
              this.$set(this.companyFields[k], 'errMsg', '')
            }
          }
        }
        for (p; p < this.productFields[index].length; p++) {
          if (item.property === 'open_account' && this.productFields[index][p].property === 'extend_attributes_money_account') {
            if (+item.value === 1) {
              this.productFields[index][p].type = 'text'
              this.productFields[index][p].required = '1'
            } else {
              this.productFields[index][p].type = 'hidden'
              this.productFields[index][p].required = '0'
              this.$set(this.productFields[index][p], 'errMsg', '')
            }
          }
          if (item.property === 'open_account2' && this.productFields[index][p].property === 'extend_attributes_money_account2') {
            if (+item.value === 1) {
              this.productFields[index][p].type = 'text'
              this.productFields[index][p].required = '1'
            } else {
              this.productFields[index][p].type = 'hidden'
              this.productFields[index][p].required = '0'
              this.$set(this.productFields[index][p], 'errMsg', '')
            }
          }
        }
      }
    },
    deleteProduct (j) {
      this.productFields.splice(j, 1)
      this.selectVisible = false
      this.$nextTick(() => {
        this.selectVisible = true
      })
    },
    delaySubmit () {
      if (!this.agreeFlag) {
        let message = ''
        if (this.disclaimer) message = '请勾选我同意《免责声明》'
        if (this.commitment_letter) message = '请勾选我同意《参赛承诺书》'
        this.$alert(message, '提示')
        return
      }
      const company_data = {}, product_list = []
      let sms_code = ''

      let i = 0, k = 0, errMsg = ''
      for (i; i < this.companyFields.length; i++) {
        if (this.companyFields[i].property === 'sms_code') sms_code = this.companyFields[i].value
        if (this.companyFields[i].required === '1' && !this.companyFields[i].value) {
          this.$set(this.companyFields[i], 'errMsg', `${this.companyFields[i].name}不能为空`)
        } else if (this.companyFields[i].required === '1' && this.companyFields[i].value) {
          if (this.companyFields[i].property === 'recommend_name') {
            if (this.companyFields[i].value.constructor === Array) {
              for (let m = 0; m < this.companyFields.length; m++) {
                if (this.companyFields[m].property === 'recommend_other_name') this.$set(this.companyFields[m], 'value', this.companyFields[i].value[1])
              }
              company_data[this.companyFields[i].property] = this.companyFields[i].value[0]
            } else company_data[this.companyFields[i].property] = this.companyFields[i].value
          } else if (this.companyFields[i].property === 'extend_attributes_interest_bussiness') {
            if (this.companyFields[i].value.includes('其他')) {
              let p = 0;
              for (p; p < this.companyFields[i].value.length; p++) {
                if (this.companyFields[i].value[p] === '其他') break
              }
              let copyCheckVal = JSON.parse(JSON.stringify(this.companyFields[i].value))
              if (this.otherVal) copyCheckVal.splice(p, 1, this.otherVal)
              else copyCheckVal.splice(p, 1)
              company_data[this.companyFields[i].property] = copyCheckVal
            } else company_data[this.companyFields[i].property] = this.companyFields[i].value
          } else company_data[this.companyFields[i].property] = this.companyFields[i].value
        } else company_data[this.companyFields[i].property] = this.companyFields[i].value
        errMsg = errMsg || this.companyFields[i].errMsg
      }
      console.log('company_data', company_data)
      for(k; k < this.productFields.length; k++) {
        let product_info = {}
        for (let j = 0; j < this.productFields[k].length; j++) {
          if (this.productFields[k][j].required === '1' && !this.productFields[k][j].value) {
            this.$set(this.productFields[k][j], 'errMsg', `${this.productFields[k][j].name}不能为空`)
          } else if (this.productFields[k][j].required === '1' && this.productFields[k][j].value) {
            if (this.productFields[k][j].property === 'product_name') product_info[this.productFields[k][j].property] = this.productFields[k][j].value[0]
            else if (this.productFields[k][j].property === 'product_tactics') {
              if (this.productFields[k][j].value.constructor === Array) {
                product_info.product_sub_tactics = this.productFields[k][j].value[1]
                product_info.product_tactics = this.productFields[k][j].value[0]
              } else product_info[this.productFields[k][j].property] = this.productFields[k][j].value
            } else product_info[this.productFields[k][j].property] = this.productFields[k][j].value
          } else product_info[this.productFields[k][j].property] = this.productFields[k][j].value
          errMsg = errMsg || this.productFields[k][j].errMsg
        }
        product_list.push(product_info)
      }
      let data = {
        sms_code,
        company_data,
        product_list,
        match_code: this.$route.query.match_code
      }
      if (errMsg) this.$alert(errMsg, '错误')
      else this.applyMulProduct(data)
    },

    getValidation (data) {
      let message = document.getElementById('message').getBoundingClientRect().top
      window.scrollTo(0, message)
      setTimeout(() =>{
        this.validateShow = false
        this.getPhoneCode(data)
      }, 1000)
    },
  }
}
</script>

<style lang="scss">
.direct-apply {
  padding-bottom: .6rem;
  width: 100%;
  height: 100%;
  @include cImg();
  .top, .bottom {
    .title {
      margin: 0 auto;
      width: 6.7rem;
      font-size: 0.32rem;
      div {
        width: 2.4rem;
        height: 0.7rem;
        line-height: 0.7rem;
        text-align: center;
        font-weight: bold;
        border-top-right-radius: 0.35rem;
        background: linear-gradient(0deg, #ffbc61 0%, #ffed9a 100%);
      }
    }
    &-box {
      margin: 0 auto;
      padding: 0 .3rem .6rem;
      width: 6.7rem;
      background-color: #FFFFFF;
      border: .02rem solid #FFC959;
      border-radius: 0 .2rem .2rem .2rem;
    }
  }
  .form {
    margin-top: .5rem;
    position: relative;
    width: 100%;
    .star {
      position: absolute;
      left: -.25rem;
      top: -.25rem;
    }
    .star:before {
      content: '*';
      font-size: .3rem;
      color: #C00000;
    }
  }
  .posi {
    position: relative;
    .dele {
      position: absolute;
      right: .2rem;
      top: .05rem;
      font-size: .3rem;
      cursor: pointer;
    }
  }
  .form-name {
    font-size: .3rem;
    font-weight: bold;
    color: #333;
  }
  .msg-btn {
    min-width: 1.9rem;
    height: 1rem;
    text-align: center;
    font-size: .3rem;
    color: #C00000;
    line-height: 1rem;
    cursor: pointer;
    border-radius: 2px;
    background: linear-gradient(90deg, #FFD585 0%, #FFEECD 47%, #FFD585 100%);
    box-shadow: 0 .03rem .04rem 0 rgba(255, 255, 255, .5);
  }
  .form-errMsg {
    position: absolute;
    left: 0;
    bottom: -.45rem;
    max-width: 6rem;
    font-size: .3rem;
    color: #C00000;
  }
  .btn-container {
    font-size: .3rem;
    font-weight: 500;
    .add {
      margin-top: .6rem;
      width: 6.7rem;
      height: 1rem;
      cursor: pointer;
      background: url("~@img/add-bg.svg") center/100% 100%;
      img {
        width: .32rem;
        height: .32rem;
        margin-right: .15rem;
      }
    }
    .agree {
      margin-top: .4rem;
      .toggle-check {
        margin-right: .2rem;
        width: .32rem;
        height: .32rem;
        cursor: pointer;
        background: url("~@img/agree-box.svg") center/100% 100%;
      }
      div {
        color: #fff;
      }
      .book {
        color: #FFEB8A;
        cursor: pointer;
      }
    }
    .submit {
      margin-top: .3rem;
      width: 6.7rem;
      height: 1rem;
      cursor: pointer;
      text-align: center;
      line-height: 1rem;
      background: url('~@img/submit-bg.svg') center/100% 100%;
    }
  }
  .el-input {
    flex-shrink: 0;
    width: 100%;
    font-size: .3rem;
    input {
      height: 1rem;
      background: #fff;
      border: .02rem solid #D7DAE2;
      color: #000;
      &:disabled {
        background: #F5F5F5;
        color: #333;
      }
      &::placeholder {
        font-size: .3rem;
        color: #666;
      }
    }
  }
  .el-radio {
    margin-top: .34rem;
    flex-grow: 1;
    flex-shrink: 0;
    display: flex;
    align-items: flex-start;
    .el-radio__original, .el-radio__inner {
      width: .26rem;
      height: .26rem;
    }
    .el-radio__inner {
      &::after {
        width: .12rem;
        height: .12rem;
        background-color: #990000;
      }
    }
    .is-checked {
      border-color: #990000;
      background-color: #fff;
    }
    .el-radio__label {
      max-width: 5.5rem;
      white-space: pre-wrap;
      font-size: .3rem;
    }
  }
  .el-radio__input.is-checked .el-radio__inner {
    background: #fff;
    border-color: #990000;
    border-width: 1px;
  }
  .el-radio__inner {
    &:hover {
      border-color: #990000;
    }
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #990000;
  }
  input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }
  input[type='number'] {
    -moz-appearance: textfield !important;
  }
  .checkbox-container {
    margin-top: .5rem;
    .el-checkbox-group {
      padding-right: .15rem;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .el-checkbox {
      margin-bottom: .4rem;
      position: relative;
      width: 2.2rem;
      margin-right: .2rem;
      .el-input, .el-input__inner {
        position: absolute;
        width: 1.5rem;
        height: .8rem;
        top: -.1rem;
        left: .15rem;
        z-index: -1;
      }
      .el-input {
        top: -.1rem;
        left: .8rem;
        background: #fff;
      }
      .el-checkbox__inner {
        position: relative;
        z-index: 1;
        width: .36rem;
        height: .36rem;
        &:after {
          width: .12rem;
          height: .2rem;
        }
      }
      .el-checkbox__label {
        position: relative;
        z-index: 1;
        font-size: .3rem;
      }
    }
  }
}
.el-message-box__wrapper {
  top: 0;
  transform: translateY(-80%);
  .el-message-box {
    width: 80%;
  }
}
.msgbox-fade-enter-active, .msgbox-fade-leave-active {
  transition: all;
}
.msgbox-fade-enter-to, .msgbox-fade-leave-to {
  transform: translateY(0);
}
.el-message-box__wrapper {
  transform: translateY(0);
}
.my-cascader {
  position: relative;
  z-index: 5;
  font-size: .28rem;
  .el-cascader-panel {
    width: 3.6rem;
    .el-cascader-menu {
      position: relative;
      z-index: 6;
      opacity: 1;
      background-color: #fff;
    }
  }
}
.el-cascader {
  width: 100%;
}
.el-picker-panel {
  th {
    font-size: .3rem;
  }
  span {
    font-size: .3rem;
  }
}
</style>

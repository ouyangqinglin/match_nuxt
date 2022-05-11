<template>
  <div class="pages-apply">
    <!--    机构信息-->
    <div class="ppw-w1200">
      <div class="title" :style="{color: theme}">私募机构信息</div>
      <common-flex class="form" v-for="i of companyFields" :key="i.property">
        <template v-if="i.type === 'text'">
          <span class="form-name" :class="{star: i.required === '1'}">{{ i.name }}:</span>
          <el-input v-if="i.property !== 'sms_code'" @blur="inputVerify(i, i.value)" :disabled="!!+(i.disabled)" v-model="i.value" :placeholder="i.placeholder" />
          <el-input style="width: 260px" v-else @blur="inputVerify(i, i.value)" :disabled="!!+(i.disabled)" v-model="i.value" :placeholder="i.placeholder" />
          <div class="msg-btn" @click="sendMsg" v-if="i.property === 'sms_code' && getCodeShow">获取验证码</div>
          <div class="msg-btn" @click="sendMsg" v-if="i.property === 'sms_code' && !getCodeShow">{{codeTxt}}s</div>
          <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
        </template>
        <template v-else-if="i.type === 'number'">
          <span class="form-name" :class="{star: i.required === '1'}">{{ i.name }}:</span>
          <el-input @blur="inputVerify(i, i.value)" type="number" v-model="i.value" :placeholder="i.placeholder"></el-input>
          <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
        </template>
        <template v-else-if="i.type === 'date'">
          <span class="form-name" :class="{star: i.required === '1'}">{{ i.name }}:</span>
          <el-date-picker value-format="yyyy-MM-dd" @blur="dateVerify(i, i.value)" @change="dateVerify(i, i.value)" v-model="i.value" type="date" :placeholder="i.placeholder" />
          <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
        </template>
        <template v-else-if="i.type === 'select'">
          <span class="form-name" :class="{star: i.required === '1'}">{{ i.name }}:</span>
          <el-cascader @change="selectVerify(i, i.value)" @blur="selectBlur(i)" popper-class="my-cascader" :options="optionDefinition[i.property]" v-model="i.value" :placeholder="i.placeholder" filterable />
          <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
        </template>
        <template v-else-if="i.type === 'radio'">
          <span class="form-name" :class="{star: i.required === '1'}">{{ i.name }}:</span>
          <common-flex align="center" style="flex-shrink: 0; max-width: 490px">
            <common-flex wrap="wrap" align="center" style="margin-top: 20px">
              <template v-for="k of optionDefinition[i.property]">
                <el-radio @change="radioChange($event, i)" v-model="i.value" :label="k.value">{{ k.label }}</el-radio>
              </template>
            </common-flex>
          </common-flex>
          <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
        </template>
        <template v-else-if="i.type === 'checkbox'">
          <span class="form-name" :class="{star: i.required === '1'}">{{ i.name }}:</span>
          <div class="checkbox-container">
            <el-checkbox-group v-model="checkVal">
              <el-checkbox  @change="checkVerify(i)" v-for="o of optionDefinition[i.property]" :key="o.label" :label="o.label">{{ o.label}}
                <el-input v-model.trim="otherVal" placeholder="请输入" @blur="checkVerify(i)" v-if="o.label === '其他' && checkVal.includes('其他')" />
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
        </template>
      </common-flex>
    </div>
    <!--    // 产品信息-->
    <div class="ppw-w1200 posi" style="margin-top: 45px" v-for="(product, j) of productFields">
      <div class="title">参赛产品信息<span v-if="productFields.length > 1">({{ j + 1 }})</span></div>
      <span @click="deleteProduct(j)" v-show="productFields.length > 1" class="dele">删除</span>
      <common-flex class="form" v-for="i of product" :key="i.property" align="center">
        <template v-if="i.type === 'text'">
          <span class="form-name" :class="{star: i.required === '1'}">{{ i.name }}:</span>
          <el-input @blur="inputProVerify(i, j, i.value)" :disabled="!!+(i.disabled)" v-model="i.value" :placeholder="i.placeholder"></el-input>
          <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
        </template>
        <template v-else-if="i.type === 'select'">
          <span class="form-name" :class="{star: i.required === '1'}">{{ i.name }}:</span>
          <el-cascader @blur="selectBlur(i)" @change="selectVerify(i, i.value, j)" popper-class="my-cascader" :options="optionDefinition[i.property]" v-model="i.value" :placeholder="i.placeholder" filterable />
          <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
        </template>
        <template v-else-if="i.type === 'radio'">
          <span class="form-name" style="margin-top: 0" :class="{star: i.required === '1'}">{{ i.name }}:</span>
          <div style="flex-shrink: 0; max-width: 490px">
            <common-flex wrap="wrap" style="height: 70px" align="center">
              <template v-for="k of optionDefinition[i.property]">
                <el-radio @change="radioChange($event, i, j)" v-model="i.value" :label="k.value">{{ k.label }}</el-radio>
              </template>
            </common-flex>
          </div>
          <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
        </template>
        <template v-else-if="i.type === 'number'">
          <span class="form-name" :class="{star: i.required === '1'}">{{ i.name }}:</span>
          <el-input :disabled="!!+(i.disabled)" @blur="inputProVerify(i, j, i.value)" type="number" v-model="i.value" :placeholder="i.placeholder"></el-input>
          <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
        </template>
      </common-flex>
    </div>
    <!--    按钮-->
    <common-flex class="btn-container" direction="column" align="center">
      <common-flex @click.native="addProduct" class="add" justify="center" align="center">
        <img :src="require('@img/add-icon.svg')" alt="">
        <div>添加参赛产品</div>
      </common-flex>
      <common-flex class="agree" justify="center" align="center">
        <common-flex align="center" justify="center" class="toggle-check" @click.native="agreeDetail(0)">
          <img v-if="agreeFlag" style="margin: 1px 0 0 2px; width: 18px; height: 18px" :src="require('@img/agree-active.svg')" alt="">
        </common-flex>
        <div>我已阅读</div>
        <div v-if="commitment_letter" class="book" @click="agreeDetail(1)">《参赛承诺书》</div>
        <div v-if="disclaimer" @click="agreeDetail(2)" class="book">《免责声明》</div>
      </common-flex>
      <div class="submit" @click="hasApply ? '': submit()">提交报名</div>
    </common-flex>
    <validation-toast :show.sync="validateShow" v-if="validateShow" @validation="getValidation" />
    <promise-book :show.sync="promiseShow" v-if="promiseShow" />
    <Disclaimer :show.sync="disclaimerShow" v-if="disclaimerShow" />
  </div>
</template>

<script>
import mixin from '@js/apply'
import ValidationToast from '@comp/validationToast'
import PromiseBook from '@comp/promise'
import Disclaimer from '@comp/apply-disclaimer'
import { mapState } from 'vuex'
export default {
  name: 'apply',
  mixins: [mixin],
  components: {
    ValidationToast,
    PromiseBook,
    Disclaimer
  },
  data () {
    return {

    }
  },
  async asyncData ({ app, query }) {
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
      singleProduct,
      companyFields,
      productFields,
      optionDefinition,
    }
  },
  computed: {
    ...mapState({
      match_code: 'match_code',
      theme: 'theme',
      disclaimer: 'apply_disclaimer',
      commitment_letter: 'commitment_letter',
      time: 'time'
    }),
    startTime () {
      return this.time.start
    },
    endTime () {
      return this.time.end
    }
  },
  mounted () {
    this.getChannelData()
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
  },
  methods: {
    deleteProduct (j) {
      this.productFields.splice(j, 1)
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
          } else {
            if (this.companyFields[i].type === 'select') {
              if (this.companyFields[i].value.constructor === Array) {
                company_data[this.companyFields[i].property] = this.companyFields[i].value[0] + '/' + this.companyFields[i].value[1]
              }
              else company_data[this.companyFields[i].property] = this.companyFields[i].value
            }
            else company_data[this.companyFields[i].property] = this.companyFields[i].value
          }
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
            if (this.productFields[k][j].property === 'product_name') {
              product_info[this.productFields[k][j].property] = this.productFields[k][j].value.split(',')[0]
            } else if (this.productFields[k][j].property === 'product_tactics') {
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
        match_code: this.match_code
      }
      if (errMsg) this.$alert(errMsg, '错误')
      else this.applyMulProduct(data)
    },
    getValidation (data) {
      setTimeout(() =>{
        this.validateShow = false
        this.getPhoneCode(data)
      }, 500)
    },
    selectBlur (item) {
      setTimeout(() => {
        let v = item.value
        if (!v || (v.constructor === Array && !v.length)) this.$set(item, 'errMsg', `${item.name}不能为空`)
        else {
          this.$set(item, 'errMsg', '')
          if (v.length > 1) this.$set(item, 'value', v)
          else if (v.constructor === Array) this.$set(item, 'value', v.join(''))
        }
        if (item.value && item.property === 'product_name') this.$set(item, 'placeholder', item.value.split(',')[0])
      }, 500)
    },
    selectVerify (item, v, index) {
      let i = 0, j = 0
      if (item.property === 'recommend_name') {
        for (i; i < this.companyFields.length; i++) {
          if (this.companyFields[i].property === 'extend_attributes_recommend_person_name') {
            if (v && v.length > 1) {
              this.$set(this.companyFields[i], 'type', 'text')
            } else {
              this.$set(this.companyFields[i], 'type', 'hidden')
            }
          }
        }
      }
      if (item.property === 'product_name') {
        this.clearProductInfo(index+1)

        this.$set(item, 'value', v)
        for (j; j < this.productFields[index].length; j++) {
          if (this.productFields[index][j].property === 'product_register_number') if (v) {
            this.$set(this.productFields[index][j], 'value', item.value[0][1])
            this.$set(this.productFields[index][j], 'errMsg', '')
          }
          if (this.productFields[index][j].property === 'product_code') if (v) {
            this.$set(this.productFields[index][j], 'value', item.value[0][2])
            this.$set(this.productFields[index][j], 'errMsg', '')
          }
          if (this.productFields[index][j].property === 'product_manager') if (v) {
            this.$set(this.productFields[index][j], 'value', item.value[0][3])
            this.$set(this.productFields[index][j], 'errMsg', '')
          }
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
      this.selectBlur(item)
    },
  }
}
</script>

<style lang="scss">
.pages-apply {
  padding: 60px 0;
  width: 100%;
  height: 100%;
  .ppw-w1200 {
    padding-bottom: 25px;
  }
  .form {
    width: 1190px;
  }
  .title {
    margin: 0 auto 30px;
    width: 359px;
    height: 60px;
    text-align: center;
    font-size: 30px;
    font-weight: 500;
    line-height: 60px;
    background: linear-gradient(90deg, #FFD585 0%, #FFEECD 47%, #FFD585 100%);
    border: 1px solid #F4BD77;
    border-radius: 0 0 6px 6px;
  }
  .posi {
    position: relative;
    .dele {
      position: absolute;
      right: 10px;
      top: 5px;
      @include font(.20 #a40202);
      cursor: pointer;
    }
  }
  .form-name {
    margin-top: 20px;
    flex-shrink: 0;
    padding-right: 20px;
    width: 437px;
    font-size: 20px;
    font-weight: 600;
    color: #333;
    text-align: right;
    line-height: 50px;
    &.star:before {
      content: '*';
      @include font(.2 #C00000);
    }
  }
  .msg-btn {
    margin: 20px 0 0 10px;
    width: 130px;
    height: 50px;
    text-align: center;
    @include font(.2 #C00000 .5);
    cursor: pointer;
    border-radius: 2px;
    background: linear-gradient(90deg, #FFD585 0%, #FFEECD 47%, #FFD585 100%);
    box-shadow: 0 3px 4px 0 rgba(255, 255, 255, .5);
  }
  .form-errMsg {
    margin: 12px 0 0 12px;
    @include font(.18 #C00000);
  }
  .btn-container {
    @include font(.2 500);
    .add {
      margin-top: 62px;
      width: 400px;
      height: 50px;
      cursor: pointer;
      background: url("~@img/add-bg.svg") center/100% 100%;
      img {
        width: 18px;
        height: 18px;
        margin-right: 10px;
      }
    }
    .agree {
      margin-top: 25px;
      .toggle-check {
        margin-right: 10px;
        width: 20px;
        height: 20px;
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
      margin-top: 32px;
      width: 400px;
      height: 50px;
      cursor: pointer;
      text-align: center;
      line-height: 50px;
      background: url('~@img/submit-bg.svg') center/100% 100%;
    }
  }
  .el-input {
    flex-shrink: 0;
    width: 400px;
    height: 50px;
    margin-top: 20px;
    font-size: 18px;
    background: #F8F8F8;
    input {
      height: 50px;
      background: #F8F8F8;
      &:disabled {
        background: #E1E1E1;
        color: #999999;
      }
      &::placeholder {
        font-size: 18px;
        color: #999;
      }
    }
  }
  .el-radio {
    margin-right: 160px;
    display: flex;
    align-items: center;
    .el-radio__original, .el-radio__inner {
      width: 20px;
      height: 20px;
    }
    .el-radio__inner {
      &::after {
        width: 9px;
        height: 9px;
        background-color: #990000;
      }
    }
    .is-checked {
      border-color: #990000;
      background-color: #fff;
    }
    .el-radio__label {
      font-size: 20px;
    }
  }
  .el-radio__input.is-checked .el-radio__inner {
    background: #fff;
    border-color: #990000;
    border-width: 2px;
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
  margin-top: 36px;
  width: 520px;
.el-checkbox {
  margin-right: 12px;
  position: relative;
  margin-bottom: 12px;
  width: 160px;
  .el-input, .el-input__inner {
    position: absolute;
    width: 220px;
    height: 40px;
    top: -7px;
    left: 15px;
    z-index: -1;
  }
  .el-input {
    top: -7px;
    left: 40px;
    background: #fff;
  }
  .el-checkbox__inner {
    position: relative;
    z-index: 1;
    width: 18px;
    height: 18px;
    &:after {
      width: 6px;
      height: 10px;
    }
  }
  .el-checkbox__label {
    position: relative;
    z-index: 1;
    font-size: 18px;
  }
}
}
}
.my-cascader .el-cascader-node {
  width: 405px;
  height: 40px;
  font-size: 16px;
}
.el-cascader-menu__wrap {
  height: auto;
  max-height: 250px;
}
.el-cascader-menu__list {
  //height: 250px;
}


.el-picker-panel {
  th {
    font-size: 16px;
  }
  span {
    position: relative;
    font-size: 16px;
  }
}
.el-loading-spinner {
  .circular {
    width: 12px;
    height: 12px;
  }
}
</style>

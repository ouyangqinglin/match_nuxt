<template>
  <div class="direct-apply">
    <img :src="require('@img/mobile/banner.jpg')" alt="">
    <!--    公司信息-->
    <div class="top">
      <div class="title"><div>私募机构</div></div>
      <div class="top-box">
        <template v-for="i of companyFields">
          <common-flex class="form" align="center" v-if="i.type === 'text'">
            <div class="star" v-if="+i.required === 1" />
            <el-input v-if="i.property !== 'sms_code'" @blur="inputVerify(i, i.value)" :disabled="!!+(i.disabled)" v-model="i.value" :placeholder="i.placeholder" />
            <el-input style="flex: 1" v-else @blur="inputVerify(i, i.value)" :disabled="!!+(i.disabled)" v-model="i.value" :placeholder="i.placeholder" />
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
            <comp-select :placeholder="i.placeholder" @change="getSelectVal($event, i)" :selector="optionDefinition[i.property]" v-model="i.value" />
            <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
          </common-flex>
          <common-flex direction="column" class="form" v-else-if="i.type === 'checkbox'">
            <div class="star" v-if="+i.required === 1" />
            <span class="form-name" style="margin-top: .25rem">{{ i.name }}</span>
            <div class="checkbox-container">
              <el-checkbox-group v-model="checkVal">
                <el-checkbox  @change="checkVerify(i)" v-for="o of optionDefinition[i.property]" :key="o.label" :label="o.label">{{ o.label}}
                  <el-input v-model="otherVal" placeholder="请输入" @blur="checkVerify(i)" v-if="o.label === '其他' && checkVal.includes('其他')" />
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
          </common-flex>
        </template>
      </div>
    </div>
    <!--    // 产品信息-->
    <div class="bottom" style="margin-top: 45px" v-for="(product, j) of productFields" :key="j">
      <div class="title"><div>参赛产品({{ j + 1 }})</div></div>
      <div class="posi bottom-box">
        <span @click="deleteProduct(j)" v-show="productFields.length > 1" class="dele">删除</span>
        <template v-for="i of product">
          <common-flex class="form"  v-if="i.type === 'text'" align="center">
            <div class="star" v-if="+i.required === 1" />
            <el-input @blur="inputProVerify(i, j, i.value)" :disabled="!!+(i.disabled)" v-model="i.value" :placeholder="i.placeholder"></el-input>
            <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
          </common-flex>
          <common-flex class="form" v-else-if="i.type === 'select'">
            <div class="star" v-if="+i.required === 1" />
            <comp-select :placeholder="i.placeholder" @change="getSelectVal($event, i, j)" :selector="optionDefinition[i.property]" v-model="i.value" />
            <common-flex align="center" class="form-errMsg">{{ i.errMsg }}</common-flex>
          </common-flex>
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
        <common-flex align="center" justify="center" class="toggle-check" @click.native="agreeDetail()">
          <img v-if="agreeFlag" style="margin-bottom: 2px" :src="require('@img/agree-active.svg')" alt="">
        </common-flex>
        <div>我已阅读并同意</div>
        <div @click="agreeDetail(1)">《参赛机构承诺书》</div>
      </common-flex>
      <div class="submit" @click="submit">提交报名</div>
    </common-flex>
    <validation-toast :show.sync="validateShow" v-if="validateShow" @validation="getValidation" />
    <promise-book :show.sync="promiseShow" v-if="promiseShow" />
  </div>
</template>

<script>
import ValidationToast from '@comp/validationToast'
import PromiseBook from '@comp/promise'
import CompSelect from '@comp/select'
export default {
  name: 'apply',
  components: {
    ValidationToast,
    PromiseBook,
    CompSelect
  },
  head () {
    return {
      title: '山西证券'
    }
  },
  data () {
    return {
      checkVal: [],
      otherVal: '',
      value: '',
      inputVal: '',
      validateShow: false,
      promiseShow: false,
      agreeFlag: false,
      getCodeShow: true,
      detailCount: 0,
      timer: null,
      codeTxt: 60,
      optionDefinition: {},
    }
  },
  async asyncData ({ app, query }) {
    let config = await app.axios({
      url: `/competition/activity/backend/api/competition/getMatchApplyFields`,
      data: { match_code: query.match_code }
    })
    console.log('query', query.match_code)
    let productFields = []
    let companyFields = config.data.data.fields.filter((i) => i.form_title === '私募机构信息')
    let productFieldsSingle = config.data.data.fields.filter((i) => i.form_title === '参赛产品信息')
    let optionDefinition = config.data.data.option_definition
    optionDefinition['product_tactics'].forEach((i) => {
      if (i.children && !i.children.length) delete i.children
    })
    optionDefinition = { ...optionDefinition }
    let i = 0, j = 0, hiddenArr = ['recommend_other_name', 'validation', 'extend_attributes_money_account', 'extend_attributes_recommend_person_name', 'product_code']
    for (i; i < companyFields.length; i++) {
      if (hiddenArr.includes(companyFields[i].property)) companyFields[i].type = 'hidden'
      if (companyFields[i].property === 'contacts_phone') companyFields[i].type = 'number'
      if (companyFields[i].property === 'email') companyFields[i].type = 'text'
    }
    for (j; j < productFieldsSingle.length; j++) {
      if (hiddenArr.includes(productFieldsSingle[j].property)) productFieldsSingle[j].type = 'hidden'
      if (productFieldsSingle[j].property === 'product_name') productFieldsSingle[j].type = 'select'
    }
    let singleProduct = JSON.parse(JSON.stringify(productFieldsSingle))
    productFields.push(productFieldsSingle)
    console.log('companyFields', companyFields)
    console.log('singleProduct', singleProduct)
    return {
      singleProduct,
      companyFields,
      productFields,
      optionDefinition
    }
  },
  mounted () {
    // console.log('route', this.$route.query)
  },
  methods: {
    getSelectVal (data, item, index) {
      console.log('111', data, item)
      if (item.property === 'recommend_name') {
        for (let i = 0; i < this.companyFields.length; i++) {
          if (this.companyFields[i].property === 'extend_attributes_recommend_person_name') {
            if (data.indexOf('>') !== -1) {
              this.$set(this.companyFields[i], 'type', 'text')
            } else this.$set(this.companyFields[i], 'type', 'hidden')
          }
        }
      }
      if (item.property === 'open_account') {
        for (let j = 0; j < this.companyFields.length; j++) {
          if (this.companyFields[j].property === 'extend_attributes_money_account') {
            if (+data === 1) {
              this.$set(this.companyFields[j], 'type', 'text')
              this.$set(this.companyFields[j], 'required', '1')
            }
            else {
              this.$set(this.companyFields[j], 'type', 'hidden')
              this.$set(this.companyFields[j], 'required', '0')
            }
          }
        }
      }
      if (item.property === 'product_name') {
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

      }
    },
    deleteProduct (j) {
      this.productFields.splice(j, 1)
    },
    addProduct () {
      this.productFields.push(JSON.parse(JSON.stringify(this.singleProduct)))
    },
    submit () {
      if (!this.agreeFlag) {
        this.$alert(`请勾选我同意《参赛机构承诺书》`, '提示')
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
              this.companyFields[i+1].value = this.companyFields[i].value[1]
              company_data[this.companyFields[i].property] = this.companyFields[i].value[0]
            }
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
      for(k; k < this.productFields.length; k++) {
        let product_info = {}
        for (let j = 0; j < this.productFields[k].length; j++) {
          if (this.productFields[k][j].required === '1' && !this.productFields[k][j].value) {
            this.$set(this.productFields[k][j], 'errMsg', `${this.productFields[k][j].name}不能为空`)
          } else if (this.productFields[k][j].required === '1' && this.productFields[k][j].value) {
            if (this.productFields[k][j].property === 'product_name') {
              console.log('xx', this.productFields[k][j])
              product_info[this.productFields[k][j].property] = this.productFields[k][j].value[0]
            }
            else product_info[this.productFields[k][j].property] = this.productFields[k][j].value
          } else product_info[this.productFields[k][j].property] = this.productFields[k][j].value
          errMsg = errMsg || this.productFields[k][j].errMsg
        }
        product_list.push(product_info)
      }
      console.log('company_data', company_data)
      console.log('product_list', product_list)
      let data = {
        sms_code,
        company_data,
        product_list,
        match_code: 'sxzt-2'
      }
      this.applyMulProduct(data)
      if (errMsg) this.$alert(errMsg, '错误')
      else this.applyMulProduct(data)
    },
    applyMulProduct (data) {
      this.axios({
        url: '/competition/activity/backend/api/competition/applyMulProducts',
        data,
        success: (resp) => {
          if (20000 === +(resp.data.code)) this.$alert('提交申请成功', '提示')
          else this.$alert(resp.msg, '错误')
        }
      })
    },
    agreeDetail (m) {
      if(m) {
        this.promiseShow = true
        this.detailCount++
        return
      }
      if (!this.detailCount) {
        this.$alert('请先阅读《参赛机构承诺书》', '提示',{
          confirmButtonText: '确定',
          callback: () => {
            this.promiseShow = true
            this.detailCount++
          }
        })
      } else this.agreeFlag = !this.agreeFlag
    },
    getValidation (data) {
      setTimeout(() =>{
        this.validateShow = false
        this.getPhoneCode(data)
      }, 1000)
    },
    sendMsg () {
      if (!this.getCodeShow) {
        this.$alert('短信验证码已发送!请注意查看', '提示')
        return
      }
      let i = 0
      for (i; i < this.companyFields.length; i++) {
        if (this.companyFields[i].property === 'contacts_phone') break
      }
      if ((this.companyFields[i].errMsg && this.companyFields[i].value) || !this.companyFields[i].value) {
        this.$alert(this.companyFields[i].errMsg || `${this.companyFields[i].name}不能为空`, '提示')
        return
      }
      this.validateShow = true
    },
    getPhoneCode (data) {
      let i = 0
      for (i; i < this.companyFields.length; i++) {
        if (this.companyFields[i].property === 'contacts_phone') break
      }
      const phone = this.companyFields[i].value
      this.axios({
        url: `/competition/activity/backend/api/competition/sendMatchApplySmsCode`,
        type: 'get',
        data: {
          phone,
          sessId: data.sessionId,
          token: data.token,
          sig: data.sig,
          scene: 'nc_register',
          match_code: 'sxzt-2'
        },
        success: ({ data }) => {
          if (+data.status === 1) {
            this.getCodeShow = false
            this.countDown(i)
          }
          this.$alert(data.msg, '提示')
        }
      })
    },
    countDown(j) {
      clearInterval(this.timer)
      let time = 60
      this.timer = setInterval( () => {
        time--
        this.codeTxt = time
        if(time === 0) {
          this.getCodeShow = true
          clearInterval(this.timer)}
      },1000)
    },
    getCompanyInfo (item, v) {
      if (!v || !v.replace(/\s*/g, '')) return
      this.axios({
        url: `/competition/activity/backend/api/competition/findCompany`,
        type: 'get',
        data: { registerNumber: v.replace(/\s*/g, '') },
        success: (res) => {
          if (res.code !== 20000) {
            this.$set(item, 'errMsg', '公司备案编号有误!')
            return
          }
          let data = res.data
          if (data.companyId) this.getProductList(data.companyId)
          let i = 0
          for (i; i < this.companyFields.length; i++) {
            if (this.companyFields[i].property === 'company_name') {
              this.$set(this.companyFields[i], 'value', data.companyName)
              this.$set(this.companyFields[i], 'errMsg', '')
            }
            if (this.companyFields[i].property === 'company_id') {
              this.$set(this.companyFields[i], 'value', data.companyId)
              this.$set(this.companyFields[i], 'errMsg', '')
            }
            if (this.companyFields[i].property === 'register_date') {
              this.$set(this.companyFields[i], 'value', data.registerDate)
              this.$set(this.companyFields[i], 'errMsg', '')
            }
          }
        }
      })
    },
    getProductList (id) {
      this.axios({
        url: `/competition/activity/backend/api/competition/getCompanyProduct`,
        type: 'get',
        data: { companyId: id, limitFundType: 1 },
        success: ({ data }) => {
          let productList = data.filter((i) => i.registerNumber)
          productList.forEach((i) => {
            i.label = i.fundShortName
            i.value = [i.fundShortName, i.registerNumber, i.fundId, i.personnelName]
          })
          this.$set(this.optionDefinition, 'product_name', productList)
        }
      })
    },
    // el-input表单失去焦点验证
    inputVerify (item, v) {
      let regObj = {
        contacts_phone: /^0?(13[0-9]|15[012356789]|16[6]|17[01235678]|18[0-9]|14[01456789]|19[0-9])[0-9]{8}$/,
        email: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      }
      if (item.property === 'register_number') {
        this.getCompanyInfo(item, v)
      }
      let i = 0
      for (i; i < this.companyFields.length; i++) {
        if (item.property === this.companyFields[i].property) break
      }
      if (!v || !v.replace(/\s*/g, '')) this.$set(item, 'errMsg', `${item.name}不能为空`)
      else if (Object.keys(regObj).includes(this.companyFields[i].property)) {
        if (!(regObj[this.companyFields[i].property].test(v))) this.$set(item, 'errMsg', `${item.name}格式不正确`)
        else {
          this.$set(item, 'errMsg', '')
          this.$set(item, 'value', v)
        }
      } else {
        this.$set(item, 'errMsg', '')
        this.$set(item, 'value', v.replace(/\s*/g, ''))
      }
    },
    inputProVerify (item, index, v) {
      let i = 0
      for (i; i < this.productFields[index].length; i++) {
        if (item.property === this.productFields[index][i].property) break
      }
      if (!v || !v.replace(/\s*/g, '')) this.$set(item, 'errMsg', `${item.name}不能为空`)
      else {
        this.$set(item, 'errMsg', '')
        this.$set(item, 'value', v.replace(/\s*/g, ''))
      }
    },
    dateVerify (item, v) {
      if (!v) this.$set(item, 'errMsg', `${item.name}不能为空!`)
      else {
        this.$set(item, 'errMsg', '')
        this.$set(item, 'value', v)
      }
    },
    checkVerify (item) {
      let v = this.checkVal
      let i = 0
      for (i; i < this.companyFields.length; i++) {
        if (item.property === this.companyFields[i].property) break
      }
      if (v.includes('其他') && v.length <= 1) {
        if (!this.otherVal) this.$set(item, 'errMsg', `${item.name}不能为空!`)
        else {
          this.$set(item, 'errMsg', '')
          this.$set(item, 'value', v)
        }
      } else if (!v.length) {
        this.$set(item, 'errMsg', `${item.name}不能为空!`)
      } else {
        this.$set(item, 'errMsg', '')
        this.$set(item, 'value', v)
      }
    }
  }
}
</script>

<style lang="scss">
.direct-apply {
  padding-bottom: .6rem;
  width: 100%;
  height: 100%;
  background-color: #cb0000;
  @include cImg();
  .top, .bottom {
    .title {
      margin: 0 auto;
      width: 6.7rem;
      font-size: 0.32rem;
      color: #701D1D;
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
      color: #a40202;
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
    font-size: .3rem;
    color: #C00000;
  }
  .btn-container {
    font-size: .3rem;
    color: #470000;
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
      :nth-child(3) {
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
    color: #333;
    input {
      height: 1rem;
      background: #fff;
      border: .02rem solid #D7DAE2;
      &:disabled {
        background: #F5F5F5;
        color: #999;
      }
      &::placeholder {
        font-size: .3rem;
        color: #999;
      }
    }
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
          width: 6px;
          height: 10px;
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

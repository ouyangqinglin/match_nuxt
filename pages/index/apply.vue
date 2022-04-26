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
        <common-flex align="center" justify="center" class="toggle-check" @click.native="agreeDetail()">
          <img v-if="agreeFlag" style="margin: 1px 0 0 2px; width: 18px; height: 18px" :src="require('@img/agree-active.svg')" alt="">
        </common-flex>
        <div>我已阅读</div>
        <div class="book" @click="agreeDetail(1)">《参赛承诺书》</div>
        <div v-if="disclaimer" @click="disclaimerShow = true" class="book">《免责声明》</div>
      </common-flex>
      <div class="submit" @click="hasApply ? '': submit()">提交报名</div>
    </common-flex>
    <validation-toast :show.sync="validateShow" v-if="validateShow" @validation="getValidation" />
    <promise-book :show.sync="promiseShow" v-if="promiseShow" />
    <Disclaimer :show.sync="disclaimerShow" v-if="disclaimerShow" />
  </div>
</template>

<script>
import ValidationToast from '@comp/validationToast'
import PromiseBook from '@comp/promise'
import Disclaimer from '@comp/apply-disclaimer'
import { mapState } from 'vuex'
export default {
  name: 'apply',
  components: {
    ValidationToast,
    PromiseBook,
    Disclaimer
  },
  data () {
    return {
      loading: '',
      checkVal: [],
      otherVal: '',
      value: '',
      inputVal: '',
      validateShow: false,
      hasApply: false,
      promiseShow: false,
      disclaimerShow: false,
      agreeFlag: false,
      getCodeShow: true,
      detailCount: 0,
      timer: null,
      codeTxt: 60,
    }
  },
  async asyncData ({ app, query }) {
    let config = await app.axios({
      url: `/competition/activity/backend/api/competition/getMatchApplyFields`,
      data: { match_code: query.match_code }
    })
    let productFields = []

    let applyFields = config.data.data.fields
    let hiddenArr = ['recommend_other_name', 'validation', 'extend_attributes_recommend_person_name', 'product_code', 'extend_attributes_money_account', 'extend_attributes_money_account2']
    let i = 0
    for (i; i < applyFields.length; i++) {
      if (hiddenArr.includes(applyFields[i].property)) applyFields[i].type = 'hidden'
      if (applyFields[i].property === 'email') applyFields[i].type = 'text'
      if (applyFields[i].property === 'product_name') applyFields[i].type = 'select'
    }
    let companyFields = applyFields.filter((i) => i.form_title === '私募机构信息')
    let productFieldsSingle = applyFields.filter((i) => i.form_title === '参赛产品信息')
    let optionDefinition = config.data.data.option_definition
    optionDefinition['product_tactics'].forEach((i) => {
      if (i.children && !i.children.length) delete i.children
    })

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
      disclaimer: 'disclaimer',
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
    getChannelData () {
      if (location.search.includes('channel')) {
        let searchObj = this.getUrlObj(decodeURIComponent(location.search))
        this.$store.commit('saveUrlObj', searchObj)
        if (searchObj.register_number) {
          this.$set(this.companyFields[0], 'value', searchObj.register_number)
          this.$set(this.companyFields[0], 'disabled', true)
          let j = 0
          for (j; j < this.companyFields.length; j++) {
            if (searchObj.hasOwnProperty(this.companyFields[j].property)) {
              this.$set(this.companyFields[j], 'value', searchObj[this.companyFields[j].property])
            }
          }
          this.getCompanyInfo(this.companyFields[0], searchObj.register_number)
        }
        if (searchObj.channel === 'ppw' || searchObj.channel === 'fm') {
          let i = 0
          for(i; i < this.companyFields.length; i++) {
            if (this.companyFields[i].property === 'recommend_name') {
              this.$set(this.companyFields[i], 'value', '私募排排网')
            }
          }
        }
      }
    },
    getUrlObj (url) {
      const jsonList = {}
      if(url.indexOf("?") !== -1){
        let str = url.slice(url.indexOf("?") + 1)
        let strs = str.split("&")
        for(let i = 0; i < strs.length; i++) {
          jsonList[strs[i].split("=")[0]] = strs[i].split("=")[1]
        }
      }
      return jsonList
    },
    deleteProduct (j) {
      this.productFields.splice(j, 1)
    },
    addProduct () {
      this.productFields.push(JSON.parse(JSON.stringify(this.singleProduct)))
    },
    submit () {
      setTimeout(() => {
        this.delaySubmit()
      }, 100)
    },
    delaySubmit () {
      if (!this.agreeFlag) {
        this.$alert(`请勾选我同意《参赛承诺书》`, '提示')
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
      // console.log('company_data', company_data)
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
    applyMulProduct (data) {
      this.hasApply = true
      this.openFullLoading('提交中')
      this.axios({
        url: '/competition/activity/backend/api/competition/applyMulProducts',
        data,
        success: (resp) => {
          this.loading.close()
          this.$alert(resp.msg, '提示')
          this.hasApply = false
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
      }, 500)
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
    openFullLoading (text = '加载中') {
      this.loading = this.$loading({
        text: `${text}...`,
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    getPhoneCode (data) {
      this.openFullLoading('请求中')
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
          match_code: this.match_code
        },
        success: ({ data }) => {
          this.loading.close()
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
            this.$set(item, 'errMsg', '公司备案编号有误')
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
            if (this.companyFields[i].property === 'company_asset_size' && this.companyFields[i].type === 'select') {
              this.optionDefinition['company_asset_size'].forEach(item => {
                if (+item.value === +data.companyAssetSize) {
                  this.$set(this.companyFields[i], 'placeholder', item.label)
                }
              })
              this.$set(this.companyFields[i], 'value', data.companyAssetSize)
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
        this.productFields.forEach(i => {
          i.forEach(item => {
            delete item.value
          })
        })
        this.getCompanyInfo(item, v)
      }
      let i = 0
      for (i; i < this.companyFields.length; i++) {
        if (item.property === this.companyFields[i].property) break
      }
      if (!v || !v.replace(/\s*/g, '')) {
        if (item.required === '1') this.$set(item, 'errMsg', `${item.name}不能为空`)
        else this.$set(item, 'errMsg', '')
      }
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
      if (!v || !v.replace(/\s*/g, '')) {
        if (item.required === '1') this.$set(item, 'errMsg', `${item.name}不能为空`)
        else this.$set(item, 'errMsg', '')
      } else {
        if (item.rule) {
          if (item.rule['<='] && +v > +item.rule['<='].limit) {
            // 最大值边界
            this.$set(item, 'errMsg', item.rule['<='].msg)
          } else if (item.rule['>='] && +v < +item.rule['>='].limit) {
            // 最小值边界
            this.$set(item, 'errMsg', item.rule['>='].msg)
          } else this.$set(item, 'errMsg', '')
        } else {
          this.$set(item, 'errMsg', '')
        }
        this.$set(item, 'value', v.replace(/\s*/g, ''))
      }
    },
    radioChange (data, item, index) {
      // console.log(data, item)
      this.$set(item, 'errMsg', '')
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
    selectBlur (item) {
      setTimeout(() => {
        let v = item.value
        if (!v || (v.constructor === Array && !v.length)) this.$set(item, 'errMsg', `${item.name}不能为空`)
        else {
          this.$set(item, 'errMsg', '')
          if (v.length > 1) this.$set(item, 'value', v)
          else if (v.constructor === Array) this.$set(item, 'value', v.join(''))
        }
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
    dateVerify (item, v) {
      if (!v) this.$set(item, 'errMsg', `${item.name}不能为空`)
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
        if (!this.otherVal) this.$set(item, 'errMsg', `${item.name}不能为空`)
        else {
          this.$set(item, 'errMsg', '')
          this.$set(item, 'value', v)
        }
      } else if (!v.length) {
        this.$set(item, 'errMsg', `${item.name}不能为空`)
      } else {
        this.$set(item, 'errMsg', '')
        this.$set(item, 'value', v)
      }
    }
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

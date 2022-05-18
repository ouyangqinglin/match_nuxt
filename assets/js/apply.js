export default {
  data () {
    return {
      selectVisible: true,
      loading: '',
      checkVal: [],
      otherVal: '',
      value: '',
      inputVal: '',
      hasApply: false,
      validateShow: false,
      promiseShow: false,
      disclaimerShow: false,
      agreeFlag: false,
      getCodeShow: true,
      detailCount: 0,
      timer: null,
      codeTxt: 60,
    }
  },
  methods: {
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
    submit () {
      setTimeout(() => {
        this.delaySubmit()
      }, 100)
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
    radioChange (data, item, index) {
      this.$set(item, 'errMsg', '')
      let scaleItem = {}
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
          if (this.productFields[index][p].property === 'product_scale') scaleItem = this.productFields[index][p]
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
      if (scaleItem.value) this.inputProVerify(scaleItem, index, scaleItem.value)
    },

    addProduct () {
      this.productFields.push(JSON.parse(JSON.stringify(this.singleProduct)))
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
    checkRule (item, v, it) {
      if (it) {
        if (it.rule['<='] && +v > +it.rule['<='].limit) {
          // 最大值边界
          this.$set(item, 'errMsg', it.rule['<='].msg)
        } else if (it.rule['>='] && +v < +it.rule['>='].limit) {
          // 最小值边界
          this.$set(item, 'errMsg', it.rule['>='].msg)
        } else this.$set(item, 'errMsg', '')
      } else {
        if (item.rule['<='] && +v > +item.rule['<='].limit) {
          // 最大值边界
          this.$set(item, 'errMsg', item.rule['<='].msg)
        } else if (item.rule['>='] && +v < +item.rule['>='].limit) {
          // 最小值边界
          this.$set(item, 'errMsg', item.rule['>='].msg)
        } else if (item.rule['<'] && +v >= +item.rule['<'].limit) {
          // 最大值边界
          this.$set(item, 'errMsg', item.rule['<'].msg)
        } else if (item.rule['>'] && +v <= +item.rule['>'].limit) {
          // 最小值边界
          this.$set(item, 'errMsg', item.rule['>'].msg)
        } else this.$set(item, 'errMsg', '')
      }
    },
    agreeDetail (m) {
      if(m) {
        if (m === 1) this.promiseShow = true
        if (m === 2 && this.disclaimer) this.disclaimerShow = true
        this.detailCount++
        return
      }
      if (!this.detailCount) {
        let message = ''
        if (this.disclaimer) message = '请勾选我同意《免责声明》'
        if (this.commitment_letter) message = '请勾选我同意《参赛承诺书》'
        this.$alert(message, '提示',{
          confirmButtonText: '确定',
          callback: () => {
            if (this.commitment_letter && this.disclaimer) this.promiseShow = true
            else if (this.commitment_letter) this.promiseShow = true
            else if (this.disclaimer) this.disclaimerShow = true
            this.detailCount++
          }
        })
      } else this.agreeFlag = !this.agreeFlag
    },
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
    arrayEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) return false
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false
      }
      return true
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
    },
    inputProVerify (item, index, v) {
      if (item.type === 'number') {
        const numReg = /^\d+(?=\.{0,1}\d+$|$)/
        if (!numReg.test(v)) {
          this.$set(item, 'errMsg', `${item.name}仅支持输入数字`)
          setTimeout(() => {
            this.$set(item, 'value', '')
          }, 1000)
          return
        }
      }
      let i = 0
      for (i; i < this.productFields[index].length; i++) {
        if (item.property === this.productFields[index][i].property) break
      }
      if (!v) {
        if (item.required === '1') this.$set(item, 'errMsg', `${item.name}不能为空`)
        else this.$set(item, 'errMsg', '')
      }
      else {
        if (item.rule) {
          if (item.rule.checkif) {
            const checkIf = item.rule.checkif
            let y = 0, valueList = [], originList = []
            for (y; y < checkIf.length; y++) {
              if (checkIf[y].logic && checkIf[y].logic === 'and') {
                let q = 0
                for (q; q < checkIf[y].list.length; q++) {
                  originList.push(checkIf[y].list[q].value)
                  this.companyFields.forEach(my => {
                    if (my.property === checkIf[y].list[q].field) {
                      valueList.push(my.value)
                    }
                  })
                  this.productFields[index].forEach(pro => {
                    if (pro.property === checkIf[y].list[q].field) {
                      valueList.push(pro.value)
                    }
                  })
                }
                const flag = this.arrayEqual(valueList, originList)
                if (flag) {
                  const it = checkIf[y].list[0]
                  this.checkRule(item, v, it)
                }
                else this.$set(item, 'errMsg', '')
              } else this.$set(item, 'errMsg', '')
            }
          }
          else this.checkRule(item, v)
        } else this.$set(item, 'errMsg', '')
        this.$set(item, 'value', v)
      }
    },
    // el-input表单失去焦点验证
    inputVerify (item, v) {
      if (item.type === 'number') {
        const numReg = /^\d+(?=\.{0,1}\d+$|$)/
        if (!numReg.test(v)) {
          this.$set(item, 'errMsg', `${item.name}仅支持输入数字`)
          return
        }
      }
      let regObj = {
        contacts_phone: /^0?(13[0-9]|15[012356789]|16[6]|17[01235678]|18[0-9]|14[01456789]|19[0-9])[0-9]{8}$/,
        email: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      }
      if (item.property === 'register_number') {
        this.clearProductInfo()
        this.getCompanyInfo(item, v)
      }
      let i = 0
      for (i; i < this.companyFields.length; i++) {
        if (item.property === this.companyFields[i].property) break
      }
      if (!v) {
        if (item.required === '1') this.$set(item, 'errMsg', `${item.name}不能为空`)
        else this.$set(item, 'errMsg', '')
      } else if (Object.keys(regObj).includes(this.companyFields[i].property)) {
        if (!(regObj[this.companyFields[i].property].test(v))) this.$set(item, 'errMsg', `${item.name}格式不正确`)
        else {
          this.$set(item, 'errMsg', '')
          this.$set(item, 'value', v)
        }
      } else {
        if (item.rule) {
          // 111
          this.checkRule(item, v)
        } else {
          this.$set(item, 'errMsg', '')
        }
        this.$set(item, 'value', v)
      }
    },
    // 清空产品信息
    clearProductInfo (index) {
      if (index) {
        this.productFields[index-1].forEach(i => {
          delete i.value
        })
      } else {
        this.productFields.forEach(i => {
          i.forEach(item => {
            delete item.value
          })
        })
      }
    },
    // 获取产品列表
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
    // 获取公司信息
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
    // 短信倒计时
    countDown (j) {
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
  }
}

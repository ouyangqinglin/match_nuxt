<template>
  <div id="nc" />
</template>

<script>
export default {
  data() {
    return {
      aliRes: null
    }
  },
  mounted() {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `//g.alicdn.com/AWSC/AWSC/awsc.js?t=${new Date().getTime()}`
    document.body.appendChild(script)
    const that = this
    script.onload = () => {
      // 实例化nc
      window.AWSC.use('nc', (state, module) => {
        // 初始化
        window.nc = module.init({
          // 应用类型标识。它和使用场景标识（scene字段）一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以在阿里云验证码控制台的配置管理页签找到对应的appkey字段值，请务必正确填写。
          appkey: 'FFFF0N00000000008289',
          // appkey: 'CF_APP_1',
          // 使用场景标识。它和应用类型标识（appkey字段）一起决定了滑动验证的业务场景与后端对应使用的策略模型。您可以在阿里云验证码控制台的配置管理页签找到对应的scene值，请务必正确填写。
          scene: 'nc_register',
          // 声明滑动验证需要渲染的目标ID。
          renderTo: 'nc',
          // 前端滑动验证通过时会触发该回调参数。您可以在该回调参数中将会话ID（sessionId）、签名串（sig）、请求唯一标识（token）字段记录下来，随业务请求一同发送至您的服务端调用验签。
          // test: module.TEST_PASS, // 测试滑动通过状态
          // test: module.TEST_BLOCK, // 滑动验证未通过，被拦截。
          // test: module.TEST_NC_PASS, // 唤醒二次验证（滑动验证），且二次验证通过
          success(data) {
            that.aliRes = data
            that.$emit('validation', data)
          },
          // 滑动验证失败时触发该回调参数。
          fail(failCode) {
            window.console && console.log(failCode)
          },
          // 验证码加载出现异常时触发该回调参数。
          error(errorCode) {
            window.console && console.log(errorCode)
          }
        })
      })
    }
  }
}
</script>

<style scoped lang='scss'>
  #nc {
    position: static !important;
    margin-bottom: 14px;
  }
  ::v-deep {
    .nc_wrapper {
      width: 100% !important;
      height: 54px !important;
      border-radius: 2px;
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, .2);
      .nc_scale {
        height: 54px !important;
        background: transparent;
        & span {
          border-color: transparent !important;
        }
      }
      .nc-lang-cnt {
        font-size: 15px;
      }
      .nc_scale {
        border-radius: 2px;
        overflow: hidden;
      }
      .nc_iconfont {
        width: 52px !important;
        height: 52px !important;
        line-height: 52px !important;
        border-radius: 2px;
        font-size: 17px;
        font-weight: 500;
        color: #111;
        background-color: rgba(233, 233, 233, 0.8);
      }
      .btn_ok {
        color: #7ac23c !important;
      }
      .nc-lang-cnt {
        line-height: 54px;
      }
      .scale_text span[data-nc-lang="SLIDE"] {
        background: -webkit-gradient(linear,left top,right top,color-stop(0,#1677FF),color-stop(.4,#1677FF),color-stop(.5,#fff),color-stop(.6,#1677FF),color-stop(1,#1677FF));
        -webkit-background-clip: text;
        font-size: 15px;
        opacity: .8;
      }
    }
  }
</style>

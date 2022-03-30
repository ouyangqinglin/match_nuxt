
<script>
import util from '@js/util.js'
export default {
  head () {
    return {
      script: [
        { src: `https://www${this.$store.state.suffix}.simuwang.com/global/common/mt/simple/t/1558575004/force_login/0.html`, async: true, defer: true },
        { src: `https://passport${this.$store.state.suffix}.simuwang.com/Static/Passport/Js/smppw_auth_mc.1.6.1.js?v=1558573200&force_auth=0`, async: true, defer: true },
      ]
    }
  },
  mounted () {
    console.log(util.getSiteSuffix())
  }
}
</script>

<template>
  <div></div>
</template>



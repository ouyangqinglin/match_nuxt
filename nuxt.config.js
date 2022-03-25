import path from 'path'

let localConfig = {} // 本地配置文件
if (process.env.NODE_ENV === 'development') {
  try {
    localConfig = require(`./${process.env.NUXT_SITE_ENV}.config.local.json`)
  } catch (err) {}
}
const routerPrefix = process.env.NODE_ENV === 'development' ? '' : '/competition'
const config = require(`./${process.env.NUXT_SITE_ENV}.config.json`)
let clientConfig = Object.assign({}, config.client, localConfig.client) // 需注入process.env的配置（会打包进客户端代码）
global._CONFIG = Object.assign({}, config.server, localConfig.server) // 服务器配置文件

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  env: clientConfig,
  server: {
    port: 20009,
    host: '0.0.0.0'
  },
  head: {
    title: '私募大赛',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge,chrome=1' },
      { name: '360-site-verification', content: '0a4c3e5d573973dc06b04b85968ef318' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
  },
  loading: { color: '#C00000' },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/css/_presetClass.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    `~/plugins/axios.js`,
    `~/plugins/element-ui.js`,
    `~/plugins/commonComp.js`,
    `~plugins/directive.js`,
    `~plugins/commonMixin.js`,
    `~/plugins/commonComp.client.js`,
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],
  router: {
    mode: 'history',
    base: routerPrefix,
    resourceHints: false,
    prefetchLinks: false
  },
  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/style-resources', // 用于全局注入scss库
  ],
  proxy: {
    '/activity': {
      target: clientConfig.apiHost,
      changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
      pathRewrite: { // 路径重写，
        '^/activity': '' // 替换target中的请求地址，也就是说/activity=/target，请求target这个地址的时候直接写成/backend。
      }
    },
    '/match': {
      target: clientConfig.figHost,
      changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
      pathRewrite: { // 路径重写，
        '^/match': '' // 替换target中的请求地址，也就是说/activity=/target，请求target这个地址的时候直接写成/backend。
      }
    }
  },
  axios: {
    proxy: true,
    withCredentials: true,
  },
  styleResources: {
    scss: [ // scss通用库
      '~/assets/css/_mixins.scss'
    ],
  },
  build: {
    extend (config, { isDev }) {
      if (isDev) { // 开发环境
        config.devtool = 'eval-source-map'
      }
      config.resolve.alias['@img'] = path.resolve(__dirname, './assets/img') // scss中需使用@起头的别名以避免webstorm引用地址报错
      config.resolve.alias['@js'] = path.resolve(__dirname, './assets/js')
      config.resolve.alias['@css'] = path.resolve(__dirname, './assets/css')
      config.resolve.alias['@comp'] = path.resolve(__dirname, './components')
      config.devtool = isDev && 'eval-source-map'
    },
    templates: [],
  },
}

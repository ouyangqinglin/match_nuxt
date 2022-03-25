const fs = require('fs')

function delDir (path) {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach((file) => {
      let curPath = path + '/' + file
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath) // 递归删除文件夹
      } else {
        fs.unlinkSync(curPath) // 删除文件
      }
    })
    fs.rmdirSync(path)
  }
}

function copyFolder (from, to) {
  let files = []
  if (fs.existsSync(to)) {
    files = fs.readdirSync(from)
    files.forEach(function (file) {
      let targetPath = from + '/' + file
      let toPath = to + '/' + file
      if (fs.statSync(targetPath).isDirectory()) {
        copyFolder(targetPath, toPath)
      } else {
        fs.copyFileSync(targetPath, toPath)
      }
    })
  } else {
    fs.mkdirSync(to)
    copyFolder(from, to)
  }
}

delDir('./build')
fs.mkdirSync('./build')
copyFolder('./.nuxt', './build/.nuxt')
copyFolder('./static', './build/static')
fs.copyFileSync('./nuxt.config.js', './build/nuxt.config.js')
fs.copyFileSync('./package.json', './build/package.json')
fs.copyFileSync('./test.config.json', './build/test.config.json')
fs.copyFileSync('./pre.config.json', './build/pre.config.json')
fs.copyFileSync('./prod.config.json', './build/prod.config.json')

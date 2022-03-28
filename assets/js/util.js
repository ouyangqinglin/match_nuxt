const util = {};

util.cookie = function (name, value = void 0, options = void 0) {
  if (value !== void 0) { // name and value given, set cookie
    options = options || {}
    if (value === null) {
      value = ''
      options.expires = -1
    }
    let expires = ''
    if (options.expires && (typeof options.expires === 'number' || options.expires.toUTCString)) {
      let date
      if (typeof options.expires === 'number') {
        date = new Date()
        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000))
      } else {
        date = options.expires
      }
      expires = '; expires=' + date.toUTCString() // use expires attribute, max-age is not supported by IE
    }
    let path = options.path ? '; path=' + options.path : ''
    let domain = options.domain ? '; domain=' + options.domain : ''
    let secure = options.secure ? '; secure' : ''
    document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('')
  } else { // only name given, get cookie
    let cookieValue = null
    if (document.cookie && document.cookie !== '') {
      let cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim()
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = (cookie.substring(name.length + 1))
          break
        }
      }
    }
    return cookieValue
  }
};


util.getSiteSuffix = function (){
  return /-.*?(?=\.)/.test(location.hostname) ? location.hostname.match(/-.*?(?=\.)/)[0] : '';
}

export default util;

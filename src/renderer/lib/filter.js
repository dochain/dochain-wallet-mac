import Vue from 'vue'

// 处理千分位
Vue.filter('formatThousands', (value = '0', currencyType = '') => {
  let res
  res = (value || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  return res
})

// 处理货币
Vue.filter('formatCurrency', (value = '0', currencyType = '') => {
  let res
  if (value.toString().indexOf('.') === -1) {
    res = (value || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.00'
  } else {
    let prev = value.toString().split('.')[0]
    let next = value.toString().split('.')[1] < 10 ? value.toString().split('.')[1] + '0' : value.toString().split('.')[1]
    res = (prev || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.' + next
  }
  return currencyType + res
})

// 转换Eth
Vue.filter('conversionEth', (value) => {
  let res = 0
  if (value) {
    res = value / (Math.pow(10, 18))
  }
  return res
})

// 转换GWei
Vue.filter('conversionGWei', (value) => {
  let res = 0
  if (value) {
    res = value / (Math.pow(10, 9))
  }
  return res
})

// 转换时间格式
Vue.filter('formatTimestamp', (value) => {
  return new Date(value * 1000).toLocaleString()
})

// 保留小数点(会四舍五入)
Vue.filter('toFixed', (value, pos) => {
  // 小数点不够要用0补齐
  value = parseFloat(value)
  if (!value) {
    return value
  }

  return value.toFixed(pos)
})

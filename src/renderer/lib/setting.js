import LokiJs from 'lokijs'
let loki = new LokiJs(`${process.env.WALLET_APPLICATION_SUPPORT_PATH}/settings.db`, {autosave: true, autosaveInterval: 5000, autoload: true})
const setting = {
  set (key, value) {
    let settings = loki.getCollection('settings')
    if (!settings) {
      settings = loki.addCollection('settings', {'indices': ['key']})
    }
    let item = settings.findOne({key: key})
    console.log(value)
    console.log(item)
    if (item) {
      item.value = value
      settings.update(item)
    } else {
      settings.insert({key: key, value: value})
    }
    loki.saveDatabase()
  },
  get (key) {
    console.log('just try')
    return new Promise((resolve, reject) => {
      loki.loadDatabase({}, function (result) {
        let settings = loki.getCollection('settings')
        if (!settings) {
          resolve(null)
        }
        let item = settings.findOne({key: key})
        console.log(item.value)
        resolve(item.value)
      })
    })
  }
}
export default setting

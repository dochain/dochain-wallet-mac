import LokiJs from 'lokijs'
const loki = new LokiJs(`${process.env.WALLET_APPLICATION_SUPPORT_PATH}/transactions.db`, {autosave: true, autosaveInterval: 5000, autoload: true})
export default loki

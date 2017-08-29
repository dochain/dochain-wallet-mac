import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
const adapter = new FileSync(`${process.env.WALLET_APPLICATION_SUPPORT_PATH}/dochain.json`)
const db = low(adapter)
db.defaults({ transactions: [], contract_addresses: [], setting: {} }).write()
export default db

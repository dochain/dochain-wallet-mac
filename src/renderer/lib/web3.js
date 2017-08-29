import Web3 from 'web3'
import lowdb from '@/lib/lowdb'
let web3 = new Web3()
if (process.env.IS_WALLET_INIT === 'false') {
  web3.setProvider('ws://127.0.0.1:8570')
  // 监听新区块
  web3.eth.subscribe('newBlockHeaders', (error, block) => {
    if (!error) {
      console.log('[subscribe new block headers]')
      getTransactionList(block)
      // console.log('[finished]')
    } else {
      console.log(`subscribe error:`)
      // console.log(error)
    }
  })
}
function getTransactionList (block) {
  let createdAt = null
  block.number = 153661
  web3.eth.getBlock(block.number)
    .then(block => {
      let web3Ins = []
      createdAt = block.timestamp
      block.transactions.forEach((value) => {
        let transaction = web3.eth.getTransaction(value)
        web3Ins.push(transaction)
      })
      // console.log('[web3Ins]')
      // console.log(web3Ins)
      return Promise.all(web3Ins)
    })
    .then(result => {
      let defaultAccount = lowdb.get('setting.default_account').value()
      if (result) {
        result.forEach((value) => {
          // console.log(`value.from[${value.from}]----value.to[${value.to}-----defaultAccount[${defaultAccount}]`)
          let blockInfo = { createdAt: createdAt, is_contract: false }
          let transaction = Object.assign(value, blockInfo)
          if ((transaction.from === defaultAccount || transaction.to === defaultAccount) && transaction.input === '0x') {
            addTransaction(transaction)
          } else {
            transaction.is_contract = true
            if (transaction.from === defaultAccount) {
              addTransaction(transaction)
            } else {
              // 解析参数
              let pre = new RegExp('0xa9059cbb')
              let str = transaction.input.replace(pre, '0x')
              let result = web3.eth.abi.decodeParameter('address', str)
              console.log('decode result:' + result)
              if (result === defaultAccount) {
                addTransaction(transaction)
                addContractAddress(transaction.to)
              }
            }
          }
        })
      }
    })
    .catch(errorResult => {
      console.log(errorResult)
    })
}

function addTransaction (transaction) {
  if (lowdb.get('transactions').find({hash: transaction.hash}).value()) {
    lowdb.get('transactions').find({hash: transaction.hash}).assign(transaction).write()
  } else {
    lowdb.get('transactions').push(transaction).write()
  }
}

function addContractAddress (address) {
  if (!lowdb.get('contract_addresses').find({value: address}).value()) {
    lowdb.get('contract_addresses').push({value: address}).write()
  }
}
export default web3

import * as types from '../mutation-types'
import { ipcRenderer } from 'electron'
import config from '@/lib/config'
import web3 from '@/lib/web3'
import lowdb from '@/lib/lowdb'
import fileDownload from 'file-download'
import { execSync } from 'child_process'
import AdmZip from 'adm-zip'
// import unzip from 'unzip'
import fs from 'fs'

const state = {
  transactionList: null,
  contractList: null,
  balance: 0.000000,
  isGethConnected: false,
  isWeb3Connected: false,
  defaultAccount: null,
  initWalletStatus: 'WALLET_INIT',
  createContractError: '',
  createContractLoading: false
}

const getters = {
  transactionList: state => state.transactionList,
  contractList: state => state.contractList,
  balance: state => state.balance,
  initWalletStatus: state => state.initWalletStatus,
  isGethConnected: state => state.isGethConnected,
  isWeb3Connected: state => state.isWeb3Connected,
  defaultAccount: state => state.defaultAccount,
  createContractError: state => state.createContractError,
  createContractLoading: state => state.createContractLoading
}

const actions = {
  init ({ commit }) {
    // 判断本地是否有binaries
    let userAppSupportPathStdout = execSync('ls ~/Library/Application\\ Support/dochainWallet').toString()
    if (userAppSupportPathStdout.indexOf('binaries') === -1) {
      // 设置下载
      commit(types.SET_INIT_WALLET_STATUS, 'DOWNLOAD_BINARIES')

      // 初始化环境
      let options = {
        directory: `${process.env.WALLET_APPLICATION_SUPPORT_PATH}/binaries`,
        filename: 'mac-geth.zip'
      }

      fileDownload('http://192.168.199.164:9006/mac-geth.zip', options, (err) => {
        if (err) {
          commit(types.SET_INIT_WALLET_STATUS, 'DOWNLOAD_BINARIES_ERROR')
          console.log(err)
          return false
        }

        // 设置geth连接状态
        commit(types.SET_INIT_WALLET_STATUS, 'GETH_CONNECTING')

        // 解压该压缩文件
        let zip = new AdmZip(`${options.directory}/${options.filename}`)
        zip.extractAllTo(options.directory, true)
        // let readStream = fs.createReadStream(`${options.directory}/${options.filename}`)
        // readStream.pipe(unzip.Extract({ path: `${options.directory}` }))
        // readStream.on('close', () => {
        //   console.log('readStream end')
        // })

        fs.open(`${process.env.WALLET_APPLICATION_SUPPORT_PATH}/binaries/mac-geth/geth`, 'a', (err, fd) => {
          // 打开文件错误
          if (err) {
            commit(types.SET_INIT_WALLET_STATUS, 'DOWNLOAD_BINARIES_ERROR')
            throw err
          }
          console.log('open geth')

          // 修改文件权限
          fs.fchmod(fd, '0755', (err) => {
            if (err) {
              commit(types.SET_INIT_WALLET_STATUS, 'DOWNLOAD_BINARIES_ERROR')
              throw err
            }

            // 关闭文件
            fs.close(fd, () => {
              // 通知进程连接链
              console.log('dochain-startup fs')
              ipcRenderer.send('dochain-startup')
            })
          })
        })
      })
    } else {
      // 设置geth连接状态
      commit(types.SET_INIT_WALLET_STATUS, 'GETH_CONNECTING')

      // 通知进程连接链
      ipcRenderer.send('dochain-startup')
    }

    // 接收主进程消息 判断是否启动成功
    ipcRenderer.on('dochain-start-result', (event, arg) => {
      console.log(arg)
      // 设置底层链连接成功
      if (arg === 'success') {
        commit(types.SET_INIT_WALLET_STATUS, 'GETH_CONNECT_SUCCEED')

        try {
          commit(types.SET_INIT_WALLET_STATUS, 'WEB3_CONNECTING')
          web3.setProvider('ws://127.0.0.1:8570')

          // NODES连接成功
          commit(types.SET_INIT_WALLET_STATUS, 'NODES_CONNECTING')

          // 检查是否有节点连接
          let intervalObj = setInterval(() => {
            web3.eth.net.getPeerCount()
              .then(result => {
                console.log(result)
                // 判断当节点数大于1的时候证明有节点连接
                if (result > 0) {
                  commit(types.SET_INIT_WALLET_STATUS, 'NODES_CONNECT_SUCCEED')
                  clearInterval(intervalObj)
                }
              })
          }, 1500)
        } catch (e) {
          commit(types.SET_INIT_WALLET_STATUS, 'WEB3_CONNECT_FAILED')
        }
      } else {
        commit(types.SET_INIT_WALLET_STATUS, 'GETH_CONNECT_FAILED')
      }
    })
  },
  changeBalance ({ commit }, balance) {
    commit(types.SET_BALANCE, balance)
  },
  getBalance ({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      dispatch('getDefaultAccounts')
        .then(result => {
          return web3.eth.getBalance(result)
        })
        .then(balance => {
          resolve(balance)
          commit(types.SET_BALANCE, balance)
        })
        .catch(errorResult => {
          console.log(errorResult)
          reject(errorResult)
        })
    })
  },
  getTransactionList ({ commit }, contractAddress) {
    let transactionList = []
    if (contractAddress) {
      transactionList = lowdb.get('transactions').find({is_contract: true, to: contractAddress}).take(1000).value()
    } else {
      transactionList = lowdb.get('transactions').take(1000).value()
    }
    console.log(transactionList)
    commit(types.SET_TRANSACTION_LIST, transactionList)
  },
  getContractList ({ commit }) {
    let addressList = lowdb.get('contract_addresses').value()
    let contractList = []
    console.log(111)
    return new Promise((resolve, reject) => {
      console.log(2222)
      addressList.forEach((address) => {
        new web3.eth.Contract(config.getAbi(), address.value).methods.getBalance(state.defaultAccount).call().then((result) => {
          console.log('==========')
          console.log(result)
          console.log('==========')
          contractList.push({address: address.value, amount: result})
          resolve(contractList)
        })
      })
    }).then((contractList) => {
      console.log()
      commit(types.SET_CONTRACT_LIST, contractList)
    })
  },
  send ({ commit }, data) {
    return new Promise((resolve, reject) => {
      // 解锁用户账户
      web3.eth.personal.unlockAccount(state.defaultAccount, data.password)
        .then(result => {
          console.log(result)
          console.log(data)
          resolve(result)
        })
        .catch(errorResult => {
          console.log(errorResult)
          reject(errorResult)
        })
    })
      .then(result => {
        return new Promise((resolve, reject) => {
          // 解锁用户账户
          web3.eth.sendTransaction({from: state.defaultAccount, to: data.address, value: data.amount})
            .then(transaction => {
              console.log('[send transaction]')
              console.log(transaction)
              console.log('[finished]')
              resolve(transaction)
            })
            .catch(errorResult => {
              console.log(errorResult)
              reject(errorResult)
            })
        })
      })
  },
  getDefaultAccounts ({ commit }) {
    return new Promise((resolve, reject) => {
      web3.eth.getAccounts()
        .then(accounts => {
          // 判断是否有账户信息
          if (accounts.length === 0) {
            resolve(null)
            commit(types.CLEAR_DEFAULT_ACCOUNT)
          } else {
            resolve(accounts[0])
            commit(types.SET_DEFAULT_ACCOUNT, accounts[0])
            lowdb.set('setting.default_account', accounts[0]).write()
          }
        })
        .catch(errorResult => {
          console.log(errorResult)
          reject(errorResult)
        })
    })
  },
  createAccount ({ commit }, user) {
    console.log(user.password)
    return new Promise((resolve, reject) => {
      web3.eth.personal.newAccount(user.password)
        .then(address => {
          resolve(address)
          commit(types.SET_DEFAULT_ACCOUNT, address)
        })
        .catch(errorResult => {
          console.log(errorResult)
          reject(errorResult)
        })
    })
  },
  showAddContractLoading ({ commit }) {
    commit(types.SHOW_ADD_CONTRACT_LOADING)
  },
  hideAddContractLoading ({ commit }) {
    commit(types.HIDE_ADD_CONTRACT_LOADING)
  },
  createContract ({ commit }, contractData) {
    return new Promise((resolve, reject) => {
      // 定义合约配置
      const contractConfig = {
        jsonInterface: `[]`,
        data: `xxxxxxxxxx`
      }
      web3.eth.personal.unlockAccount(state.defaultAccount, 'xxxxxx', 60)
      .then(result => {
        if (result) {
          // 创建合约
          let contractInstantiate = new web3.eth.Contract(JSON.parse(contractConfig.jsonInterface))
          let deployParams = {
            data: contractConfig.data,
            arguments: [
              // tonken金额
              contractData.initialAmount,
              // token的名字
              contractData.tokenName,
              // token的小数点
              contractData.decimalUnits,
              // token的符号
              contractData.tokenSymbol
            ]
          }
          console.log(state.defaultAccount)
          // 获取部署合约对象
          let sendParams = {
            from: state.defaultAccount,
            gas: 4300000
          }
          contractInstantiate.deploy(deployParams)
          .send(sendParams, (error, transactionHash) => {
            console.log('------1111-----', error, transactionHash)
          })
          .on('error', (error) => {
            console.log('------error-----', error)
          })
          .on('transactionHash', (transactionHash) => {
            console.log('------transactionHash-----', transactionHash)
          })
          .on('receipt', (receipt) => {
            console.log('------receipt-----', receipt.contractAddress) // contains the new contract address
            resolve(receipt)
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            console.log('------confirmationNumber-----', confirmationNumber, receipt) // contains the new contract address
          })
          .then((newContractInstance) => {
            console.log('------newContractInstance-----', newContractInstance.options) // instance with the new contract address
          })
        } else {
          console.log('password error')
        }
        return true
      })
      .catch(result => {
        console.log(result)
      })
    })
  }
}

const mutations = {
  [types.SET_BALANCE] (state, balance) {
    state.balance = balance
  },
  [types.CLEAR_BALANCE] (state) {
    state.balance = 0.0000000
  },
  [types.SET_TRANSACTION_LIST] (state, transactionList) {
    state.transactionList = transactionList
  },
  [types.CLEAR_TRANSACTION_LIST] (state) {
    state.transactionList = null
  },
  [types.SET_CONTRACT_LIST] (state, contractList) {
    state.contractList = contractList
  },
  [types.CLEAR_CONTRACT_LIST] (state) {
    state.transactionList = null
  },
  [types.SET_IS_GETH_CONNECTED] (state, result) {
    state.isGethConnected = result
  },
  [types.SET_IS_WEB3_CONNECTED] (state, result) {
    state.isWeb3Connected = result
  },
  [types.SET_DEFAULT_ACCOUNT] (state, result) {
    state.defaultAccount = result
  },
  [types.CLEAR_DEFAULT_ACCOUNT] (state) {
    state.defaultAccount = null
  },
  [types.SET_INIT_WALLET_STATUS] (state, status) {
    state.initWalletStatus = status
  },
  [types.SET_CREATE_CONTRACT_ERROR] (state, errMessage) {
    state.createContractError = errMessage
  },
  [types.SHOW_ADD_CONTRACT_LOADING] (state) {
    state.createContractLoading = true
  },
  [types.HIDE_ADD_CONTRACT_LOADING] (state) {
    state.createContractLoading = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

'use strict'

import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import { spawn, execSync, spawnSync } from 'child_process'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

// 设置static目录
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

// 获取当前用户目录
let userRootPath = execSync('echo $HOME').toString().replace(/[\r\n]/g, '')
let walletApplicationSupportPath = `${userRootPath}/Library/Application Support/dochainWallet`
process.env.USER_ROOT_PATH = userRootPath
process.env.WALLET_APPLICATION_SUPPORT_PATH = walletApplicationSupportPath

// 设置默认的数据
let defaultWindow = null
let dochainProcess = null

const winURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9080' : `file://${__dirname}/index.html`

/**
 * 创建默认窗口
 */
function createDefaultWindow () {
  /**
   * Initial window options
   */
  defaultWindow = new BrowserWindow({
    height: 260,
    useContentSize: true,
    width: 400,
    resizable: false
    // transparent: true
    // backgroundColor: '#2e2c29',
    // titleBarStyle: 'hidden-inset',
    // movable: true
  })

  // 设置一下环境变量
  process.env.IS_WALLET_INIT = true

  // 加载页面信息
  defaultWindow.loadURL(winURL)

  // window关闭的时候清空实例
  defaultWindow.on('closed', () => {
    defaultWindow = null
  })
}

/**
 * 应用ready之后
 */
app.on('ready', () => {
  // 创建窗口
  createDefaultWindow()

  // 创建菜单
  const template = [
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'}
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        {role: 'toggledevtools'},
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'close'}
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://electron.atom.io') }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})

/**
 * 窗口全部关闭之后
 */
app.on('window-all-closed', () => {
  if (dochainProcess) {
    dochainProcess.kill('SIGHUP')
  }

  app.quit()
})

/**
 * 应用激活完成
 */
app.on('activate', () => {
  // TODO 需要再看一遍文档
  // if (defaultWindow === null) {
  //   createDefaultWindow()
  // }
})

/**
 * 应用退出
 */
app.on('quit', () => {
  if (dochainProcess) {
    dochainProcess.kill('SIGHUP')
  }
})

/**
 * 当GPU进程崩溃的时候触发
 */
app.on('gpu-process-crashed', () => {
  if (dochainProcess) {
    dochainProcess.kill('SIGHUP')
  }
})

/**
 * 连接区块链
 */
ipcMain.on('dochain-startup', (event, arg) => {
  console.log('dochain-startup start')
  let dochainData0Path = `${userRootPath}/dochain/data0`
  let gethCommandPath = `${walletApplicationSupportPath}/binaries/mac-geth/geth`
  let genesisPath = `${walletApplicationSupportPath}/binaries/mac-geth/genesis.json`

  // 判断用户根目录中是否
  let userRootStdout = execSync('ls ~').toString()
  if (userRootStdout.indexOf('dochain') === -1) {
    let initDochainStdout = spawnSync(gethCommandPath, ['--datadir', dochainData0Path, 'init', genesisPath])
    initDochainStdout = `${initDochainStdout.stderr.toString()}${initDochainStdout.stdout.toString()}`

    // 判断是否初始化成功
    if (initDochainStdout.indexOf('Successfully wrote genesis state') === -1) {
      event.sender.send('dochain-start-result', 'error')
      return true
    }
  }

  // 设置参数信息
  let params = [
    '--identity',
    'itarit',
    '--datadir',
    dochainData0Path,
    '--networkid',
    '3822',
    '--port',
    '30310',
    '--ws',
    '--wsport',
    '8570',
    '--wsaddr',
    '127.0.0.1',
    '--wsapi',
    'db,eth,net,web3,miner,personal,txpool,admin,debug',
    '--wsorigins',
    '*',
    '--bootnodes',
    'enode://7db817b6fae077d8a459bcbcf10c077b9279156ce770f87922eba6a0d12707447a78e785f2e0809632883969df54598076a67ee0114292f852de764b9b27fd78@127.0.0.1:30303'
  ]
  if (!dochainProcess) {
    dochainProcess = spawn(gethCommandPath, params)

    // 正常输出信息
    dochainProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })

    // 错误输出信息
    dochainProcess.stderr.on('data', (data) => {
      if (data.indexOf('opened: ws://127.0.0.1:8570') !== -1) {
        event.sender.send('dochain-start-result', 'success')
      }
      console.log(`stderr: ${data}`)
    })

    // 进程错误信息
    dochainProcess.on('error', (err) => {
      event.sender.send('dochain-start-result', err)
      console.log(`err: ${err}`)
    })
  } else {
    event.sender.send('dochain-start-result', 'success')
  }
})

/**
 * 定义改变window的设置
 */
let walletWindow = null
ipcMain.on('dochain-change-window', (event, arg) => {
  console.log('dochain-change-window change')
  defaultWindow.close()

  // 设置本次打开的窗口不是初始化窗口
  process.env.IS_WALLET_INIT = false
  walletWindow = new BrowserWindow({
    height: 860,
    useContentSize: true,
    width: 1000
  })
  walletWindow.loadURL(winURL)
  walletWindow.once('ready-to-show', () => {
    walletWindow.show()
  })

  walletWindow.on('closed', () => {
    walletWindow = null
  })
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

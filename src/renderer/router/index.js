import Vue from 'vue'
import Router from 'vue-router'
import Init from '@/components/Wallet/Init'
import CreateAccount from '@/components/Wallet/CreateAccount'
import WalletIndex from '@/components/Wallet/Index'
import Send from '@/components/Wallet/Send'
import Receive from '@/components/Wallet/Receive'
import Contract from '@/components/Wallet/Contract'
import AddContract from '@/components/Wallet/AddContract'
import store from '@/store'

Vue.use(Router)

// 设置默认路由
let defaultRoute = {
  path: '/',
  name: 'default',
  component: Init,
  meta: {
    isShowHeader: false
  }
}
if (process.env.IS_WALLET_INIT === 'false') {
  defaultRoute.name = 'accountCreate'
  defaultRoute.component = CreateAccount
}

const router = new Router({
  routes: [
    defaultRoute,
    {
      path: '/wallet/:contract_address?',
      name: 'walletIndex',
      component: WalletIndex,
      meta: {
        isShowHeader: true
      }
    },
    {
      path: '/send',
      name: 'send',
      component: Send,
      meta: {
        isShowHeader: true
      }
    },
    {
      path: '/receive',
      name: 'receive',
      component: Receive,
      meta: {
        isShowHeader: true
      }
    },
    {
      path: '/contract',
      name: 'contract',
      component: Contract,
      meta: {
        isShowHeader: true
      }
    },
    {
      path: '/contract/add',
      name: 'addContract',
      component: AddContract,
      meta: {
        isShowHeader: true
      }
    }
  ]
})

// 默认路由的钩子
router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.isShowHeader)) {
    store.dispatch('showHeader')
    store.dispatch('getDefaultAccounts')
      .then(result => {
        next()
      })
  } else {
    console.log('hideHeader')
    store.dispatch('hideHeader')
    next()
  }
})

export default router

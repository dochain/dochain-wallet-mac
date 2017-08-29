<template>
<div class="state-app_setup ng-scope init-wallet">
  <div class="row init-wallet">
    <div class="col-md-6 col-md-offset-3 col-sm-12 col-xs-12">
      <div class="appWrapper">
        <div class="init-logo"><img src="../../assets/logo1.png" width="100px" height="100px"></div>
        <h2 class="pageTitle ng-binding init-title" v-if="initWalletStatus == 'WALLET_INIT'">钱包初始化开始</h2>
        <h2 class="pageTitle ng-binding init-title" v-else-if="initWalletStatus == 'DOWNLOAD_BINARIES'">正在下载资源库信息...</h2>
        <h2 class="pageTitle ng-binding init-title" v-else-if="initWalletStatus == 'DOWNLOAD_BINARIES_ERROR'">下载资源库失败请确认网络连接</h2>
        <h2 class="pageTitle ng-binding init-title" v-else-if="initWalletStatus == 'GETH_CONNECTING'">正在启动客户端...</h2>
        <h2 class="pageTitle ng-binding init-title" v-else-if="initWalletStatus == 'GETH_CONNECT_FAILED'">客户端启动失败请重新打开应用</h2>
        <h2 class="pageTitle ng-binding init-title" v-else-if="initWalletStatus == 'WEB3_CONNECTING'">正在连接客户端...</h2>
        <h2 class="pageTitle ng-binding init-title" v-else-if="initWalletStatus == 'WEB3_CONNECT_SUCCEED'">客户端连接成功</h2>
        <h2 class="pageTitle ng-binding init-title" v-else-if="initWalletStatus == 'WEB3_CONNECT_FAILED'">客户端连接失败</h2>
        <h2 class="pageTitle ng-binding init-title" v-else-if="initWalletStatus == 'NODES_CONNECTING'">正在连接节点...</h2>
        <h2 class="pageTitle ng-binding init-title" v-else-if="initWalletStatus == 'NODES_CONNECT_SUCCEED'">节点连接成功</h2>
        <h3 class="pageTitle ng-binding init-title" v-if="initWalletStatus == 'NODES_CONNECT_SUCCEED'">
           <a href="#" class="init-sub-title" @click.prevent="intoWallet">进入钱包</a>
        </h3>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import { ipcRenderer } from 'electron'

export default {
  name: 'init',
  computed: {
    ...mapGetters([
      'isGethConnected',
      'isWeb3Connected',
      'initWalletStatus'
    ])
  },
  methods: {
    intoWallet () {
      // 改变window设置
      ipcRenderer.send('dochain-change-window')
    }
  },
  created () {
    this.$store.dispatch('init')
  }
}
</script>

<style scoped>
.init-wallet {
  /*background-color: #2e9ad0;*/
  background-image: url(../../assets/init-backgournd3.png);
  background-repeat:no-repeat;
}
.init-title {
  text-align: center;
  color: #fff;
}
.init-logo {
  text-align: center;
}
.init-sub-title {
  color: #fff;
}
</style>

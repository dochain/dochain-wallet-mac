<template>
  <div class="appContainer container">
    <component-left-menu></component-left-menu>
    <div class="appRightCol" style="padding-left:0px;">
      <component-balance></component-balance>
      <div class="appBody">
        <div class="appBodyContainer ng-scope">
          <div class="txList ng-scope">
            <div class="ng-scope">
              <div class="ng-isolate-scope">
                <div class="text-center ng-scope" >
                  <div class="ng-scope">
                    <div class="noTransactions" v-show="(!isLoading && !contractList)">
                      <i class="bticon bticon-doc-text"></i>
                      <h1 class="ng-binding">
                        尚无记录
                      </h1>
                    </div>
                    <div class="table-responsive" v-if="(!isLoading && contractList)">
                      <table class="table table-hover">
                        <thead>
                        <tr>
                          <th>address</th>
                          <th>amount</th>
                          <th>units</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="contract in contractList">
                          <td class="text-left"><router-link :to ="{name: 'walletIndex', params: { contract_address: contract.address}}">{{contract.address}}</router-link></td>
                          <td class="text-left">{{contract.amount}}</td>
                          <td class="text-left">无</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div class="text-center loadingSpinner ng-scope" v-show="isLoading">
                  <div class="loading-spinner loading-spinner-">
                    <div class="loading loading-0"></div>
                    <div class="loading loading-1"></div>
                    <div class="loading loading-2"></div>
                  </div>
                  <router-link :to="{ name: 'addContract'}">添加</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import LeftMenu from '@/components/Wallet/LeftMenu'
  import Balance from '@/components/Wallet/Balance'
  import { mapGetters } from 'vuex'
  export default {
    name: 'wallet_contract',
    components: {
      'component-left-menu': LeftMenu,
      'component-balance': Balance
    },
    computed: {
      ...mapGetters([
        'isLoading',
        'contractList'
      ])
    },
    created () {
      // 设置左侧菜单
      this.$store.dispatch('changeLeftMenu', 'contract')
      this.$store.dispatch('getDefaultAccounts')
      // 获取交易列表
      this.$store.dispatch('showLoading')
      this.$store.dispatch('getContractList')
        .then(() => {
          this.$store.dispatch('hideLoading')
          console.log(this.contractList)
        })
    }
  }
</script>

<style>
  .container {
    width: 100% !important;
  }
</style>

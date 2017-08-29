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
                    <div class="noTransactions" v-show="(!isLoading && !transactionList)">
                      <i class="bticon bticon-doc-text"></i>
                      <h1 class="ng-binding">
                        尚无交易
                      </h1>
                      <h2 class="sentence-case ng-binding">
                        开始于
                        <router-link class="ng-binding" to="/receive">
                          为您的钱包注资
                        </router-link>
                      </h2>
                    </div>
                    <div class="table-responsive" v-if="(!isLoading && transactionList)">
                      <table class="table table-hover">
                        <thead>
                        <tr>
                          <th>txHash</th>
                          <th>from</th>
                          <th>to</th>
                          <th>金额(DOC)</th>
                          <th>花费(DOC)</th>
                          <th>时间</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="transaction in transactionList">
                          <td class="text-left">{{transaction.hash}}</td>
                          <td class="text-left">{{transaction.from}}</td>
                          <td class="text-left">{{transaction.to}}  <span class="label label-danger" v-if="transaction.is_contract">contract</span></td>
                          <td class="text-left">
                            <span class="label label-success">+{{transaction.value|conversionEth}}</span>
                          </td>
                          <td class="text-left">{{transaction.gasPrice * transaction.gas|conversionEth}}</td>
                          <td class="text-left">{{transaction.createdAt|formatTimestamp}}</td>
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
    name: 'wallet_index',
    components: {
      'component-left-menu': LeftMenu,
      'component-balance': Balance
    },
    computed: {
      ...mapGetters([
        'isLoading',
        'transactionList'
      ])
    },
    created () {
      // 设置左侧菜单
      this.$store.dispatch('changeLeftMenu', 'index')
      this.$store.dispatch('getDefaultAccounts')
      // 获取交易列表
      this.$store.dispatch('showLoading')
      this.$store.dispatch('getTransactionList', this.$route.params.contract_address)
        .then(() => {
          this.$store.dispatch('hideLoading')
        })
    }
  }
</script>

<style>
  .container {
    width: 100% !important;
  }
</style>

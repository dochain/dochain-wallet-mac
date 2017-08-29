<template>
  <div class="appContainer container">
    <component-left-menu></component-left-menu>
    <div class="appRightCol" style="padding-left:0px;">
      <component-balance></component-balance>
      <div class="appBody">
        <div class="appBodyContainer ng-scope" ui-view="mainView">
          <div class="appPage ng-scope">
            <div class="ng-scope">
              <form class="form ng-pristine ng-invalid ng-invalid-required" name="addContractForm" novalidate="" @submit.prevent="addContract()" data-vv-scope="confirmInputForm">
                <div class="row">
                  <div class="col-xs-12">
                    <div class="form-group form-group-lg" :class="{'has-error': (errors.has('confirmInputForm.initialAmount')) }">
                      <label class="control-label" for="initialAmount">
                        <span class="sentence-case ng-binding">初始金额</span>
                      </label>
                      <input
                              data-vv-as="初始金额"
                              type="text"
                              placeholder="输入初始金额"
                              class="form-control"
                              name="initialAmount"
                              v-validate="'required'"
                              v-model="formData.initialAmount"
                      >
                      <span class="help help-block text-danger" v-show="errors.has('confirmInputForm.initialAmount')">
                      {{ errors.first('confirmInputForm.initialAmount') }}
                    </span>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-xs-12">
                    <div class="form-group form-group-lg" :class="{'has-error': (errors.has('confirmInputForm.tokenName')) }">
                      <label class="control-label" for="tokenName">
                        <span class="sentence-case ng-binding">代币名称</span>
                      </label>
                      <input
                              data-vv-as="代币名称"
                              type="text"
                              placeholder="输入代币名称"
                              class="form-control"
                              name="tokenName"
                              v-validate="'required'"
                              v-model="formData.tokenName"
                      >
                      <span class="help help-block text-danger" v-show="errors.has('confirmInputForm.tokenName')">
                      {{ errors.first('confirmInputForm.tokenName') }}
                    </span>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-xs-12">
                    <div class="form-group form-group-lg" :class="{'has-error': (errors.has('confirmInputForm.decimalUnits')) }">
                      <label class="control-label" for="decimalUnits">
                        <span class="sentence-case ng-binding">保留小数</span>
                      </label>
                      <input
                              data-vv-as="保留小数"
                              type="text"
                              placeholder="输入保留小数"
                              class="form-control"
                              name="decimalUnits"
                              v-validate="'required'"
                              v-model="formData.decimalUnits"
                      >
                      <span class="help help-block text-danger" v-show="errors.has('confirmInputForm.decimalUnits')">
                      {{ errors.first('confirmInputForm.decimalUnits') }}
                    </span>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-xs-12">
                    <div class="form-group form-group-lg" :class="{'has-error': (errors.has('confirmInputForm.tokenSymbol')) }">
                      <label class="control-label" for="tokenSymbol">
                        <span class="sentence-case ng-binding">代币符号</span>
                      </label>
                      <input
                              data-vv-as="代币符号"
                              type="text"
                              placeholder="输入代币符号"
                              class="form-control"
                              name="tokenSymbol"
                              v-validate="'required'"
                              v-model="formData.tokenSymbol"
                      >
                      <span class="help help-block text-danger" v-show="errors.has('confirmInputForm.tokenSymbol')">
                      {{ errors.first('confirmInputForm.tokenSymbol') }}
                    </span>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-xs-12">
                    <div class="form-group form-group-lg form-group-buttons">
                      <button class="btn btn-lg btn-primary" type="submit" v-show="!createContractLoading">
                        <span class="ng-binding">&nbsp;&nbsp; 发送 &nbsp;&nbsp;</span>
                      </button>
                      <div class="loading-spinner loading-spinner-" v-show="createContractLoading">
                        <div class="loading loading-0"></div>
                        <div class="loading loading-1"></div>
                        <div class="loading loading-2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
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
    data () {
      return {
        formData: {
          initialAmount: 0,
          tokenName: ''
        }
      }
    },
    computed: {
      ...mapGetters([
        'createContractLoading',
        'contractList'
      ])
    },
    methods: {
      addContract () {
        this.$validator.validateAll('addContractForm').then(result => {
          console.log(this.formData)
          this.$store.dispatch('showAddContractLoading')
          this.$store.dispatch('createContract', this.formData)
            .then(result => {
              this.$store.dispatch('hideAddContractLoading')
            })
        })
      }
    },
    created () {
      // 设置左侧菜单
      this.$store.dispatch('changeLeftMenu', 'contract')
      this.$store.dispatch('getDefaultAccounts')
    }
  }
</script>

<style>
  .container {
    width: 100% !important;
  }
</style>

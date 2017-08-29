<template>
  <div class="appContainer container">
  <component-left-menu></component-left-menu>
  <div class="appRightCol" style="padding-left:0px;">
  <component-balance></component-balance>
  <div class="appBody" id="appBody">
    <!-- uiView: mainView -->
    <div class="appBodyContainer ng-scope" ui-view="mainView">
      <div class="appPage ng-scope">

        <form class="form ng-pristine ng-valid ng-valid-min ng-valid-required" name="sendInputForm" novalidate="" ng-init="showQR=false">
          <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">
              <div class="form-group form-group-lg">
                <label class="control-label ng-binding">地址</label>
                <p class="address ng-binding">{{defaultAccount}}</p>
                <span class="help-block ng-binding">已为您创建了一个新的比特币地址。请使用此地址接收资金</span>
              </div>
            </div>
      </div>
      </form>
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
  name: 'wallet_receive',
  components: {
    'component-left-menu': LeftMenu,
    'component-balance': Balance
  },
  computed: {
    ...mapGetters([
      'defaultAccount'
    ])
  },
  created () {
    this.$store.dispatch('changeLeftMenu', 'receive')
  }
}
</script>

<style>
.container {
  width: 100% !important;
}
</style>

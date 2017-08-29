<template>
<div class="state-app_setup container ng-scope">
  <div class="row">
    <div class="col-md-6 col-md-offset-3 col-sm-12 col-xs-12">
      <div class="appWrapper">
        <h1 class="pageTitle ng-binding">创建账号</h1>
        <div class="formContainer">
          <form name="loginForm" class="form ng-pristine ng-invalid ng-invalid-required" @submit.prevent="createAccount()">
            <div class="form-group form-group-lg" :class="{'has-error': (errors.has('password')) }">
              <label class="control-label ng-binding">密码</label>
              <input
                data-vv-as="密码"
                name="password"
                v-validate="'required|max:16|min:6'"
                class="form-control"
                type="password"
                placeholder="密码"
                v-model="user.password"
              >
              <div class="help-block ng-scope" v-show="errors.has('password')">
                  <div class="ng-binding ng-scope">{{ errors.first('password') }}</div>
              </div>
            </div>
            <div class="form-group form-group-lg form-group-buttons ng-scope" v-show="!isLoading">
                <button type="submit" class="form-control btn btn-primary ng-binding">创建</button>
            </div>
            <div class="ng-binding ng-scope" v-show="isLoading">
                <div class="loading-spinner loading-spinner-">
                    <div class="loading loading-0"></div>
                    <div class="loading loading-1"></div>
                    <div class="loading loading-2"></div>
                </div>
                正在登录
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'createAccount',
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  computed: mapGetters([
    'isLoading'
  ]),
  methods: {
    createAccount () {
      this.$validator.validateAll().then(result => {
        if (result) {
          // 显示loading
          this.$store.dispatch('showLoading')
          this.$store.dispatch('createAccount', this.user)
            .then((result) => {
              console.log(`new account:${result}`)
              // 隐藏loading
              this.$store.dispatch('hideLoading')
              // 页面跳转
              this.$router.push('/wallet')
            })
            .catch(errorResult => {
              alert(`创建账户失败${errorResult}`)
            })
        }
      })
    }
  },
  created () {
    this.$store.dispatch('getDefaultAccounts')
      .then((result) => {
        if (result) {
          this.$router.push('/wallet')
        }
      })
  }
}
</script>

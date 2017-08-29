<template>
<div class="bodyViewContainer ng-scope">
  <div class="ng-scope">
    <component-header></component-header>
  </div>
  <div class="appWrapper ng-scope">
      <router-view></router-view>
  </div>
</div>
</template>

<script>
import Header from '@/components/Header'

export default {
  name: 'app',
  components: {
    'component-header': Header
  },
  created () {
    console.log('App vue 准备完成')
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

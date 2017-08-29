<template>
<nav class="navbar ng-scope" v-if="isShowHeader">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle">
        <i class="bticon  bticon-arrow-down-circle-o"></i>
      </button>
      <a class="navbar-brand" href=""><img src="../assets/Dochain-w84b.png"></a>
    </div>
  </div>
</nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'header',
  computed: mapGetters([
    'isShowHeader'
  ])
}
</script>

<style>
.navbar .navbar-header {
  width: 100% !important;
}
</style>

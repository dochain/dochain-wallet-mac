<template>
<footer class="footer ng-scope" v-show="!currentUser">
  <div class="container">
  </div>
</footer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'footer',
  computed: mapGetters([
    'currentUser'
  ])
}
</script>

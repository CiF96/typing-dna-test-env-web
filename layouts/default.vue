<template>
  <div class="py-16">
    <navbar />
    <Nuxt />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import navbar from '~/components/Navbar.vue'

export default Vue.extend({
  components: {
    navbar,
  },
})
</script>

<template>
  <div>
    <top-bar />
    <div class="wrapper">
      <router-view class="pt-5 mt-2"></router-view>
    </div>    
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { TopBar } from '@/components/UI'

  export default Vue.extend({
    name: 'roster',
    components: { TopBar },
    computed: {
      pilots: function () {
        return this.$store.getters.getAllPilots
      }
    },
    created: function () {
      this.$store.dispatch('setDatapath', Vue.prototype.userDataPath)
      this.$store.dispatch('loadAllPilots')
      this.$store.dispatch('loadData')
      this.$store.dispatch('loadBrews')
      this.$store.dispatch('buildLicenses')
    }
  })
</script>

<style scoped>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { 
    overflow: hidden;
  }

  .wrapper {
    display: flex;
    width: 100%;
  }
</style>


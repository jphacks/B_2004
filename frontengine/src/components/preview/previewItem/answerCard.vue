<template>
    <div><b-card class=""><slot></slot></b-card></div>
</template>

<script>
import BootstrapVue, { BCard } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vue from 'vue/dist/vue.esm.js'

export default {
  components: {
    BCard
  }
}
</script>

<style scoped>
.sizeing {
    width: 300px;
    color: blue;
}
</style>

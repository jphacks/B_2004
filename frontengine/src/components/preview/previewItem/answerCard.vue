<template>
    <b-card @click="action" :id="'answerCard'"><slot></slot></b-card>
</template>

<script>
import BootstrapVue, { BCard } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vue from 'vue/dist/vue.esm.js'

export default {
  name: "AnswerCard",
  components: {
    BCard
  },
  methods: {
    action: function (...params) {
      this.$emit('click', ...params)
    }
  }
}
</script>

<style scoped>
.defaultClass {
  width: 0px;
  height: 0px;
}
</style>

<template>
  <div class="b-card">
    <b-card bg-variant="white" text-variant="black" class="text-left">
      <h2>{{problemNumber}}</h2>
      <b-card-text>{{problemStatement}}</b-card-text>
      <router-link to="/problemDetail">この問題を解く</router-link>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'ProblemCard',
  props: {
    problemNumber: String,
    problemStatement: String
  }
}
</script>

<style scoped>
.b-card {
  margin: 40px 40px 40px;
}
</style>

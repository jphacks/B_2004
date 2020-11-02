<template>
  <div class="b-card">
    <b-card bg-variant="white" text-variant="black" class="text-left">
      <b-card-header header-bg-variant="success">
        <h1>{{problemNumber}}</h1>
      </b-card-header>
      <b-card-body>
        <b-card-text>{{problemStatement}}</b-card-text>
        <router-link :to="{name: 'ProblemDetail', params: {examId: problemId}}">この問題を解く</router-link>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'ProblemCard',
  props: {
    problemNumber: String,
    problemStatement: String,
    problemId: String
  }
}
</script>

<style scoped>
.b-card {
  margin: 40px 40px 40px;
}
</style>

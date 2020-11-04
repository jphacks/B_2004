<template>
  <div class="b-card">
    <b-card bg-variant="white" text-variant="black" class="text-center">
      <b-card-header header-bg-variant="warning">
        <b-card-text>期待される出力：{{expectation}}</b-card-text>
      </b-card-header>
      <b-card-body>
        <b-card-text>あなたの出力：{{yourAnswer}}</b-card-text>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'OutputCard',
  props: {
    expectation: String,
    yourAnswer: String
  }
}
</script>

<style scoped>
.b-card {
  margin: 40px 40px 40px;
}
</style>

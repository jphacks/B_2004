<template>
  <div class="b-card">
    <b-card bg-variant="white" text-variant="black" class="text-center">
      <b-card-header header-bg-variant="warning">
        <b-card-text>テストケースNo.{{testCaseNumber}}</b-card-text>
      </b-card-header>
      <b-card-body>
        <b-card-text>{{judgment}}</b-card-text>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'ResultCard',
  props: {
    testCaseNumber: String,
    judgment: String
  }
}
</script>

<style scoped>
.b-card {
  margin: 40px 40px 40px;
}
</style>

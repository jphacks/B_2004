<template>
    <b-card bg-variant="white" text-variant="black" class="text-center">
      <b-card-body>
        <b-card-text>問題本文<br /></b-card-text>
        <b-card-text>{{ this.$route.params.context ? this.$route.params.context : "" }}</b-card-text>
      </b-card-body>
    </b-card>
</template>

<script>
export default {
  name: "Exam5Detail"
}
</script>

<style scoped>
.problemArea {
  margin: 40px 40px 40px;
}
.b-buttonArea {
  text-align: center;
}
.b-card {
  border: solid 0.5px gray;
  margin: auto;
}
.detail-buttons {
  display: flex;
}
</style>

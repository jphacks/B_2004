<template>
  <div class="b-card" v-if="this.exams">
    <h1>aaaaa</h1>
    <b-card bg-variant="white" text-variant="black" class="text-center">
      <b-card-body>
        <b-card-text>問題名：{{ this.exams.name ? this.exams.name : "" }}<br /></b-card-text>
        <b-card-text>難易度：{{ this.exams.diff ? this.exams.diff : "" }}<br /></b-card-text>
        <router-link
          :to="{ name: 'Exam5Detail', params: { examId: exams.name, context: exams.body } }"
          >参加登録</router-link
        >
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "Exam5Card",
  data () {
    return {
      // checkTime: ""
    }
  },
  props: {
    exams: Object
  }
}
</script>

<style scoped>
.b-card {
  border: 0.5px solid gray;
  margin: 10px 10px;
}
</style>

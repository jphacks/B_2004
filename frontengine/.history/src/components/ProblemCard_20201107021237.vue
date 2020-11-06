<template>
  <div class="b-card">
    <b-card bg-variant="white" text-variant="black" class="text-center">
      <b-card-body>
        <h4>{{problemNumber}}</h4>
        <b-card-text>{{problemStatement}}</b-card-text>
        <!--<b-card-text>{{ getLoginId }}</b-card-text>-->
        <b-card-text>難易度：{{ exam.difficult }}<br>この問題はソートを行う問題です。是非参加してみてください。</b-card-text>
        <router-link :to="{name: 'ProblemDetail', params: {examId: problemId}}" @click.native="chk()">参加登録</router-link>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import firebase from 'firebase'
export default {
  name: 'ProblemCard',
  props: {
    problemNumber: String,
    problemStatement: String,
    problemId: String,
    exam: Object
  },
  methods: {
    chk () {
      firebase.firestore().collection('users').doc(this.getLoginId).collection('join').doc(this.problemId).set({
        difficult: this.exam.difficult,
        name: this.exam.name
        // startAt: this.exam.startAt
      })
    }
  },
  computed: {
    ...mapGetters(['getUserId']),
    getLoginId () {
      console.log('check', this.getUserId)
      return this.getUserId
    },
    viewExam () {
      if (this.exam || 0) {
        return this.exam.difficult
      } else return null
    }
  }
}
</script>

<style scoped>
.b-card {
  border: 0.5px ridge gray;
  margin: 10px 10px ;
}
</style>

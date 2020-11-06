<template>
  <div class="b-card">
    <b-card bg-variant="white" text-variant="black" class="text-left">
      <b-card-body>
        <h1>{{problemNumber}}</h1>
        <b-card-text>{{problemStatement}}</b-card-text>
        <b-card-text>{{ getLoginId }}</b-card-text>
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
    }

  }
}
</script>

<style scoped>
.b-card {
  margin: 40px 40px 40px;
}
</style>

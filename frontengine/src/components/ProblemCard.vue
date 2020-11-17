<template>
  <div class="b-card" v-if="this.exam">
    <b-card bg-variant="white" text-variant="black" class="text-center">
      <b-card-body>
        <h4>{{ this.exam ? this.exam.name : "" }}</h4>
        <b-card-text>{{ problemStatement }}</b-card-text>
        <!--<b-card-text>{{ getLoginId }}</b-card-text>-->
        <b-card-text>難易度：{{ viewExam }}<br /></b-card-text>
        <router-link
          :to="{ name: 'ProblemDetail', params: { examId: problemId } }"
          @click.native="setExamInfo()"
          >参加登録</router-link
        >
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import firebase from "firebase"
import moment from "moment"
export default {
  name: "ProblemCard",
  data () {
    return {
      // checkTime: ""
    }
  },
  props: {
    problemNumber: String,
    problemStatement: String,
    problemId: String,
    exam: Object
  },
  methods: {
    setExamInfo: function () {
      const self = this
      firebase
        .firestore()
        .collection("users")
        .doc(this.getLoginId)
        .collection("join")
        .doc(this.problemId)
        .get()
        .then(function (doc) {
          console.log("checkstartat", doc.data().startAt)
          if (!doc.data().startAt) {
            console.log("kiteruyo")
            firebase
              .firestore()
              .collection("users")
              .doc(self.getLoginId)
              .collection("join")
              .doc(self.problemId)
              .update({
                difficult: self.exam.difficult,
                name: self.exam.name,
                startAt: firebase.firestore.Timestamp.fromDate(new Date())
              })
          }
        })
      // console.log("checkTjfwejfopwkjo")
    }
  },
  computed: {
    ...mapGetters(["getUserId"]),
    getLoginId () {
      console.log("check", this.getUserId)
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
  border: 0.5px solid gray;
  margin: 10px 10px;
}
</style>

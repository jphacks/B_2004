<template>
  <div class="b-card" v-if="this.exam">
    <b-card bg-variant="white" text-variant="black" class="text-center">
      <b-card-body>
        <h4>{{ this.exam ? this.exam.name : "" }}</h4>
        <b-card-text>{{ problemStatement }}</b-card-text>
        <!--<b-card-text>{{ getLoginId }}</b-card-text>-->
        <b-card-text>難易度：{{ this.exam.rating ? Math.floor(this.exam.rating) + "±" + Math.floor(this.exam.ratingDiviation * 3) : "" }}<br /></b-card-text>
        <b-card-text>平均解答時間：{{ this.exam.aveSolveTime ? viewTime() : "" }}<br /></b-card-text>
        <b-card-text>正答率：{{ this.exam.kaisuu ? (this.exam.winNum/this.exam.kaisuu) * 100 + "%" : "0%" }}<br /></b-card-text>
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
    viewTime: function () {
      let solTime = moment(this.exam.aveSolveTime)
      console.log("ABCDEFG", solTime.hour())
      let diffHours = Math.floor(solTime / (1000 * 3600))
      let diffMinutes = Math.floor((solTime / (1000 * 60)) % 60)
      let diffSeconds = Math.floor((solTime / (1000)) % 60)
      if (!diffHours || 0) {
        return diffMinutes + "分"
      }
      return diffHours + "時間" + diffMinutes + "分" + diffSeconds + "秒"
    },
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
          // console.log("checkstartat", doc.data().startAt)
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

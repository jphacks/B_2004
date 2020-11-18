<template>
  <div class="problemResult">
    <h1>結果</h1>
    <span>
      <h3>今回の結果はこちら：{{ name }}</h3>
      <!-- {{ userInfo.challenged }} <br>
      {{ this.problemInfo.rating }} -->
      {{ userInfo.challenged }}
    </span>
    <div v-if="output.length > 0">
      <b-container class="bv-example-row">
        <b-row cols="2" cols-sm="1" cols-md="1" cols-lg="2">
          <b-col>
            <ul id="example-1">
              <ResultCard
                v-for="(item, index) in keys"
                :key="index"
                :testCaseNumber="index"
                :judgment="item.enter"
                :reasons="item.detail"
              />
            </ul>
          </b-col>
          <b-col>
            <ul id="example-2">
              <OutputCard
                v-for="(item, index) in output"
                :key="index"
                :expectation="item.expectations"
                :yourAnswer="item.status"
              />
            </ul>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <div v-else>
      <span>読み込み中....</span>
      <span v-if="reloadTime === 0"
        ><b-button @click="reload()">リロード</b-button></span
      >
      <span v-else
        ><b-button>リロード: wait{{ reloadTime }}</b-button></span
      >
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from "firebase"
import { mapActions, mapGetters } from "vuex"
import ResultCard from "@/components/ResultCard.vue"
import OutputCard from "@/components/OutputCard.vue"
export default {
  name: "ProblemResult",
  components: {
    ResultCard,
    OutputCard
  },
  data () {
    return {
      examId: this.$route.params.examId,
      result: [],
      output: [],
      keys: [],
      name: "",
      reloadTime: 0,
      userStatus: true,
      userNewRating: {},
      problemNewRating: {},
      problemInfo: {},
      userInfo: {}
      // ユーザーが解けたと仮定、これを！すれば問題に対しての勝ち負けになる。
    }
  },
  mounted: function () {
    const self = this
    let userInfo = {}
    let promise = new Promise((resolve, reject) => {
      this.problemInfo = this.getExam
      resolve()
    })
    promise.then(() => {
      console.log("AAAAAAAA")
      return this.getUserInfo()
    }).then(() => {
      // console.log("FFFFFFFF", this.userInfo)
      return this.getUserFlag()
    }).then(() => {
      console.log("BBBBBB", this.userInfo)
      console.log("CCCCCCCCCC")
      return this.culcRateUser()
    }).then(() => {
      console.log("DDDDDDDD")
      return this.culcRateProblem()
    }).then(() => {
      return this.setNewExamRate()
    }).then(() => {
      console.log("FFFFFFFF")
      if (!self.userInfo.challenged) {
        console.log("EEEEEEE", self.userInfo.challenged)
        return this.setNewUserRate()
      }
    }).catch(() => { // エラーハンドリング
      console.error('Something wrong!')
    })
    this.testCase()
    console.log("param", this.$route.params)
    if (this.$route.params.resOutput) {
      this.output = this.$route.params.resOutput.data
    } else {
      this.getResult()
    }
    console.log("output", this.output, this.keys)
  },
  props: {
    // examId: String,
    status: String,
    reason: String
  },
  methods: {
    reload: function () {
      this.getResult()
      this.testCase()
      this.reloadTime = 5
      this.countDown()
    },
    countDown: function () {
      if (this.reloadTime > 0) {
        setTimeout(() => {
          this.reloadTime -= 1
          this.countDown()
        }, 1000)
      }
    },
    getResult: function () {
      console.log("info", this.$route.params.examId)
      const output = []
      return firebase
        .firestore()
        .collection("exams")
        .doc(this.$route.params.examId)
        .collection("users")
        .doc(this.getLoginId)
        .get()
        .then((ss) => {
          const getData = ss.data()
          console.log("outputdata", getData)
          this.output = getData.output
        })
    },
    testCase: function () {
      const output = []
      return firebase
        .firestore()
        .collection("exams")
        .doc(this.$route.params.examId)
        .get()
        .then((ss) => {
          this.keys = ss.data().examInfo.testCases
          this.name = ss.data().name
          console.log("outputaa", this.keys)
        })
    },
    getUserInfo: function () {
      const userId = this.getLoginId
      const self = this
      return firebase
        .firestore()
        .collection("users")
        .doc(String(userId))
        .get()
        .then(function (doc) {
          let docData = doc.data()
          console.log("DOCDATA", docData)
          self.userInfo = doc.data()
        })
    },
    getUserFlag: function () {
      const userId = this.getLoginId
      const examId = this.examId
      let hantei = false
      const self = this
      firebase
        .firestore()
        .collection("users")
        .doc(String(userId))
        .collection("join")
        .doc(String(examId))
        .get()
        .then(function (doc) {
          const docData = doc.data()
          console.log("kakakakakak", docData.challenged)
          if (!(!docData.challenged)) {
            hantei = true
          }
        })
      if (hantei) {
        this.userInfo.challenged = true
        console.log("ktooooooooooooooota")
      }
    },
    culcRateUser: function () {
      // culcRating
      console.log("totyuukakunin42", this.userInfo)
      const examId = this.examId
      const updateUserRate = {}
      const updateProblemRate = {}
      const self = this
      let rDiff = 0
      let RDdiff = 0
      let seido = 0
      let seidoProblem = 0
      let syoritu = 0
      let yuudo = 0
      let s
      if (!this.userStatus) {
        s = 0
      } else {
        s = 1
      }
      const keisu = Math.log(10) / 400
      /* if (!docData.challenged) {
            console.log("outputgweopgmwepogkwpokgpkaa", docData.challenged)
            return {}
          } */
      console.log("checkstartat", self.userInfo)
      if (!self.userInfo.rating) {
        console.log("kiteruyo", self.userInfo)
        updateUserRate.r = 1500
        updateUserRate.RD = 300
      } else {
        updateUserRate.r = this.userInfo.rating
        updateUserRate.RD = this.userInfo.ratingDiviation
        console.log("ZZZZZZZZZZZ", this.userInfo.challenged)
      }
      console.log("ratehyouzi", updateUserRate.r + updateUserRate.RD)
      // this.updateProblemRate.r = this.getExams[this.examId].rating
      // this.updateProblemRate.RD = this.getExams[this.examId].ratingDiviation
      // 問題について
      updateProblemRate.r = this.problemInfo.rating
      updateProblemRate.RD = this.problemInfo.ratingDiviation
      // バックエンドが治ったらちゃんと引数で受け取るようにする
      // console.log("hyouzi", this.updateProblemRate.r, this.updateProblemRate.RD)
      console.log("hyogsuzi", updateProblemRate)
      console.log("hyogsguzi", updateProblemRate.r, updateProblemRate.RD)
      console.log("hyogsguzi", updateUserRate.r, updateUserRate.RD)
      // ユーザーについて
      seido = 1 / Math.sqrt(1 + (3 / Math.PI ** 2 * keisu * updateUserRate.RD ** 2))
      seidoProblem = 1 / Math.sqrt(1 + (3 / Math.PI ** 2 * keisu * updateProblemRate.RD ** 2))
      syoritu = 1 / (1 + 10 ** seidoProblem * (updateUserRate.r - updateProblemRate.r))
      yuudo = 1 / (keisu ** 2 * seidoProblem ** 2 * syoritu * (1 - syoritu))
      RDdiff = 1 / Math.sqrt(1 / updateUserRate.RD ** 2 + 1 / yuudo)
      rDiff = updateUserRate.r + (keisu * RDdiff ** 2 * seidoProblem * (s - syoritu))
      console.log("miruUser", updateUserRate, updateProblemRate, rDiff, RDdiff)
      this.userNewRating.r = rDiff
      this.userNewRating.RD = RDdiff
      /* firebase
              .firestore()
              .collection("users")
              .doc(String(self.getLoginId))
              .collection("join")
              .doc(String(examId))
              .update({
                rating: rDiff,
                ratingDiviation: RDdiff,
                challenged: true
              }) */
      // ユーザーについて
      // 問題の更新
      // 問題の更新
      // culcRating
    },
    culcRateProblem: function () {
      // culcRating
      const examId = this.examId
      const updateUserRate = {}
      const updateProblemRate = {}
      const self = this
      let rDiff = 0
      let RDdiff = 0
      let seido = 0
      let seidoProblem = 0
      let syoritu = 0
      let yuudo = 0
      let s
      if (!this.userStatus) {
        s = 1
      } else {
        s = 0
      }
      const keisu = Math.log(10) / 400
      /* if (!docData.challenged) {
            console.log("outputgweopgmwepogkwpokgpkaa", docData.challenged)
            return {}
          } */
      console.log("checkstartat", this.userInfo.rating)
      if (!this.userInfo.rating) {
        console.log("kiteruyo", self.examId)
        updateUserRate.r = 1500
        updateUserRate.RD = 300
      } else {
        updateUserRate.r = this.userInfo.rating
        updateUserRate.RD = this.userInfo.ratingDiviation
        // console.log("ratehyouzi", self.updateUserRate.RD)
      }
      console.log("ratehyouzi", updateUserRate.r + updateUserRate.RD)
      // this.updateProblemRate.r = this.getExams[this.examId].rating
      // this.updateProblemRate.RD = this.getExams[this.examId].ratingDiviation
      // 問題について
      updateProblemRate.r = this.problemInfo.rating
      updateProblemRate.RD = this.problemInfo.ratingDiviation
      // バックエンドが治ったらちゃんと引数で受け取るようにする
      // console.log("hyouzi", this.updateProblemRate.r, this.updateProblemRate.RD)
      console.log("hyogsuzi", updateProblemRate)
      // 問題について
      seido = 1 / Math.sqrt(1 + (3 / Math.PI ** 2 * keisu * updateUserRate.RD ** 2))
      seidoProblem = 1 / Math.sqrt(1 + (3 / Math.PI ** 2 * keisu * updateProblemRate.RD ** 2))
      syoritu = 1 / (1 + 10 ** seido * (updateProblemRate.r - updateUserRate.r))
      yuudo = 1 / (keisu ** 2 * seido ** 2 * syoritu * (1 - syoritu))
      RDdiff = 1 / Math.sqrt(1 / updateProblemRate.RD ** 2 + 1 / yuudo)
      rDiff = updateProblemRate.r + (keisu * RDdiff ** 2 * seido * (s - syoritu))
      console.log("miru", updateUserRate, updateProblemRate)
      console.log("ratingExam", rDiff, RDdiff, 1)
      this.problemNewRating.r = rDiff
      this.problemNewRating.RD = RDdiff
      /* firebase
              .firestore()
              .collection("users")
              .doc(String(self.getLoginId))
              .collection("join")
              .doc(String(examId))
              .update({
                rating: rDiff,
                ratingDiviation: RDdiff,
                challenged: true
              }) */
      // ユーザーについて
      // 問題の更新
      // 問題の更新
      // culcRating
    },
    setNewUserRate: function () {
      const userId = this.getLoginId
      const examId = this.examId
      const self = this
      console.log("nanndekounaruno", self.userNewRating)
      firebase
        .firestore()
        .collection("users")
        .doc(String(userId))
        .update({
          rating: self.userNewRating.r,
          ratingDiviation: self.userNewRating.RD
        })
      firebase
        .firestore()
        .collection("users")
        .doc(String(userId))
        .collection("join")
        .doc(String(examId))
        .update({
          challenged: true
        })
    },
    setNewExamRate: function () {
      const userId = this.getLoginId
      const examId = this.examId
      const self = this
      firebase
        .firestore()
        .collection("exams")
        .doc(String(examId))
        .update({
          rating: self.problemNewRating.r,
          ratingDiviation: self.problemNewRating.RD
        })
    }
  },
  computed: {
    ...mapGetters(["getExams", "getUserId"]),
    getText () {
      return "''"
    },
    getExam () {
      // const examId = this.$route.params.examId
      console.log("getExam", this.examId, this.getExams)
      if (!this.getExams || !this.getExams[this.examId]) {
        return { name: "testmodea" }
      }
      return this.getExams[this.examId]
    },
    getLoginId () {
      console.log("check", this.getUserId)
      return this.getUserId
    }
  }
}
</script>

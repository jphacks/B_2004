<template>
  <b-container class="bv-example-row">
    <b-row>
      <h2>e</h2>
      <!-- {{ Object.keys(this.userRate) }} -->
      <div v-if="this.flag">
        <rate-chart
          class="ratechart"
          :datas="this.setTate"
          :label="this.setYoko"
        />
      </div>
    </b-row>
  </b-container>
</template>

<script>
import { LayoutPlugin } from "bootstrap-vue"
import firebase from "firebase"
import { mapActions, mapGetters } from "vuex"
import moment from "moment"
import RateChart from "./RateChart.vue"
export default {
  components: { RateChart },
  name: "chartrate",
  data () {
    return {
      setTate: [],
      setYoko: [],
      userRate: [],
      flag: false
    }
  },
  created: function () {
    let promise = new Promise((resolve, reject) => {
      resolve(this.getResult())
    })
    promise
      .then((data) => {
        // console.log('Something wrong!', this.userRate)
        return this.setRate()
      })
      .catch(() => {
        // エラーハンドリング
        console.error("Something wrong!")
      })
  },
  mounted: function () {},
  methods: {
    getResult: function () {
      return firebase
        .firestore()
        .collection("users")
        .doc(this.getLoginId)
        .collection("rate")
        .orderBy("time")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const output = {}
            output.rating = doc.data().rating
            output.ratingDiviation = doc.data().ratingDiviation
            output.time = doc.data().time
            this.userRate[doc.id] = output
          })
          console.log("ou777tputdata", this.userRate)
          // console.log("jijfiowejop77777", this.setYoko, this.setTate)
        })
    },
    setRate: function () {
      const self = this
      const demo = this.userRate
      console.log("jijfiowejop77777", demo)
      Object.values(demo).forEach((data) => {
        let dat = new Date(data.time.toDate())
        let moment2 = moment(dat).format("YYYY年MM月DD日 HH:mm")
        this.setYoko.push(moment2)
        this.setTate.push(Math.floor(data.rating) - 400)
        // console.log("setYOKO", data)
        console.log("SETDAY", moment2)
      })
      console.log("SETTATE", this.setTate, this.setYoko)
      this.flag = true
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

<style scoped>
.userState {
  text-align: left;
}
.userPerform {
  text-align: left;
}
.nameSize {
  padding-top: 25px;
  font-size: 25px;
}
.ratechart {
  padding: 100px;
}
</style>

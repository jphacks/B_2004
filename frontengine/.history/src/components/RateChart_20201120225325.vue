<script>
import { LayoutPlugin } from 'bootstrap-vue'
import firebase from 'firebase'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { Bar } from 'vue-chartjs'
export default {
  extends: Bar,
  name: 'RateChart',
  conponents: {
  },
  data () {
    return {
      userRate: [],
      setTate: [],
      setYoko: [],
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Bar Dataset',
            data: [10, 20, 30, 40, 50, 30],
            // data: Object.values(Object.values(userRate)),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          },
          {
            label: 'Line Dataset',
            data: [10, 50, 20, 30, 30, 40],
            borderColor: '#CFD8DC',
            fill: false,
            type: 'line',
            lineTension: 0.3
          }
        ]
      },
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Month'
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 10
            }
          }]
        }
      }
    }
  },
  mounted: function () {
    // this.renderChart(this.data, this.options)
    let promise = new Promise((resolve, reject) => {
      this.getResult()
      resolve()
    })
    promise.then((data) => {
      console.log('Something wrong!', this.userRate)
      return this.setRate()
    }).then((data) => {
      console.log('Something wrong!', this.userRate)
      this.renderChart(this.data, this.options)
    }).catch(() => { // エラーハンドリング
      console.error('Something wrong!')
    })
  },
  methods: {
    getResult: function () {
      return firebase
        .firestore()
        .collection("users")
        .doc(this.getLoginId)
        .collection("rate")
        .orderBy('time')
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
      console.log("jijfiowejop77777", this.userRate)
      this.userRate.forEach((data) => {
        console.log(data)
        /* this.setYoko[data.id] = data.time
        this.setTate[data.id] = data.rating */
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

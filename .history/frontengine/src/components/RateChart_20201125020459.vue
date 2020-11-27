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
        /* labels: this.setYoko, */
        labels: this.label,
        datasets: [
          {
            label: '更新後のレート',
            data: this.datas,
            backgroundColor: "rgba(50,50,255,0.1)", // グラフの背景色
            borderColor: "rgba(50,50,255,1)", // グラフの線の色
            fill: false,
            type: 'line',
            lineTension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        backgroundColor: "#CCFFFF",
        scales: {
          display: false,
          xAxes: [{
            scaleLabel: {
              type: 'time',
              time: {
                displayFormats: {
                  quarter: 'll',
                  unit: 'month'
                }
              }
            }
          }],
          yAxes: [{
            ticks: {
              max: 3000,
              min: 0,
              stepSize: 100
            }
          }]
        }
      }
    }
  },
  props: {
    datas: Array,
    label: Array
  },
  mounted: function () {
    this.$refs.canvas.width = 900
    // this.$refs.canvas.style.backgroundColor = "#CCFFFF"
    console.log("DOUNANOdOOO", this.$refs.canvas.width)
    this.renderChart(this.data, this.options)
  },
  methods: {
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

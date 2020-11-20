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
      demo1: [
        1500,
        1500,
        1500,
        1523,
        1547
      ],
      demo2: [
        43242,
        432424,
        423423,
        423424,
        423423,
        432423
      ],
      data: {
        /* labels: this.setYoko, */
        labels: this.label,
        datasets: [
          {
            label: 'Line Dataset',
            data: this.datas,
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
  props: {
    datas: Array,
    label: Array,
    test: String
  },
  mounted: function () {
    console.log("DOUNANOsdOOO", this.datas)
    setTimeout(() => {
      this.renderChart(this.data, this.options)
    }, 500)
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

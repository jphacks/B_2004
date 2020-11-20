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
      ]
    }
  },
  props: {
      data: Object,
      option: Object
  },
  mounted: function () {
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

<template>
  <div class="problemResult">
    <h1>結果</h1>
    <span>
      <h3>今回の結果はこちら：{{ name }}</h3>
    </span>
    <b-container class="bv-example-row">
      <b-row cols="2" cols-sm="1" cols-md="1" cols-lg="2">
        <b-col>
          <ul id="example-1">
            <ResultCard v-for="(item, index) in keys" :key="index" :testCaseNumber="index" :judgment="item.enter" :reasons="item.detail"/>
          </ul>
        </b-col>
        <b-col>
          <ul id="example-2">
            <OutputCard v-for="(item, index) in output" :key="index" :expectation="item.expectations" :yourAnswer="item.status"/>
          </ul>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import firebase from 'firebase'
import { mapActions, mapGetters } from 'vuex'
import ResultCard from '@/components/ResultCard.vue'
import OutputCard from '@/components/OutputCard.vue'
export default {
  name: 'ProblemResult',
  components: {
    ResultCard,
    OutputCard
  },
  data () {
    return {
      result: [],
      output: [],
      keys: [],
      name: ''
    }
  },
  mounted: function () {
    this.getResult()
    this.testCase()
    console.log('output', this.output, this.keys)
  },
  props: {
    examId: String,
    status: String,
    reason: String
  },
  methods: {
    getResult: function () {
      console.log('info', this.$route.params.examId)
      const output = []
      return firebase.firestore().collection('exams').doc(this.$route.params.examId).collection('users').doc(this.getLoginId).get().then(ss => {
        const getData = ss.data()
        console.log('outputdata', getData)
        this.output = getData
      })
    },
    testCase: function () {
      const output = []
      return firebase.firestore().collection('exams').doc(this.$route.params.examId).get().then(ss => {
        this.keys = ss.data().examInfo.testCases
        this.name = ss.data().name
        console.log('outputaa', this.keys)
      })
    }
  },
  computed: {
    ...mapGetters(['getExams', 'getUserId']),
    getText () {
      return "''"
    },

    getExam () {
      // const examId = this.$route.params.examId
      console.log('getExam', this.examId, this.getExams)
      if (!this.getExams || !this.getExams[this.examId]) {
        return { name: 'testmode' }
      }
      return this.getExams[this.examId]
    },
    getLoginId () {
      console.log('check', this.getUserId)
      return this.getUserId
    }
  }
}
</script>

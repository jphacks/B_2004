<template>
  <div class="problemResult">
    <h1>結果</h1>
    <span>
      <h3>今回の結果はこちら：{{ getExam ? getExam.name : 'testmode' }}</h3>
    </span>
    <b-container class="bv-example-row">
      <b-row cols="2" cols-sm="1" cols-md="1" cols-lg="2">
        <b-col>
          <ul id="example-1">
            <ResultCard v-for="(item, index) in result" :key="index" :testCaseNumber="item.number" :judgment="item.message" :reasons="item.detail"/>
          </ul>
        </b-col>
        <b-col>
          <ul id="example-2">
            <OutputCard v-for="(item, index) in output" :key="index" :expectation="item.expectations" :yourAnswer="item.answer"/>
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
      result: [
        { number: '1', message: this.status, detail: this.reason },
        { number: '2', message: this.status, detail: this.reason },
        { number: '3', message: this.status, detail: this.reason },
        { number: '4', message: this.status, detail: this.reason },
        { number: '5', message: this.status, detail: this.reason },
        { number: '6', message: this.status, detail: this.reason },
        { number: '7', message: this.status, detail: this.reason },
        { number: '8', message: this.status, detail: this.reason },
        { number: '9', message: this.status, detail: this.reason },
        { number: '10', message: this.status, detail: this.reason }
      ],
      output: []
    }
  },
  mounted: function () {
    this.getResult()
    console.log('output', this.output)
  },
  props: {
    examId: String,
    status: String,
    reason: String
  },
  method: {
    getResult: function () {
      return firebase.firestore().collection('exams').doc(this.$route.params.examId).collection('users').doc(getUserId).get().then(ss => {
        const data = ss.data()
        this.output = ss.data()
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

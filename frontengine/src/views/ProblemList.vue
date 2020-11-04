<template>
  <div class="problemList">
    <h1 >問題一覧</h1>
    {{ getExamViews }}
    <!--<ProblemCard :problemNumber="'No.' + 1" :problemId="'vho02QWOCy9IsjgqhiEG'"/>-->
    <ProblemCard v-for="(problemId, index) in Object.keys(getExams)" :key="index" :problemNumber="'No.' + String(index+1)" :problemId="problemId"/>
  </div>
</template>

<script>
// @ is an alias to /src
import ProblemCard from '@/components/ProblemCard.vue'
import firebase from 'firebase'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ProblemList',
  components: {
    ProblemCard
  },
  data () {
    return {
    }
  },
  mounted: function () {
    this.fetchExams()
  },
  methods: {
    ...mapActions(['fetchExams']),
    onfirebase: function () {
      console.log('check', firebase.firestore())
      firebase.firestore().collection('exams').get().then(snapsshot => {
        console.log('ss', snapsshot)
        snapsshot.forEach(doc => {
          console.log('doc', doc)
        })
      })
    }
  },
  computed: {
    ...mapGetters(['getExams']),
    getExamViews () {
      console.log('this.getExams')
      const self = this
      let output = {}
      output = this.getExams
      return output
    }
    // ex:
    // hogehoge = []
    // hogehoge.push(...[1,2,3,4,5])
    // hogehoge = [1,2,3,4,5]
  },
  watch: {
    getExams: function (data) {
      if (Object.keys(this.data).length === 0) {
        this.fetchExams
      }
    }
  }
}

</script>

<template>
  <div class="problemList" >
    <h1 >問題一覧</h1>
    {{ exams }}
    <!--<ProblemCard :problemNumber="'No.' + 1" :problemId="'vho02QWOCy9IsjgqhiEG'"/>-->
    <div v-if="getExamViews.length !== 0">
      <ProblemCard v-for="(problemId, index) in Object.keys(exams || {})" :key="index" :problemNumber="'No.' + String(index+1)" :problemId="problemId"/>
    </div>
    <div v-else>
      読み込み中...
    </div>
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
      exams: {}
    }
  },
  mounted: function () {
    this.fetchFirebaseExams()
  },
  methods: {
    ...mapActions(['fetchExams', 'setExams']),
    onfirebase: function () {
      console.log('check', firebase.firestore())
      firebase.firestore().collection('exams').get().then(snapsshot => {
        console.log('ss', snapsshot)
        snapsshot.forEach(doc => {
          console.log('doc', doc)
        })
      })
    },
    renderExam: function () {
      if (Object.keys(this.getExams || {}).length === 0) {
        this.fetchExams().then(a => {
          console.log('check', a)
          this.exams = a
        })
      }
    },
    fetchFirebaseExams: function () {
      const output = {}
      return firebase.firestore().collection('exams').get().then(snapsshot => {
        console.log('ss', snapsshot)
        snapsshot.forEach(doc => {
          this.setExams(doc)
          output[doc.id] = doc.data()
        })
        this.exams = output
      })
    }
  },
  computed: {
    ...mapGetters(['getExams']),
    getExamViews () {
      return this.fetchFirebaseExams()
    }
    // ex:
    // hogehoge = []
    // hogehoge.push(...[1,2,3,4,5])
    // hogehoge = [1,2,3,4,5]
  },
  watch: {
    getExamViews: function (o) {
      console.log('chek', o)
    }
  }
}

</script>

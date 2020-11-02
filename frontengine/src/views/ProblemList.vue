<template>
  <div class="problemList">
    <h1 v-on:click="fetchExams()">問題一覧</h1>
    {{ getExamViews }}
    <ProblemCard v-for="(problemId, index) in Object.keys(getExamViews)" :key="index" :problemNumber="'No.' + String(index+1)" :problemId="problemId"/>
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
  mounted: function () {
    firebase.firestore().collection('exams').get().then(snapsshot => {
      console.log('ss', snapsshot)
      snapsshot.forEach(doc => {
        console.log('doc', doc)
      })
    })
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
      return this.getExams
    }
    // ex:
    // hogehoge = []
    // hogehoge.push(...[1,2,3,4,5])
    // hogehoge = [1,2,3,4,5]
  }
}

</script>

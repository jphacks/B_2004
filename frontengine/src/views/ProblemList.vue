<template>
  <div class="problemList" >
    <!--{{ exams }}-->
    <b-container class="bv-example-row">
      <b-row cols="2" cols-sm="1" cols-md="1" cols-lg="2">
        <b-col>
          <br><br><br><br>
          <b-card class="leftList">
            <img alt="frontEngine logo" src="../assets/frontEngineLogo.png">
            <h6><br>右の問題一覧の中から解きたい問題に参加してください。<br>レートが更新されるのは一問につき一度なので注意<br></h6>
            <h6 class="pleaseLogin">※ログインしていないと参加登録できません。</h6>
          </b-card>
        </b-col>
        <b-col>
          <h1>問題一覧</h1>
          <div class="rightList">
            <ProblemCard :problemNumber="'No.' + 'test'" :problemId="'vho02QWOCy9IsjgqhiEG'"/>
            <div v-if="getExamViews.length !== 0">
              <ProblemCard v-for="(problemId, index) in Object.keys(exams || {})" :key="index" :problemNumber="'No.' + String(index+1)" :problemId="problemId" :exam="exams[problemId]" />
            </div>
            <div v-else>
              読み込み中...
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
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
        console.log('exams', this.exams)
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

<style scoped>
.leftList {
  border: 0px ;
  margin: 10px 10px ;
}
.rightList {
  max-height: 800px ;
  overflow-y: scroll ;
  border: solid 0.5px gray;
}
.pleaseLogin {
  color: #ff0000;
}
</style>

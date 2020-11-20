<template>
<b-container class="bv-example-row">
 <b-row>
   <h2>e</h2>
   {{ this.userRate[FtYWid7CXW4F24d4Kpor] }}
  </b-row>
</b-container>
</template>

<script>
import { LayoutPlugin } from 'bootstrap-vue'
import firebase from 'firebase'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'MyProfile',
  conponents: {
  },
  data () {
    return {
      userRate: []
    }
  },
  mounted: function () {
    this.getResult()
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

<style scoped>
.userState {
    text-align: left;
}
.userPerform {
    text-align: left;
}
.nameSize {
    padding-top: 25px;
    font-size: 25px;
}
</style>

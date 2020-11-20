<template>
<b-container class="bv-example-row">
 <b-row>
   <b-col class="userState" >
     <img src="../assets/frontEngineIcon.png">
      <h2 class="nameSize">{{this.getEmailState}}</h2>
     <b>合計 {{ difficultSum }}点</b>
     <br>
  </b-col>
  <b-col class="userPerform" cols="8">
    <h2>実績</h2><br>
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Contest Name</th>
                <th>Score</th>
            </tr>
        </thead>
        <tbody>
          <tr v-for="(examId,index) in Object.keys(userItems || {})" :key="examId" :index="index">
            <td>{{isMoment(userItems[examId].startAt.seconds)}}</td>
            <td>{{userItems[examId].name}}</td>
            <td>{{userItems[examId].difficult}}</td>
          </tr>
        </tbody>
    </table>
    </b-col>
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
    getResult()
  },
  methods: {
    getResult: function () {
      const output = []
      return firebase
        .firestore()
        .collection("users")
        .doc(this.getLoginId)
        .collection("rate")
        .orderBy('time')
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            output[doc.id] = doc.data().rate
          })
          console.log("outputdata", output)
          this.userRate = output
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

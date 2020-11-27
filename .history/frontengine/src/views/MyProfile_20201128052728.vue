<template>
  <b-container class="bv-example-row">
    <b-row>
      <b-col class="userState" >
        <b-img src="../assets/frontEngineIcon.png" width="160" height="160" alt="placeholder"></b-img>
        <h2 class="nameSize">{{this.getEmailState}}</h2>
        <ChangeForm/>
        <div v-if="tootta">
          {{ this.userRate }}
        </div>
        <h1 class="pointStyle">レート {{ "ここに最新のレート" }}</h1>
        <br>
        <div class="performanceTable">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Contest Name</th>
                <th>Time</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(examId,index) in Object.keys(userItems || {})" :key="examId" :index="index">
                <td>{{isMoment(userItems[examId].startAt.seconds)}}</td>
                <td>{{userItems[examId].name}}</td>
                <td>{{setTime(userItems[examId].solveTime)}}</td>
                <td>{{userItems[examId].difficult}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-col>
      <!-- <RatingPage/> -->
      <b-col class="userPerform" cols="8">
        <!-- <h2>実績</h2><br> -->
        <div class="rateCard">
         <RatingPage/>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { LayoutPlugin } from 'bootstrap-vue'
import firebase from 'firebase'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import RatingPage from "@/components/RatingPage.vue"
import ChangeForm from "@/components/ChangeForm.vue"
export default {
  components: {
    RatingPage,
    ChangeForm
  },
  name: 'MyProfile',
  conponents: {
    RatingPage
  },
  data () {
    return {
      userItems: {},
      difficultSum: 0,
      userRate: {},
      tootta: false
    }
  },
  mounted: function () {
    console.log('check', this.fetchFirebaseUsers)
    this.fetchFirebaseUsers()
    this.getResult()
  },
  methods: {
    ...mapActions(['setUserItems']),
    fetchFirebaseUsers: function () {
      const output = {}
      return firebase.firestore().collection('users').doc(this.userId).collection('join').get().then(snapsshot => {
        console.log('ss', snapsshot)
        snapsshot.forEach(doc => {
          console.log('chek', this.users)
          this.setUserItems(doc)
          output[doc.id] = doc.data()
          this.difficultSum += output[doc.id].difficult
        })
        console.log('cc', this.userItems)
        this.userItems = output
      })
    },
    isMoment: function (date) {
      console.log('date', date)
      const momentDAte = moment.unix(date)
      return momentDAte.format('YYYY-MM-DD HH:mm:ssZ')
    },
    setTime: function (date) {
      console.log("f")
      const momentDAte = moment.unix(date)
      return momentDAte.format('H時間mm分')
    },
    getResult: function () {
      return firebase
        .firestore()
        .collection("users")
        .doc(this.getUserId)
        .collection("rate")
        .orderBy("time")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const output = {}
            output.rating = doc.data().rating
            output.ratingDiviation = doc.data().ratingDiviation
            output.time = doc.data().time
            this.userRate[doc.id] = output
          })
          this.tootta = true
          return {}
        })
    }
  },
  computed: {
    ...mapGetters(['getUserId', 'getEmailState']),
    userId: function () {
      console.log('aa', this.getUserId)
      return this.getUserId
    },
    getUserName: function () {
      return this.getEmailState
    }
  }
}
</script>

<style scoped>
.bv-example-row {
    margin-top: 0px;
    margin-left: 50px;
}
.userState {
    text-align: left;
}
.userPerform {
    text-align: left;
}
.nameSize {
    padding-top: 25px;
    font-size: 30px;
}
.pointStyle {
  margin: 0px;
  margin-top: 10px;
  text-align: left;
  font-size: 30px;
  font-weight: bold;
}
.rateCard {
  float: left;
}
</style>

<template>
<b-container class="bv-example-row">
 <b-row>
   <b-col class="userState">
    <h2>南無三</h2>
     <b class="nameSize">{{userItems}}点</b>
     <br>
     <span class="user-aset">{{userItems.join}}</span>
  <img src="../assets/logo.png">
  </b-col>
  <b-col class="userPerform" cols="8">
    <h2>実績</h2><br>
    <b-table striped hover :items="items"></b-table>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import { LayoutPlugin } from 'bootstrap-vue'
import firebase from 'firebase'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'MyProfile',
  conponents: {
  },
  data () {
    return {
      userItems: 100,
      items: [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
        { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
        { age: 38, first_name: 'Jami', last_name: 'Carney' }
      ]
    }
  },
  method: {
    ...mapActions(['setUserItems']),
    fetchFirebaseExams: function () {
      const output = {}
      return firebase.firestore().collection('users').get().then(snapsshot => {
        console.log('ss', snapsshot)
        snapsshot.forEach(doc => {
          this.setUserItems(doc)
          output[doc.id] = doc.data()
        })
        this.users = output
      })
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
    font-size: 50px;
}
</style>

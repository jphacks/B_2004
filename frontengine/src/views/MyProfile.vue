<template>
    <b-container class="bv-example-row">
    <b-tabs pills content-class="mt-3">
      <b-tab title="プロフィール" active>
        <b-row>
          <b-col class="userState">
          <h2>
               <b>{{userItems}}点</b>
                <br>
                <span class="user-aset">{{userName}}</span>
          </h2>
          <img src="../assets/logo.png">
          </b-col>
          <b-col class="userPerform" cols="8">
          <h2>
              <p>実績</p>
              <br>
              <b-table striped hover :items="items"></b-table>
          </h2>
          </b-col>
        </b-row>
      </b-tab>
      <b-tab title="コンテスト実績">
          <b-card-text>Tab contents 2</b-card-text>
        </b-tab>
    </b-tabs>
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
      userItems: {}
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
</style>

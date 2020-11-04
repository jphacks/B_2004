<template>
    <b-container class="bv-example-row">
    <b-tabs pills content-class="mt-3">
      <b-tab title="Tab 1" active>
        <b-row>
          <b-col class="userState">
          <h2>
               <b>{{myRate}}点</b>
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
      <b-tab title="Tab 2">
          <b-card-text>Tab contents 2</b-card-text>
        </b-tab>
    </b-tabs>
    </b-container>
</template>

<script>
import { LayoutPlugin } from 'bootstrap-vue'
export default {
  name: 'MyProfile',
  conponents: {
  },
  data () {
    return {
      myRate: 100,
      userName: '南無三',
      items: [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
        { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
        { age: 38, first_name: 'Jami', last_name: 'Carney' }
      ]
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

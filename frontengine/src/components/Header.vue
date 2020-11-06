<template>
  <div>
  <b-navbar class="b-navbar" toggleable="lg" type="dark">>
    <b-navbar-brand to="/">front Engine</b-navbar-brand>
    <div class="menu">
    <b-navbar-brand class="examList" to="/ProblemList">examList</b-navbar-brand>
    </div>
    <b-navbar-nav class="ml-auto">
      <b-nav-item class="email" @click="myPro"> {{ getEmail }}</b-nav-item>
      <b-nav-item class="ssq" v-if="!getLoginStatus"><LoginButton :loginType="'login'"/></b-nav-item>
      <b-nav-item v-else @click="signOut()">ログアウト</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</div>
</template>

<script>
import LoginButton from './LoginButton.vue'
import firebase from 'firebase'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Header',
  props: {
    msg: String
  },
  components: {
    LoginButton
  },
  methods: {
    ...mapActions(['logOut']),
    signOut: function () {
      firebase.auth().signOut().then(user => {
        console.log('logout', user)
        this.logOut()
      })
    },
    myPro: function () {
      if (this.$route.path !== '/myProfile') {
        this.$router.push('/myProfile')
      }
    }
  },
  computed: {
    ...mapGetters(['getLogin', 'getLoginState', 'getEmailState']),
    getLoginInfo () {
      return this.getLogin
    },
    getLoginStatus () {
      return this.getLoginState
    },
    getEmail () {
      return this.getEmailState
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.b-navbar {
  background-color: #00adb5;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  align-items: right;
  display: inline-block;
  margin: 0 10px;
}
.menu {
  padding-left: 50px;
}
.examList {
}
</style>

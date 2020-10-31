<template>
  <div>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="/">front Engine</b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-nav-item class="ssq"><LoginButton/></b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</div>
</template>

<script>
import LoginButton from './LoginButton.vue'

export default {
  name: 'Header',
  props: {
    msg: String
  },
  components: {
    LoginButton
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
a {
  color: #42b983;
}
</style>

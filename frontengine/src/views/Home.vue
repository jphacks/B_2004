<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <LoginButton loginType="login"/>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import LoginButton from '@/components/LoginButton.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld,
    LoginButton
  }
}
</script>

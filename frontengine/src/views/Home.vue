<template>
  <div class="home">
    <img alt="frontEngine logo" src="../assets/frontEngineLogo.png">
    <LoginButton loginType="login"/>
    <HelloWorld msg="frontEngineへようこそ"/>
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

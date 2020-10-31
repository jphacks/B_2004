<template>
  <div class="home">
    <img alt="frontEngine logo" src="../assets/frontEngineLogo.png">
    <HelloWorld msg="frontEngineへようこそ"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>

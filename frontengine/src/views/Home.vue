<template>
  <div class="home">
    <img alt="frontEngine logo" src="../assets/frontEngineLogo.png">
    <HomeDesign msg="frontEngineへようこそ"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeDesign from '@/components/HomeDesign.vue'

export default {
  name: 'Home',
  components: {
    HomeDesign
  },
  data () {
    return {
      input: ['aada', 'dasda', 'dwdww', 'ww', 'dadaw', 'tanuki']
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
}
</style>

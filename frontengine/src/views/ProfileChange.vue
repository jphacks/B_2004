<template>
  <div id="cpp">
    <MyClient></MyClient>
  </div>
</template>

<script>
import MyClient from '@/components/MyClient.vue'

export default {
  name: 'ProfileChange',
  components: {
    MyClient
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

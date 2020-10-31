<template>
  <div class="problemList">
    <h1>問題一覧</h1>
    <Card problemNumber="No.1" problemStatement="問題文"/>
    <Card problemNumber="No.2" problemStatement="問題文"/>
    <Card problemNumber="No.3" problemStatement="問題文"/>
    <Card problemNumber="No.4" problemStatement="問題文"/>
    <Card problemNumber="No.5" problemStatement="問題文"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Card from '@/components/Card.vue'

export default {
  name: 'ProblemList',
  components: {
    Card
  }
}
</script>

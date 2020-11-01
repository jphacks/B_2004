<template>
  <div class="problemList">
    <h1>問題一覧</h1>
    <ProblemCard problemNumber="No.1" problemStatement="問題文"/>
    <ProblemCard problemNumber="No.2" problemStatement="問題文"/>
    <ProblemCard problemNumber="No.3" problemStatement="問題文"/>
    <ProblemCard problemNumber="No.4" problemStatement="問題文"/>
    <ProblemCard problemNumber="No.5" problemStatement="問題文"/>
    <Pagination/>
  </div>
</template>

<script>
// @ is an alias to /src
import ProblemCard from '@/components/ProblemCard.vue'
import Pagination from '@/components/Pagination.vue'

export default {
  name: 'ProblemList',
  components: {
    ProblemCard,
    Pagination
  }
}
</script>

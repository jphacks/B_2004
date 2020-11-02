<template>
  <div class="problemList">
    <h1>新規登録</h1>
    <EntryForm/>
  </div>
</template>

<script>
// @ is an alias to /src
import EntryForm from '@/components/EntryForm.vue'

export default {
  name: 'Entry',
  components: {
    EntryForm
  }
}
</script>

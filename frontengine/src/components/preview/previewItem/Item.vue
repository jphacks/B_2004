<template>
<div @click="action">
<slot ></slot>
</div>
</template>

<script>
export default {
  name: "Item",
  methods: {
    action: function (...params) {
      this.$emit('click', ...params)
    }
  }
}
</script>

<style scoped>
</style>

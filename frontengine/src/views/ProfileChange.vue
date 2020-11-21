<template>
<div>
  <b-card
    title="Card Title"
    img-alt="Image"
    img-top
    tag="article"
    style="max-width: 80rem;"
    class="text-center"
  >
  <div class="bg-secondary text-light">
      <b-list-group>
        <b-list-group-item href="#">
          <span class="btnTitle">name</span>
          <span class="btnArr">></span>
          Awesome link
        </b-list-group-item>
        <b-list-group-item href="#">Link with active state</b-list-group-item>
        <b-list-group-item href="#">Action links are easy</b-list-group-item>
        <b-list-group-item href="#">Disabled link</b-list-group-item>
      </b-list-group>
  </div>
  </b-card>
</div>
</template>

<script>
export default {
  methods: {
    myPro: function () {
      if (this.$route.path !== '/myProfile') {
        this.$router.push('/myProfile')
      }
    }
  }
}
</script>

<style scoped>
.btnTitle {
  float: left;
}
.btnArr {
  float: right;
}
</style>

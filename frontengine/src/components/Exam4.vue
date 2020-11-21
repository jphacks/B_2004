<template>
  <div class="exam4">
    <b-card class="hanoi" @click="utusu('left')">
      <b-card v-for="(value, index) of left" @click="trans(value, 'left', index)" :key="index">{{value}}</b-card>
    </b-card>
    <b-card class="hanoi" @click="utusu('center')">
      <b-card v-for="(value, index) of center" @click="trans(value, 'center')" :key="index">{{value}}</b-card>
    </b-card>
    <b-card class="hanoi" @click="utusu('right')">
      <b-card v-for="(value, index) of right" @click="trans(value, 'right')" :key="index">{{value}}</b-card>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'Exam4',
  props: {
    input: Array
  },
  data () {
    return {
      left: this.input,
      center: [],
      right: [],
      pocket: '',
      pocketBool: false,
      pocketSelect: ''
    }
  },
  methods: {
    trans: function (val, houkou) {
      let hairetu = []
      hairetu.push(1)
      this.center.push(val)
    },
    utusu: function (target) {
      this[target].push(this.pocket)
      this.pocketBool = false
    }
  }
}
</script>

<style scoped>
.exam4 {
  display: flex;
}
.hanoi {
  margin-right: 50px;
  height: 300px;
  overflow-y: auto;
  width: 150px;
}
</style>

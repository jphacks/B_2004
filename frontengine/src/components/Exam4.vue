<template>
  <div class="exam4">
    <answer-card class="hanoi" @click="utusu('left')">
      <answer-card v-for="(value, index) of input" @click="trans(value, 'left')" :key="index">{{value}}</answer-card>
    </answer-card>
    <answer-card class="hanoi" @click="utusu('center')">
      <answer-card v-for="(value, index) of center" @click="trans(value, 'center')" :key="index">{{value}}</answer-card>
    </answer-card>
    <answer-card class="hanoi" @click="utusu('right')">
      <answer-card v-for="(value, index) of right" @click="trans(value, 'right')" :key="index">{{value}}</answer-card>
    </answer-card>
  </div>
</template>

<script>
import AnswerCard from '@/components/preview/previewItem/AnswerCard.vue'
export default {
  components: { AnswerCard },
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
    trans: function (value, houkou) {
      if (this.pocketBool && this.pocketSelect !== houkou) {
        this[houkou].push(this.pocket)
        this.pocketBool = false
      } else if (!this.pocketBool) {
        this.pocket = value
        const search = this[houkou].indexOf(value)
        this[houkou].splice(search, 1)
        this.pocketBool = true
        this.pocketSelect = houkou
      }
    },
    utusu: function (target) {
      if (this.pocketBool && this.pocketSelect !== target) {
        this[target].push(this.pocket)
        this.pocketBool = false
      }
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
  width: 200px;
  display: block;
}
</style>

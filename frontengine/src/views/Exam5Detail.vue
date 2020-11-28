<template>
    <answer-card bg-variant="white" text-variant="black" class="text-center">
      <div>
        <span>問題本文</span>
        <answer><span>{{ this.$route.params.context }}</span></answer>
      </div>
    </answer-card>
</template>

<script>
import AnswerCard from "@/components/preview/previewItem/AnswerCard.vue"
import Answer from '../components/preview/answer.vue'
export default {
  name: "Exam5Detail",
  components: {
    AnswerCard,
    Answer
  },
  methods: {
    exist: function (data) {
      if (data || 0) {
        return data
      }
      return {}
    }
  }
}
</script>

<style scoped>
.text-center {
  width: 500px;
  max-height: 600px;
  overflow-y: scroll;
  margin-left: auto;
  margin-right: auto;
}
</style>

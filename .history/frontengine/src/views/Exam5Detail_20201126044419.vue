<template>
    <answer-card bg-variant="white" text-variant="black" class="text-center">
      <div>
        <span>問題本文<br /></span>
        <span>{{ this.$route.params.context ? this.$route.params.context : "" }}</span>
      </div>
    </answer-card>
</template>

<script>
import AnswerCard from "@/components/preview/previewItem/AnswerCard.vue"
export default {
  name: "Exam5Detail"
}
</script>

<style scoped>
.problemArea {
  margin: 40px 40px 40px;
}
.b-buttonArea {
  text-align: center;
}
.AnswerCard {
  border: solid 0.5px gray;
  margin: auto;
}
.detail-buttons {
  display: flex;
}
</style>

<template>
  <div class="problemList">
    <div class="bv-example-row">
      <div>
        <div>
          <answer>問題一覧</answer>
          <div class="examList" v-if="exams">
            <div v-for="(naiyou, index) in exams" :key="index">
              <div class="answer-card" v-if="naiyou">
                <answer-card class="text-center">
                  <span>
                    <answer>{{ naiyou.name }}</answer><br/></span>
                  <span>
                    <answer>{{ naiyou.diff }}</answer><br/></span>
                  <router-link :to="{ name: 'Exam5Detail', params: { examId: naiyou.name, context: naiyou.body } }" >参加登録</router-link>
                </answer-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// プロジェクト単位の例題１
import AnswerCard from "@/components/preview/previewItem/AnswerCard.vue"
import Answer from '../components/preview/answer.vue'
export default {
  name: "Exam5",
  components: {
    AnswerCard,
    Answer
  },
  data () {
    return {
    }
  },
  methods: {
    exist: function (data) {
      if (data || 0) {
        return data
      }
      return {}
    }
  },
  props: {
    exams: {}
  },
  mounted: function () {
  },
  computed: {
  }
}
</script>

<style scoped>
.examList {
  width: 500px;
  max-height: 600px;
  overflow-y: scroll;
  border: solid 2px gray;
  margin-left: auto;
  margin-right: auto;
}
.answer-card {
  margin: 18px;
  border: solid 1px gray;
}
</style>

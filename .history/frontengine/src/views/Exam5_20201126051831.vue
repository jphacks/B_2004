<template>
  <div class="problemList">
    <!--{{ exams }}-->
    <h6>
      例題１標準入力で受け取った例題（Object型）をWEBサイト上に実装してください。
      手順としてはPloblemList上に受け取った問題の概要(name,diff)を表示し、
      それをクリックしたときに問題の詳細(body)をProblemDetailによって表示できるようにしてください。
    </h6>
    <div class="bv-example-row">
      <div>
        <div>
          <h1>問題一覧</h1>
          <div class="examList" v-if="exams">
            <div
              v-for="(naiyou, index) in Object.values(exams || {})"
              :key="index"
            >
              <div class="answer-card" v-if="naiyou">
                <answer-card
                  bg-variant="white"
                  text-variant="black"
                  class="text-center"
                >
                  <span
                    >問題名：{{ exist(naiyou.name) }}<br
                  /></span>
                  <span
                    >難易度：{{ exist(naiyou.diff) }}<br
                  /></span>
                  <router-link
                    :to="{
                      name: 'Exam5Detail',
                      params: { examId: naiyou.name, context: naiyou.body },
                    }"
                    >参加登録</router-link
                  >
                </answer-card>
              </div>
            </div>
          </div>
          <div v-else>読み込み中...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// プロジェクト単位の例題１
import AnswerCard from "@/components/preview/previewItem/AnswerCard.vue"
export default {
  name: "Exam5",
  components: {
    AnswerCard
  },
  data () {
    return {
      exams: {
        problem1: {
          name: "example1",
          diff: 100,
          body: "例題1です。"
        },
        problem2: {
          name: "example2",
          diff: 200,
          body: "例題2です。"
        },
        problem3: {
          name: "example3",
          diff: 300,
          body: "例題3です。"
        },
        problem4: {
          name: "example4",
          diff: 400,
          body: "例題4です。"
        },
        problem5: {
          name: "example5",
          diff: 500,
          body: "例題5です。"
        }
      }
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
  props: {},
  mounted: function () {
    console.log("hyouzi", this.exams)
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
  margin: 10px 10px ;
  border: solid 1px gray;
}
</style>

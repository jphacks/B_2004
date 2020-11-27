<template>
  <div class="problemList">
    <!--{{ exams }}-->
    <h6>
      要素として、examsは各問題の要素をまとめてもっており、それぞれ問題の名前"Name"(String型),難易度"diff"(Num型),問題本文"context"(String型)が格納されています。これらの要素をPloblemList上に受け取った問題の概要(name,diff)を表示し、それをクリックしたときに問題の詳細(body)をProblemDetailによって表示できるようにしてください。
      あなたは業務で問題一覧とその内容を表示できるようにと依頼されました。
      問題の要素がまとめられたObjectがinputに与えられるので、それらを用いて依頼された内容を実現してください。
      例題１標準入力で受け取った例題（Object型）をWEBサイト上に実装してください。
      手順としてはPloblemList上に受け取った問題の概要(name,diff)を表示し、
      それをクリックしたときに問題の詳細(body)をProblemDetailによって表示できるようにしてください。
    </h6>
    <div class="bv-example-row">
      <div>
        <div>
          <answer>問題一覧</answer>
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
                    >
                    <answer>問題名：{{ exist(naiyou.name) }}</answer><br
                  /></span>
                  <span
                    >
                    <answer>難易度：{{ exist(naiyou.diff) }}</answer><br
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
import Answer from '../components/preview/answer.vue'
export default {
  name: "Exam5",
  components: {
    AnswerCard
    Answer
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
  margin: 18px;
  border: solid 1px gray;
}
</style>

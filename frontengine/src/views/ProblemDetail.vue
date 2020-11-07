<template>
  <body class="problemArea">
  <!--<div class="ploblemBody">
    <span>{{ getExam ? getExam.name : 'testmode' }}</span>
  </div>-->
  <div class="problemView">
    <!-- <Exam1/> -->
    <!--<Exam2/>-->
    <h1>問題：{{ getExam.name }}</h1>
    <!--<h1>難易度：{{getExam.difficult}}</h1>-->
      <b-card class="b-card">
      <b-card-text>
        {{getExam.examInfo.explain.join('')}}<br><br>
        {{getExamInfo}}<br>
        {{getExamDataForm}}<br><br>
        <!--<b-card>
          <b-card-text>
            入力例1<br>
            {{getExam.examInfo.testCases.pascalCase.enter.join(',')}}<br>
          </b-card-text>
          <b-card-text>
            出力例1<br>
            {{getExam.examInfo.testCases.pascalCase.exit[0]}}<br>
            {{getExam.examInfo.testCases.pascalCase.exit[1]}}<br>
          </b-card-text>
        </b-card>
        <b-card>
          <b-card-text>
            入力例2<br>
            {{getExam.examInfo.testCases.randomCase.enter.join(',')}}<br>
          </b-card-text>
          <b-card-text>
            出力例2<br>
            {{getExam.examInfo.testCases.randomCase.exit[0]}}<br>
            {{getExam.examInfo.testCases.randomCase.exit[1]}}<br>
            {{getExam.examInfo.testCases.randomCase.exit[2]}}<br>
            {{getExam.examInfo.testCases.randomCase.exit[3]}}<br>
            {{getExam.examInfo.testCases.randomCase.exit[4]}}<br>
          </b-card-text>
        </b-card>-->
        <b-card>
          <b-card-text>
            入力例1<br>
            {{getExam.examInfo.testCases.sampleCase.enter.join(',')}}<br>
          </b-card-text>
          <b-card-text>
            出力例1<br>
            <span v-for="(smCase, index) in Object.keys(getExam.examInfo.testCases.sampleCase.exit || {})" :key="index" >
              {{String(getExam.examInfo.testCases.sampleCase.exit[index])}}<br>
            </span>
          </b-card-text>
        </b-card>
        <!--<b-card>
          <b-card-text>
            入力例4<br>
            {{getExam.examInfo.testCases.sampleCase2.enter.join(',')}}<br>
          </b-card-text>
          <b-card-text>
            出力例4<br>
            {{getExam.examInfo.testCases.sampleCase2.exit[0]}}<br>
            {{getExam.examInfo.testCases.sampleCase2.exit[1]}}<br>
            {{getExam.examInfo.testCases.sampleCase2.exit[2]}}<br>
            {{getExam.examInfo.testCases.sampleCase2.exit[3]}}<br>
            {{getExam.examInfo.testCases.sampleCase2.exit[4]}}<br>
            {{getExam.examInfo.testCases.sampleCase2.exit[5]}}<br>
            {{getExam.examInfo.testCases.sampleCase2.exit[6]}}<br>
            {{getExam.examInfo.testCases.sampleCase2.exit[7]}}<br>
            {{getExam.examInfo.testCases.sampleCase2.exit[8]}}<br>
          </b-card-text>
        </b-card>-->
      </b-card-text>
    </b-card>
  </div>
  <br>
  <!-- Answer Form Area -->
  <div class="problemdetail">
    <b-button variant="outline-primary" @click="sumplePush()">サンプルを設置する</b-button>
      <b-form-textarea
      id="textarea"
      v-model="text"
      :state="text.length > 0"
      placeholder="解答を入力してください。"
      rows="6"
    ></b-form-textarea>
    <b-button @click="getDom()">送信</b-button>
    <!-- <br><br><br><router-link :to="{name: 'ProblemResult', params: {examId: $route.params.examId}}">問題結果画面に遷移します。</router-link> -->
  </div>
  </body>
</template>

<script>
// @ is an alias to /src
import MainProcess from '@/process/MainProcess.js'
import { mapGetters, mapActions } from 'vuex'
import Exam1 from '@/components/Exam1.vue'
import firebase from 'firebase'
// import Exam1 from '@/components/Exam1.vue'
// import Exam2 from '@/components/Exam2.vue'
export default {
  name: 'ProblemDetail',
  components: {
    // Exam1,
    // Exam2
  },
  data () {
    return {
      text: '',
      input: [
        'pen',
        'pineapple',
        'apple',
        'pen'
      ],
      clear: [
        'pen',
        'penpineapple',
        'penpineappleapple',
        'penpineappleapplepen'
      ],
      option: {
        mode: 'answerDOM',
        existString: true
      },
      exam: {
      }
    }
  },
  props: {
  },
  mounted: function () {
    this.setExam()
    console.log('exam', this.exam)
  },
  methods: {
    ...mapActions(['setExams']),
    getDom: function () {
    //  MainProcess(this.text)
      const submitExam = firebase.functions().httpsCallable('submitExam')
      const examId = this.$route.params.examId
      submitExam({
        userId: this.getLoginId,
        examId: examId,
        examText: this.text,
        testCase: this.input,
        outputSumple: this.clear,
        optionSumple: this.option
      })
        .then(res => {
          console.log(res)
          this.$router.push({ name: 'ProblemResult', params: { examId: this.$route.params.examId } })
        })
        .catch(e => {
          console.log(e)
        })
    },
    sumpleTest: function () {
      console.log('TANOMU AC', MainProcess(this.text, this.input, this.clear, this.option))
    },
    sumplePush: function () {
      this.text = this.getSumpleText
    },
    setExam: function () {
      const examId = this.$route.params.examId
      return firebase.firestore().collection('exams').get().then(snapsshot => {
        let output = {}
        console.log('ss', snapsshot)
        snapsshot.forEach(doc => {
          this.setExams(doc)
          output[doc.id] = doc.data()
        })
        console.log('this.exam', output[examId])
        this.exam = output[examId]
      })
    },
    createEvent: function () {
    }
  },
  computed: {
    ...mapGetters(['getExams', 'getUserId']),
    getText () {
      return "''"
    },
    getExam () {
      return this.exam
    },
    getLoginId () {
      console.log('check', this.getUserId)
      return this.getUserId
    },
    getSumpleText () {
      const output = []
      output.push('<template>')
      output.push('<div class="problemdetail">')
      output.push('<answer v-for="(item, index) of input" :key="index">{{jointStr(input, index)}}<br/></answer>')
      output.push('</div>')
      output.push('</template>')
      output.push('<script>')
      // output.push('import MainProcess from \'@/process/MainProcess.js\'')
      output.push('export default {')
      output.push('  name: \'Home\',')
      output.push('  components: {')
      output.push('  },')
      output.push('props: {')
      output.push('input: Array')
      output.push('},')
      output.push('  data () {')
      output.push('    return {')
      output.push('      text: \'\',')
      output.push('      number: 0')
      output.push('    }')
      output.push('  },')
      output.push('  methods: {')
      output.push('    jointStr: function (items, index) {')
      output.push('      let output = \'\'')
      output.push('      for (let i = 0; i < index + 1; i = i + 1) {')
      output.push('        output = output + items[i]')
      output.push('      }')
      output.push('      return output')
      output.push('    }')
      output.push('  },')
      output.push('  computed: {')
      output.push('    getText () {')
      output.push('      return "\'\'"')
      output.push('    },')
      output.push('    getMergeText () {')
      output.push('     return this.input.join(\'\')')
      output.push('    }')
      output.push('  }')
      output.push('}')
      output.push('</' + 'script>')
      return output.join('\n')
    },
    getClearModel () {
      let output = {}
      output.exists = [] // eventに対応したやつ
      output.events = [] // event
      output.events.push({ id: 'sortButtonId', event: 'click' })
      output.events.push({ id: 'sortButtonName', event: 'click' })
      return output
    },
    getExamInfo () {
      return this.getExam.examInfo.exEnter[0]
    },
    getExamDataForm () {
      return this.getExam.examInfo.exEnter[1]
    }

  }
}
</script>

<style scoped>
.problemArea {
  margin: 40px 40px 40px;
}
.b-buttonArea {
  text-align: center;
}
.b-card {
  border: solid 0.5px gray;
  margin: auto;
}
</style>

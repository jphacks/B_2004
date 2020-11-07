<template>
  <body class="problemArea">
  <div class="ploblemBody">
    <span>{{ getExam ? getExam.name : 'testmode' }}</span>
  </div>
  <div class="problemView">
    <!-- <Exam1/> -->
    <Exam2/>
  </div>
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
    <b-button @click="sumpleTest()">送信</b-button>
    <b-button @click="getDom()">てててすとー</b-button>
    <br><br><br><router-link :to="{name: 'ProblemResult', params: {examId: $route.params.examId, status:'wa', reason:'wawawwa'}}">問題結果画面に遷移します。</router-link>
  </div>
  </body>
</template>

<script>
// @ is an alias to /src
import MainProcess from '@/process/MainProcess.js'
import { mapGetters } from 'vuex'
import Exam1 from '@/components/Exam1.vue'
import firebase from 'firebase'
// import Exam1 from '@/components/Exam1.vue'
import Exam2 from '@/components/Exam2.vue'
export default {
  name: 'ProblemDetail',
  components: {
    // Exam1,
    Exam2
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
      }
    }
  },
  props: {
    exam: Object,
    examId: String
  },
  methods: {
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
    createEvent: function () {
    }
  },
  computed: {
    ...mapGetters(['getExams', 'getUserId']),
    getText () {
      return "''"
    },
    getExam () {
      const examId = this.$route.params.examId
      console.log('getExam', examId, this.getExams)
      if (!this.getExams || !this.getExams[examId]) {
        return { name: 'testmode' }
      }
      return this.getExams[examId]
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
      output.push('input: Array,')
      output.push('testCase: {')
      output.push('type: String,')
      output.push('default: \'testcase\'')
      output.push(' }')
      output.push('},')
      output.push('  data () {')
      output.push('    return {')
      output.push('      text: \'\',')
      output.push('      number: 0,')
      output.push('      obj: {a: {}, c:{d:50, e:{}}},')
      output.push('      array: [0,1,2],')
      output.push('      input: [\'pen\',\'pineapple\',\'apple\', \'pen\'],')
      output.push('      clear: [\'pen\',\'penpineapple\',\'penpineappleapple\', \'penpineappleapplepen\'],')
      output.push('    }')
      output.push('  },')
      output.push('  methods: {')
      output.push('    getDom: function (text) {')
      output.push('      MainProcess(text)')
      output.push('    },')
      output.push('    jointStr: function (items, index) {')
      output.push('      let output = \'\'')
      output.push('      for (let i = 0; i < index + 1; i = i + 1) {')
      output.push('        output = output + items[i]')
      output.push('      }')
      output.push('      return output')
      output.push('    },')
      output.push('  sort: function (index) {')
      output.push('    switch (index) {')
      output.push('        case \'userId\':')
      output.push('          this.items.sort(function (a, b) {')
      output.push('            if (a.userId < b.userId) {')
      output.push('              return -1')
      output.push('            }')
      output.push('            if (a.userId > b.userId) {')
      output.push('             return 1')
      output.push('            }')
      output.push('            return 0')
      output.push('          })')
      output.push('          break')
      output.push('        case \'userName\':')
      output.push('          this.items.sort(function (a, b) {')
      output.push('            if (a.userName < b.userName) {')
      output.push('              return -1')
      output.push('            }')
      output.push('            if (a.userName > b.userName) {')
      output.push('              return 1')
      output.push('            }')
      output.push('            return 0')
      output.push('          })')
      output.push('          break')
      output.push('      }')
      output.push('    },')
      output.push('    testObject: function () {')
      output.push('    let k = 0')
      output.push('          k++')
      output.push('       return k')
      output.push('      }')
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
    }
  }
}
</script>

<style scoped>
.problemArea {
  margin: 40px 40px 40px;
}
</style>

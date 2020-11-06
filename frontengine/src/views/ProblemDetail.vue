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
    <b-button @click="getDom()">送信</b-button>
    <br><br><br><router-link :to="{name: 'ProblemResult', params: {examId: $route.params.examId}}">問題結果画面に遷移します。</router-link>
  </div>
  </body>
</template>

<script>
// @ is an alias to /src
import MainProcess from '@/process/MainProcess.js'
import { mapGetters } from 'vuex'
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
      text: ''
    }
  },
  props: {
  },
  methods: {
    getDom: function () {
      MainProcess(this.text)
    },
    sumplePush: function () {
      this.text = this.getSumpleText
    },
    createEvent: function () {
    }
  },
  computed: {
    ...mapGetters(['getExams']),
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
    getSumpleText () {
      const output = []
      output.push('<template>')
      output.push('<div class="problemdetail">')
      output.push('<answer v-for="(item, index) of items" :key="index">{{jointStr(items, index)}}<br/></answer>')
      output.push('<answer/>')
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
      output.push('      array: [0,1,2]')
      output.push('    }')
      output.push('  },')
      output.push('  methods: {')
      output.push('    getDom: function (text) {')
      output.push('      MainProcess(text)')
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
      output.push('      },')
      output.push('    test: function () {')
      output.push('      let a = 30 + 30')
      output.push('      a = 30 + 50')
      output.push('      let sakurai = {a:30, b:30, c:30}')
      output.push('      let sakuraihairetu = [30,40,50]')
      output.push('      let outputText =\'\'')
      output.push('      switch (a){')
      output.push('      case 10:')
      output.push('      outputText=\'10\'')
      output.push('      break')
      output.push('      case 50:')
      output.push('      outputText=\'50\'')
      output.push('      break')
      output.push('      case 100:')
      output.push('      outputText=\'100\'')
      output.push('      break')
      output.push('      default:')
      output.push('      outputText=\'default\'')
      output.push('      }')
      // output.push('      let k = Object.keys(sakurai)')
      // output.push('      return output')
      // output.push('      if (a<100) {')
      // output.push('      outputText = \'a<100\'')
      // output.push('      } else if ( a> 150) {')
      // output.push('      outputText = \'a>150\' ')
      // output.push('      }  else  {')
      // output.push('      outputText = \'a>1000\'')
      // output.push('      }')
      // output.push('      this.number = 50 + 30 + 20 * 40')
      output.push('      for (let i = 0; i< 10; i = i + 1) {')
      output.push('       this.number = this.number + 1')
      output.push('      }')
      output.push('        return this.number')
      // output.push('      this.getDom()')
      output.push('     }')
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

<template>
  <div class="createExam">
    <b-card class="input-area">
      <b-form-input v-model="difficult" placeholder="difficult"></b-form-input>
      <b-form-input v-model="name" placeholder="name"></b-form-input>
      <br/>
      <b-form-input v-for="(value, key) of targets" :key="key" v-model="targets[key]" :placeholder="key + 'target'"></b-form-input>
      <b-form-input placeholder="preTyle" v-model="targetPreType"></b-form-input>
      <b-form-input placeholder="targetType" v-model="targetType"></b-form-input>
      <b-form-input v-model="targetContext" placeholder="文字列"></b-form-input>
      <b-btn @click="pushEx()">追加</b-btn>
    </b-card>
    <b-card class="output-area">
      <span>difficult: {{difficult}}<br/></span>
      <span>name: {{name}}<br/></span>
      <span>examInfo<br/></span>
      <span v-for="(value, key) of examInfo" :key="key" class="youso">
        {{key}}: {{value}}
        <br/>
      </span>
    </b-card>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'createExam',
  components: {
  },
  data () {
    return {
      difficult: 0,
      name: '',
      targets: ['', '', '', ''],
      targetContext: '',
      targetPreType: '',
      targetType: '',
      examInfo: {
        Name: '',
        exEnter: [],
        explain: [],
        option: {
        },
        testCase: {
        }
      }
    }
  },
  methods: {
    pushEx: function () {
      let targetKey = []
      let tar = this.examInfo
      for (let index of Object.keys(this.targets)) {
        const key = this.targets[index]
        console.log('key', key, this.targets, index)
        if (key.length > 0) {
          if (!tar[key]) {
            tar[key] = {}
          }
          targetKey.push(key)
          tar = tar[key]
        }
      }
      let targetText = this.targetContext
      if (this.targetType === 'boolean') {
        targetText = Boolean(targetText)
      } else if (this.targetType === 'int') {
        targetText = Number(targetText)
      }
      if (this.targetPreType === "Array") {
        if (!Array.isArray(tar)) {
          tar = []
        }
        tar.push(targetText)
      } else {
        tar = targetText
      }
      let targetss = ''
      for (let key of targetKey) {
        targetss = targetss + [key]
      }
      this.targetContext = ''
      console.log('this.examInfo', this.examInfo, tar, targetKey, targetss)
    }
  }
}
</script>

<style scoped>
.input-area {
  display: block;
  padding-right: 50px;
}
.output-area {
  display: block;
}
.createExam {
  display: flex;
}
.youso {
  padding-left: 25px;
}
</style>

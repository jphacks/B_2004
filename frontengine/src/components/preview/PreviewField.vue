<template>
  <div class="PreviewField">
    <!--<b-button v-if="dom" @click="previewParse()">プレビューを表示する</b-button>-->
    <b-card class="card">
      <div :id="uniqueKey" class="targetPreviewFiled">
        <div>
        </div>
      </div>
    </b-card>
    <b-btn primary @click="$emit('style-check')">デザインチェック</b-btn>
    <b-btn @click="previewParse()">レンダリング</b-btn>
  </div>
</template>

<script>
// @ is an alias to /src
import { pureDomPreviewParse, domPreviewParse, saveDomTree } from '@/process/ScriptUtility/domPreviewParse.js'
import { global } from '@/process/moduleProcess.js'
import Vue from 'vue/dist/vue.esm.js'
import Answer from '@/components/preview/answer'
import { domProperty } from '@/process/ScriptUtility/domUtility.js'
import PreviewCard from '@/components/preview/previewItem/PreviewCard'
import AnswerCard from "@/components/preview/previewItem/AnswerCard"
import BootstrapVue from 'bootstrap-vue'
import { globalStyle } from '@/process/MainProcess.js'
import { importBootstrap, bootstrapImports } from '@/process/addBootstrapComponents.js'
import Item from '@/components/preview/previewItem/Item'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default {
  name: 'PreviewField',
  components: {
  },
  props: {
    dom: {},
    inputScript: {},
    unique: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      outputDom: {},
      pushPreview: ''
    }
  },
  computed: {
    getDom () {
      return this.dom
    },
    uniqueKey () {
      return this.unique + 'targetPreview'
    },
    importCompo () {
      const output = {}
      output.Answer = Answer
      output.PreviewCard = PreviewCard
      return output
    }
  },
  watch: {
    dom: function () {
      this.outputDom = this.dom
      this.previewParse()
    }
  },
  mounted: function () {
    this.testPush()
  },
  methods: {
    domEvent: function (order, path, userAction, ...arg) {
      console.log('orderPPP', order, path, userAction, arg, global)
      let toParam = Object.assign({}, global)
      arg.forEach(x => {
        toParam = Object.assign(toParam, x)
      })
      const domPro = domProperty(order, toParam)
      if (userAction) {
        console.log('userAction!', toParam, order)
        this.outputDom = domPreviewParse(saveDomTree, path)
        this.previewParse()
      }
      console.log('domproprety', domPro, global, order, arg)
      return domPro
    },
    classEvent: function (path, ...orders) {
      // class名を受け取る
      let outputObj = {}
      orders.forEach(key => {
        outputObj = Object.assign(outputObj, globalStyle[path].class[key])
      })
      console.log('class', path, orders, globalStyle, outputObj)
      return outputObj
    },
    parseEvent: function (param) {
      const splits = param.split('[')
      const gets = splits[0]
      console.log('param.split()', splits)
      const index = Number(splits[1].split(']')[0])
      // console.log('globaltete', global[gets][index], gets, index)
      if (global[gets]) {
        return global[gets][index]
      } else {
        return false
      }
    },
    routerEvent: function (param) {
      console.log('routerEvent', param)
      this.$emit('router-change', param)
    },
    previewParse: function () {
      // const getDDD = domPreviewParse(this.dom, 'default')
      console.log('outputdom', this.dom, this.outputDom)
      const getDDD = this.outputDom
      const self = this
      const domEvent = this.domEvent
      const classEvent = this.classEvent
      const parseEvent = this.parseEvent
      const routerEvent = this.routerEvent
      const testSumple = getDDD
      console.log('checce', getDDD, importBootstrap, bootstrapImports)
      bootstrapImports()
      let newPreviewDom = Vue.component('newPreviewDom', {
        template: getDDD,
        methods: {
          domEvent: domEvent,
          classEvent: classEvent,
          parseEvent: parseEvent,
          routerEvent: routerEvent
        },
        components: {
          Answer,
          PreviewCard,
          AnswerCard,
          'router-link': Item,
          ...importBootstrap
        },
        style: {
          size: {
            width: '500px',
            position: 'absolute'
          }
        }
      })
      let vm = new Vue({
        Answer,
        render: h => h(newPreviewDom)
      })
      // this.pushPreview = newPreviewDom
      const targetDomChange = document.getElementById(this.uniqueKey).children[0]
      vm.$mount(targetDomChange)
      console.log('vueStatus', vm.$el, vm)
      this.$emit('vueDom', vm.$el, vm.$el.children)
    },
    testPush: function () {
      console.log('document', document, this.document)
      const sumpleText = [`<div> aaaa </div>`]
      return sumpleText
    }
  }
}
</script>

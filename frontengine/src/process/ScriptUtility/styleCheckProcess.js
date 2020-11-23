import Vue from 'vue'
export { styleCheckProcess }

function styleCheckProcess (template, imports) {
  // const getDDD = domPreviewParse(this.dom, 'default')
  console.log('outputdom', this.dom, this.outputDom)
  const getDDD = template
  const self = this
  const domEvent = this.domEvent
  const classEvent = this.classEvent
  const testSumple = getDDD
  let newPreviewDom = Vue.component('newPreviewDom', {
    template: getDDD,
    methods: {
      domEvent: domEvent,
      classEvent: classEvent
    },
    components: {
      ...imports
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
}

function domEvent (order, path, userAction, ...arg) {
  // domのfunction系を一旦ここに噛ませる
  // orderはfunction名
  // pathはcomponentファイル名
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
}
function classEvent (path, ...orders) {
  // class名を受け取る
  let outputObj = {}
  orders.forEach(key => {
    outputObj = Object.assign(outputObj, globalStyle[path].class[key])
  })
  console.log('class', path, orders, globalStyle, outputObj)
  return outputObj
}

// import DomProcess from './DomProcess.js'
import CreateAST from './CreateAST.js'
import ScriptProcess from './ScriptProcess.js'
import DomProcess from './DomProcess.js'
import { global, initGlobal } from './moduleProcess.js'
import { domProperty } from './ScriptUtility/domUtility.js'
import { getProperty } from './ScriptUtility/utility.js'
import { execScript, getScript } from './ScriptUtility/execScript.js'
import { styleProperty } from './styleProcess.js'
import { earth, pageAdd } from '@/process/ProjectProcess.js'
let globalStyle = {}
let checkClear = 0
let lastOutput = []
let outputIndex = 0
async function MainProcess (text, props, clear, option, fileName, event, eventIndex, init) {
  let toProps = {}
  if (init) {
    initGlobal()
  }
  if (Array.isArray(props)) {
    toProps.input = props
  } else {
    // obj型
    toProps = Object.assign(toProps, props)
  }
  const fileInfo = {} // ここに単一ファイル情報を記載
  let pageName = 'default'
  if (fileName) {
    pageName = fileName
  }
  fileInfo.fileName = pageName
  const templateLength = '<template>'.length
  const scriptLength = '<script>'.length
  const styleLength = '<style scoped>'.length
  const templates = text.substr(text.indexOf('<template>') + templateLength, text.indexOf('</template>') - templateLength)
  const script = text.substr(text.indexOf('<script>') + scriptLength, text.indexOf('</script>') - scriptLength - text.indexOf('<script>'))
  const style = text.substr(text.indexOf('<style scoped>') + styleLength, text.indexOf('</style>') - styleLength - text.indexOf('<style scoped>'))
  const domTree = DomProcess(templates)
  ScriptProcess(script, toProps)
  globalStyle = styleProperty(style)
  const errors = []
  const getClear = clear
  let targetIndex = 0
  let output = { status: 'WA', reason: '' }
  const vForGlobal = {}
  const parseOutput = []
  if (props) {
    Object.keys(toProps || {}).forEach(key => {
      global[key] = toProps[key]
    })
  }
  const snapShotFileGlobalInfo = Object.assign({}, global)
  console.log('global', global, toProps, props)
  let resultOutput = [] // 文字列型の場合は、outputが見れるはず
  let tooru = true
  // let target = domTree
  const targets = []
  targets.push(domTree)
  pageAdd(pageName, templates, script, style, domTree, text, global)
  while (targets.length > 0) {
    const ifBool = true
    const getTar = targets.pop()
    const tar = Object.assign({}, getTar)
    if (tar.params) {
      // console.lo('targets!!', tar.params, tar)
    }
    tooru = false
    // -- v-for
    if (tar['v-for']) {
      const target = tar['v-for']
      if (target.type === 'variable' || target.type === 'function') {
        let data = domProperty(target.right, tar.params)
        // とりあえずdataはArray想定 本来ではObjectも考えないといけないよ
        if (Array.isArray(data)) {
          for (let i = data.length - 1; i >= 0; i--) {
            // tar.params = {}
            let nextTarget = Object.assign({}, tar)
            const params = {}
            const textParams = {}
            const keys = Object.values(target.target)
            params[keys[0]] = data[i]
            textParams[keys[0]] = String(keys[0] + '[' + i + ']')
            console.log('chh', data[i], data, target)
            if (keys.length === 2) {
              params[keys[1]] = i
              textParams[keys[1]] = i
            }
            nextTarget.paramIndex = i
            nextTarget.paramValue = data[i]
            nextTarget.params = Object.assign({}, params)
            nextTarget.textParams = Object.assign({}, params)
            // console.lo('nextTarget', nextTarget)
            delete nextTarget['v-for']
            targets.push(nextTarget)
          }
        } else if (typeof data === 'object') {
          // obj
          const keys = Object.keys(data)
          data = Object.values(data)
          for (let i = data.length - 1; i >= 0; i--) {
            // tar.params = {}
            let nextTarget = Object.assign({}, tar)
            const params = {}
            const textParams = {}
            const keys = Object.values(target.target)
            params[keys[0]] = data[i]
            console.log('chh', data[i], data)
            // textParams[key[0]] =
            if (keys.length === 2) {
              params[keys[1]] = keys[i]
            }
            nextTarget.paramIndex = keys[i]
            nextTarget.paramValue = data[i]
            nextTarget.params = Object.assign({}, params)
            // console.lo('nextTarget', nextTarget)
            delete nextTarget['v-for']
            targets.push(nextTarget)
          }
        }
        continue
      } else {
        // func
      }
    }
    // 8-- v-for
    // v-if
    if (tar['v-if']) {
      let data = !!domProperty(tar['v-if'].right, tar.params)
      if (!data) {
        continue
      }
    }
    // 8-- v-if
    parseOutput.push(tar)
    if (tar.name === 'reserveText') {
      // console.log('tarValue:none', tar)
      const output = []
      for (let reserve of Object.values(tar.reserves)) {
        const strValueStart = tar.value.substr(0, reserve.start)
        const strValueEnd = tar.value.substr(reserve.end + 1, tar.value.length)
        if (reserve.type === 'function') {
          const get = domProperty(reserve.textRawValue, tar.params)
          // とりあえずglobalのみ対応
          const args = []
          const toStr = String(get)
          output.push(toStr)
        } else if (reserve.type === 'variable') {
          const get = domProperty(reserve.textRawValue, tar.params)
          let toStr = String(get)
          // tar.value = strValueStart + toStr + strValueEnd
          output.push(toStr)
          // console.log('pppRRR', reserve, tar.value, global)
        } else if (reserve.type === 'direct') {
          output.push(reserve.text)
        }
      }
      tar.value = output.join('')
    }
    if (option && option.mode === 'answerDOM') {
      if (option.existString) {
        if (tar.answer && tar.name === 'reserveText') {
          // とりあえずexistStringなので....
          // console.log('tarValue', tar, targetIndex)
          if (typeof lastOutput[outputIndex] !== 'string') {
            lastOutput[outputIndex] = ''
          }
          lastOutput[outputIndex] = lastOutput[outputIndex] + tar.value
        } else if (tar.answer) {
          // console.log('tarValue:without', tar)
        }
        // -- lastPropagate
        // 子供に伝播
        if (tar.name === 'br') {
          outputIndex++
        }
        if (tar.open) {
          let closeObject = {}
          closeObject.open = false
          closeObject.close = true
          closeObject.name = tar.name
          closeObject.unique = tar.unique
          closeObject.depth = tar.depth
          targets.push(closeObject)
        }
        let pushChildren = tar.children || []
        for (let i = pushChildren.length - 1; i >= 0; i--) {
          const value = pushChildren[i]
          let nextObject = {}
          nextObject = Object.assign({}, value)
          if (tar.hasOwnProperty('params')) {
            nextObject.params = Object.assign({}, tar.params)
          }
          if (tar.hasOwnProperty('textParams')) {
            nextObject.textParams = Object.assign({}, tar.textParams)
          }
          if (tar.hasOwnProperty('paramIndex')) {
            nextObject.paramIndex = tar.paramIndex
          }
          if (tar.hasOwnProperty('answer')) {
            nextObject.answer = tar.answer
          }
          if (tar.name === 'answer') {
            nextObject.answer = true
            nextObject.answerIndex = i
          }
          // console.log('cheek', nextObject)
          targets.push(nextObject)
          // -- lastPrpagate
        }
      }
    }
  }
  console.log('parse', parseOutput)
  console.log('!!event!!', event)
  console.log('domTree', domTree, event, eventIndex)
  const getEvent = event[eventIndex]
  let count = 0
  let openCount = 0
  const clickEvent = getEvent.click
  let Target = clickEvent.point
  if (getEvent.hasOwnProperty('click')) {
    if (!Target) {
      Target = clickEvent.component
    } else {
      Target = Target.component
    }
  }
  for (let i = 0; i < parseOutput.length; i++) {
    let target = parseOutput[i]
    console.log('!!event!!', Target, target, count, Target.depth, target.depth)
    if (target.name === Target.name && target.depth === Target.depth) {
      count++
      console.log('!!event!!:click!!', target, Target)
      console.log('click:tansaku', count)
      if (count === Target.count) {
        count = 0
        console.log('click', count)
        if (Target.hasOwnProperty('component')) {
          console.log('seni: !!event!!', Target, Target.component)
          Target = Target.component
        } else {
          console.log('!!event!!: target', target, target.others)
          for (let k = 0; k < target.others.length; k++) {
            const other = target.others[k]
            if (other.left.indexOf('click') >= 0) {
              const arrays = []
              let toGlobal = Object.assign({}, global)
              toGlobal = Object.assign({}, target.params)
              for (let p = 0; p < other.functionArgument.length; p++) {
                arrays.push(getProperty(other.functionArgument[p], toGlobal))
              }
              getScript(global[other.functionTarget], arrays, toGlobal)
              console.log('!!event!!returnMainProcess', eventIndex, init)
              return MainProcess(text, props, clear, option, fileName, event, eventIndex + 1, false)
            }
          }
        }
      }
    }
  }
  if (option.existString) {
    let flag = true
    let noneTarget = []
    if (clear && Array.isArray(clear)) {
      for (let i = 0; i < clear.length; i++) {
        if (lastOutput[i] !== clear[i]) {
          flag = false
          noneTarget.push(i)
        }
      }
    }
    if (flag) {
      return {
        status: 'AC',
        reason: 'all Accept',
        info: checkClear,
        option: option,
        clear: clear,
        output: lastOutput,
        domTree: domTree,
        earth: earth,
        fileInfo: fileInfo
      }
    } else {
      return {
        status: 'WA',
        reason: 'noClear',
        info: checkClear,
        option: option,
        clear: clear,
        output: lastOutput,
        noneTarget: noneTarget,
        domTree: domTree,
        earth: earth,
        fileInfo: fileInfo
      }
    }
  } else {
    return {
      status: 'WA',
      reason: 'runCode',
      info: checkClear,
      option: option,
      clear: clear,
      output: lastOutput,
      domTree: domTree,
      earth: earth,
      fileInfo: fileInfo
    }
  }
}

function runVueDom (targetDomTree, option) {
  const targets = [targetDomTree]
  const parseOutput = []
  let tooru = true
  console.log('targets', targets, targetDomTree, parseOutput)
  while (targets.length > 0) {
    const ifBool = true
    const getTar = targets.pop()
    const tar = Object.assign({}, getTar)
    if (tar.params) {
      // console.lo('targets!!', tar.params, tar)
    }
    tooru = false
    // -- v-for
    if (tar['v-for']) {
      const target = tar['v-for']
      if (target.type === 'variable' || target.type === 'function') {
        let data = domProperty(target.right, tar.params)
        // とりあえずdataはArray想定 本来ではObjectも考えないといけないよ
        if (typeof data === 'string') {
          // たぶんparseする時にjoin(',')で参照渡し的にこっちもmergeされちゃってるので...
          data = data.split(',')
        }
        if (Array.isArray(data)) {
          for (let i = data.length - 1; i >= 0; i--) {
            // tar.params = {}
            let nextTarget = Object.assign({}, tar)
            const params = {}
            const parseParams = {}
            const keys = Object.values(target.target)
            params[keys[0]] = data[i]
            // parseParams[keys[0]] = data[i]
            parseParams[keys[0]] = target.right + '[' + i + ']'
            if (keys.length === 2) {
              params[keys[1]] = i
              parseParams[keys[1]] = i
            }
            console.log('parrrr', params, parseParams, keys)
            nextTarget.paramIndex = i
            nextTarget.paramValue = data[i]
            nextTarget.params = Object.assign({}, params)
            nextTarget.parseParams = Object.assign({}, parseParams)
            // console.lo('nextTarget', nextTarget)
            delete nextTarget['v-for']
            targets.push(nextTarget)
          }
        } else if (typeof data === 'object') {
          // obj
          const keys = Object.keys(data)
          data = Object.values(data)
          for (let i = data.length - 1; i >= 0; i--) {
            // tar.params = {}
            let nextTarget = Object.assign({}, tar)
            const params = {}
            const parseParams = {}
            const keys = Object.values(target.target)
            params[keys[0]] = data[i]
            parseParams[keys[0]] = target.right + '[' + i + ']'
            if (keys.length === 2) {
              params[keys[1]] = keys[i]
              parseParams[keys[1]] = keys[i]
            }
            nextTarget.paramIndex = keys[i]
            nextTarget.paramValue = data[i]
            nextTarget.params = Object.assign({}, params)
            nextTarget.parseParams = Object.assign({}, parseParams)
            // console.lo('nextTarget', nextTarget)
            delete nextTarget['v-for']
            targets.push(nextTarget)
          }
        }
        continue
      } else {
        // func
      }
    }
    // 8-- v-for
    // v-if
    if (tar['v-if']) {
      let data = !!domProperty(tar['v-if'].right, tar.params)
      if (!data) {
        continue
      }
    }
    // 8-- v-if
    parseOutput.push(tar)
    if (tar.name === 'reserveText') {
      // console.log('tarValue:none', tar)
      const output = []
      for (let reserve of Object.values(tar.reserves)) {
        const strValueStart = tar.value.substr(0, reserve.start)
        const strValueEnd = tar.value.substr(reserve.end + 1, tar.value.length)
        if (reserve.type === 'function') {
          const get = domProperty(reserve.textRawValue, tar.params)
          // とりあえずglobalのみ対応
          const args = []
          const toStr = String(get)
          output.push(toStr)
        } else if (reserve.type === 'variable') {
          const get = domProperty(reserve.textRawValue, tar.params)
          let toStr = String(get)
          // tar.value = strValueStart + toStr + strValueEnd
          output.push(toStr)
          // console.log('pppRRR', reserve, tar.value, global)
        } else if (reserve.type === 'direct') {
          output.push(reserve.text)
        }
      }
      tar.value = output.join('')
    }
    if (tar.name === 'br') {
      outputIndex++
    }
    let pushChildren = tar.children || []
    if (tar.open) {
      let closeObject = {}
      closeObject.name = tar.name
      closeObject.close = true
      closeObject.unique = tar.unique
      closeObject.open = false
      closeObject.depth = tar.depth
      targets.push(closeObject)
    }
    for (let i = pushChildren.length - 1; i >= 0; i--) {
      const value = pushChildren[i]
      let nextObject = {}
      nextObject = Object.assign({}, value)
      if (tar.hasOwnProperty('params')) {
        nextObject.params = Object.assign({}, tar.params)
      }
      if (tar.hasOwnProperty('parseParams')) {
        nextObject.parseParams = Object.assign({}, tar.parseParams)
      }
      if (tar.hasOwnProperty('paramIndex')) {
        nextObject.paramIndex = tar.paramIndex
      }
      if (tar.hasOwnProperty('answer')) {
        nextObject.answer = tar.answer
      }
      if (tar.name === 'answer') {
        nextObject.answer = true
        nextObject.answerIndex = i
      }
      // console.log('cheek', nextObject)
      targets.push(nextObject)
      // -- lastPrpagate
    }
  }

  return parseOutput
}

export { globalStyle, MainProcess, runVueDom }

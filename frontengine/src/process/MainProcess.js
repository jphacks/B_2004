// import DomProcess from './DomProcess.js'
import CreateAST from './CreateAST.js'
import ScriptProcess from './ScriptProcess.js'
import DomProcess from './DomProcess.js'
import { global } from './moduleProcess.js'
import { domProperty } from './ScriptUtility/domUtility.js'
import { execScript, getScript } from './ScriptUtility/execScript.js'
export default async function (text, props, clear, option) {
  const templateLength = '<template>'.length
  const scriptLength = '<script>'.length
  const styleLength = '<style scoped>'.length
  const templates = text.substr(text.indexOf('<template>') + templateLength, text.indexOf('</template>') - templateLength)
  const script = text.substr(text.indexOf('<script>') + scriptLength, text.indexOf('</script>') - scriptLength - text.indexOf('<script>'))
  const style = text.substr(text.indexOf('<style scoped>') + styleLength, text.indexOf('</style>') - styleLength - text.indexOf('<style scoped>'))
  // ('解析 template:', templates, 'script:', script, 'style:', style)
  // ('解析script ', script)
  const domTree = DomProcess(templates)
  const module = ScriptProcess(script)
  // const data = execScript(global, ['userId'])
  // console.lo('scriptRe', global, module, option, clear)
  // console.lo('dom', domTree)
  const errors = []
  let toProps = {}
  if (Array.isArray(props)) {
    toProps.input = props
  } else {
    // obj型
    toProps = Object.assign(toProps, props)
  }
  // オブジェクト型で例題作ってなかった><
  // const toProps = { input: props }

  if (props) {
    Object.keys(toProps || {}).forEach(key => {
      global[key] = toProps[key]
    })
  }
  console.log('global', global)
  // const getClear = clear
  const getClear = clear
  let checkClear = 0
  let targetIndex = 0
  let output = { status: 'WA', reason: '' }
  const vForGlobal = {}
  // console.log('outputtt', text, props, clear, option)
  if (option && option.mode === 'answerDOM') {
    if (option.existString) {
      let resultOutput = [] // 文字列型の場合は、outputが見れるはず
      let tooru = true
      // let target = domTree
      const targets = []
      targets.push(domTree)
      console.log('answerDom', domTree)
      while (targets.length > 0) {
        const getTar = targets.shift()
        const tar = Object.assign({}, getTar)
        if (tar.params) {
          // console.lo('targets!!', tar.params, tar)
        }
        tooru = false
        // -- v-for
        console.log('mituketa', tar)
        if (tar['v-for']) {
          const target = tar['v-for']
          if (target.type === 'variable' || target.type === 'function') {
            console.log('chhh', target)
            let data = domProperty(target.right, tar.params)
            // とりあえずdataはArray想定 本来ではObjectも考えないといけないよ
            console.log('data', data)
            if (Array.isArray(data)) {
              for (let i = 0; i < data.length; i++) {
                // tar.params = {}
                let nextTarget = Object.assign({}, tar)
                const params = {}
                const keys = Object.values(target.target)
                params[keys[0]] = data[i]
                if (keys.length === 2) {
                  params[keys[1]] = i
                }
                nextTarget.paramIndex = i
                nextTarget.paramValue = data[i]
                nextTarget.params = Object.assign({}, params)
                // console.lo('nextTarget', nextTarget)
                delete nextTarget['v-for']
                targets.push(nextTarget)
              }
            } else {
              // obj
              const keys = Object.keys(data)
              data = Object.values(data)
              for (let i = 0; i < data.length; i++) {
                // tar.params = {}
                let nextTarget = Object.assign({}, tar)
                const params = {}
                const keys = Object.values(target.target)
                params[keys[0]] = data[i]
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
        if (tar.answer && tar.name === 'reserveText') {
          // とりあえずexistStringなので....
          // console.log('tarValue', tar, targetIndex)
          if (tar.value === clear[targetIndex]) {
            checkClear++
          } else {
            return { status: 'WA', reason: 'noneClear', target: clear[targetIndex], targetNone: tar.value, targetIndex: targetIndex }
          }
          targetIndex++
          if (clear.length === checkClear) {
            return { status: 'AC', reason: 'all Accept' }
          }
        } else if (tar.answer) {
          // console.log('tarValue:without', tar)
        }
        // -- lastPropagate
        let i = 0
        // console.log('tar.children', tar.children, tar)
        Object.values(tar.children || {}).forEach(array => {
          array.forEach(value => {
            let nextObject = {}
            nextObject = Object.assign({}, value)
            if (tar.hasOwnProperty('params')) {
              nextObject.params = Object.assign({}, tar.params)
            }
            if (tar.hasOwnProperty('paramIndex')) {
              nextObject.paramIndex = tar.paramIndex
            }
            if (tar.name === 'answer') {
              nextObject.answer = true
              nextObject.answerIndex = i
              i = i + 1
            }
            // console.log('cheek', nextObject)
            targets.push(nextObject)
          })
        })
        // -- lastPrpagate
      }
      return { status: 'WA', reason: 'runCode', info: checkClear, option: option, clear: clear }
    }
  } else {

  }
  // CreateAST(script)
  // console.log('runcode:')
  return { status: 'WA', reason: 'why?runendCode', info: checkClear }
}

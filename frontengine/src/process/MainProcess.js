// import DomProcess from './DomProcess.js'
import CreateAST from './CreateAST.js'
import ScriptProcess from './ScriptProcess.js'
import DomProcess from './DomProcess.js'
import { global } from './moduleProcess.js'
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
  console.log('scriptRe', global, module, option, clear)
  console.log('dom', domTree)
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

  // const getClear = clear
  const getClear = clear
  let checkClear = 0
  let targetIndex = 0
  let output = { status: 'WA', reason: '' }
  const vForGlobal = {}
  console.log('outputtt', text, props, clear, option)
  if (option && option.mode === 'answerDOM') {
    if (option.existString) {
      let resultOutput = [] // 文字列型の場合は、outputが見れるはず
      let tooru = true
      // let target = domTree
      const targets = []
      targets.push(domTree)
      while (targets.length > 0) {
        const getTar = targets.shift()
        const tar = Object.assign({}, getTar)
        if (tar.params) {
          console.log('targets!!', tar.params, tar)
        }
        tooru = false
        // -- v-for
        if (tar['v-for']) {
          const target = tar['v-for']
          if (target.type === 'variable') {
            if (target.variableType === 'global') {
              if (global.hasOwnProperty(target.right)) {
                if (global[target.right]) {
                  let data = global[target.right]
                  if (data.func) {
                    // argumentはまだ未対応><
                    data = getScript(global[target.right], [])
                  }
                  for (let i = 0; i < global[target.right].length; i++) {
                    // tar.params = {}
                    let nextTarget = Object.assign({}, tar)
                    const params = {}
                    if (target && target.target && target.target.index) {
                      params.index = i
                    } else {
                    }
                    nextTarget.paramIndex = i
                    nextTarget.paramValue = global[target.right][i]
                    params.value = global[target.right][i]
                    nextTarget.params = Object.assign({}, params)
                    console.log('nextTarget', nextTarget)
                    delete nextTarget['v-for']
                    targets.push(nextTarget)
                  }
                  continue
                }
              } else {
                return { status: 'WA', reason: 'no!!' + target.rights + ' is not defined!!' }
              }
            } else {
              return { status: 'WA', reason: 'sorry!! no use not Global v-for' }
            }
          } else {
            // func
          }
        }
        // 8-- v-for
        if (tar.name === 'reserveText') {
          console.log('tarValue:none', tar)
          for (let reserve of Object.values(tar.reserves)) {
            const strValueStart = tar.value.substr(0, reserve.start)
            const strValueEnd = tar.value.substr(reserve.end + 1, tar.value.length)
            if (reserve.type === 'function') {
              // とりあえずglobalのみ対応
              const args = []
              for (let argument of reserve.functionArgument) {
                if (tar.params.hasOwnProperty(argument)) {
                  args.push(tar.params[argument])
                } else if (global.hasOwnProperty(argument)) {
                  args.push(global[argument])
                }
              }
              console.log('getterqq', global, tar, args)
              if (!global.hasOwnProperty(reserve.text)) {
                return { status: 'WA', reason: 'funtion no' }
              }
              const getReturn = getScript(global[reserve.text], args)
              const toStr = String(getReturn)
              console.log('getter', global, getReturn, args, toStr)
              tar.value = strValueStart + toStr + strValueEnd
            } else if (reserve.type === 'variable') {
              // tar.value = global[reserve.text]
              const toStr = String(tar.value)
              tar.value = strValueStart + toStr + strValueEnd
            }
          }
        }
        if (tar.answer && tar.name === 'reserveText') {
          // とりあえずexistStringなので....
          console.log('tarValue', tar, targetIndex)
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
          console.log('tarValue:without', tar)
        }
        // -- lastPropagate
        let i = 0
        console.log('tar.children', tar.children, tar)
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
            console.log('cheek', nextObject)
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
  console.log('runcode:')
  return { status: 'WA', reason: 'why?runendCode', info: checkClear }
}

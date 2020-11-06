// import DomProcess from './DomProcess.js'
import CreateAST from './CreateAST.js'
import ScriptProcess from './ScriptProcess.js'
import DomProcess from './DomProcess.js'
import { global } from './moduleProcess.js'
import { execScript, getScript } from './ScriptUtility/execScript.js'
export default function (text, props, clear, option) {
  const templateLength = '<template>'.length
  const scriptLength = '<script>'.length
  const styleLength = '<style scoped>'.length
  const templates = text.substr(text.indexOf('<template>') + templateLength, text.indexOf('</template>') - templateLength)
  const script = text.substr(text.indexOf('<script>') + scriptLength, text.indexOf('</script>') - scriptLength - text.indexOf('<script>'))
  const style = text.substr(text.indexOf('<style scoped>') + styleLength, text.indexOf('</style>') - styleLength - text.indexOf('<style scoped>'))
  // ('解析 template:', templates, 'script:', script, 'style:', style)
  // ('解析script ', script)
  const domTree = DomProcess(templates)
  const scriptRe = ScriptProcess(script)
  const data = execScript(global.testObject, ['userId'])
  console.log('scriptRe', domTree)
  const errors = []
  if (props) {
    Object.keys(props || {}).forEach(key => {
      global[key] = props[key]
    })
  }
  // const getClear = clear
  const getClear = []
  let output = { status: 'WA', reason: '' }
  const vForGlobal = {}
  if (option && option.mode === 'answerDOM') {
    if (option.existString) {
      let tooru = true
      // let target = domTree
      const targets = []
      targets.push(domTree)
      while (targets.length > 0) {
        const tar = targets.pop()
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
                    tar.params = {}
                    if (target.index) {
                      tar.params.index = i
                    }
                    tar.params.value = global[target.right][i]
                    targets.push(tar)
                  }
                  break
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
        // -- v-for
        
      }
    }
  } else {

  }
  // CreateAST(script)
}

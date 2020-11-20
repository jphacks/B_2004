import propsProcess from './ScriptUtility/propsProcess.js'
import dataProcess from './ScriptUtility/dataProcess.js'
import methodsProcess from './ScriptUtility/methodsProcess.js'
import computedProcess from './ScriptUtility/computedProcess.js'
import { execScript } from './ScriptUtility/execScript.js'
let global = {}
export { global }
export default function (ast, props) {
  // console.log('ast', ast)
  global = {}
  const firstBody = ast.program.body[0].declaration.properties
  const modules = {}
  console.log('props', props)
  if (props) {
    Object.keys(props || {}).forEach(key => {
      global[key] = props[key]
    })
  }
  for (const body of firstBody) {
    // console.log('body', body)
    modules[body.key.name] = body
  }
  for (const key of Object.keys(modules)) {
    switch (key) {
      case 'props':
        // mergeObject(propsProcess(modules[key]))
        break
      case 'methods':
        mergeObject(methodsProcess(modules[key]))
        break
      case 'data':
        mergeObject(dataProcess(modules[key]))
        break
      case 'computed':
        mergeObject(computedProcess(modules[key]))
        break
      case 'mounted':
        break
    }
  }
  // console.log('srhjeosije', global.text)
  // const output = execScript(global.testObject, global.text)
  // console.log('moduleOutput', global, modules)
  return modules
}
function mergeObject (obj) {
  Object.keys(obj).forEach(key => {
    global[key] = obj[key]
  })
}

import propsProcess from './ScriptUtility/propsProcess.js'
import dataProcess from './ScriptUtility/dataProcess.js'
import methodsProcess from './ScriptUtility/methodsProcess.js'
import computedProcess from './ScriptUtility/computedProcess.js'
import { execScript } from './ScriptUtility/execScript.js'
const global = {}
export { global }
export default function (ast) {
  // console.log('ast', ast)
  console.log('getkakuninn!!', ast.program.body)
  const firstBody = ast.program.body[0].declaration.properties
  const modules = {}
  for (const body of firstBody) {
    // console.log('body', body)
    modules[body.key.name] = body
  }
  for (const key of Object.keys(modules)) {
    switch (key) {
      case 'props':
        mergeObject(propsProcess(modules[key]))
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
  console.log('output!!!!!', global)
  // const output = execScript(global.testObject, global.text)
  console.log('output!!!', global)
  // console.log('moduleOutput', global, modules)
  return modules
}
function mergeObject (obj) {
  Object.keys(obj).forEach(key => {
    global[key] = obj[key]
  })
}

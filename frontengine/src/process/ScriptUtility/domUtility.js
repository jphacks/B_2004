import { global } from '../moduleProcess.js'
import { execScript, getScript, isBool } from './execScript.js'
export { domProperty }
function domProperty (text, params) {
  const script = scriptCreateAST(text)
  const ToParams = params || {}
  const toDomScript = Object.assign(ToParams, global)
  console.log('scriptDom', script, toDomScript, text)
  if (script.expression) {
    return isBool(script.expression, toDomScript)
  } else if (script.value) {
    return isBool(script.value, toDomScript)
  }
  // console.lo('checcer', script)
  // console.lo('scriptDom', script, toDomScript, isBool(script.expression, toDomScript))
}

function scriptCreateAST (script) {
  const { parse } = require('@babel/parser')
  const ast = parse(script)
  if (ast && ast.program && ast.program.body && ast.program.body[0]) {
    // 一行解析
    return ast.program.body[0]
  }
  if (ast && ast.program && ast.program.directives && ast.program.directives[0]) {
    return ast.program.directives[0]
  }
}

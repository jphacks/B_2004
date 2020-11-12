import { global } from '../moduleProcess.js'
import { execScript, getScript, isBool } from './execScript.js'
export { domProperty }
function domProperty (text, params) {
  const type = typeof Boolean(text)
  console.log('type', type)
  const script = scriptCreateAST(text)
  const ToParams = params || {}
  const toDomScript = Object.assign(ToParams, global)
  const scriptExpression = script.expression || script
  if (script && script.expression) {
    return isBool(script.expression, toDomScript)
  } else if (script && script.value) {
    return isBool(script.value, toDomScript)
  }
  // console.lo('checcer', script)
  // console.lo('scriptDom', script, toDomScript, isBool(script.expression, toDomScript))
}

function scriptCreateAST (script) {
  const { parse } = require('@babel/parser')
  try {
    const ast = parse(script)
    console.log('scriptt', ast)
    if (ast && ast.program && ast.program.body && ast.program.body[0]) {
    // 一行解析
      return ast.program.body[0]
    }
    if (ast && ast.program && ast.program.directives && ast.program.directives[0]) {
      return ast.program.directives[0]
    }
  } catch (e) {
    console.log('error', e)
  }
}

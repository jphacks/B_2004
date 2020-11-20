import { global } from '../moduleProcess.js'
import { execScript, getScript, isBool } from './execScript.js'
export { domProperty }
function domProperty (text, params) {
  const type = typeof Boolean(text)
  console.log('type', type)
  console.log('checcker', text, params)
  const script = scriptCreateAST(text)
  const ToParams = params || {}
  const toDomScript = Object.assign(ToParams, global)
  const scriptExpression = script.expression || script
  if (script && script.expression) {
    const returnBool = isBool(script.expression, toDomScript)
    console.log('returnBool', returnBool)
    return returnBool
  } else if (script && script.value) {
    const returnBool = isBool(script.value, toDomScript)
    console.log('returnBool', returnBool)
    return returnBool
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

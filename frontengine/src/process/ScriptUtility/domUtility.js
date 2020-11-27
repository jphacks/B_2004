import { global } from '../moduleProcess.js'
import { execScript, getScript, isBool } from './execScript.js'
export { domProperty }
function domProperty (text, params) {
  const type = typeof Boolean(text)
  const script = scriptCreateAST(text + ';')
  console.log('script', script, text, params)
  const ToParams = params || {}
  const toDomScript = Object.assign(ToParams, global)
  const scriptExpression = script.expression || script
  if (script && script.expression) {
    const returnBool = isBool(script.expression, toDomScript)
    return returnBool
  } else if (script && script.value) {
    const returnBool = isBool(script.value, toDomScript)
    return returnBool
  } else {
    const returnBool = isBool(script, toDomScript)
    return returnBool
  }
  // console.lo('checcer', script)
  // console.lo('scriptDom', script, toDomScript, isBool(script.expression, toDomScript))
}

function scriptCreateAST (script) {
  const { parse } = require('@babel/parser')
  try {
    const ast = parse(script)
    console.log('sccc', ast)
    if (ast && ast.program && ast.program.body && ast.program.body[0]) {
    // 一行解析
      return ast.program.body[0]
    }
    if (ast && ast.program && ast.program.directives && ast.program.directives[0]) {
      return ast.program.directives[0]
    }
  } catch (e) {
    console.log('error', e)
    const ast = parse('const a = ' + script)
    console.log('ast', ast)
    return ast.program.body[0].declarations[0].init
  }
}

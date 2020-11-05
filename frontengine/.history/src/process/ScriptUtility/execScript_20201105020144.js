import { CheckProperty } from './utility.js'
export { execScript }
function execScript (body, array) {
  // name,valueは予約されている??
  // output {name: name, value: value}
  const local = {}
  const localInfo = {}
  const error = []
  // 引数をとる
  for (let i = 0; i < body.params.length; i++) {
    const getter = body.params[i].name
    local[getter] = array[i]
  }
  // 実際に読み込む
  console.log(body.body.length)
  for (let i = 0; i < body.body.length; i++) {
    switch (body.body[i].type) {
      // 宣言
      case 'VariableDeclaration':
        for (const decalate of body.body[i].decrations) {
          if (local[decalate.id.name]) {
            error.push(decalate)
            continue
          }
          local[decalate.id.name] = decalate.init ? CheckProperty(decalate.init) : null
          localInfo[decalate.id.name] = body.body[i].kind
        }
        // console.log('てすうううううううううううと')
        break
      case 'ExpressionStatement':
        if (body.body[i].expression.type === 'CallExpression') {
          const kumikomi = local[body.body[i].expression.callee.object]
          const target = body.body[i].expression.callee.object
          const arg = body.body[i].expression.arguments
          // ex: hairetu = []
          // hairetu = [ ...[1,2,3,4,5]]
          const kumikomiFuncName = body.body[i].expression.callee.property.name
          if (body.body[i].expression.arguments.type === 'ArrowFunctionExpression') {
            const recName = body.body[i].expression.arguments.body
            local[target][kumikomiFuncName](key => execScript(recName, key))
            // local[body.body[i].expression.callee.object] =
            console.log('てすうううううううううううと', local[target])
          }
        }
        break
      case '':
        break
    }
  }
  // console.log('出力テスト', param)

  /* if (body && body.key && body.key.name) {
    output.name = body.key.name
  }
  if (body.value.type === 'ArrayExpression') {
    output.value = []
    for (const element of body.value.elements) {
      const get = CheckProperty(element)
      output.value.push(Object.values(get || {})[0])
    }
  } else if (body.value.type === 'ObjectExpression') {
    for (const property of body.value.properties) {
      const get = CheckProperty(property)
      for (const key of Object.keys(get || {})) {
        output[key] = get[key]
      }
    }
    if (body.value.properties.length === 0) {
      output.value = {}
    }
  } else {
    // 配列でもオブジェクトでもない型
    if (body.value.extra) {
      output.value = body.value.extra.rawValue
    } else if (body.extra) {
      output.value = body.extra.rawValue
    } else {
      console.log('why? err')
    }
  }
  let out
  if (output.hasOwnProperty('value')) {
    out = output.value
  } else {
    out = {}
  }
  for (const key of Object.keys(output)) {
    if (key === 'd') {
    }
    if (key !== 'name' && key !== 'value') {
      out[key] = output[key]
    }
  }
  return { [output.name || 'name']: out } */
}

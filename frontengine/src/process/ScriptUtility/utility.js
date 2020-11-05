import { global } from '../moduleProcess.js'
export { CheckProperty, getProperty }

// データの代入を支援するfunction {name: value}の形で返される
function CheckProperty (body) {
  // name,valueは予約されている??
  // output {name: name, value: value}
  console.log('get: CheckProperty', body)
  const output = {}
  if (body && body.key && body.key.name) {
    output.name = body.key.name
  }
  let bodyType = body.value ? body.value.type : body.type
  let bodyValue = body.value || body
  if (bodyType === 'ArrayExpression') {
    output.value = []
    const targetElement = bodyValue.elements || body.elements
    for (const element of targetElement) {
      const get = CheckProperty(element)
      output.value.push(Object.values(get || {})[0])
    }
  } else if (bodyType === 'ObjectExpression') {
    for (const property of bodyValue.properties) {
      const get = CheckProperty(property)
      for (const key of Object.keys(get || {})) {
        output[key] = get[key]
      }
    }
    if (bodyValue.properties.length === 0) {
      output.value = {}
    }
  } else if (bodyType === 'CallExpression') {
    let argument = []
    if (bodyValue.hasOwnProperty('arguments')) {
      argument = bodyValue.argument
    }
  } else {
    // 配列でもオブジェクトでもない型
    if (body.value && body.value.extra) {
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
  for (const key of Object.keys(output || {})) {
    if (key === 'd') {
    }
    if (key !== 'name' && key !== 'value') {
      out[key] = output[key]
    }
  }
  console.log('getoutput', out, output)
  if (output.name) {
    console.log('output', output)
    return { [output.name || 'name']: out }
  } else {
    return { name: out }
  }
}

function getProperty (body, local) {
  const key = Object.keys(body)[0]
  console.log('get', body, local, CheckProperty(body))
  if (body.object && body.object.type === 'ThisExpression') {
    return global[body.property.name]
  } else if (body.type && body.type === 'Identifier' && body.name) {
    return local[body.name]
  } else if (body.type && body.type === 'MemberExpression' && body.object) {
    if (body.name) {
      return getProperty(body.object, local)[body.name]
    }
    return getProperty(body.object, local)
  } else {
    const key = Object.keys(CheckProperty(body))[0]
    console.log('aa:getProperty', CheckProperty(body), key)
    return CheckProperty(body)[key]
  }
}

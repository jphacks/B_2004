import { CheckProperty } from './utility.js'
export default function (body, object) {
  // name,valueは予約されている??
  // output {name: name, value: value}
  const local = {}
  console.log('出力テスト', body, object)
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
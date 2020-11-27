import { global } from '../moduleProcess.js'
import { execScript, getScript } from './execScript.js'
export { CheckProperty, getProperty }
// データの代入を支援するfunction {name: value}の形で返される
// checkPropertyのreserveしてるname
const reserveName = 'reserveNameName'
function CheckProperty (body, local, option) {
  // name,valueは予約されている??
  // output {name: name, value: value}
  const output = {}
  if (body && body.key && body.key.name) {
    output[reserveName] = body.key.name
  }
  let bodyType = body.value && body.value.type ? body.value.type : body.type
  let bodyValue = body.value || body
  if (bodyType === 'ArrayExpression') {
    output.value = []
    const targetElement = bodyValue.elements || body.elements
    for (const element of targetElement) {
      const get = getProperty(element, local)
      // console.log('arrayGet', get, element, local)
      output.value.push(get)
    }
  } else if (bodyType === 'ObjectExpression') {
    for (const property of bodyValue.properties) {
      const get = getProperty(property.value, local)
      const key = getProperty(property.key, local)
      console.log('get:objectExpression', get, key, bodyValue)
      output[key] = get
      // for (const key of Object.keys(get || {})) {
      //   if (key !== 'noneDataEDEKQWLDCOLASXMW') {
      //     output[key] = get[key]
      //   }
      // }
    }
    if (bodyValue.properties.length === 0) {
      output.value = {}
    }
  } else if (bodyType === 'CallExpression') {
    let argument = []
    if (bodyValue.hasOwnProperty('arguments')) {
      argument = bodyValue.argument
    }
    let target = bodyValue
    let couho = []
    while (true) {
      const flag = false

      if (!flag) {
        break
      }
    }
  } else if (bodyType === 'BooleanLiteral') {
    // true or false
    output.value = body.value
  } else if (bodyType === 'ThisExpression') {
    output.value = global
  } else {
    // 配列でもオブジェクトでもない型
    if (body.value && body.value.extra) {
      output.value = body.value.extra.rawValue
    } else if (body.extra) {
      output.value = body.extra.rawValue
    } else {

    }
  }
  let out
  if (output.hasOwnProperty('value')) {
    out = output.value
  } else {
    // noneDataEDEKQWLDCOLASXMW はdataがない時のやつ
    out = {}
  }
  for (const key of Object.keys(output || {})) {
    if (key === 'd') {
    }
    if (key !== [reserveName] && key !== 'value' && key !== 'noneDataEDEKQWLDCOLASXMW') {
      out[key] = output[key]
    }
  }

  if (output[reserveName]) {
    return { [output[reserveName] || [reserveName]]: out }
  } else {
    return { name: out }
  }
}

function getProperty (body, local, funcArguments) {
  if (!body) {
    console.error('maybe body is null or undifiend?', body, local)
    return false
  }
  console.log('getts', body, local)
  const key = Object.keys(body || {})[0]
  if (body && body.type === 'ThisExpression') {
    return global
  } else if (body.type && body.type === 'Identifier' && body.name) {
    // console.log('first:maybe', body, local, !!local[body.name])
    if (local && local.hasOwnProperty(body.name)) {
      if (local[body.name] && local[body.name].hasOwnProperty('func') && local[body.name].computed) {
        return getScript(local[body.name], [], local)
      }
      return local[body.name]
    } else {
      // maybe javascript default item
      switch (body.name) {
        case 'Object':
          return Object
        case 'Array':
          return Array
        case 'Number':
          return Number
        case 'String':
          return String
        case 'Boolean':
          return Boolean
      }
      return body.name
    }
  } else if (body.type && body.type === 'MemberExpression' && body.object) {
    if (body.name) {
      return getProperty(body.object, local)[body.name]
    } else if (body.property) {
      const outputData = getProperty(body.object, local)
      console.log('outputData', outputData, body)
      if (!outputData) {
        return outputData
      }
      // // console.log('join?', body, outputData, body.property.name, outputData[body.property.name](''), funcArguments)
      // // console.log('join', outputData[body.property.name](...funcArguments), !!funcArguments)
      // const testGlobal = Object.assign({}, global)
      if (!!funcArguments && outputData && outputData[body.property.name]) {
        return outputData[body.property.name](...funcArguments)
      } else if (body.property.name) {
        // console.log('bodymemberrr', outputData[body.property.name], outputData, body.property.name)
        if (!outputData.hasOwnProperty(body.property.name)) {
          return outputData[getProperty(body.property, local)]
        } else {
          return outputData[body.property.name]
        }
      } else if (body.property.extra) {
        if (outputData) {
          const index = getProperty(body.property, local)
          return outputData[index]
        }
      }
    }
    return getProperty(body.object, local)
  } else if (body.type === 'CallExpression') {
    let propertyArguments = []
    if (body.arguments) {
      for (let param of body.arguments) {
        if (param.type === 'FunctionExpression') {
          console.error('sorry!! argument dont use function!!')
          return false
        } else {
          propertyArguments.push(getProperty(param, local))
        }
      }
      if (body.callee) {
        // console.log('callee', propertyArguments, local, body)
        const outputData = getProperty(body.callee, local, propertyArguments)
        if (!outputData) {
          return outputData
        }
        if (outputData && outputData.type === 'FunctionExpression') {
          // この処理は少しおかしい気がするぞ...
          return getProperty(outputData, local, propertyArguments)
        } else if (outputData.computed) {
          return getScript(outputData, [], local)
        }
        return outputData
      }
    }
  } else if (body.type === 'FunctionExpression') {
    console.log('functionExpress', body, funcArguments, local)
    return getScript(body, funcArguments, local)
  } else if (body.type === 'BlockStatement' && body.computed) {
    // console.log('computed', body)
    return getScript(body, [], local)
  } else if (body.type === 'ObjectProperty') {
    const lustGet = getProperty(body.value, local, funcArguments)
    console.log('body:data::', lustGet, body)
    return lustGet
  } else {
    let data = CheckProperty(body, local)
    let key = 'key'
    if (typeof data === 'object') {
      key = Object.keys(data || {})[0]
    }
    return data[key]
  }
}

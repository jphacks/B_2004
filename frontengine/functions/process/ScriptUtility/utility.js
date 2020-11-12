/* import { global } from '../moduleProcess.js'
import { execScript } from './execScript.js'
export { CheckProperty, getProperty } */
const global = require('../moduleProcess.js');
const execScript = require('./execScript.js');
exports.CheckProperty = CheckProperty
exports.getProperty = getProperty
// データの代入を支援するfunction {name: value}の形で返される
function CheckProperty (body, option) {
  // name,valueは予約されている??
  // output {name: name, value: value}

  const output = {}
  if (body && body.key && body.key.name) {
    output.name = body.key.name
  }
  let bodyType = body.value && body.value.type ? body.value.type : body.type
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
      // console.log('getter', get)
      for (const key of Object.keys(get || {})) {
        if (key !== 'noneDataEDEKQWLDCOLASXMW') {
          output[key] = get[key]
        }
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
    if (key !== 'name' && key !== 'value' && key !== 'noneDataEDEKQWLDCOLASXMW') {
      out[key] = output[key]
    }
  }

  if (output.name) {
    return { [output.name || 'name']: out }
  } else {
    return { name: out }
  }
}

function getProperty (body, local, funcArguments) {
  // console.log('first', body, local)
  if (!body) {
    console.error('maybe body is null or undifiend?', body, local)
    return false
  }
  const key = Object.keys(body || {})[0]
  if (body && body.type === 'ThisExpression') {
    return global
  } else if (body.type && body.type === 'Identifier' && body.name) {
    // console.log('first:maybe', body, local, !!local[body.name])
    if (local.hasOwnProperty(body.name)) {
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
    }
  } else if (body.type && body.type === 'MemberExpression' && body.object) {
    // console.log('bodyMeber', body, local, funcArguments)
    if (body.name) {
      return getProperty(body.object, local)[body.name]
    } else if (body.property) {
      const outputData = getProperty(body.object, local)
      // // console.log('join?', body, outputData, body.property.name, outputData[body.property.name](''), funcArguments)
      // // console.log('join', outputData[body.property.name](...funcArguments), !!funcArguments)
      if (!!funcArguments) {
        return outputData[body.property.name](...funcArguments)
      } else if (body.property.name) {
        // console.log('bodymemberrr', outputData[body.property.name], outputData, body.property.name)
        if (!outputData[body.property.name]) {
          return outputData[getProperty(body.property, local)]
        } else {
          return outputData[body.property.name]
        }
      } else if (body.property.extra) {
        return outputData[getProperty(body.property, local)]
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
        // console.log('callee', propertyArguments)
        const outputData = getProperty(body.callee, local, propertyArguments)
        // console.log('getter', outputData)
        return outputData
      }
    }
  } else {
    let data = CheckProperty(body)
    let key = 'key'
    if (typeof data === 'object') {
      key = Object.keys(data || {})[0]
    }
    // console.log('return', data[key], data)
    return data[key]
  }
}

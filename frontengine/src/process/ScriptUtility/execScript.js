import { CheckProperty, getProperty } from './utility.js'
import { global } from '../moduleProcess.js'
export { execScript, getScript, scriptCreateAST, isBool }
function getScript (body, array, preLocal) {
  return execScript(body, array, preLocal).returnArguments
}
function execScript (body, array, preLocal) {
  // name,valueは予約されている??
  // output {name: name, value: value}
  let local = {}
  if (preLocal) {
    // console.lo('local', local, preLocal)
    local = Object.assign(local, preLocal)
  }
  const localInfo = {}
  const error = []
  let access = body
  // 引数をとる
  if (array && body.params) {
    for (let i = 0; i < body.params.length; i++) {
      local[body.params[i].name] = array[i]
    }
  }
  // console.lo('array', array, local)
  for (let key of Object.keys(local || {})) {
    // console.lo('output', local[key])
  }
  //
  //
  // 実際に読み込む
  //
  // console.lo('body', body)
  if (body.body && body.body.type === 'BlockStatement') {
    access = body.body
  }
  if (access.hasOwnProperty('consequent')) {
    if (!access.body) {
      access.body = []
    }
    access.body.push(...access.consequent)
  }
  const rowParams = Object.keys(body.params || {}).length
  const row = Object.keys(access.body || {}).length
  for (let i = 0; i < row; i++) {
    //
    if (!access || !access.body[i] || !access.body[i].type) {
      continue
    }

    switch (access.body[i].type) {
      // 宣言
      case 'VariableDeclaration':
        //
        if (!access.body[i].declarations) {
          continue
        }

        for (const decalate of Object.values(access.body[i].declarations || {})) {
          if (local[decalate.id.name]) {
            error.push(decalate)
            continue
          }
          local[decalate.id.name] = decalate.init ? calculation(decalate.init, local) : null
          localInfo[decalate.id.name] = decalate.kind
        }
        break
      case 'ExpressionStatement':
        // console.lo('argument', access.body[i])
        if (access.body[i].expression && access.body[i].expression.type === 'CallExpression') {
          const target = access.body[i].expression.callee
          if (target.object && target.object.type === 'ThisExpression') {
            execScript(global[target.property.name], access.body[i].expression.arguments)
          } else {
            const args = []
            const getRawArgs = access.body[i].expression.arguments
            for (let i = 0; i < getRawArgs.length; i++) {
              args.push(getProperty(getRawArgs[i], local))
            }
            getProperty(target, local, args)
            // console.log('getter', getter, args)
          }
        } else if (access.body[i].expression && access.body[i].expression.type === 'AssignmentExpression') {
          // console.log('functionExpress::!!!:assign', body, array, preLocal)
          // console.lo('chhhhhh', access.body[i].expression)
          if (access.body[i].expression.left.name && local.hasOwnProperty(access.body[i].expression.left.name)) {
            local[access.body[i].expression.left.name] = calculation(access.body[i].expression.right, local)
            // console.lo('checcer', calculation(access.body[i].expression.right, local))
          } else if (access.body[i].expression.left.property && access.body[i].expression.left.property.name) {
            global[access.body[i].expression.left.property.name] = calculation(access.body[i].expression.right, local)
          }
        } else if (access.body[i].expression && access.body[i].expression.type === 'UpdateExpression') {
          // console.lo('update:argument')
          const targetUpate = access.body[i].expression.argument
          if (targetUpate.name && local.hasOwnProperty(targetUpate.name)) {
            // console.lo('update:argument:local', calculation(targetUpate, local))
            local[targetUpate.name] = calculation(access.body[i].expression, local)
          } else if (targetUpate.name && global.hasOwnProperty(targetUpate.name)) {
            // console.lo('update:argument:glbal')
            global[targetUpate.name] = calculation(access.body[i].expression, local)
          }
        }
        break
      case 'ForStatement':

        const target = access.body[i]
        const initTarget = target.init.declarations[0]
        const initName = initTarget.id.name
        let initIndex = calculation(initTarget.init, local)
        const readyupdate = target.update
        let updateCalculation = target.update.right
        if (!target.update.right) {
          // argument?
          updateCalculation = target.update
        }
        // console.lo('update', readyupdate)
        let updateName = ''
        if (readyupdate.left) {
          updateName = readyupdate.left.name
        } else {
          // argument
          updateName = readyupdate.argument.name
        }
        // const updateName = readyupdate.left.name
        const readyBool = target.test
        // console.lo('isBool(readyBool, { ...local, [initName]: initIndex })', isBool(readyBool, { ...local, [initName]: initIndex }))
        while (isBool(readyBool, { ...local, [initName]: initIndex })) {
          let get = execScript(target.body, array, { ...local, [initName]: initIndex })
          Object.keys(get.returnLocal || {}).forEach(key => {
            if (key !== initName) {
              local[key] = get.returnLocal[key]
            }
          })
          if (get.returnOrder === 'break') {
            break
          }
          // updateFunc
          if (initName === updateName) {
            initIndex = calculation(updateCalculation, { ...local, [initName]: initIndex })
            if (initIndex === false) {
              console.error('why false!?', updateCalculation, initIndex)
              break
            }
          } else {
            local[updateName] = calculation(updateCalculation, { ...local, [initName]: initIndex })
          }
        }
        break
      case 'BreakStatement':
        let output = { returnArguments: {}, returnLocal: { ...preLocal }, returnOrder: 'break' }
        Object.keys(preLocal || {}).forEach(key => {
          output.returnLocal[key] = local[key]
        })
        return output
      case 'IfStatement':
        let targetGO = access.body[i]
        let targetDo = null
        while (true) {
          if (!targetGO.hasOwnProperty('test')) {
            // else
            // -> つまりifでないものが全てとおる
            targetDo = targetGO
            break
          }
          let resultBool = isBool(targetGO.test, local)
          if (!resultBool) {
            // false
            if (targetGO.alternate) {
              targetGO = targetGO.alternate
            } else {
              break
            }
          } else {
            // true
            targetDo = targetGO.consequent
            break
          }
        }
        if (targetDo) {
          let get = execScript(targetDo, array, local)

          Object.keys(get.returnLocal || {}).forEach(key => {
            local[key] = get.returnLocal[key]
          })
        }
        break
      case 'ReturnStatement':
        const argument = access.body[i].argument
        let outputReturn = { returnArguments: {}, returnLocal: { ...preLocal }, returnOrder: 'return' }
        const returnData = getProperty(argument, local)
        outputReturn.returnArguments = returnData
        // console.lo('getter', outputReturn, argument, returnData, local)
        Object.keys(preLocal || {}).forEach(key => {
          outputReturn.returnLocal[key] = local[key]
        })
        return outputReturn
      case 'ContinueStatement':
        let ContinueOutput = { returnArguments: {}, returnLocal: { ...preLocal }, returnOrder: 'break' }
        Object.keys(preLocal || {}).forEach(key => {
          ContinueOutput.returnLocal[key] = local[key]
        })
        return ContinueOutput
      case 'SwitchStatement':
        const cases = access.body[i].cases
        const discriminant = access.body[i].discriminant
        const discriminantValue = getProperty(discriminant, local)
        for (let takeCase of cases) {
          const testValue = getProperty(takeCase.test, local)
          // console.lo('discriminantValue', discriminantValue, 'testValue', testValue)
          if (!testValue) {
            // maybeDefault
            const get = execScript(takeCase, array, local)
            // console.lo('switchGet', get)
            if (get.returnOrder === 'break') {
              break
            }
            continue
          }
          const createBool = scriptCreateAST(String(discriminantValue) + '===' + String(testValue)).expression
          const check = isBool(createBool, local)
          // console.lo('checkerr', check, createBool)
          // console.lo('checker', createBool)
          if (check) {
            // このケースに該当する
            // console.lo('bbo', createBool)
            const get = execScript(takeCase, array, local)
            // console.lo('switchGet', get)
            if (get.returnOrder === 'break') {
              break
            }
          }
        }
        break
    }
  }
  let output = { returnArguments: {}, returnLocal: { ...preLocal }, returnOrder: 'end' }
  Object.keys(preLocal || {}).forEach(key => {
    output.returnLocal[key] = local[key]
  })

  return output
}

function calculation (body, local, params, err, type) {
  if (err) {
    return 'err'
  }
  if (!local) {
    return 'err'
  }
  if (body && body.left && body.right) {
    switch (body.operator) {
      case '+':
        return calculation(body.left, local, params, err, type) + calculation(body.right, local, params, err, type)
      case '-':
        return calculation(body.left, local, params, err, type) - calculation(body.right, local, params, err, type)
      case '/':
        return calculation(body.left, local, params, err, type) / calculation(body.right, local, params, err, type)
      case '*':
        return calculation(body.left, local, params, err, type) * calculation(body.right, local, params, err, type)
      case '%':
        return calculation(body.left, local, params, err, type) % calculation(body.right, local, params, err, type)
      case '**':
        return calculation(body.left, local, params, err, type) ** calculation(body.right, local, params, err, type)
    }
  } else if (body && body.hasOwnProperty('argument')) {
    switch (body.operator) {
      case '++':
        return getProperty(body.argument, local) + 1
      case '--':
        return getProperty(body.argument, local) - 1
      case '-':
        return -getProperty(body.argument, local)
    }
  }

  return getProperty(body, local)
}

function naibuKansu (body, local) {
  if (body.object && body.property) {
    return getProperty(body.object, local)
  }
}

function isBool (body, local, params, err, type) {
  if (err) {
    return 'err'
  }
  if (!local) {
    return 'err'
  }
  if (body.operator) {
    switch (body.operator) {
      case '!':
        return !isBool(body.argument, local, params, err, type)
      case '>':
        return isBool(body.left, local, params, err, type) > isBool(body.right, local, params, err, type)
      case '>=':
        return isBool(body.left, local, params, err, type) >= isBool(body.right, local, params, err, type)
      case '<':
        return isBool(body.left, local, params, err, type) < isBool(body.right, local, params, err, type)
      case '<=':
        return isBool(body.left, local, params, err, type) <= isBool(body.right, local, params, err, type)
      case '||':
        return isBool(body.left, local, params, err, type) || isBool(body.right, local, params, err, type)
      case '===':
        return isBool(body.left, local, params, err, type) === isBool(body.right, local, params, err, type)
      case '==':
        return isBool(body.left, local, params, err, type) == isBool(body.right, local, params, err, type)
      case '|':
        return isBool(body.left, local, params, err, type) | isBool(body.right, local, params, err, type)
      case '&&':
        return isBool(body.left, local, params, err, type) && isBool(body.right, local, params, err, type)
      case '&':
        return isBool(body.left, local, params, err, type) & isBool(body.right, local, params, err, type)
      case '!==':
        return isBool(body.left, local, params, err, type) !== isBool(body.right, local, params, err, type)
      case '!=':
        return isBool(body.left, local, params, err, type) !== isBool(body.right, local, params, err, type)
    }
    return calculation(body, local, params, err, type)
  }
  return calculation(body, local, params, err, type)
}

function scriptCreateAST (script) {
  const { parse } = require('@babel/parser')
  const ast = parse(script)
  if (ast && ast.program && ast.program.body && ast.program.body[0]) {
    // 一行解析
    return ast.program.body[0]
  }
}

import { CheckProperty, getProperty } from './utility.js'
import { global } from '../moduleProcess.js'
export { execScript }
function execScript (body, array, preLocal) {
  // name,valueは予約されている??
  // output {name: name, value: value}
  let local = {}
  if (preLocal) {
    local = Object.assign(local, preLocal)
  }
  const localInfo = {}
  const error = []
  let access = body
  // 引数をとる
  console.log('global', global)
  // console.log('ast', JSON.stringify(body, null, 2))
  // console.log(Object.values(access.type))
  // 実際に読み込む
  // console.log(body.body.length)
  if (body.body && body.body.type === 'BlockStatement') {
    access = body.body
  }
  const rowParams = Object.keys(body.params || {}).length
  const row = Object.keys(access.body || {}).length
  for (let i = 0; i < rowParams; i++) {
    const getter = body.params[0].name
    local[getter] = array[i]
  }
  for (let i = 0; i < row; i++) {
    // console.log(access.body[i].type)
    if (!access || !access.body[i] || !access.body[i].type) {
      continue
    }
    console.log('これ見る', access.body[i], access.body[i].type, local)
    switch (access.body[i].type) {
      // 宣言
      case 'VariableDeclaration':
        // console.log(access.body[i].type)
        if (!access.body[i].declarations) {
          continue
        }
        console.log('確認', access.body[i].declarations[0].init, calculation(access.body[i].declarations[0].init, local))
        for (const decalate of Object.values(access.body[i].declarations || {})) {
          if (local[decalate.id.name]) {
            error.push(decalate)
            continue
          }
          local[decalate.id.name] = decalate.init ? calculation(decalate.init, local) : null
          localInfo[decalate.id.name] = decalate.kind
          console.log('toLocal', local, decalate)
        }
        break
      case 'ExpressionStatement':
        console.log('ExpressionStatement', access.body[i])
        if (access.body[i].expression && access.body[i].expression.type === 'CallExpression') {
          const target = access.body[i].expression.callee
          if (target.object && target.object.type === 'ThisExpression') {
            execScript(global[target.property.name], access.body[i].expression.arguments)
          }
        } else if (access.body[i].expression && access.body[i].expression.type === 'AssignmentExpression') {
          if (access.body[i].expression.left.name && local.hasOwnProperty(access.body[i].expression.left.name)) {
            console.log('check:dasdasd', local, access.body[i], access.body[i].expression)
            local[access.body[i].expression.left.name] = calculation(access.body[i].expression.right, local)
          } else if (access.body[i].expression.left.property && access.body[i].expression.left.property.name) {
            console.log('global', calculation(access.body[i].expression.right, local))
            global[access.body[i].expression.left.property.name] = calculation(access.body[i].expression.right, local)
          }
        }
        break
      case 'ForStatement':
        console.log('forstate:start', body, access.body[i])
        const target = access.body[i]
        const initTarget = target.init.declarations[0]
        const initName = initTarget.id.name
        let initIndex = calculation(initTarget.init, local)
        const readyupdate = target.update
        const updateCalculation = target.update.right
        const updateName = readyupdate.left.name
        const readyBool = target.test
        console.log('forstate:update', initTarget, { ...local, [initName]: initIndex }, readyBool)
        console.log('forstate', readyBool)
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
          if (!isBool(targetGO.test, local)) {
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
          console.log('done!!', targetDo, local, get)
          Object.keys(get.returnLocal || {}).forEach(key => {
            local[key] = get.returnLocal[key]
          })
        }
        break
    }
  }
  let output = { returnArguments: {}, returnLocal: { ...preLocal }, returnOrder: 'end' }
  Object.keys(preLocal || {}).forEach(key => {
    output.returnLocal[key] = local[key]
  })
  console.log('local:end', local, global, output)
  return output
}

function calculation (body, local, params, err, type) {
  console.log('get!!', body, local)
  if (err) {
    return 'err'
  }
  if (!local) {
    console.log('check:calculation', body, local)
    return 'err'
  }
  if (body.left && body.right) {
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
  }
  console.log('getdata', getProperty(body, local))
  return getProperty(body, local)
}

function naibuKansu (body, local) {
  console.log('みーーーる！！', getProperty(body.object, local))
  if (body.object && body.property) {
    return getProperty(body.object, local)
  }
}

function isBool (body, local, params, err, type) {
  console.log('get!!', body, local)
  if (err) {
    return 'err'
  }
  if (!local) {
    console.log('check:isBool', body, local)
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
    }
    return getProperty(body, local)
  }
  return getProperty(body, local)
}

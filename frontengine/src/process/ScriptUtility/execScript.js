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
    console.log('これ見る', access.body[i], access, access.body[i].type)
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
          console.log('get!!ugoiteruu', local, access.body[i])
          if (access.body[i].expression.left.name && local[access.body[i].expression.left.name]) {
            local[access.body[i].expression.left.name] = calculation(access.body[i].expression.right, local)
          } else if (access.body[i].expression.left.property && access.body[i].expression.left.property.name) {
            console.log('global', calculation(access.body[i].expression.right, local))
            global[access.body[i].expression.left.property.name] = calculation(access.body[i].expression.right, local)
          }
        }
        break
      case '':
        break
    }
  }

  console.log('local', local, global)
}

function calculation (body, local, params, err, type) {
  console.log('get!!', body, local)
  if (err) {
    return 'err'
  }
  if (body.left && body.right) {
    switch (body.operator) {
      case '+':
        return calculation(body.left, params, err, type) + calculation(body.right, params, err, type)
      case '-':
        return calculation(body.left, params, err, type) - calculation(body.right, params, err, type)
      case '/':
        return calculation(body.left, params, err, type) / calculation(body.right, params, err, type)
      case '*':
        return calculation(body.left, params, err, type) * calculation(body.right, params, err, type)
      case '%':
        return calculation(body.left, params, err, type) % calculation(body.right, params, err, type)
      case '**':
        return calculation(body.left, params, err, type) ** calculation(body.right, params, err, type)
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

import { CheckProperty } from './utility.js'
export { execScript }
function execScript (body, array) {
  // name,valueは予約されている??
  // output {name: name, value: value}
  const local = {}
  const localInfo = {}
  const error = []
  let access = body
  // 引数をとる
  console.log('ast', JSON.stringify(body, null, 2))
  // console.log(Object.values(access.type))
  // 実際に読み込む
  // console.log(body.body.length)
  if (body.body.type === 'BlockStatement') {
    access = body.body
  }
  const rowParams = Object.keys(body.params).length
  const row = Object.keys(access.body).length
  for (let i = 0; i < rowParams; i++) {
    const getter = body.params[0].name
    local[getter] = array[i]
  }
  for (let i = 0; i < row; i++) {
    // console.log(access.body[i].type)
    switch (access.body[i].type) {
      // 宣言
      case 'VariableDeclaration':
        console.log(access.body[i].type)
        for (const decalate of access.body[i].declations) {
          if (local[decalate.id.name]) {
            error.push(decalate)
            continue
          }
          local[decalate.id.name] = decalate.init ? CheckProperty(decalate.init) : null
          localInfo[decalate.id.name] = access[i].kind
        }
        // console.log('てすうううううううううううと')
        break
      case 'ExpressionStatement':
        if (access.body[i].expression.type === 'CallExpression') {
          const target = access[i].expression.callee.object
          let kumikomiFuncName = ''
          if (access[i].expression.callee && access[i].expression.callee.property) {
            kumikomiFuncName = access.body[i].expression.callee.property.name
          }
          if (access.body[i].expression.arguments.type === 'ArrowFunctionExpression') {
            const recName = access.body[i].expression.arguments.body
            local[target][kumikomiFuncName](key => execScript(recName, key))
            // local[body.body[i].expression.callee.object] =
            // console.log('てすうううううううううううと', local[target])
          }
        }
        break
      case '':
        break
    }
  }
}

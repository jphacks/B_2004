import { CheckProperty } from './utility.js'
export { execScript }
function execScript (body, array) {
  // name,valueは予約されている??
  // output {name: name, value: value}
  const local = {}
  const localInfo = {}
  const error = []
  const access = body
  // 引数をとる
  const rowParams = Object.keys(access.params).length
  const row = Object.keys(access.body).length
  console.log('ast', JSON.stringify(body, null, 2))
  // console.log(Object.values(access.type))
  

  for (let i = 0; i < rowParams; i++) {
    const getter = access.params[0].name
    local[getter] = array[i]
  }
  // 実際に読み込む
  // console.log(body.body.length)
  for (let i = 0; i < row; i++) {
    switch (body && body.key && body.key.name && access.body[i].type) {
      // 宣言
      case 'VariableDeclaration':
        console.log(body && body.key && body.key.name && access.body[i].type)
        for (const decalate of access[i].decrations) {
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
        if (access[i].expression && access[i].expression.type === 'CallExpression') {
          const kumikomi = local[access[i].expression.callee.object]
          const target = access[i].expression.callee.object
          const arg = access[i].expression.arguments
          // ex: hairetu = []
          // hairetu = [ ...[1,2,3,4,5]]
          let kumikomiFuncName = ''
          if (access[i].expression.callee && access[i].expression.callee.property) {
            kumikomiFuncName = access[i].expression.callee.property.name
          }
          if (access[i].expression.arguments.type === 'ArrowFunctionExpression') {
            const recName = access[i].expression.arguments.body
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

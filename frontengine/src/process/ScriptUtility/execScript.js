import { CheckProperty } from './utility.js'
import { global } from '../moduleProcess.js'
export { execScript }
function execScript (body, array) {
  // name,valueは予約されている??
  // output {name: name, value: value}
  const local = {}
  const localInfo = {}
  const error = []
  let access = body
  // 引数をとる
  console.log('global', global)
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
    console.log('これ見る', access.body[i], access)
    switch (access.body[i].type) {
      // 宣言
      case 'VariableDeclaration':
        // console.log(access.body[i].type)
        for (const decalate of access.body[i].declations) {
          if (local[decalate.id.name]) {
            error.push(decalate)
            continue
          }
          local[decalate.id.name] = decalate.init ? CheckProperty(decalate.init) : null
          localInfo[decalate.id.name] = access[i].kind
        }
        break
      case 'ExpressionStatement':
        console.log(access.body[i].expression.type)
        if (access.body[i].expression && access.body[i].expression.type === 'CallExpression') {
          const target = access.body[i].expression.callee
          if (target.object && target.object.type === 'ThisExpression') {
            execScript(global[target.property.name], access.body[i].expression.arguments)
          }
          /* // 組み込み関数のとき
          let kumikomiFuncName = ''
          if (access.body[i].expression.callee && access.body[i].expression.callee.property) {
            kumikomiFuncName = access.body[i].expression.callee.property.name
          }
          if (access.body[i].expression.arguments.type === 'ArrowFunctionExpression') {
            const recName = access.body[i].expression.arguments.body
            local[target][kumikomiFuncName](key => execScript(recName, key))
          }
          // 組み込み関数の時 */
        }
        break
      case '':
        break
    }
  }
}

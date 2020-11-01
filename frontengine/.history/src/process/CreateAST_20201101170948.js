const babylon = require('babylon')
const log = require('babel-log')
// hogeをfugaに変更する関数
export default function (script) {
  const ast = babylon.parse(script)
  log(ast)
  // console.log(printAST(ast, true))
}
r
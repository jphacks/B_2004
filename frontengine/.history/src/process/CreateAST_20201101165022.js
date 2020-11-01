const babylon = require('babylon')
// hogeをfugaに変更する関数
export default function (script) {
    const ast = babylon.parse(script)
    console.log(ast)
}
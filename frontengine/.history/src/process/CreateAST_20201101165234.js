const babylon = require('babylon')
// hogeをfugaに変更する関数
export default function (text) {
    const ast = babylon.parse(text)
    console.log(ast)
}
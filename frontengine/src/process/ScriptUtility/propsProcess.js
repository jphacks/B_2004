export default function (body) {
  const output = {}
  console.log('take', body)
  if (body.value.type === 'ObjectExpression') {
    // オブジェクト??
    for (const take of body.value.properties) {
      if (take.value.type === 'Identifier') {
        // 変数: type型
        output[take.key.name] = {}
        output[take.key.name].name = take.key.name
        output[take.key.name].type = take.value.name
      } else {
        // 変数: {}
        output[take.key.name] = {}
        output[take.key.name].name = take.key.name
        for (const property of take.value.properties) {
          if (property.value.type === 'Identifier') {
            output[take.key.name][property.key.name] = property.value.name
            continue
          }
          if (property.value.type === 'StringLiteral') {
            output[take.key.name][property.key.name] = property.value.value
          }
        }
      }
    }
  } else if (body.value.type === 'ArrayExpression') {
    // 配列??
    for (const take of body.value.elements) {
      if (take.value.type === 'Identifier') {
        // 変数: type型
        output[take.key.name] = {}
        output[take.key.name].name = take.key.name
      }
    }
  }
  return output
}

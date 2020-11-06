exports.methodProcess = function (body) {
  const output = {}
  for (const property of body.value.properties) {
    output[property.key.name] = property.value
    if (output[property.key.name]) {
      output[property.key.name].func = true
    }
  }
  return output
}

export default function (body) {
  const output = {}
  for (const property of body.value.properties) {
    output[property.key.name] = property.value
    output[property.key.name].func = true
  }
  return output
}

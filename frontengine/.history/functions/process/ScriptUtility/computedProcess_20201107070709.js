export default function (body) {
  const output = {}
  for (const property of body.value.properties) {
    output[property.key.name] = property.body
    if (!property.body) {
      continue
    } else {

    }
    output[property.key.name].computed = true
    output[property.key.name].func = true
  }
  return output
}

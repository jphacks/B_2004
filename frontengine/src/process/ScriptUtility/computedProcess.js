export default function (body) {
  const output = {}
  for (const property of body.value.properties) {
    output[property.key.name] = property.body
    if (!property.body) {
      console.log('computed', property)
      continue
    } else {

    }
    output[property.key.name].computed = true
  }
  return output
}

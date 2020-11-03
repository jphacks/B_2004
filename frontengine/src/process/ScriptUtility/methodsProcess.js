export default function (body) {
  const output = {}
  for (const property of body.value.properties) {
    output[property.key.name] = property.value
  }
  return output
}

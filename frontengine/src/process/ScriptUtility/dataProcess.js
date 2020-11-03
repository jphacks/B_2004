import { CheckProperty } from './utility.js'
export default function (body) {
  const output = {}
  for (const property of body.body.body[0].argument.properties) {
    const getter = CheckProperty(property)
    for (const key of Object.keys(getter)) {
      // O(1)
      output[key] = getter[key]
    }
  }
  return output
}

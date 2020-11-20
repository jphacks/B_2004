import { CheckProperty, getProperty } from './utility.js'
import { global } from '../moduleProcess.js'
export default function (body) {
  const output = {}
  for (const property of body.body.body[0].argument.properties) {
    const getter = getProperty(property)
    output[property.key.name] = getter
  }
  return output
}

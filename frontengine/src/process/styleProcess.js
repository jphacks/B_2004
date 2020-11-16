export { styleProperty }

function styleProperty (style, path) {
  console.log('style:test', style)
  const output = {}
  output.class = {}
  output.id = {}
  output.tag = {}
  let target = []
  for (let i = 0; i < style.length; i++) {
    const val = style[i]
    if (val == ' ' || val == '\n' || val == '/s' || val == '↵') {
      continue
    }
    if (val === '{') {
      let targetInput = 'tag'
      switch (target[0]) {
        case '.':
          targetInput = 'class'
          target.shift()
          break
        case '#':
          targetInput = 'id'
          target.shift()
          break
      }
      let targetVal = target.join('')
      console.log('style:target', targetVal, targetInput)
      output[targetInput][targetVal] = {}
      i++
      let outputKey = []
      let value = []
      let coron = false
      for (;i < style.length; i++) {
        if (style[i] == '}') {
          // とりあえずclassの階層構造は無視
          break
        }
        if (style[i] != ';') {
          if (style[i] == ':') {
            coron = true
            continue
          }
          if (!coron) {
            if (style[i] == ' ' || style[i] == '\n' || style[i] == '/s' || style[i] == '↵') {
              continue
            }
            outputKey.push(style[i])
          } else {
            value.push(style[i])
          }
        } else {
          output[targetInput][targetVal][outputKey.join('')] = value.join('')
          outputKey = []
          value = []
          coron = false
        }
      }
      target = []
    } else {
      target.push(val)
    }
  }
  console.log('style:output', output)
  let str = path
  if (!str) {
    str = 'default'
  }
  return { [str]: output }
}

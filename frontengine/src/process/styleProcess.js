export { styleProperty }

function styleProperty (style) {
  console.log('style:test', style)
  const output = {}
  output.class = {}
  output.id = {}
  output.tag = {}
  const target = []
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
      output[targetVal] = {}
      i++
      for (; ; i++) {

      }
    } else {
      target.push(val)
    }
  }
}

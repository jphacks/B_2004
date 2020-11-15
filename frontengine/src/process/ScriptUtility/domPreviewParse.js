export { domPreviewParse }
function domPreviewParse (domTree, fileName) {
  console.log('getDomPreviewParse', domTree)
  const output = []
  let stack = [domTree]
  while (stack.length > 0) {
    const take = stack.pop()
    const parseDom = {}
    parseDom.class = take.class.variables.join(' ')
    if (take.hasOwnProperty('v-for')) {
      const targetValue = []
      if (take['v-for'].target.hasOwnProperty('value')) {
        targetValue.push(take.target.value)
      }
      if (take['v-for'].target.hasOwnProperty('index')) {
        targetValue.push(take.target.index)
      }
      let targetInput = ''
      if (take['v-for'].type === 'function') {
        const targetArg = [...take['v-for'].functionArgument]
      } else if (take['v-for'].type === 'variable') {

      }
      // const targetOutput = '(' + targetValue.join(',') + ')' + ' of ' +
    }
  }
}

function findBlock (text, firstIndex) {
  let cntFirst = 0
  let cntEnd = 0
  const slice = []
  for (let i = firstIndex; i < text.length; i++) {
    if (cntFirst !== 0 && cntFirst === cntEnd) {
      const str = slice.join('')
      return str
    }
    if (text.charAt(i) === '{') {
      cntFirst++
      continue
    }
    if (text.charAt(i) === '}') {
      cntEnd++
      continue
    }
    slice.push(text.charAt(i))
  }
  console.log('Error')
}

export default function (text) {
  const dataLength = 'data ()'.length
  const methodLength = 'methods:'.length
  const dataFirst = text.indexOf('data ()') + dataLength
  const methodFirst = text.indexOf('methods:') + methodLength
  const dataBlock = findBlock(text, dataFirst)
  const methodBlock = findBlock(text, methodFirst)
  console.log(dataBlock, methodBlock)
}

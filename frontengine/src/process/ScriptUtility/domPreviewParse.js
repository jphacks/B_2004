export { domPreviewParse }
function domPreviewParse (domTree) {
  console.log('getDomPreviewParse', domTree)
  const output = []
  let stack = [domTree]
  while (stack.length > 0) {
    const take = stack.pop()
    const parseDom = take
  }
}

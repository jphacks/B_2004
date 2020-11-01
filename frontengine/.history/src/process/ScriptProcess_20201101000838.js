import { DOMAnalysis } from './DomProcess.js'

export default function (text) {
  const tags = []
  const tagCount = {} // そのタグが開かれている時true
  // let hierarchy = 0
  // const err = []
  let unique = 0 // 各々のタグにuniqueIdを付与する
  let parentId = null
  for (let i = 0; i < text.length; i++) {
    const mozi = text.charAt(i)
    if (mozi === '<') {
      const slice = []
      for (; ; i++) {
        slice.push(text.charAt(i))
        if (text.charAt(i) === '>') {
          break
        }
      }
      const str = slice.join('')
      const info = DOMAnalysis(str)
      if (info.name && info.name.length > 0) {
        tags[unique] = info
        unique++
        if (parentId) {
          tags[unique].parentId = parentId
        }
        if (info.open) {
          if (!tagCount[info.name]) {
            tagCount[info.name] = 0
          }
          tagCount[info.name]++
          parentId = unique - 1 // 今代入したもの(++してないもの)を親とする
        }
        if (info.close) {
          tagCount[info.name]--
        }
      }
    }
  }
  console.log('file', text, text.charAt(1), text.length, tags)
}

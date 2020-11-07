/* import CreateAST from './CreateAST.js'
import moduleProcess from './moduleProcess.js' */
const CreateAST = require('./CreateAST.js');
const moduleProcess = require('./moduleProcess.js');
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
}

exports.ScriptProcess = function (text) {
  const generate = require('@babel/generator').default
  const ast = CreateAST(text)
  const module = moduleProcess(ast)
  // const generated = generate(ast)
  // ('interpre', myInterpreter, myInterpreter.run())
  // ('generate', generate.code(ast, { sourceType: 'module', sourceMaps: true }))
  const dataLength = 'data ()'.length
  const methodLength = 'methods:'.length
  const dataFirst = text.indexOf('data ()') + dataLength
  const methodFirst = text.indexOf('methods:') + methodLength
  const dataBlock = findBlock(text, dataFirst)
  const methodBlock = findBlock(text, methodFirst)
  return module
  // (dataBlock, methodBlock)
}

function strict (text) {
  'use strict'
  eval(text)
}

// ---
// map = {c: 0, aPLUSb: astaPLUSb, cPlusd: astcPlusd}
// function aPLUSb(text) {
//   let a = 30
//   let b = 50
//   this.c = a + b
//   this.aPlusb()
// }
// function cPLUSd(text) {
//   let c = 30
//   let d = 50
//   this.e = c + d
// }
// ast <- 引数, 'function'

// function functionAnlysis (ast) {
//   let cari = {}
//   for (let text of ast) {
//     if (text=== 'thisのやつ') {
//       if (text === 'function') {
//         functionAnlysis(global[text.functionName])
//       }
//     }
//     if ( text === 'variant') {
//       cari[text.varinatName] = text.vlue
//     }

//   }
// }

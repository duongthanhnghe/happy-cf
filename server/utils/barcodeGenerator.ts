import bwipjs from 'bwip-js'
import fs from 'fs'
import path from 'path'

export async function generateBarcode(code: string, filename: string) {
  const filepath = path.join(process.cwd(), 'public', 'barcodes', filename)
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer({
      bcid: 'code128',
      text: code,
      scale: 3,
      height: 10,
      includetext: false,
    }, (err: any, png: any) => {
      if (err) return reject(err)

      fs.mkdirSync(path.dirname(filepath), { recursive: true })

      fs.writeFileSync(filepath, png)
      resolve('/barcodes/' + filename)
    })
  })
}

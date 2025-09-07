import bwipjs from 'bwip-js';
import fs from 'fs';
import path from 'path';
export async function generateBarcode(code, filename) {
    const filepath = path.join(process.cwd(), 'public', 'barcodes', filename);
    return new Promise((resolve, reject) => {
        bwipjs.toBuffer({
            bcid: 'code128',
            text: code,
            scale: 3,
            height: 10,
            includetext: false,
        }, (err, png) => {
            if (err)
                return reject(err);
            fs.mkdirSync(path.dirname(filepath), { recursive: true });
            fs.writeFileSync(filepath, png);
            resolve('/barcodes/' + filename);
        });
    });
}
//# sourceMappingURL=barcodeGenerator.js.map
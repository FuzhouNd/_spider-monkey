import pdf from 'pdf-parse';
import fs from 'fs-extra';
import pdfjs from 'pdfjs';
import path from 'path';




export async function toText(filePath:string) {
  //@ts-ignore
  let dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer)
  return data.text
}

export async function toPdf(filePathList:string[], targetPath:string) {
  const doc = new pdfjs.Document({
    font: require('pdfjs/font/Helvetica'),
    padding: 10,
  });
  for (const filePath of filePathList) {
    const src = fs.readFileSync(filePath);
    const img = new pdfjs.Image(src);
    doc.image(img);
    
  }
  const dir = path.parse(targetPath).dir
  if (!fs.pathExistsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  doc.pipe(fs.createWriteStream(targetPath));
  await doc.end();
}


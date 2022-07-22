import pdf from 'pdf-parse';
import fs from 'fs-extra';




export async function toText(filePath:string) {
  let dataBuffer = fs.readFileSync('./1.pdf');
  const data = await pdf(dataBuffer)
  return data.text
}



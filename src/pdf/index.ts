import pdf from 'pdf-parse';
import fs from 'fs-extra';




export async function toText(filePath:string) {
  //@ts-ignore
  let dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer)
  return data.text
}



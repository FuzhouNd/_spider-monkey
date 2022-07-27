// app.post('/set', async (req, res) => {
//   const body = req.body;
//   res.setHeader('content-type', 'text/plain');
//   if (Array.isArray(body)) {
//     body.forEach((file) => {
//       const filePath = file.filePath;
//       const parsedPath = path.parse(filePath);
//       if (!fs.pathExistsSync(parsedPath.dir)) {
//         fs.mkdirSync(parsedPath.dir);
//       }
//       if (!fs.pathExistsSync(filePath)) {
//         fs.writeFileSync(filePath, Object.keys(file.data).join(','), { flag: 'a' });
//       }
//       const str = Object.keys(file.data)
//         .map((key) => {
//           return file.data[key];
//         })
//         .join(',');
//       console.log('write', dayjs().format('YYYY-MM-DD HH:mm:ss'), filePath);
//       fs.writeFileSync(filePath, str, { flag: 'a' });
//     });
//   }
//   if (body?.filePath) {
//     const file = body;
//     const filePath = file.filePath;
//     const parsedPath = path.parse(filePath);
//     if (!fs.pathExistsSync(parsedPath.dir)) {
//       fs.mkdirSync(parsedPath.dir);
//     }
//     if (!fs.pathExistsSync(filePath)) {
//       fs.writeFileSync(filePath, Object.keys(file.data).join(';') + '\r\n', { flag: 'a' });
//     }
//     if (!fs.readFileSync(filePath, { encoding: 'utf-8' })) {
//       fs.writeFileSync(filePath, Object.keys(file.data).join(';') + '\r\n', { flag: 'a' });
//     }
//     const str = Object.keys(file.data)
//       .map((key) => {
//         return file.data[key];
//       })
//       .join(';');
//     console.log('write', dayjs().format('YYYY-MM-DD HH:mm:ss'), filePath);
//     fs.writeFileSync(filePath, str + '\r\n', { flag: 'a' });
//   }
//   res.send('');
// });

// app.post('/get', async (req, res) => {
//   const body = req.body;
//   const filePath = body.filePath;
//   res.setHeader('content-type', 'text/plain');
//   if (filePath && fs.pathExistsSync(filePath)) {
//     const text = fs.readFileSync(filePath, { encoding: 'utf-8' });
//     res.send(text);
//     return;
//   }
//   res.send('');
// });
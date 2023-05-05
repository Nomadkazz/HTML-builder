const fs = require('fs');
// const path = require('path');
//path.normalize('./01-read-file/text.txt')

const readStream = fs.createReadStream('./01-read-file/text.txt', { encoding: 'utf8' });

readStream.on('data', (chunk) => {
  console.log(chunk);
});

readStream.on('error', (err) => {
  console.error(err);
});

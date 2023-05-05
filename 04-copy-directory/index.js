const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Function to copy files from source to target directory
function copyFile(source, target) {
  const readStream = fs.createReadStream(source);
  const writeStream = fs.createWriteStream(target);

  readStream.on('error', err => console.error(`Failed to read file ${source}`, err));
  writeStream.on('error', err => console.error(`Failed to write file ${target}`, err));

  readStream.pipe(writeStream);
}

// Copy files from source to target directory
fs.readdir(sourceDir, (err, files) => {
  if (err) {
    console.error('Failed to list files', err);
    return;
  }

  files.forEach(file => {
    const srcPath = path.join(sourceDir, file);
    const destPath = path.join(targetDir, file);

    fs.stat(srcPath, (err, stats) => {
      if (err) {
        console.error(`Failed to get stats for file ${srcPath}`, err);
        return;
      }

      if (stats.isFile()) {
        copyFile(srcPath, destPath);
      }
    });
  });
});

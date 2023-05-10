const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

function deleteDirectoryRecursive(directoryPath) {
    if (fs.existsSync(directoryPath)) {
      fs.readdirSync(directoryPath).forEach((file) => {
        const filePath = path.join(directoryPath, file);
        if (fs.lstatSync(filePath).isDirectory()) {
          deleteDirectoryRecursive(filePath);
        } else {
          fs.unlinkSync(filePath);
        }
      });
      fs.rmdirSync(directoryPath);
    }
}

async function copyDirectory(source, destination) {
    await fsp.mkdir(destination, { recursive: true });

    const files = await fsp.readdir(source);
    for (const file of files) {
        const sourcePath = path.join(source, file);
        const destinationPath = path.join(destination, file);
        const fileStat = await fsp.stat(sourcePath);

        if (fileStat.isFile()) {
            // await fs.copyFile(sourcePath, destinationPath);
            const readStream = fs.createReadStream(sourcePath);
            const writeStream = fs.createWriteStream(destinationPath);
          
            readStream.on('error', err => console.error(`Failed to read file ${sourcePath}`, err));
            writeStream.on('error', err => console.error(`Failed to write file ${destinationPath}`, err));
          
            readStream.pipe(writeStream);
        } else if (fileStat.isDirectory()) {
            await copyDirectory(sourcePath, destinationPath);
        }
    }
}

deleteDirectoryRecursive(targetDir)
fs.mkdirSync(targetDir, { recursive: true });
copyDirectory(sourceDir, targetDir);
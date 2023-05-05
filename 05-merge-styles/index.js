const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');

var stylesList = [];

fs.readdirSync(stylesDir).forEach(file => {
    const filePath = path.join(stylesDir, file);
    const stat = fs.statSync(filePath);
  
    if (stat.isFile() && path.extname(filePath) === '.css') {
      const content = fs.readFileSync(filePath, 'utf-8');
      stylesList.push(content);
    }
});
  
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
fs.writeFileSync(bundlePath, stylesList.join('\n'));


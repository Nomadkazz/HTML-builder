const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const COMPONENT_TAG_REGEX = /{{(\w+)}}/g;
const COMPONENTS_DIR = path.join(__dirname, 'components');
const STYLES_DIR = path.join(__dirname, 'styles');
const ASSETS_DIR = path.join(__dirname, 'assets');
const TEMPLATE_FILE = path.join(__dirname, 'template.html');
const DIST_DIR = path.join(__dirname, 'project-dist');
const DIST_INDEX_FILE = path.join(DIST_DIR, 'index.html');
const DIST_STYLE_FILE = path.join(DIST_DIR, 'style.css');
const DIST_ASSETS = path.join(DIST_DIR, 'assets');

async function main() {
  try {
    await fsp.mkdir(DIST_DIR, { recursive: true });
    await replaceTemplateTags();
    await mergeStyles(STYLES_DIR, DIST_STYLE_FILE);
    await copyDirectory(ASSETS_DIR, DIST_ASSETS);
  } catch (error) {
    console.error(error);
  }
}

//05-merge-styles
async function mergeStyles(stylesDir, distDir){    
    var stylesList = [];
    
    fs.readdirSync(stylesDir).forEach(file => {
        const filePath = path.join(stylesDir, file);
        const stat = fs.statSync(filePath);
      
        if (stat.isFile() && path.extname(filePath) === '.css') {
          const content = fs.readFileSync(filePath, 'utf-8');
          stylesList.push(content);
        }
    });
      
    fs.writeFileSync(distDir, stylesList.join('\n'));
}

//04-copy-directory
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

async function replaceTemplateTags() {
  const templateContent = await fsp.readFile(TEMPLATE_FILE, 'utf-8');
  let replacedContent = templateContent;

  const componentTags = Array.from(templateContent.matchAll(COMPONENT_TAG_REGEX), match => match[1]);
  const componentsContent = await Promise.all(componentTags.map(tag => getComponentContent(tag)));

  componentTags.forEach((tag, i) => {
    const componentContent = componentsContent[i];
    replacedContent = replacedContent.replace(new RegExp(`{{${tag}}}`, 'g'), componentContent);
  });

  await fsp.writeFile(DIST_INDEX_FILE, replacedContent);
}

async function getComponentContent(name) {
  const componentFile = path.join(COMPONENTS_DIR, `${name}.html`);
  const componentExt = path.extname(componentFile);

  if (componentExt !== '.html') {
    throw new Error(`Unsupported file extension for component '${name}'`);
  }

  const componentContent = await fsp.readFile(componentFile, 'utf-8');
  return componentContent;
}

main();

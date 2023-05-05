const fs = require('fs');
const readline = require('readline');

const filename = './02-write-file/text.txt';
const writeStream = fs.createWriteStream(filename, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.setPrompt('Введите текст для записи в файл: ');
rl.prompt();

rl.on('line', (text) => {
    if(text.toLowerCase() == "exit"){
        exit();
    }
    writeStream.write(`${text}\n`);
    rl.prompt();
});

rl.on('SIGINT', () => {
    exit();
});

function exit(){
    console.log('\nПрограмма завершена.');
    process.exit();
}
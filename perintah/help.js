const fs = require('fs/promises');
const path = require('path');

async function Alya(api, event) {
  const folderPath = path.join('./perintah');

  try {
    const files = await fs.readdir(folderPath);

    const jsFiles = files.filter(file => path.extname(file) === '.js');

    jsFiles.sort();

    const commandList = jsFiles.map(file => path.basename(file, '.js')).join('\n');
    api.sendMessage(`# Daftar perintah: \n\n${commandList}`, event.threadID, event.messageID);
  } catch (error) {
    
  }
}

const config = { nama: "help" };
module.exports = { Alya, config };

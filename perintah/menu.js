const fs = require('fs/promises');
const path = require('path');

async function Alya(api, message) {
  const folderPath = path.join('./perintah');

  try {
    const files = await fs.readdir(folderPath);
    const jsFiles = files.filter(file => path.extname(file) === '.js');
    jsFiles.sort();

    const commandList = jsFiles.map(file => path.basename(file, '.js')).join('\n');
    api.sendMessage(`# Daftar perintah: \n\n${commandList}`, message.threadID, message.messageID);
  } catch (error) {
    
  }
}

const config = { 
  nama: "menu",
  penulis: "Hady Zen", 
  peran: 0,
  kuldown: 10,
  tutor: "<cmd/kosong>"
};
module.exports = { Alya, config };

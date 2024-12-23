module.exports = {
  config: { 
    nama: "file", 
    penulis: "Hady Zen", 
    peran: 2,
    kuldown: 6,
    tutor: "<nama file>"
  }, 
  Alya: async function(api, event, args) {
    const fs = require('fs');  
    const path = require('path'); 
    if (!args.join(' ')) return api.sendMessage('Berikan nama file nya su.', event.threadID, event.messageID);
    const filePath = path.join('perintah', `${args[0]}.js`);
    const file = fs.readFileSync(filePath, 'utf8');
    if (!file || file.length < 0) { 
      return api.sendMessage('Gada file itu wak', event.threadID, event.messageID);
    } else { 
      api.sendMessage(file, event.threadID, event.messageID);  
    }
  }
};

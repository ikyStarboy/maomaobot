const config = { 
  nama: "tr",
  kuldown: 10
};

async function Alya(api, event) { 
  const axios = require('axios');
  const text = event.body?.replace(":tr", "")?.trim().toLowerCase();
  const parts = text?.split(' ');

  if (parts && parts.length >= 2) {
      const bhs = parts[0];
      const hady = parts.slice(1).join(' ');
      const respon = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${bhs}&dt=t&q=${encodeURIComponent(hady)}`);
      if (respon.data[0].map(item => item[0]).join('')) {
        return api.sendMessage(`# Terjemahan\n\n${respon.data[0].map(item => item[0]).join('')}`, event.threadID, event.messageID);
      } else {
        return api.sendMessage("gak di jawab", event.threadID, event.messageID);
      }
  } else {
    return api.sendMessage("Masukkan pesan nya bodo", event.threadID, event.messageID);
  }
}
module.exports = { config, Alya };

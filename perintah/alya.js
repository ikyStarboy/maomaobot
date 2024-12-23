module.exports = {
config: { 
  nama: "alya",
  penulis: "Hady Zen", 
  kuldown: 10,
  peran: 0,
  tutor: "<pertanyaan>"
}, 

Alya: async function (api, event, args) { 
  const axios = require('axios');
  const text = args.join(' ');

  if (text) {
      const hady = `nama kamu adalah Alya Kujou. User input: ${text}`;
      const respon = await axios.get(`https://sandipbaruwal.onrender.com/gemini?prompt=${encodeURIComponent(hady)}`);
      if (respon.data.answer) {
        return api.sendMessage(respon.data.answer, event.threadID, event.messageID);
      } else {
        return api.sendMessage("gak di jawab", event.threadID, event.messageID);
      }
  } else {
    return api.sendMessage("Masukkan pesan nya bodo", event.threadID, event.messageID);
  }
}
};

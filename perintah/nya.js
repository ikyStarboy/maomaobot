module.exports = {
  config: { 
    nama: "nya", 
    penulis: "Hady Zen", 
    kuldown: 6,
    peran: 0,
    tutor: ""
  }, 
  Alya: async function(api, event) {
    api.sendMessage("nya.", event.threadID, event.messageID);
  }
};

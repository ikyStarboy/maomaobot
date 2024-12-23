module.exports = {
  config: { 
    nama: "uid", 
    kuldown: 10
  }, 
  Alya: async function(api, event) {
    api.sendMessage(event.senderID, event.threadID, event.messageID)
  }
};

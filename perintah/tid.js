module.exports = {
  config: { 
    nama: "tid", 
    kuldown: 10
  }, 
  Alya: async function(api, message) {
    api.sendMessage(message.threadID, message.threadID, message.messageID)
  }
};

module.exports = { 
config: { 
  nama: "kick",
  penulis: "Hady Zen", 
  kuldown: 10,
  peran: 1,
  tutor: "<id>"
}, 

Alya: async function (api, event, args) { 
 const id = args[0];

  if (id) {
     api.removeUserFromGroup(id, event.threadID);
  } else {
    return api.sendMessage("Masukkan id nya bodo", event.threadID, event.messageID);
  }
}
};

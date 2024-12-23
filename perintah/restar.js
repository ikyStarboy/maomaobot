module.exports = { 
config: { 
  nama: "restar",
  penulis: "Hady Zen", 
  kuldown: 6,
  peran: 2,
  tutor: ""
}, 

Alya: async function (api, event) { 
  api.sendMessage("❄ Memulai ulang maomao..", event.threadID, event.messageID);
  const { spawn } = require("child_process");
  const child = spawn("npm stop && npm start", {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
  });
}
};

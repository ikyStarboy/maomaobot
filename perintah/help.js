const fs = require('fs/promises');
const path = require('path');

async function Alya(api, message, args) {
  const folderPath = path.join('./perintah');
  const commandsPerPage = 4; // Jumlah command per halaman
  const pageRequested = parseInt(args[0], 10) || 1; // Halaman yang diminta (default: 1)

  try {
    const files = await fs.readdir(folderPath);
    const jsFiles = files.filter(file => path.extname(file) === '.js');
    jsFiles.sort();

    // Hitung total halaman
    const totalPages = Math.ceil(jsFiles.length / commandsPerPage);

    if (pageRequested > totalPages || pageRequested < 1) {
      return api.sendMessage(
        `Halaman yang diminta tidak tersedia. Total halaman: ${totalPages}.`,
        message.threadID,
        message.messageID
      );
    }

    // Ambil command untuk halaman yang diminta
    const startIndex = (pageRequested - 1) * commandsPerPage;
    const commandsForPage = jsFiles.slice(startIndex, startIndex + commandsPerPage);

    // Format menjadi 2x2
    let formattedCommands = `🌟 𝗗𝗮𝗳𝘁𝗮𝗿 𝗣𝗲𝗿𝗶𝗻𝘁𝗮𝗵 (Halaman ${pageRequested}/${totalPages}) 🌟\n\n`;
    for (let i = 0; i < commandsForPage.length; i += 2) {
      const row = commandsForPage.slice(i, i + 2)
        .map(file => `• ${path.basename(file, '.js')}`)
        .join('     '); // Jarak antar kolom
      formattedCommands += `${row}\n`;
    }

    formattedCommands += `\nGunakan "help <nomor halaman>" untuk melihat halaman lainnya.`;

    api.sendMessage(formattedCommands.trim(), message.threadID, message.messageID);
  } catch (error) {
    console.error('Error reading command files:', error);
    api.sendMessage('Terjadi kesalahan saat membaca daftar perintah.', message.threadID, message.messageID);
  }
}

const config = { 
  nama: "help",
  penulis: "Hady Zen", 
  peran: 0,
  kuldown: 10,
  tutor: "<cmd/kosong>"
};

module.exports = { Alya, config };

  const express = require('express');
	const app = express();
	const axios = require('axios');
	const login = require("./hady-zen/itsuki-fca");
	const { warna, font, logo } = require("./hady-zen/log.js");
	const fs = require("fs");
	const path = require("path");
	const akun = fs.readFileSync('akun.txt', 'utf8');
	const { awalan } = require('./config.json');
 
console.log(warna.biru + `
░█▄▒▄█▒▄▀▄░▄▀▄░█▄▒▄█▒▄▀▄░▄▀▄
░█▒▀▒█░█▀█░▀▄▀░█▒▀▒█░█▀█░▀▄▀
                           v1.00.01\n`);
console.log(logo.info + "Chatbot messenger by hady and saveng.");
	if (!akun || akun.length < 0) {
console.log(logo.error + 'Harap masukkan cookie terlebih dahulu.');
	}

login({appState: JSON.parse(fs.readFileSync('akun.txt', 'utf8'))}, (err, api) => {
		if(err) return console.log(logo.error + `terjadi kesalahan saat login: ${err}`);
console.log(logo.login + 'mulai menerima pesan dari pengguna.');
	
    api.setOptions({listenEvents: true});
		api.listenMqtt((err, message) => {
  const text = message.body;

			async function itsuki() {
					 if (text && text.toLowerCase().startsWith(awalan)) {
					try {
  const role = text.substring(text.indexOf(awalan) + awalan.length).trim() || "hai";
		const hadi = `Nama kamu adalah Maomao, kamu harus menggunakan emoji sesuai percakapan, sifat mu dingin dan malas tapi tetap peduli dan typing mu pendek saja. User input: "${role}"`;
	const { data } = await axios.get(`https://sandipbaruwal.onrender.com/gemini?prompt=${encodeURIComponent(hadi)}`);
  api.sendMessage(data.answer, message.threadID, message.messageID);
	} catch (err) { 
console.log(logo.error + 'terjadi kesalahan pada api: ' + err);
}
	} else if (message.body !== undefined && message.threadID !== undefined) {
console.log(logo.pesan + `ID: ${message.threadID} pesan: ${text}`);
					 }
}
itsuki();		
});
app.listen(3000, () => { });
});

app.get('/', (req, res) => { 
 res.sendFile(path.join(__dirname, 'hady-zen', 'hadi.html'));
});

process.on('unhandledRejection', (reason, promise) => {
	console.log(logo.error + 'unhandled promise rejection:', reason);
});

process.on('uncaughtException', (err) => {
	console.log(logo.error + 'uncaught exception:', err);
});

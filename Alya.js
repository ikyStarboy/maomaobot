  const express = require('express');
	const app = express();
	const axios = require('axios');
	const login = require("./hady-zen/alya-fca");
	const { warna, font, logo } = require("./hady-zen/log.js");
	const fs = require("fs");
	const path = require("path");
	const akun = fs.readFileSync('akun.txt', 'utf8');
	const { awalan } = require('./config.json');
 
console.log(warna.biru + `
░█▄▒▄█▒▄▀▄░▄▀▄░█▄▒▄█▒▄▀▄░▄▀▄
░█▒▀▒█░█▀█░▀▄▀░█▒▀▒█░█▀█░▀▄▀                           v1.00.01\n`);
console.log(logo.info + "Chatbot messenger by hady and saveng.");
	if (!akun || akun.length < 0) {
console.log(logo.error + 'Harap masukkan cookie terlebih dahulu.');
	}

login({appState: JSON.parse(fs.readFileSync('akun.txt', 'utf8'))}, (err, api) => {
		if(err) return console.log(logo.error + `terjadi kesalahan saat login: ${err}`);
	api.setOptions({listenEvents: true});
console.log(logo.login + 'mulai menerima pesan dari pengguna.');
	  
		api.listenMqtt((err, event) => {
            const body = event.body;
            if (!body) return;
            if (!body.startsWith(awalan)) return;
const args = body.slice(awalan.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
            async function executeCommand(cmd, api, message) {
                const folderPath = path.join(__dirname, '/perintah');

                try {
                    const files = fs.readdirSync(folderPath);

                    for (const file of files) {
                        if (file.endsWith('.js')) {
                            const filePath = path.join(folderPath, file);

                            const { config, Alya } = require(filePath);

                            if (config && config.nama === cmd && typeof Alya === 'function') {
                                console.log(`Menjalankan perintah dari file: ${file}`);
                                await Alya(api, event);
                                return;
                            }
                        }
                    }

                    console.log('Perintah tidak ditemukan.');
                } catch (error) {
                    console.error('Error while executing command:', error);
                }
            }

            executeCommand(cmd, api, event);
		
});
app.listen(3000, () => { });
});

app.get('/', (req, res) => { 
 res.sendFile(path.join(__dirname, 'hady-zen', 'hadi.html'));
});

process.on('unhandledRejection', (reason) => {
	console.log(logo.error + 'unhandled promise rejection:', reason);
});

process.on('uncaughtException', (err) => {
	console.log(logo.error + 'uncaught exception:', err);
});

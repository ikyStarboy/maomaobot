/* HADY ZEN'IN */

const { waktu } = require("./waktu");
const font = {
  bold: `\x1b[1m`,
  italic: `\x1b[3m`
}
const warna = {
  reset: `\x1b[0m`, 
  hitam: `\x1b[38;5;240m`,
  merah: `\x1b[31m`,
  hijau: `\x1b[32m`,
  kuning: `\x1b[33m`,
  biru: `\x1b[34m`,
  magenta: `\x1b[35m`,
  cyan: `\x1b[36m`,
  putih: `\x1b[37m`
};

const logo = {
  error: `${warna.hitam}${waktu}${warna.reset} ${warna.merah}${font.bold}ERROR: ${warna.reset}`, 
  login: `${warna.hitam}${waktu}${warna.reset} ${warna.hijau}${font.bold}LOGIN: ${warna.reset}`, 
  info: `${warna.hitam}${waktu}${warna.reset} ${warna.kuning}${font.bold}INFO: ${warna.reset}`, 
  cmds: `${warna.hitam}${waktu}${warna.reset} ${warna.cyan}${font.bold}CMDS: ${warna.reset}`, 
  pesan: `${warna.hitam}${waktu}${warna.reset} ${warna.biru}${font.bold}PESAN: ${warna.reset}`
}

module.exports = { warna, font, logo };
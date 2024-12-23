/* HADY ZEN'IN */

function stop() {
  const { logo } = require('./hady-zen/log');
console.clear();
  console.log(logo.info + "Alya telah diperintahkan untuk berhenti.");
process.exit(1);
}

stop();

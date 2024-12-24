const fs = require('fs');
const path = require('path');

const databasePath = path.resolve(__dirname, 'balanceDatabase.json');

function readDatabase() {
  if (!fs.existsSync(databasePath)) {
    fs.writeFileSync(databasePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(databasePath, 'utf-8');
  return JSON.parse(data);
}

function writeDatabase(data) {
  fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
}

function ensureUser(uid) {
  const database = readDatabase();
  let user = database.find((u) => u.uid === uid);

  if (!user) {
    user = { uid, balance: 5 };
    database.push(user);
    writeDatabase(database);
  }
  return user;
}

module.exports = {
  config: {
    nama: "balance",
    penulis: "Hady Zen",
    kuldown: 10,
    peran: 0,
    tutor: "<penggunaan command>",
  },
  Alya: async function (api, event) {
    const senderID = event.senderID;
    const user = ensureUser(senderID);
    return api.sendMessage(`Balance kamu saat ini: ${user.balance}`, event.threadID, event.messageID);
  },
};

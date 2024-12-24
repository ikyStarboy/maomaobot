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

function transferBalance(senderID, receiverID, amount) {
  const database = readDatabase();
  const sender = ensureUser(senderID);
  const receiver = ensureUser(receiverID);

  if (sender.balance < amount) return false;

  sender.balance -= amount;
  receiver.balance += amount;

  const senderIndex = database.findIndex((u) => u.uid === senderID);
  const receiverIndex = database.findIndex((u) => u.uid === receiverID);

  database[senderIndex] = sender;
  database[receiverIndex] = receiver;

  writeDatabase(database);
  return true;
}

module.exports = {
  config: {
    nama: "pay",
    penulis: "iky",
    kuldown: 10,
    peran: 0,
    tutor: "pay <uid penerima> <nominal>",
  },
  Alya: async function (api, event, args) {
    const senderID = event.senderID;
    const receiverID = args[0];
    const amount = parseInt(args[1], 10);

    if (!receiverID || isNaN(amount) || amount <= 0) {
      return api.sendMessage(
        "salah brader harus nya gini: pay <uid penerima> <nominal>",
        event.threadID,
        event.messageID
      );
    }

    if (receiverID === senderID) {
      return api.sendMessage("Kamu tidak bisa mengirim balance ke diri sendiri.", event.threadID, event.messageID);
    }

    const success = transferBalance(senderID, receiverID, amount);
    if (success) {
      return api.sendMessage(
        `Berhasil mengirim ${amount}€`,
        event.threadID,
        event.messageID
      );
    } else {
      return api.sendMessage(
        "euro kamu tidak cukup untuk melakukan transfer.",
        event.threadID,
        event.messageID
      );
    }
  },
};

const fs = require('fs');
const path = require('path');

const databasePath = path.resolve(__dirname, 'balanceDatabase.json');
const fakeUidDatabasePath = path.resolve(__dirname, 'fakeUidDatabase.json');

// Membaca database pengguna
function readDatabase() {
  if (!fs.existsSync(databasePath)) {
    fs.writeFileSync(databasePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(databasePath, 'utf-8');
  return JSON.parse(data);
}

// Menulis ke database pengguna
function writeDatabase(data) {
  fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
}

// Membaca database fakeUid
function readFakeUidDatabase() {
  if (!fs.existsSync(fakeUidDatabasePath)) {
    fs.writeFileSync(fakeUidDatabasePath, JSON.stringify({ nextUid: 1, users: {} }));
  }
  const data = fs.readFileSync(fakeUidDatabasePath, 'utf-8');
  return JSON.parse(data);
}

// Menulis ke database fakeUid
function writeFakeUidDatabase(data) {
  fs.writeFileSync(fakeUidDatabasePath, JSON.stringify(data, null, 2));
}

// Menjamin bahwa user dengan UID asli telah ada, dan jika belum, buat data baru
function ensureUser(uid) {
  const fakeUidDatabase = readFakeUidDatabase();
  let fakeUid = fakeUidDatabase.users[uid]?.fakeUid;

  if (!fakeUid) {
    fakeUid = fakeUidDatabase.nextUid;
    fakeUidDatabase.users[uid] = { fakeUid, name: "unknown" };
    fakeUidDatabase.nextUid += 1;
    writeFakeUidDatabase(fakeUidDatabase);
  }

  const database = readDatabase();
  let user = database.find((u) => u.fakeUid === fakeUid);

  if (!user) {
    user = { fakeUid, balance: 5 };
    database.push(user);
    writeDatabase(database);
  }

  return user;
}

// Transfer balance antar pengguna menggunakan fakeUid
function transferBalance(senderID, receiverFakeUid, amount) {
  const database = readDatabase();
  const sender = ensureUser(senderID);
  const receiver = database.find((u) => u.fakeUid === receiverFakeUid);

  if (!receiver) return false;
  if (sender.balance < amount) return false;

  sender.balance -= amount;
  receiver.balance += amount;

  const senderIndex = database.findIndex((u) => u.fakeUid === sender.fakeUid);
  const receiverIndex = database.findIndex((u) => u.fakeUid === receiver.fakeUid);

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
    tutor: "pay <fakeUid penerima> <nominal>",
  },
  Alya: async function (api, event, args) {
    const senderID = event.senderID;
    const receiverFakeUid = parseInt(args[0], 10);  // Menggunakan fakeUid sebagai parameter
    const amount = parseInt(args[1], 10);

    if (!receiverFakeUid || isNaN(amount) || amount <= 0) {
      return api.sendMessage(
        "Format salah! Harusnya seperti ini: pay <fakeUid penerima> <nominal>",
        event.threadID,
        event.messageID
      );
    }

    if (receiverFakeUid === ensureUser(senderID).fakeUid) {
      return api.sendMessage("Kamu tidak bisa mengirim balance ke diri sendiri.", event.threadID, event.messageID);
    }

    const success = transferBalance(senderID, receiverFakeUid, amount);
    if (success) {
      return api.sendMessage(
        `Berhasil mengirim ${amount}€`,
        event.threadID,
        event.messageID
      );
    } else {
      return api.sendMessage(
        "Saldo kamu tidak cukup untuk melakukan transfer.",
        event.threadID,
        event.messageID
      );
    }
  },
};

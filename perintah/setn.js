const fs = require('fs');
const path = require('path');

const balanceDatabasePath = path.resolve(__dirname, 'balanceDatabase.json');
const fakeUidDatabasePath = path.resolve(__dirname, 'fakeUidDatabase.json');

function readDatabase(filePath, defaultValue) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function writeDatabase(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function ensureUser(uid) {
  const balanceDatabase = readDatabase(balanceDatabasePath, []);
  const fakeUidDatabase = readDatabase(fakeUidDatabasePath, { nextUid: 1, users: {} });

  let user = balanceDatabase.find((u) => u.uid === uid);

  if (!user) {
    let fakeUid = fakeUidDatabase.users[uid]?.fakeUid;

    if (!fakeUid) {
      fakeUid = fakeUidDatabase.nextUid;
      fakeUidDatabase.users[uid] = { fakeUid, name: "unknown" }; // Default name "unknown"
      fakeUidDatabase.nextUid += 1;
      writeDatabase(fakeUidDatabasePath, fakeUidDatabase);
    }

    user = { uid, name: "unknown", fakeUid, balance: 5 }; // Default name "unknown"
    balanceDatabase.push(user);
    writeDatabase(balanceDatabasePath, balanceDatabase);
  }

  return user;
}

module.exports = {
  config: {
    nama: "setn",
    penulis: "iky",
    kuldown: 10,
    peran: 0,
    tutor: "setn <nama_baru>",
  },
  Alya: async function (api, event, args) {
    const senderID = event.senderID;
    const newName = args.join(' ');

    if (!newName) {
      return api.sendMessage("Masukkan nama baru yang valid!", event.threadID, event.messageID);
    }

    const user = ensureUser(senderID);
    const currentBalance = user.balance;

    if (currentBalance < 2) {
      return api.sendMessage("Euro kaga cukup.", event.threadID, event.messageID);
    }

    user.name = newName;
    user.balance -= 2; // Mengurangi saldo 2 yen

    const balanceDatabase = readDatabase(balanceDatabasePath, []);
    const userIndex = balanceDatabase.findIndex((u) => u.uid === senderID);
    balanceDatabase[userIndex] = user;
    writeDatabase(balanceDatabasePath, balanceDatabase);

    return api.sendMessage(`Nama kamu berhasil diubah menjadi ${newName}.`, event.threadID, event.messageID);
  },
};

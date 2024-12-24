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
  try {
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
  } catch (error) {
    console.error("Error in ensureUser function: ", error);
    return null;
  }
}

module.exports = {
  config: {
    nama: "status",
    penulis: "iky",
    kuldown: 10,
    peran: 0,
    tutor: "status",
  },
  Alya: async function (api, event) {
    try {
      const senderID = event.senderID;
      const user = ensureUser(senderID); // Mendapatkan data pengguna

      if (!user) {
        return api.sendMessage("Terjadi kesalahan dalam mengambil data pengguna. Silakan coba lagi.", event.threadID, event.messageID);
      }

      const message = `𝗡𝗮𝗺𝗮: ${user.name}\n𝗕𝗮𝗹𝗮𝗻𝗰𝗲: ${user.balance}¥\n𝗨𝗜𝗗: ${user.fakeUid}`;
      return api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error in Alya function: ", error);
      return api.sendMessage("Terjadi kesalahan dalam memproses perintah. Coba lagi nanti.", event.threadID, event.messageID);
    }
  },
};

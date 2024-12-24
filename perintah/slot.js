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

function updateUserBalance(uid, amount) {
  const database = readDatabase();
  const userIndex = database.findIndex((u) => u.uid === uid);

  if (userIndex !== -1) {
    database[userIndex].balance += amount;
    writeDatabase(database);
  }
}

module.exports = {
  config: {
    nama: "slot",
    penulis: "Iky",
    kuldown: 10,
    peran: 0,
    tutor: "slot <nominal>",
  },
  Alya: async function (api, event, args) {
    const senderID = event.senderID;
    const nominal = parseInt(args[0], 10);

    if (isNaN(nominal) || nominal <= 0) {
      return api.sendMessage(
        "Masukkan nominal yang valid untuk bermain slot.",
        event.threadID,
        event.messageID
      );
    }

    const user = ensureUser(senderID);

    if (user.balance < nominal) {
      return api.sendMessage(
        "Balance kamu tidak cukup untuk bermain slot.",
        event.threadID,
        event.messageID
      );
    }

    const outcomes = ["🎉", "💎", "🍀", "💀"]; // Simbol slot
    const result = [];

    // Probabilitas menang: 1/5
    const isWin = Math.random() < 0.2; // 20% peluang menang

    if (isWin) {
      // Jika menang, hasil slot akan sama
      const winSymbol = outcomes[Math.floor(Math.random() * outcomes.length)];
      result.push(winSymbol, winSymbol, winSymbol);
    } else {
      // Jika kalah, hasil slot akan acak
      for (let i = 0; i < 3; i++) {
        result.push(outcomes[Math.floor(Math.random() * outcomes.length)]);
      }
    }

    if (isWin) {
      const winnings = nominal * 2;
      updateUserBalance(senderID, winnings - nominal); // Menambahkan kemenangan
      return api.sendMessage(
        `🎰 | ${result.join(" ")}\nKamu menang! Euro kamu bertambah ${winnings}.`,
        event.threadID,
        event.messageID
      );
    } else {
      updateUserBalance(senderID, -nominal); // Mengurangi nominal yang dipertaruhkan
      return api.sendMessage(
        `🎰 | ${result.join(" ")}\nKamu kalah. Euro kamu berkurang ${nominal}.`,
        event.threadID,
        event.messageID
      );
    }
  },
};

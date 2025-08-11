const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient({
  log: ["query"],
}).then((prisma) => {
  console.log("Connected to the database");
});

module.exports = db;

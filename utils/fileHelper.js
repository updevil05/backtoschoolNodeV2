const fs = require("fs").promises;

async function readFileContent(filePath) {
  return await fs.readFile(filePath, "utf-8");
}

async function readJSON(filePath) {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

module.exports = { readFileContent, readJSON, writeJSON };

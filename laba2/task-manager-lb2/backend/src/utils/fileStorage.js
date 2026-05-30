const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../data');

function readJson(fileName) {
  const filePath = path.join(dataDir, fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(fileName, data) {
  const filePath = path.join(dataDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { readJson, writeJson };

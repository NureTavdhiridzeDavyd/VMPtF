const { readJson } = require('../utils/fileStorage');

function listUsers(req, res) {
  const users = readJson('users.json').map(({ password, ...user }) => user);
  res.json(users);
}

module.exports = { listUsers };

const { readJson, writeJson } = require('../utils/fileStorage');
const { encodeToken } = require('../middleware/authMiddleware');

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const users = readJson('users.json');
  const user = users.find((item) => item.email === email && item.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({ token: encodeToken(user), user: sanitizeUser(user) });
}

function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const users = readJson('users.json');
  const existing = users.find((item) => item.email === email);

  if (existing) {
    return res.status(409).json({ message: 'User with this email already exists' });
  }

  const newUser = {
    id: users.length ? Math.max(...users.map((item) => item.id)) + 1 : 1,
    name,
    email,
    password,
    role: 'user'
  };

  users.push(newUser);
  writeJson('users.json', users);

  res.status(201).json({ token: encodeToken(newUser), user: sanitizeUser(newUser) });
}

function me(req, res) {
  res.json(req.user);
}

module.exports = { login, register, me };

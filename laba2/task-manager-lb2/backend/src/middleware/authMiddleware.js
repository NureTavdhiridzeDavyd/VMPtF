const { readJson } = require('../utils/fileStorage');

function encodeToken(user) {
  return Buffer.from(JSON.stringify({ id: user.id, role: user.role })).toString('base64');
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    const users = readJson('users.json');
    const user = users.find((item) => item.id === payload.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
}

module.exports = { authMiddleware, adminOnly, encodeToken };

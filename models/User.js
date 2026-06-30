const { getDb } = require('../config/database');

function create(user, callback) {
  const db = getDb();
  const stmt = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
  stmt.run(user.username, user.password, user.role || 'user', function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID, username: user.username, role: user.role || 'user', created_at: new Date().toISOString() });
  });
}

function findByUsername(username, callback) {
  const db = getDb();
  db.get('SELECT id, username, password, role, created_at FROM users WHERE username = ?', [username], callback);
}

function findById(id, callback) {
  const db = getDb();
  db.get('SELECT id, username, role, created_at FROM users WHERE id = ?', [id], callback);
}

module.exports = { create, findByUsername, findById };

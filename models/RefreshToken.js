const { getDb } = require('../config/database');

function create(token, userId, expiresAt, callback) {
  const db = getDb();
  const stmt = db.prepare('INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES (?, ?, ?)');
  stmt.run(token, userId, expiresAt, function (err) {
    if (err) return callback(err);
    callback(null, { token, user_id: userId, expires_at: expiresAt });
  });
}

function find(token, callback) {
  const db = getDb();
  db.get('SELECT token, user_id, expires_at FROM refresh_tokens WHERE token = ?', [token], callback);
}

function remove(token, callback) {
  const db = getDb();
  const stmt = db.prepare('DELETE FROM refresh_tokens WHERE token = ?');
  stmt.run(token, function (err) {
    if (err) return callback(err);
    callback(null, this.changes > 0);
  });
}

module.exports = { create, find, remove };

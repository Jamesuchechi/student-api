const { getDb } = require('../config/database');

function findAll(options, callback) {
  // options: { page, limit, search }
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const offset = (page - 1) * limit;
  const db = getDb();

  let where = '';
  const params = [];
  if (options.search) {
    where = 'WHERE name LIKE ? OR email LIKE ?';
    params.push(`%${options.search}%`, `%${options.search}%`);
  }

  const countSql = `SELECT COUNT(*) as cnt FROM students ${where}`;
  const dataSql = `SELECT id, name, email, created_at FROM students ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`;

  db.get(countSql, params, (err, row) => {
    if (err) return callback(err);
    const total = row ? row.cnt : 0;
    const dataParams = params.concat([limit, offset]);
    db.all(dataSql, dataParams, (err2, rows) => {
      if (err2) return callback(err2);
      callback(null, { rows, total, page, limit });
    });
  });
}

function create(student, callback) {
  const db = getDb();
  const stmt = db.prepare('INSERT INTO students (name, email) VALUES (?, ?)');
  stmt.run(student.name, student.email, function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID, name: student.name, email: student.email, created_at: new Date().toISOString() });
  });
}

function findById(id, callback) {
  const db = getDb();
  db.get('SELECT id, name, email, created_at FROM students WHERE id = ?', [id], callback);
}

function update(id, student, callback) {
  const db = getDb();
  const stmt = db.prepare('UPDATE students SET name = ?, email = ? WHERE id = ?');
  stmt.run(student.name, student.email, id, function (err) {
    if (err) return callback(err);
    callback(null, this.changes > 0);
  });
}

function remove(id, callback) {
  const db = getDb();
  const stmt = db.prepare('DELETE FROM students WHERE id = ?');
  stmt.run(id, function (err) {
    if (err) return callback(err);
    callback(null, this.changes > 0);
  });
}

module.exports = { create, findAll, findById, update, remove };

const fs = require('fs');
const path = require('path');
const { getDb } = require('../config/database');

function ensureMigrationsTable(db) {
  db.run(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function appliedMigrations(db, cb) {
  db.all('SELECT name FROM migrations', (err, rows) => {
    if (err) return cb(err);
    cb(null, new Set(rows.map((r) => r.name)));
  });
}

function applyMigration(db, name, sql, cb) {
  db.exec(sql, (err) => {
    if (err) return cb(err);
    db.run('INSERT INTO migrations (name) VALUES (?)', [name], cb);
  });
}

function run() {
  const db = getDb();
  ensureMigrationsTable(db);

  const migrationsDir = path.join(__dirname, '..', 'migrations');
  if (!fs.existsSync(migrationsDir)) return console.log('no migrations folder');

  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

  appliedMigrations(db, (err, applied) => {
    if (err) throw err;
    (async () => {
      for (const file of files) {
        if (applied.has(file)) continue;
        console.log('applying', file);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await new Promise((res, rej) => applyMigration(db, file, sql, (e) => (e ? rej(e) : res())));
        console.log('applied', file);
      }
      console.log('migrations complete');
      process.exit(0);
    })().catch((e) => { console.error(e); process.exit(1); });
  });
}

run();

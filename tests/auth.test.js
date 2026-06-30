const request = require('supertest');
const app = require('../app');
const { getDb } = require('../config/database');
const fs = require('fs');
const path = require('path');

beforeAll((done) => {
  // ensure migrations applied
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  const db = getDb();
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
  (async () => {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      await new Promise((res, rej) => db.exec(sql, (e) => (e ? rej(e) : res())));
    }
    done();
  })().catch(done);
});

test('register, login, create student flow', async () => {
  const username = `u${Date.now()}`;
  const password = 'password123';

  const reg = await request(app).post('/api/auth/register').send({ username, password });
  expect(reg.status).toBe(201);

  const login = await request(app).post('/api/auth/login').send({ username, password });
  expect(login.status).toBe(200);
  expect(login.body.token).toBeDefined();
  const token = login.body.token;

  const create = await request(app).post('/api/students').set('Authorization', `Bearer ${token}`).send({ name: 'Alice', email: `${username}@example.com` });
  expect(create.status).toBe(201);

  const list = await request(app).get('/api/students').set('Authorization', `Bearer ${token}`);
  expect(list.status).toBe(200);
  expect(Array.isArray(list.body.rows)).toBe(true);
});

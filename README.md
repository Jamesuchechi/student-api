# Student Management API

A production-oriented student management API built with Express and SQLite.

## Features
- JWT authentication
- Role-aware routing support
- SQLite storage with schema initialization
- Request validation hooks
- Production middleware: Helmet, CORS, Morgan

## Run locally
```bash
npm install
npm run dev
```

## Notes
- Current storage is SQLite. Later you can swap storage adapters to PostgreSQL or MongoDB.
- Add frontend consumption on top via `/api/auth` and `/api/students`.

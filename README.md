# 📒 Bahhi Khata — Backend-First Expense Tracker

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Bahhi Khata is a **backend-first expense tracker** built as a **proof-of-work engineering project**. The focus is on **correct backend design, schema ownership, authentication, and real-world evolution**, with the frontend intentionally kept simple until the data layer is solid.

This project is meant to resemble a **digital khata (ledger)** — reliable, structured, and honest — rather than a flashy dashboard.

---

## 🎯 Project Philosophy

* **Backend correctness first** — APIs, auth, and schema before UI polish
* **Schema evolves with features** — migrations over guesswork
* **No premature abstraction** — clarity > cleverness
* **Real-world constraints** — production DB, cloud hosting, auth flows

---

## 🌟 Live Demo

* **Backend API**: [https://bahhi-khata-backend.onrender.com](https://bahhi-khata-backend.onrender.com)
  *(Render free tier — may cold start)*
* **Frontend**: Local / in progress

---

## 🚀 Quick Start

### Prerequisites

* Node.js 18+
* PostgreSQL 16+ (local or Neon)
* Git

### Backend Setup

```bash
git clone https://github.com/BahhiKhata/BahhiKhata.git
cd BahhiKhata/backend
npm install
cp .env.example .env
```

Initialize database:

```bash
psql <DATABASE_URL> -f database/schema.sql
```

Start server:

```bash
npm run dev
# or
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🏗️ Architecture Overview

```
Frontend (Next.js)
        │
        ▼
Backend API (Express + JWT)
        │
        ▼
PostgreSQL (Neon)
```

* Stateless JWT authentication
* Strict user-level data ownership
* Hosted on Render + Neon

---

## 📁 Project Structure

### Backend

```
backend/
├── server.js
├── config/db.js
├── routes/
│   ├── auth.js
│   ├── expenses.js
│   └── expenseTypes.js
├── middleware/auth.js
├── database/
│   ├── schema.sql
│   └── migrations/
└── utils/
```

### Frontend

```
frontend/
├── pages/
│   ├── login.jsx
│   ├── register.jsx
│   ├── expenses.jsx
│   ├── add-expense.jsx
│   └── edit-expense/[id].jsx
├── components/
│   └── Layout.jsx
├── utils/api.js
```

---

## 📊 Database Schema (Phase 3 — Final)

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expense_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expense_type_id INTEGER NOT NULL REFERENCES expense_types(id),
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    description TEXT,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_type ON expenses(expense_type_id);
```

---

## 🔌 API Overview

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Expenses (Phase 3)

* `GET /api/expenses` (supports filters)
* `POST /api/expenses`
* `PUT /api/expenses/:id`
* `DELETE /api/expenses/:id`

Filtering supported via query params:

```
/api/expenses?from=YYYY-MM-DD&to=YYYY-MM-DD&min=100&max=500
```

---

## ✅ Phase 3 — Completed Features

* JWT-based authentication
* Expense CRUD (add / edit / delete)
* User-scoped data access
* Date & amount filtering
* Production DB on Neon
* Schema migration experience
* Minimal but functional frontend

Phase 3 intentionally focuses on **correctness over polish**.

---

## 🛣️ Roadmap

### Phase 4 — Analytics & Statistics

* Monthly spending summary
* Category-wise totals
* Daily averages
* Dedicated `/stats` pages

### Phase 5 — UX & Efficiency

* Better edit flows (inline / modal)
* Debounced filters
* Pagination
* Performance improvements

### Phase 6 — Bahhi Khata UI Identity

* Ledger-style layout
* Date-grouped expenses
* Calm, paper-like design language

---

## 📝 License

MIT License

---

⭐ *This repository represents real backend learning: schema drift, migrations, auth, and production debugging — not just UI

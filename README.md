

📒 Bahhi Khata — Expense Tracker (MVP)

Bahhi Khata is a minimal, clean expense tracker built with a custom backend and database, focusing on correctness, simplicity, and extensibility.
This project intentionally avoids over-engineering and serves as a strong foundation for future features.

🚀 Tech Stack
Frontend

Next.js (Pages Router)

React

Axios

Tailwind CSS

Backend

Node.js

Express.js

PostgreSQL

JWT (JSON Web Tokens)

bcrypt

Database

PostgreSQL (Local Development)

🧠 Tech Stack Explained (What does what?)
Next.js (Frontend)

Handles routing (/login, /register, /expenses)

Manages UI state and navigation

Communicates with backend via REST APIs

Uses pages/ routing (file-based routing)

Axios

Centralized API client (utils/api.js)

Automatically attaches JWT token to every request

Keeps frontend-backend communication clean

Express.js (Backend)

Exposes REST APIs (/auth, /expenses)

Handles authentication and authorization

Acts as the middle layer between frontend and database

PostgreSQL

Stores users and expenses

Ensures data integrity and persistence

Connected via pg library using connection pooling

JWT (Authentication)

Generated on login

Stored in browser localStorage

Sent with every protected request

Used by backend middleware to protect routes

bcrypt

Hashes passwords before storing in DB

Compares hashed passwords securely during login

🔄 Program Flow (End-to-End)
1️⃣ User Registration

User submits name, email, password

Frontend sends request to POST /api/auth/register

Backend:

Hashes password

Stores user in PostgreSQL

User is redirected to login

2️⃣ User Login

User submits email & password

Frontend sends request to POST /api/auth/login

Backend:

Verifies credentials

Generates JWT token

Token is stored in localStorage

3️⃣ Authenticated Requests

Axios interceptor attaches JWT automatically

Backend middleware verifies token

User-specific data is returned

4️⃣ Expense Flow

User accesses /expenses

Frontend calls GET /api/expenses

Backend:

Extracts user from JWT

Fetches expenses belonging to that user

Data is rendered on UI

5️⃣ Logout

Token removed from localStorage

User redirected to /login

Protected routes are blocked

📁 Project Structure
Backend
backend/
│── server.js              # Entry point
│── config/
│   └── db.js              # PostgreSQL connection
│── routes/
│   ├── auth.js            # Register & login APIs
│   └── expenses.js        # Expense CRUD APIs
│── middleware/
│   └── auth.js            # JWT authentication middleware
│── .env                   # Environment variables

Frontend
frontend/
│── pages/
│   ├── index.js           # Redirect logic
│   ├── login.js           # Login page
│   ├── register.js        # Register page
│   ├── expenses.js        # Expense list (protected)
│   └── add-expense.js     # Add expense form
│── utils/
│   └── api.js             # Axios instance
│── styles/
│   └── globals.css

✅ Current Features (MVP)

User registration

User login

JWT-based authentication

Protected routes

Add expense

View expenses

User-specific data isolation

Logout functionality

Clean frontend-backend separation

⚠️ Note: This is intentionally a minimal MVP. No analytics, no charts, no automation yet.

🧹 Cleanup & Decisions Made

Things intentionally removed or avoided:

Supabase (fully replaced with custom backend)

CSV import

Auto/UPI parsing

Budgets & insights

Overly complex UI components

These were removed to:

Reduce cognitive load

Improve reliability

Keep ownership of backend logic

Build strong fundamentals first

🛠️ Environment Variables
Backend (backend/.env)
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/bahhi_khata
JWT_SECRET=your_secret_key
PORT=5000

Frontend (frontend/.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

🔮 Planned Improvements (Future Roadmap)
UI / UX

Better layout and spacing

Responsive dashboard

Dark mode

Improved empty states

Core Features

Edit expense

Delete expense confirmation modal

Expense categories management

Date-based filtering

Advanced / Unique Features (Suggested)

Monthly expense summary

Smart expense tagging

Budget alerts

Spending pattern insights

Offline-first support

CSV / PDF export

AI-based expense categorization (future)

Multi-device sync (cloud DB)

Auth Enhancements (Later)

Google OAuth

Password reset

Email verification

🎯 Project Philosophy

Simple. Correct. Extensible.

This project prioritizes:

Understanding over abstraction

Ownership over third-party magic

Clean foundations over flashy features

📌 Status

✅ Backend stable

✅ Frontend connected

✅ Database integrated

🚧 Features intentionally limited

🚀 Ready for iteration


🧭 Phased Development Plan

This project is intentionally being developed in clear phases, with each phase focusing on one core concern.
New features will only be added after the previous phase is stable and understood.

✅ Phase 0 — Foundation (Completed)

Goal: Build a clean, correct base system.

What was done:

Set up PostgreSQL locally

Designed core database tables (users, expenses)

Built custom backend using Express

Implemented JWT-based authentication

Connected frontend to backend using REST APIs

Removed Supabase and unnecessary abstractions

Cleaned frontend and backend structure

Verified end-to-end flow (register → login → expenses)

Outcome:
A stable MVP with full ownership of backend, database, and authentication.

🟡 Phase 1 — Database & Schema Evolution (Planned)

Goal: Prepare database for future features.

Planned changes:

Add new tables as features are introduced (not in advance)

Normalize schema where needed

Introduce foreign key constraints properly

Add indexes for frequently queried fields

Improve date-based querying and aggregations

Reasoning:
Schema will evolve with features, not before them, to avoid premature complexity.

🟡 Phase 2 — Cloud Database & Backend Hosting (Planned)

Goal: Move from local setup to a managed environment.

Planned changes:

Migrate PostgreSQL to a cloud provider (e.g. Neon / Railway / Supabase DB)

Update backend connection string

Add environment-based configuration

Ensure secure secrets handling

Enable basic logging and monitoring

Reasoning:
Cloud setup will make the app accessible, scalable, and production-like.

🟡 Phase 3 — Public App Release (Minimal UI) (Planned)

Goal: Make the app usable by real users with the simplest possible UI.

Planned changes:

Keep UI minimal and functional

Focus on clarity over aesthetics

Ensure all core flows are stable

Handle edge cases and errors gracefully

Reasoning:
A simple, working app is more valuable than a complex, unfinished one.

🟡 Phase 4 — UI / UX Improvements (Planned)

Goal: Improve usability and visual clarity.

Planned changes:

Better layout and spacing

Improved mobile responsiveness

Cleaner navigation

Consistent design language

Optional dark mode

Reasoning:
UI improvements will be done only after core functionality is proven stable.

🟡 Phase 5 — Advanced Features & Auth Enhancements (Planned)

Goal: Extend functionality without breaking the core system.

Planned features:

OAuth-based authentication (Google, etc.)

Password reset and account recovery

Better session handling

Role-based access (if needed)

Reasoning:
Advanced authentication will be added after understanding and stabilizing JWT-based auth.

🟡 Phase 6 — Advanced & Unique Features (Exploratory)

Goal: Differentiate the app from generic expense trackers.

Possible features (subject to validation):

Smart categorization of expenses

Monthly and yearly summaries

Budget alerts and thresholds

Export (CSV / PDF)

Spending pattern insights

Offline-first support

AI-assisted tagging or summaries (future exploration)

Reasoning:
These features will be added selectively, based on learning goals and project direction.

📌 Development Philosophy

Features are added only when needed

Each phase is completed before moving forward

Understanding > speed

Clean architecture > feature count

No premature optimization or abstraction

📍 Current Status

Phase 0: ✅ Completed

Phase 1+: ⏳ Planned
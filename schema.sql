# 🧾 Bahhi Khata

Bahhi Khata is a **backend-first expense tracker** built as a proof-of-work project.
The focus of this project is **backend correctness, clean architecture, and realistic frontend UX**, not feature bloat.

---

## 🚀 Project Overview

Bahhi Khata allows users to:
- Register and authenticate securely
- Add, view, and delete personal expenses
- Persist data in a cloud-hosted PostgreSQL database
- Use a clean, responsive, and animated frontend interface

The application intentionally avoids over-engineering and frameworks that hide core logic.

---

## 🧱 Tech Stack

### Frontend
- **Next.js (Pages Router)**
- **React**
- **Tailwind CSS**
- **Axios**
- Deployed on **Vercel** (planned)

### Backend
- **Node.js**
- **Express**
- **JWT authentication**
- **bcrypt password hashing**
- Hosted on **Render (free tier)**

### Database
- **PostgreSQL (Neon cloud)**

---

## 🔐 Authentication

- Email + password authentication
- Passwords hashed using `bcrypt`
- Stateless JWT authentication
- Tokens stored client-side (localStorage)
- Protected routes via middleware

No third-party auth providers are used at this stage by design.

---

## 📦 Project Phases

### ✅ Phase 0 — Foundation
- Express backend setup
- PostgreSQL schema design
- JWT authentication
- Protected routes

### ✅ Phase 1 — Database Evolution
- Normalized schema
- Expense types table
- Foreign key constraints
- SQL JOINs for enriched responses

### ✅ Phase 2 — Cloud Deployment
- Neon PostgreSQL migration
- Backend deployment on Render
- Environment-based configuration
- Production-ready API

### ✅ Phase 3 — Frontend Polish & UX (Current)

This phase focused entirely on **frontend quality and usability**, without changing backend architecture.

#### Key improvements:
- Introduced a proper **Home / Landing page**
- Implemented a global **Layout system** (Navbar + Footer)
- Created reusable UI components:
  - `<Input />`
  - `<Button />`
- Rebuilt **Login** and **Register** pages with:
  - Better layout
  - Autofill support
  - Show/hide password
  - Error handling
- Added **premium CSS styling**:
  - Soft gradients
  - Elevation and shadows
  - Hover and focus transitions
  - Page entry animations
- Fixed layout alignment issues:
  - Consistent max-width grid
  - Proper vertical centering
  - Navbar / content / footer alignment
- Maintained logic-UI separation (no logic regressions)

---

## 🖥️ Frontend Structure

frontend/
├── pages/
│ ├── _app.js
│ ├── index.js # Home page
│ ├── login.js
│ ├── register.js
│ └── expenses.js
│
├── components/
│ ├── Layout.js
│ ├── Navbar.js
│ ├── Footer.js
│ ├── Input.js
│ └── Button.js
│
├── styles/
│ └── globals.css
│
└── utils/
└── api.js

yaml
Copy code

---

## 🎨 Design Philosophy

- Clean, minimal, fintech-style UI
- Animations only where they add clarity
- No unnecessary libraries
- Accessibility-friendly inputs
- Responsive by default

The goal is **professional and calm**, not flashy.

---

## 📌 Current Status

- Backend: ✅ Stable & deployed
- Frontend: ✅ Polished, animated, presentable
- Auth: ✅ Working end-to-end
- Ready for frontend deployment on Vercel

---

## 🔮 Future Scope

Planned improvements (not yet implemented):
- Add expense form UI
- Expense filtering and summaries
- Monthly insights / analytics
- Optional OAuth (Google, GitHub)
- Dark mode
- Mobile-first refinements

---

## 🧠 Key Takeaway

Bahhi Khata is built to demonstrate:
- Real backend engineering
- Practical frontend UX decisions
- Incremental, justified development phases
- Clear separation of concerns

This is not a tutorial project — it’s a **deliberate engineering exercise**.

---

## 👤 Author

**Harsh Mrigank**  
Backend-first engineering project
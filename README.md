# 📒 Bahhi Khata — Backend-First Expense Tracker

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Bahhi Khata is a **minimal, backend-first expense tracker** built as a **proof-of-work project** to demonstrate **correct backend design, authentication, database ownership, and cloud deployment**. The project deliberately avoids over-engineering and focuses on **clarity, correctness, and extensibility**.

## 🎯 Project Philosophy
- **Backend correctness first** — Robust APIs before fancy UI
- **Simplicity over abstraction** — No premature optimization
- **Ownership over third-party magic** — Understand every layer
- **Schema evolves with features** — Not before them

## 🌟 Live Demo
- **Backend API**: `https://bahhi-khata-backend.onrender.com` (Render free tier - may cold start)
- **Frontend**: Coming soon
- **API Documentation**: See [API Reference](#api-reference) below

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 16+ (local or Neon cloud)
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/BahhiKhata/BahhiKhata.git
   cd BahhiKhata/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Initialize database**
   ```bash
   # Create database and tables
   psql -U your_user -d postgres -f database/schema.sql
   ```

5. **Start the server**
   ```bash
   npm run dev  # Development mode with nodemon
   # OR
   npm start    # Production mode
   ```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🏗️ Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │────▶│   PostgreSQL    │
│   (Next.js)     │◀────│   (Express)     │◀────│   (Neon)        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                        │                        │
        └────────────────────────┼────────────────────────┘
                                 ▼
                         ┌─────────────────┐
                         │   Render.com    │
                         │   (Hosting)     │
                         └─────────────────┘
```

## 📁 Project Structure

### Backend (`/backend`)
```
backend/
├── server.js                 # Application entry point
├── package.json             # Dependencies and scripts
├── .env.example             # Environment template
├── config/
│   └── db.js               # PostgreSQL connection pool
├── routes/
│   ├── auth.js             # Authentication endpoints
│   ├── expenses.js         # Expense CRUD operations
│   └── expenseTypes.js     # Expense type management
├── middleware/
│   └── auth.js             # JWT verification middleware
├── database/
│   └── schema.sql          # Database schema and seed data
└── utils/
    └── validators.js       # Input validation utilities
```

### Frontend (`/frontend`)
```
frontend/
├── pages/
│   ├── login.jsx           # Login page
│   ├── register.jsx        # Registration page
│   ├── expenses.jsx        # Expense listing
│   └── add-expense.jsx     # Add expense form
├── utils/
│   └── api.js             # Axios API client configuration
├── styles/
│   └── globals.css        # Global Tailwind styles
└── package.json
```

## 🔧 Tech Stack Deep Dive

### Backend Layer
- **Express.js** - Lightweight, unopinionated web framework
- **JWT Authentication** - Stateless, scalable authentication
- **bcrypt.js** - Secure password hashing
- **pg** - PostgreSQL client with connection pooling
- **cors** - Cross-origin resource sharing

### Database Layer
- **PostgreSQL 16+** - Robust, ACID-compliant relational database
- **Neon** - Serverless PostgreSQL with branching
- **Foreign Keys** - Referential integrity enforcement
- **Indexes** - Optimized query performance
- **JSON Support** - Flexible data when needed

### Frontend Layer
- **Next.js 13** - React framework with file-based routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - Promise-based HTTP client
- **React Hooks** - Modern state and effect management

### Deployment & DevOps
- **Render** - Platform as a Service for backend hosting
- **GitHub Actions** - CI/CD pipeline (planned)
- **Environment Variables** - Secure configuration management
- **SSL/TLS** - Encrypted data transmission

## 📊 Database Schema

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expense types (reference table)
CREATE TABLE expense_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Expenses table
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    expense_type_id INTEGER REFERENCES expense_types(id),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    description TEXT,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
```

## 🔌 API Reference

### Authentication Endpoints

#### `POST /api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "userId": 1
}
```

#### `POST /api/auth/login`
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Expense Endpoints

#### `GET /api/expenses`
Get all expenses for authenticated user.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
[
  {
    "id": 1,
    "amount": 50.75,
    "description": "Groceries",
    "expense_date": "2024-01-15",
    "type_name": "Food",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

#### `POST /api/expenses`
Create a new expense.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Request Body:**
```json
{
  "amount": 29.99,
  "description": "Monthly Netflix subscription",
  "expense_type_id": 3,
  "expense_date": "2024-01-15"
}
```

### Expense Types

#### `GET /api/expense-types`
Get all available expense types.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

## 🚢 Deployment Guide

### 1. Database Deployment (Neon)
1. Create account at [neon.tech](https://neon.tech)
2. Create new project and database
3. Copy connection string from Dashboard
4. Run schema: `psql [connection_string] -f database/schema.sql`

### 2. Backend Deployment (Render)
1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add `DATABASE_URL` and `JWT_SECRET`

### 3. Frontend Deployment (Vercel)
1. Create account at [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run specific test suites
npm test -- --testPathPattern=auth
npm test -- --testPathPattern=expenses

# Test with coverage
npm run test:coverage
```

## 🔒 Security Features

- **JWT-based authentication** with configurable expiration
- **Password hashing** using bcrypt (salt rounds: 10)
- **SQL injection prevention** via parameterized queries
- **CORS configuration** for cross-origin security
- **Environment-based configuration** (no secrets in code)
- **Input validation** on all endpoints
- **HTTPS enforcement** in production

## 📈 Performance Optimizations

- **Database connection pooling** (max 20 connections)
- **Query optimization** with proper indexes
- **Response compression** for large datasets
- **Caching headers** for static assets
- **Lazy loading** of non-critical modules

## 🛠️ Development Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "db:reset": "node scripts/reset-database.js",
    "db:seed": "node scripts/seed-database.js",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## 🎨 Repository Improvement Tactics

### 1. **Documentation Enhancement**
- [ ] Add API documentation with Swagger/OpenAPI
- [ ] Create architecture decision records (ADRs)
- [ ] Add database migration guide
- [ ] Include troubleshooting section
- [ ] Add contribution guidelines

### 2. **Code Quality**
- [ ] Add ESLint with custom rules
- [ ] Implement Prettier for code formatting
- [ ] Add Husky pre-commit hooks
- [ ] Set up commit message conventions
- [ ] Add code coverage reporting

### 3. **Testing Strategy**
- [ ] Unit tests for utility functions
- [ ] Integration tests for API endpoints
- [ ] Database transaction tests
- [ ] Load testing for critical paths
- [ ] End-to-end testing with Cypress

### 4. **CI/CD Pipeline**
- [ ] GitHub Actions for automated testing
- [ ] Automated deployments to staging
- [ ] Database migration automation
- [ ] Security scanning (SAST, DAST)
- [ ] Performance benchmarking

### 5. **Monitoring & Observability**
- [ ] Add logging with Winston/Morgan
- [ ] Implement error tracking (Sentry)
- [ ] Add health check endpoints
- [ ] Set up metrics collection
- [ ] Create monitoring dashboard

### 6. **Developer Experience**
- [ ] Add Docker configuration
- [ ] Create development environment script
- [ ] Add database seeding utilities
- [ ] Implement hot reload configuration
- [ ] Add API client generation

## 🔄 Development Workflow

1. **Feature Development**
   ```bash
   git checkout -b feature/your-feature
   # Make changes
   npm run lint
   npm test
   git commit -m "feat: add your feature"
   ```

2. **Code Review**
   - Create pull request
   - Ensure all tests pass
   - Update documentation
   - Request review

3. **Deployment**
   - Merge to main branch
   - CI/CD pipeline triggers
   - Automated tests run
   - Deploy to staging
   - Manual verification
   - Promote to production

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```
   Error: Cannot find module 'express'
   ```
   **Solution:** Run `npm install` in the backend directory

2. **Port Already in Use**
   ```
   Error: listen EADDRINUSE: address already in use :::5000
   ```
   **Solution:** Change port in `.env` or kill existing process

3. **JWT Authentication Failures**
   ```
   Error: invalid token
   ```
   **Solution:** Check `JWT_SECRET` environment variable

4. **CORS Errors in Development**
   ```
   Access-Control-Allow-Origin error
   ```
   **Solution:** Ensure frontend URL is in CORS configuration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) team for the amazing framework
- [PostgreSQL](https://www.postgresql.org/) community
- [Render](https://render.com/) for free tier hosting
- [Neon](https://neon.tech/) for serverless PostgreSQL

---

## 📞 Support

For support, email [your-email] or open an issue in the GitHub repository.

## 📊 Project Status

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0 — Foundation | ✅ Completed | Basic backend with authentication |
| Phase 1 — Database Evolution | ✅ Completed | Enhanced schema and relationships |
| Phase 2 — Cloud Deployment | ✅ Completed | Production deployment on Render |
| Phase 3 — Frontend Polish | 🟡 In Progress | UI improvements and UX enhancements |
| Phase 4 — Advanced Features | 🔄 Planned | Analytics, reports, and exports |
| Phase 5 — Mobile App | 🔄 Planned | React Native application |

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**
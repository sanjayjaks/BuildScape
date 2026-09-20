# 🏗️ BuildScape

**An open-source marketplace connecting people with verified construction and interior-design professionals, with interactive 3D project visualization on the roadmap.**

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-in%20development-orange.svg)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20Node%20%7C%20MongoDB-green.svg)

## Why BuildScape?

Finding trustworthy construction and interior-design professionals is hard. Providers are scattered across word-of-mouth, social media and unverified listings, and clients can't easily compare work, get estimates, or picture the result before hiring.

BuildScape brings discovery, provider verification, project management and (soon) 3D previews into one platform.

## Features

**Working today**
- 🔐 **Authentication:** registration and login with JWT, bcrypt password hashing, and role-based access (client / service provider)
- 🔎 **Service discovery:** browse, search and filter service providers
- 🧑‍🔧 **Provider onboarding:** provider registration with verification document upload (multer)
- 📁 **Projects:** create and manage project information through the API and dashboard
- 💰 **Estimates:** service estimate endpoint
- 🖼️ **Portfolios:** verified providers can add portfolio items
- 💎 **Membership UI:** membership plan components
- 🎨 **Modern UI:** responsive React interface with Tailwind CSS and Framer Motion

**Planned**
- 🧊 Interactive 3D room and project visualization (three.js)
- 📧 Email verification and notifications
- ✅ Automated tests and CI
- 🔒 Security hardening (rate limiting, upload validation, secrets management)

> Some UI areas use mock data or are still under development. See the code for current details.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite, React Router, Tailwind CSS, Framer Motion, Axios |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Multer |

## Project Structure

```
BuildScape/
├── frontend/          # React + TypeScript app (Vite)
│   └── src/
│       ├── auth/  components/  context/  layouts/
│       └── pages/  services/  utils/
└── backend/           # Express REST API
    ├── config/  controllers/  middleware/
    ├── models/  routes/  utils/
    └── server.js
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- MongoDB running locally (or a MongoDB Atlas connection string)

### 1. Clone
```bash
git clone https://github.com/sanjayjaks/BuildScape.git
cd BuildScape
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env    # then edit .env (see below)
npm run dev
```
The API runs at `http://localhost:5000`. Check it at `http://localhost:5000/api/health`.

### 3. Frontend
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
The app runs at `http://localhost:5173`.

## Environment Variables

`backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/buildscape
JWT_SECRET=replace_with_a_long_random_string
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:5000
```

`frontend/.env` (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

Never commit `.env` files or secrets.

## API Overview

| Route | Description |
|---|---|
| `POST /api/auth/register`, `POST /api/auth/login` | Create account, sign in |
| `GET /api/services/providers` | List service providers |
| `GET /api/services/search` | Search and filter providers |
| `GET /api/services/providers/:id` | Provider details |
| `POST /api/services/register` | Register as a provider (with documents) |
| `POST /api/services/estimate` | Get a service estimate (auth required) |
| `/api/projects` | Project management (auth required) |
| `GET /api/health` | Health check |

## Roadmap

- [ ] Fix and stabilize the build and CI pipeline
- [ ] Add automated tests (backend and frontend)
- [ ] Email verification and notifications
- [ ] **3D visualization:** interactive room and project previews with three.js
- [ ] Security hardening and production deployment guide
- [ ] Accessibility and performance improvements

## Contributing

Contributions are welcome.

1. Fork the repo and create a branch: `git checkout -b

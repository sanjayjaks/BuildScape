# 🏗️ BuildScape

**BuildScape is a Smart Service Marketplace project focused on
connecting people with construction and interior-design professionals.
Its vision is to make service discovery and project planning easier
through a modern web experience, with interactive 3D visualization
planned for the future.**

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-in%20development-orange.svg)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20Node.js%20%7C%20MongoDB-green.svg)

> **Project status:** BuildScape is under active development. Some API
> responses and interface areas currently use placeholder or mock data.
> Review the implementation before relying on a feature in production.

------------------------------------------------------------------------

## 🌟 Why BuildScape?

Finding suitable construction and interior-design professionals can
involve searching across multiple sources and comparing services
manually. BuildScape aims to bring service discovery and project-related
workflows together in one accessible platform.

The long-term goal is to help users explore service providers, manage
project information, and eventually visualize ideas through interactive
3D experiences.

## ✨ Features and Development Areas

### Present in the codebase

-   🔐 **Authentication foundation:** JWT-based authentication
    middleware and password-hashing dependencies.
-   🔎 **Service discovery interfaces and API routes:** Provider
    listing, search, and detail routes are present; some controller
    responses are currently sample data.
-   🧑‍🔧 **Provider onboarding foundation:** Provider registration logic
    and document-upload handling are represented in the backend.
-   📁 **Project workflows:** Project-related routes and frontend
    interfaces are included; verify the current persistence and
    authorization behavior before production use.
-   💰 **Estimate endpoint:** An estimate route exists, but its current
    response is a placeholder and should not be treated as a real
    quotation.
-   🖼️ **Portfolio endpoint:** Portfolio functionality is represented in
    the API, but the current controller response is not backed by
    persistent portfolio storage.
-   💎 **Membership UI:** Membership-related interface components.
-   🎨 **Modern frontend:** React, TypeScript, Tailwind CSS, and Framer
    Motion are included in the frontend stack.

### Planned / to be completed

-   🧊 Interactive room and project visualization using Three.js or a
    compatible 3D stack.
-   📧 Email verification and notification workflows.
-   ✅ Automated frontend and backend test coverage.
-   🔒 Production security hardening, including rate limiting, upload
    validation, and robust secrets management.
-   🚀 Deployment configuration and production-readiness improvements.
-   ♿ Accessibility and performance improvements.

## 🛠️ Tech Stack

  -----------------------------------------------------------------------
  Layer                               Technologies
  ----------------------------------- -----------------------------------
  Frontend                            React 18, TypeScript, Vite, React
                                      Router, Tailwind CSS, Framer
                                      Motion, Axios

  Backend                             Node.js, Express, MongoDB,
                                      Mongoose, JWT, bcryptjs, Multer

  Development                         ESLint, Vitest dependencies, npm
  -----------------------------------------------------------------------

## 📁 Project Structure

``` text
BuildScape/
├── frontend/                 # React + TypeScript application
│   └── src/
│       ├── auth/
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       └── utils/
└── backend/                  # Express API
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── utils/
    └── server.js
```

## 🚀 Getting Started

### Prerequisites

-   Node.js 18 or later
-   npm
-   MongoDB running locally, or a MongoDB connection string for a hosted
    database

### 1. Clone the repository

``` bash
git clone https://github.com/sanjayjaks/BuildScape.git
cd BuildScape
```

### 2. Configure and start the backend

``` bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory. You can use
`.env.example` as a reference if it is present in your checkout.

``` env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/buildscape
JWT_SECRET=replace_with_a_long_random_string
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:5000
```

Use a strong, private value for `JWT_SECRET`. Do not commit your `.env`
file.

Start the backend:

``` bash
npm run dev
```

The API is expected to run at `http://localhost:5000` when using the
default port. If available in your version, the health endpoint is:

``` text
http://localhost:5000/api/health
```

### 3. Configure and start the frontend

Open a second terminal from the repository root:

``` bash
cd frontend
npm install
```

If your local setup needs an explicit API base URL, create
`frontend/.env`:

``` env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

``` bash
npm run dev
```

Vite will print the local development URL in the terminal, commonly
`http://localhost:5173`.

## 🔌 API Overview

The backend includes route groups for authentication, services,
projects, and health checks. Exact endpoints and access requirements may
evolve.

  -----------------------------------------------------------------------
  Route group / endpoint              Purpose
  ----------------------------------- -----------------------------------
  `/api/auth`                         Authentication-related operations

  `/api/services`                     Provider discovery, provider
                                      details, onboarding, and
                                      service-related operations

  `/api/projects`                     Project-related operations

  `/api/health`                       Basic health check, if enabled in
                                      the current server configuration
  -----------------------------------------------------------------------

Some service-controller operations currently return placeholder or
sample responses. Confirm the relevant controller and route
implementation before treating an endpoint as production-ready.

## 🧭 Roadmap

-   [x] Establish the React/TypeScript frontend and Express backend
    foundations
-   [ ] Complete and validate core marketplace workflows
-   [ ] Add automated frontend and backend tests
-   [ ] Implement email verification and notifications
-   [ ] Develop interactive 3D room and project previews
-   [ ] Strengthen security and production configuration
-   [ ] Improve accessibility, performance, and deployment documentation

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome.

1.  Fork the repository.

2.  Create a branch for your change:

    ``` bash
    git checkout -b feature/your-feature
    ```

3.  Make your changes and test them.

4.  Open a pull request explaining what changed and why.

Please do not commit credentials, private user files, `.env` files, or
`node_modules`.

## 📌 Status

BuildScape is an early-stage project under active development. Features,
routes, and implementation details may change as development continues.

## 👨‍💻 Author

**Sanjay Jakkani**

-   GitHub: [@sanjayjaks](https://github.com/sanjayjaks)
-   Repository: [BuildScape](https://github.com/sanjayjaks/BuildScape)
-   LinkedIn: [Sanjay
    Jakkani](https://www.linkedin.com/in/sanjay-jakkani-0360203a9)

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE)
for details.

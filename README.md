# 🔐 Production-Ready Authentication & Authorization System

A full-stack, enterprise-grade authentication system built with **React**, **TypeScript**, **Node.js/Express**, and **MongoDB**. Designed around advanced security standards (In-Memory Access Tokens, HTTP-Only Refresh Token Sessions, CSRF/XSS mitigations), a Soft-Friction UX, and clean architectural principles (Layered Architecture, Dependency Injection, and External Memory Store).

---

## ✨ Features

### 🛡️ Security & Token Lifecycle
* **In-Memory Access Tokens:** Access Tokens are kept strictly in-memory using a custom React `useSyncExternalStore` store—never in `localStorage`.
* **Session-Based Refresh Tokens:** Secured via HTTP-Only, SameSite Cookies mapped to session records in MongoDB.
* **Silent Refresh System:** Background token renewal via custom Axios interceptors before token expiry.
* **OAuth 2.0 Integration:** Seamless single-click onboarding with Google OAuth.

### 👤 User Experience & Control
* **Soft-Friction Verification:** Users are logged in immediately upon registration; an unverified banner allows optional delayed email confirmation.
* **Role-Based Access Control (RBAC):** Multi-tier permission rules for public, auth-only, and admin layouts.
* **Forgot & Reset Password Flow:** Secure token-based password recovery via email.

### 📐 Software Architecture
* **Frontend:** Feature-based directory organization, custom generic UI components (`Button`, `Input`, `PageLoader`), and typed custom hooks.
* **Backend:** Layered architecture using standard Controller-Service-Repository pattern with Dependency Injection.
* **Validation & Error Handling:** Schema parsing via Zod, global async wrappers, and standard `ApiResponse` envelope.
* **Graceful Shutdown:** Clean handling of database connections and pending operations on process termination.

---

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Tailwind CSS, TanStack Query, React Hook Form, Zod.
* **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, PassportJS / OAuth2, Zod.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+ recommended)
* MongoDB database instance (Local or Atlas)

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=mongodb:link
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
```
Run the development server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```
Run the application:
```bash
npm run dev
```
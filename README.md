# System Architecture & Design Decisions

## Overview

This project is a **job-fetching and processing system** that periodically pulls job listings from external feeds (like [Jobicy](https://jobicy.com)), stores them in **MongoDB**, and maintains **import logs** for monitoring. The system includes a **React + TypeScript frontend** to visualize import logs and statistics.

---

## 🧱 Tech Stack

### 🖥️ Backend
- 🟩 **Node.js + Express** – REST API server.
- 🍃 **MongoDB (Mongoose)** – Stores job listings and import logs.
- 🟥 **Redis (Bull)** – Job queue and scheduler.
- 🐂 **Bull (Bull UI / custom dashboard)** – Queue management.
- 🌐 **Axios + xml2js** – Fetches and parses RSS job feeds.

### 🎨 Frontend
- ⚛️ **React + TypeScript** – Component-based UI.
- 🎀 **Tailwind CSS** – Utility-first styling.
- 🌍 **Axios** – HTTP client for backend API.

---

## ⚙️ System Components

### 1️⃣ Job Fetching & Processing
- 🔄 Jobs fetched from RSS feeds using `axios`.
- 📄 XML parsed with `xml2js` to extract job data.
- 📝 Each job normalized and upserted in MongoDB.
- ❌ Invalid/failed jobs logged with reasons.

### 2️⃣ Job Queue (Bull + Redis)
- 🕒 Asynchronous processing with `Bull`.
- ⏰ Scheduled via cron (`Bull.repeat`) every hour (`0 * * * *`).
- 🚦 Processes each feed serially to avoid overload.

### 3️⃣ Logging (ImportLog)
- 🗂️ Each fetch creates a single `ImportLog` entry.
- 📊 Tracks:
    - Total jobs fetched
    - New jobs created
    - Existing jobs updated
    - Failed jobs (with reasons)
    - Timestamp

### 4️⃣ API Endpoints
- `/api/fetch-logs`: Paginated logs with metadata (total pages, hasNext, etc.)
- ➕ Extendable for job listings or manual fetch triggers.

---

## 🖥️ Frontend UI

- ⚡ Built with **Vite + React + TypeScript + Tailwind CSS**.
- 📋 Displays:
    - Import history (paginated table)
    - Total import count
    - Last import timestamp
- ✨ Clean UX: hover states, loading indicators, error handling.

---

## ✅ Design Decisions

| 🎯 Decision | 💡 Reason |
|-------------|-----------|
| **Bull + Redis** | Efficient job queuing, retries, background processing |
| **XML + `xml2js`** | RSS feeds are XML; easy JSON conversion |
| **`findOneAndUpdate` with `upsert`** | Prevents duplication, handles create/update in one step |
| **Single `ImportLog` per batch** | Easier analytics, better performance, simpler frontend |
| **Tailwind CSS** | Fast, utility-first UI development |
| **Paginated API** | Scalable, avoids large payloads |
| **TypeScript types** | Data safety, developer productivity |

---

## 🔧 Run Commands

> **Ensure** 🟢 MongoDB, 🟥 Redis, and 🟩 Node.js are installed and running.

### 🚀 Backend

```bash
cd backend
npm install
npm run dev
```

### 🚀 Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Configurations

All sensitive and environment-specific configs are in `.env` or `config.env`, excluded from Git via `.gitignore`.

---

## 🛡️ Error Handling & Resilience

- Each job processed with `try-catch` for specific failure logging.
- Failed jobs saved in the `ImportLog` document.
- Bull retries failed jobs by default (configurable).

---

## 📁 Folder Structure (Simplified)

```
/backend
├── controllers/
├── models/
├── queues/
├── utils/
├── routes/
├── server.js
└── config.env

/frontend
├── components/
├── services/
├── types/
└── main.tsx
```

---

This architecture provides a **colorful, modular, and extensible** separation of concerns between job processing, logging, and presentation. The system is production-ready and can be enhanced with authentication, monitoring, and more!
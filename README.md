
# Custom Rate Limiter (Node.js + TypeScript)

A lightweight **rate limiting middleware** built in **TypeScript** for Express.
It uses the **Sliding Window algorithm** with an **in-memory store** to restrict how many requests a user can make within a given time window.

This project is **kept simple on purpose** (no Redis, no microservice mode) to clearly demonstrate how a rate limiter works under the hood.

---

## ✨ Features

* ⏳ **Sliding Window algorithm** — precise per-window request limiting.
* 🧠 **In-memory store** — easy to understand, no external dependencies.
* 🔌 **Express middleware** — plug into any route or the whole app.
* 📊 **RateLimit headers** — standard headers so clients know their limits.
* 🛑 **429 Too Many Requests** — when the limit is exceeded.

---

## 🚀 Getting Started

### Install

```bash
git clone https://github.com/<your-username>/custom-rate-limiter.git
cd custom-rate-limiter
npm install
```

### Run in dev mode

```bash
npm run dev
```

Server runs at [http://localhost:3000](http://localhost:3000).

---

## 🧩 Usage

In `server.ts`:

```ts
import express from "express";
import { MemoryStore } from "./ratelimiter/memoryStore";
import { rateLimiter } from "./ratelimiter/middleware";

const app = express();
const store = new MemoryStore();

// Allow 5 requests per minute per IP+route
const limiter = rateLimiter(store, { limit: 5, windowMs: 60_000 });

app.use("/api", limiter);

app.get("/api/shorten", (req, res) => {
  res.json({ ok: true, msg: "within limits" });
});

app.listen(3000, () => console.log("Server on http://localhost:3000"));
```

Now test:

```bash
for i in {1..6}; do curl -i http://localhost:3000/api/shorten; echo; done
```

* Requests **1–5** → `200 OK`
* Request **6** → `429 Too Many Requests` with `Retry-After` header

---

## 🔗 Integration Example

This rate limiter is used in my **URL Shortener project** with redis implementation.:

👉 [URL Shortener Repository](https://github.com/tesla77coded/url-shortner.git)

---

## 📚 How It Works

* Each request is assigned a **key**: `prefix:ip:route`.
* For that key, we keep a list of **timestamps**.
* On each request:

  1. Remove old timestamps outside the window.
  2. Add the current timestamp.
  3. Count how many remain.
* If count ≤ limit → **allow**.
* If count > limit → **block** with `429`.

---

## 🛠 Future Improvements

* 🔄 Token Bucket algorithm (burst-friendly).
* 🗄 Redis store (for distributed setups).
* 📦 NPM package distribution.

---

## 📜 License

MIT

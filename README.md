# Moodify — Real-Time Facial Emotion-Aware Music Streaming Platform

> A full-stack media platform that fuses on-device computer vision with a secure REST API and CDN-backed media pipeline to deliver music recommendations driven by a user's real-time facial expression.

![Node](https://img.shields.io/badge/Node.js-Express%205-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-ioredis-DC382D?logo=redis&logoColor=white)
![MediaPipe](https://img.shields.io/badge/MediaPipe-Tasks%20Vision-4285F4?logo=google&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20Cookies-black)

---

## 1. Overview

Moodify is a full-stack application that classifies a user's mood from live webcam input using on-device machine learning, then serves a matching audio track streamed from a CDN. The system is split into two independently deployable services — a React SPA (computer-vision capture + playback UI) and a Node/Express API (auth, media metadata, file ingestion) — communicating over a cookie-authenticated REST interface.

What makes this more than a simple "webcam app" is the engineering underneath it: client-side ML inference to avoid shipping raw video to a server, an ID3-aware media ingestion pipeline that extracts embedded cover art from MP3 binaries, a Redis-backed session-invalidation layer sitting alongside MongoDB persistence, and a feature-sliced frontend architecture with explicit separation between UI, state, hooks, and API layers.

---

## 2. Tech Stack

**Frontend**
- React 19 + Vite 8 (SPA, HMR build tooling)
- React Router 7 (`createBrowserRouter`, protected-route guarding)
- `@mediapipe/tasks-vision` — `FaceLandmarker` for client-side facial blendshape inference
- Axios (cookie-credentialed HTTP client)
- SCSS (feature-scoped + shared design tokens)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose (ODM, schema validation, unique indexing)
- Redis (`ioredis`) — token blacklist / session invalidation cache
- JSON Web Tokens (`jsonwebtoken`) + `bcryptjs` (password hashing)
- Multer (in-memory multipart file buffering)
- `node-id3` (MP3 ID3 metadata + embedded artwork extraction)
- `@imagekit/nodejs` (CDN-backed object storage for audio/image binaries)
- `cookie-parser`, `cors`, `dotenv`

---

## 3. System Architecture

Moodify follows a **three-tier architecture** with a clear separation between presentation, application/API, and data layers:

```
┌─────────────────────────┐        REST (JSON, cookie auth)        ┌──────────────────────────┐
│   React SPA (Frontend)  │ ───────────────────────────────────▶  │   Express API (Backend)  │
│  • Webcam + FaceLandmarker (on-device inference)               │  • Auth controller        │
│  • Context-based state (Auth, Song)                             │  • Song/media controller  │
│  • Custom HTML5 audio player                                    │  • JWT middleware         │
└─────────────────────────┘                                       └──────────────────────────┘
                                                                              │
                                                       ┌──────────────────────┼──────────────────────┐
                                                       ▼                      ▼                      ▼
                                                 MongoDB (Mongoose)     Redis (ioredis)        ImageKit CDN
                                                 Users / Songs          Token blacklist /       Audio files +
                                                                        session cache           extracted artwork
```

**Data flow, end to end:**

1. **Auth** — A user registers/logs in; the backend hashes the password with `bcryptjs`, issues a JWT (`id`, `username`, 3-day expiry), and sets it as a cookie. `auth.middleware.js` verifies the cookie on every protected request and checks Redis before trusting the token.
2. **Mood capture (client-side ML)** — On the protected `Home` route, `FaceExpression` opens the webcam via `getUserMedia`, initializes MediaPipe's `FaceLandmarker` in `VIDEO` running mode, and on each detection pass extracts facial blendshape scores (smile, jaw-open, brow-raise) entirely **in the browser** — no video frame is ever sent to the server, which is a meaningful privacy and bandwidth design decision.
3. **Mood classification** — A heuristic threshold classifier (`utils/utils.js`) maps blendshape scores to one of `happy`, `surprised`, or `sad`.
4. **Recommendation** — The classified mood is sent to `GET /api/song?mood=<mood>`, which queries MongoDB for a matching `Song` document and returns its CDN URL, poster URL, and title.
5. **Playback** — A custom-built `Player` component (no external player library) streams the track directly from the ImageKit CDN URL via the native HTML5 `<audio>` element.
6. **Media ingestion (admin/upload path)** — `POST /api/song` accepts a multipart MP3 upload via Multer (in-memory buffer, 10 MB limit), parses embedded ID3 metadata with `node-id3` to recover the track title and cover-art image buffer, then uploads both the audio file and the extracted artwork to ImageKit **concurrently** via `Promise.all`, and persists the resulting CDN URLs in MongoDB.

---

## 4. Key Features

- **On-device facial mood detection** using MediaPipe's `FaceLandmarker` blendshape model — no server-side video processing or storage.
- **Mood-driven song retrieval** via a query-based MongoDB lookup (`happy` / `sad` / `surprised`).
- **Cookie-based JWT authentication** with password hashing (`bcryptjs`, 10 salt rounds) and a dedicated `getMe` endpoint for session rehydration on page refresh.
- **Redis-backed logout/session invalidation** layer, decoupled from primary persistence (MongoDB) for fast, ephemeral token-state checks.
- **Automated metadata extraction from raw audio binaries** — track title and cover art are pulled directly from MP3 ID3 tags rather than requiring manual entry.
- **CDN-backed media storage** (ImageKit) for both audio files and poster art, keeping binary assets out of the primary database.
- **Custom audio player** with click-to-seek progress bar, ±5s skip, variable playback speed (0.5×–2×), volume control with mute toggle, and per-track state reset.
- **Protected client-side routing** — a `Protected` wrapper component gates authenticated routes and redirects unauthenticated users to `/login` based on live auth context state.
- **Feature-sliced frontend architecture** — each feature (`auth`, `Home`, `Expression`) owns its own pages, components, hooks, context/state, API service module, and styles.

---

## 5. Core Engineering Highlights

**Privacy-conscious ML placement.** Running `FaceLandmarker` client-side, instead of streaming webcam frames to a backend vision service, is a deliberate architectural choice: it removes an entire class of data-transfer and storage concerns around biometric video, and it keeps inference latency local rather than network-bound.

**Layered frontend architecture.** The codebase explicitly enforces a 4-layer separation per feature: **UI layer** (pages/components render and route), **hooks layer** (orchestrates state transitions and API calls), **state layer** (`React.Context` for `AuthContext` and `SongContext`), and **API layer** (isolated Axios service modules per feature). This keeps components free of direct HTTP calls and makes each layer independently testable and swappable.

**Concurrent I/O for media ingestion.** The song upload path uploads the audio file and its extracted cover image to ImageKit in parallel with `Promise.all` rather than sequentially, reducing upload latency for a workflow that would otherwise be I/O-bound on two separate network round trips.

**Decoupled session-invalidation cache.** Rather than relying solely on MongoDB for logout/blacklist checks (a `Blacklist` Mongoose model exists for this), the active implementation uses Redis as a fast, TTL-based cache (`EX 3600`) for invalidated sessions — keeping a high-frequency, low-latency check (every authenticated request) off the primary datastore.

**Schema-level data integrity.** Mongoose enforces uniqueness on `username`/`email`, requires `password` while excluding it from default query projections (`select: false`), and constrains `Song.mood` to a fixed enum — pushing data-shape validation down to the schema rather than relying on controller logic alone.

**Stateless, verifiable auth.** JWTs carry only non-sensitive identity claims (`id`, `username`) with a bounded 3-day expiry, verified per-request via middleware that fails closed (rejects on missing/invalid/blacklisted token) before any controller logic executes — keeping authorization checks centralized rather than duplicated per route.

**Binary-to-CDN media pipeline.** Audio is never written to local disk — Multer buffers uploads in memory, `node-id3` parses the buffer directly, and the binary is forwarded straight to ImageKit. This avoids local filesystem coupling, which matters for any future move to a stateless/containerized deployment.

---

## 6. Folder Structure

```
Moodify-main/
├── Backend/
│   ├── server.js                     # Entry point — loads env, connects DB, starts HTTP listener
│   └── src/
│       ├── app.js                    # Express app: middleware, CORS, route mounting
│       ├── config/
│       │   ├── db.js                 # MongoDB/Mongoose connection
│       │   └── cache.js              # Redis (ioredis) client configuration
│       ├── controller/
│       │   ├── auth.controller.js    # register / login / getMe / logout
│       │   └── song.controller.js    # uploadSong / getSong
│       ├── middlewares/
│       │   ├── auth.middleware.js    # JWT verification + Redis blacklist check
│       │   └── upload.middleware.js  # Multer in-memory storage config
│       ├── models/
│       │   ├── user.model.js
│       │   ├── song.model.js
│       │   └── blacklist.model.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── song.routes.js
│       └── services/
│           └── storage.service.js    # ImageKit upload abstraction
│
└── Frontend/
    ├── index.html / vite.config.js
    └── src/
        ├── App.jsx                   # Provider composition + router mount
        ├── main.jsx                  # React root
        ├── app.routes.jsx            # Route table (createBrowserRouter)
        └── features/
            ├── auth/
            │   ├── pages/             # Login.jsx, Register.jsx
            │   ├── components/        # FormGroup.jsx, Protected.jsx
            │   ├── hooks/useAuth.js
            │   ├── services/auth.api.js
            │   ├── auth.context.jsx
            │   └── styles/
            ├── Home/
            │   ├── pages/Home.jsx
            │   ├── components/Player.jsx (+ .scss)
            │   ├── hooks/useSong.js
            │   ├── service/song.api.js
            │   └── song.context.jsx
            ├── Expression/
            │   ├── components/FaceExpression.jsx
            │   └── utils/utils.js     # MediaPipe init + blendshape-based classifier
            └── shared/styles/
```

---

## 7. Setup & Installation

**Prerequisites:** Node.js, a running MongoDB instance, a Redis instance (e.g., Redis Cloud), and an ImageKit account/private key.

### Backend

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_USERNAME=your_redis_username
REDIS_PASSWORD=your_redis_password
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

```bash
npm run dev   # starts via nodemon on port 3000
```

### Frontend

```bash
cd Frontend
npm install
npm run dev   # starts Vite dev server on port 5173
```

> The backend's CORS configuration (`src/app.js`) explicitly allows `http://localhost:5173` with `credentials: true` — keep frontend/backend ports aligned with this when running locally.

---

## 8. API Overview

All endpoints are mounted under `/api`. Authenticated endpoints rely on an httpOnly-style `token` cookie set at login/registration.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Creates a user (hashed password), issues a JWT cookie |
| `POST` | `/api/auth/login` | Public | Validates credentials, issues a JWT cookie |
| `GET` | `/api/auth/get-me` | Protected | Returns the authenticated user's profile (session rehydration) |
| `GET` | `/api/auth/logout` | Public | Clears the auth cookie and writes an invalidation entry to Redis (1-hour TTL) |
| `POST` | `/api/song` | Public | Multipart upload (`song` field, MP3, ≤10MB) — extracts ID3 metadata/artwork and persists a `Song` document |
| `GET` | `/api/song?mood=<mood>` | Public | Returns a song matching the requested mood (`happy` \| `sad` \| `surprised`) |

---

## 9. Future Improvements

- **Per-session token revocation** — logout currently writes a single shared Redis key rather than a key scoped to the specific token/session, so blacklist checks could be made per-token (e.g., hashed JWT as the Redis key) for precise, multi-device-safe revocation.
- **Cookie hardening** — explicitly set `httpOnly`, `secure`, and `sameSite` flags on the auth cookie for production deployment.
- **Centralized error handling** — introduce an Express error-handling middleware and async route wrappers; several controllers currently assume happy-path execution without try/catch boundaries.
- **Request validation layer** — add schema validation (e.g., `zod`/`express-validator`) on auth and upload payloads ahead of controller logic.
- **Multi-song mood pools** — `getSong` currently returns a single matching document per mood (`findOne`); expanding to a randomized pool/playlist per mood would improve variety.
- **Environment-driven CORS** — externalize the allowed origin instead of hardcoding `localhost:5173`, to support staging/production origins.
- **Expanded emotion taxonomy** — the blendshape classifier currently activates `happy`/`surprised` with `sad` as a fallback; additional blendshape combinations (brow-down, frown) are present in code but currently commented out and could be enabled for finer-grained mood classification.
- **Automated testing** — no test suite is currently wired up; the backend's `npm test` script is a placeholder.
- **Consolidate blacklist strategy** — a Mongoose `Blacklist` model exists alongside the active Redis-based approach; standardizing on one mechanism would remove dead code paths.

---

## 10. Use Cases

- A personal music player that auto-curates tracks based on the listener's real-time mood, without requiring manual playlist selection.
- A reference implementation for combining on-device computer vision (MediaPipe) with a traditional REST/CDN media stack.
- A foundation for mood-aware content platforms (podcasts, ambient soundscapes, video clips) that need the same capture → classify → recommend pipeline.

# Personal Portfolio Website

A production-ready, full-stack personal portfolio built with Node.js, Express, MongoDB, and vanilla JavaScript — featuring dynamic content loading, glassmorphism UI, dark/light theming, and a working contact form with email notifications.

---

## 📋 Overview

This portfolio is built with an MVC architecture on the backend and zero-framework vanilla JS on the frontend. Skills and projects are fetched dynamically from MongoDB rather than hardcoded, and the contact form is fully validated client-side and server-side, stores submissions in the database, and sends email notifications via Nodemailer.

---

## ✨ Features

- **Dynamic content** — Profile, Skills, and Projects loaded from MongoDB via REST API
- **Animated hero section** with typing effect and smooth scrolling
- **Dark/Light theme toggle** with OS preference detection
- **Glassmorphism UI** with gradient backgrounds and scroll-reveal animations
- **Fully responsive**, mobile-first design with hamburger navigation
- **Contact form** with client-side + server-side validation, MongoDB storage, and email notifications
- **Security hardened** — Helmet, CORS, rate limiting, input sanitization, XSS protection
- **Accessible** — semantic HTML, ARIA labels, reduced-motion support
- **SEO ready** — meta tags, Open Graph tags, custom 404 page
- **Centralized error handling** with consistent JSON API responses

---

## 🛠️ Tech Stack

**Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6)
**Backend:** Node.js, Express.js
**Database:** MongoDB with Mongoose
**Email:** Nodemailer
**Security:** Helmet, CORS, express-validator, express-rate-limit

---

## 📁 Folder Structure
portfolio/
├── client/
│   ├── index.html
│   ├── 404.html
│   ├── css/
│   │   ├── theme.css
│   │   ├── style.css
│   │   └── animations.css
│   ├── js/
│   │   ├── api.js
│   │   ├── typing-effect.js
│   │   ├── theme-toggle.js
│   │   ├── scroll-animations.js
│   │   ├── contact-form.js
│   │   └── main.js
│   └── images/
│       ├── favicon.png
│       ├── profile.jpg
│       └── projects/
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── mailer.js
│   ├── controllers/
│   │   ├── profileController.js
│   │   ├── skillsController.js
│   │   ├── projectsController.js
│   │   └── contactController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── validators.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── Profile.js
│   │   ├── Skill.js
│   │   ├── Project.js
│   │   └── Contact.js
│   ├── routes/
│   │   ├── profileRoutes.js
│   │   ├── skillsRoutes.js
│   │   ├── projectsRoutes.js
│   │   └── contactRoutes.js
│   ├── services/
│   │   └── emailService.js
│   ├── app.js
│   ├── server.js
│   └── seed.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
---

## 🚀 Installation

### Prerequisites
- Node.js v18 or higher
- A MongoDB Atlas account (free tier is fine) or local MongoDB instance
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) generated (for Nodemailer)

### Steps

1. **Clone the repository**
```bash
   git clone https://github.com/your-username/portfolio.git
   cd portfolio
```

2. **Install dependencies**
```bash
   npm install
```

3. **Configure environment variables**
```bash
   cp .env.example .env
```
   Then fill in your real values in `.env` (see [Environment Variables](#-environment-variables) below).

4. **Add your images** (currently referenced but not included — see note below)
   - `client/images/profile.jpg`
   - `client/images/favicon.png`
   - `client/images/og-preview.jpg`
   - `client/images/projects/*.jpg`
   - `client/resume.pdf`

   > Until these are added, the site will function normally but show broken image icons where these assets are referenced.

5. **Seed the database** with sample data
```bash
   node server/seed.js
```
   Edit `server/seed.js` first to replace sample data with your real profile, skills, and projects.

6. **Start the backend server**
```bash
   npm run dev
```
   Server runs on `http://localhost:5000` by default.

7. **Open the frontend**
   Open `client/index.html` directly in a browser, or serve it with a simple static server (e.g., VS Code's Live Server extension) for the best experience.

---

## 🔐 Environment Variables

Create a `.env` file in the project root (use `.env.example` as a template):

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Port the backend server runs on (default: `5000`) |
| `CLIENT_URL` | URL of your deployed frontend |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `EMAIL_SERVICE` | Email provider (e.g., `gmail`) |
| `EMAIL_HOST` | SMTP host (e.g., `smtp.gmail.com`) |
| `EMAIL_PORT` | SMTP port (`587` for TLS, `465` for SSL) |
| `EMAIL_USER` | Your email address used to send notifications |
| `EMAIL_PASS` | App password (NOT your regular email password) |
| `EMAIL_RECEIVER` | Email address that receives contact form notifications |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed frontend origins for CORS |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds |
| `RATE_LIMIT_MAX_REQUESTS` | Max contact form submissions per IP per window |

**Never commit your `.env` file.** It's already excluded via `.gitignore`.

---

## 📡 API Documentation

Base URL: `/api`

### `GET /api/profile`
Returns the portfolio owner's profile data.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "name": "Srinivas",
    "role": "Full Stack Developer",
    "bio": "...",
    "email": "...",
    "github": "...",
    "linkedin": "...",
    "resume": "...",
    "profileImage": "...",
    "education": [...],
    "experience": [...]
  }
}
```

### `GET /api/skills`
Returns all skills, sorted by category and display order.

**Response `200`:**
```json
{
  "success": true,
  "count": 8,
  "data": [
    { "name": "Java", "icon": "☕", "level": 80, "category": "Backend" }
  ]
}
```

### `GET /api/projects`
Returns all projects, featured projects first.

**Response `200`:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "title": "...",
      "description": "...",
      "image": "...",
      "technologies": ["React", "Node.js"],
      "githubLink": "...",
      "liveDemo": "...",
      "featured": true
    }
  ]
}
```

### `POST /api/contact`
Submits a contact form message. Rate-limited to 5 requests per 15 minutes per IP by default.

**Request body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Let's work together",
  "message": "Hi, I'd love to discuss a project with you."
}
```

**Response `201` (success):**
```json
{
  "success": true,
  "message": "Your message has been received. Thank you for reaching out!",
  "data": { "id": "...", "name": "...", "subject": "...", "createdAt": "..." }
}
```

**Response `400` (validation error) / `429` (rate limited):**
```json
{
  "success": false,
  "message": "Validation failed: Message must be between 10 and 2000 characters"
}
```

### `GET /api/health`
Simple health check endpoint for deployment monitoring.

---

## 🌐 Deployment Guide

### Backend → Render

1. Push your code to GitHub.
2. Create a new **Web Service** on [Render](https://render.com), connect your repo.
3. Set the build command: `npm install`
4. Set the start command: `npm start`
5. Add all variables from your `.env` file under Render's **Environment** tab.
6. Deploy. Note your Render URL (e.g., `https://your-app.onrender.com`).

### Database → MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) or Render's IP ranges.
3. Under **Database Access**, create a user with read/write permissions.
4. Copy the connection string into your `MONGODB_URI` environment variable (both locally and on Render).

### Frontend → Netlify

1. In `client/js/api.js`, the `BASE_URL` will automatically use your Render backend URL in production (update the fallback if needed).
2. Push your code to GitHub.
3. Create a new site on [Netlify](https://netlify.com), point it to the `client/` folder as the publish directory.
4. Add a `_redirects` file inside `client/` with this content, so Netlify serves your custom 404 page correctly:
/*  /404.html  404
5. Update `ALLOWED_ORIGINS` in your Render environment variables to include your new Netlify URL.
6. Deploy.

---

## 📄 License

MIT — free to use and adapt for your own portfolio.

---

## 👤 Author

**Srinivas** — Full Stack Developer Intern @ Codec Technologies
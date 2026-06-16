# Sports Performance Tracker

A full-stack, role-based sports analytics platform for athletes and coaches. Built with React, Node.js, Express, and MongoDB Atlas — deployed live on Vercel + Render.

**Live Demo:** https://sports-tracker-sigma.vercel.app

---

## What It Does

**Athletes can:**
- Register and log training sessions with workout type, duration, and notes
- Track personal goals with target values, current progress, and deadlines
- View performance analytics and session history on a personal dashboard
- Link to a coach using a unique coach code

**Coaches can:**
- Generate a unique invite code to onboard athletes
- View all linked athletes and drill into individual session histories
- Add feedback comments on specific athlete sessions
- Assign goals to athletes with targets, units, and deadlines

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Axios, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (stateless) + Google OAuth 2.0 (Passport.js) |
| Deployment | Vercel (frontend), Render (backend) |

---

## Architecture

- **Dual authentication:** Stateless JWT via Authorization headers for email/password login; Google OAuth 2.0 via Passport.js for social sign-in
- **Role-based access control:** Separate dashboards and protected routes for `athlete` and `coach` roles enforced via custom Express middleware
- **RESTful API:** Clean separation of auth, athlete, and coach route layers
- **PWA:** Installable on mobile devices with responsive design and hamburger navigation

---

## Local Setup

```bash
# Clone the repo
git clone https://github.com/adityacharchitgarg-bot27/Sports-Tracker.git

# Backend
cd server
npm install
# Create .env with MONGO_URI, JWT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, CLIENT_URL
npm start

# Frontend
cd client
npm install
npm start
```

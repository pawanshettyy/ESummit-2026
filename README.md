# E-Summit 2026 - The Beginning of Legacy

A full-stack event management platform for E-Summit 2026, TCET Mumbai's first-ever Entrepreneurship Summit. Built to handle pass booking, QR-based check-in, event management, and admin operations for a two-day summit uniting visionaries, investors, and students.

## 🎯 Project Overview

E-Summit 2026 is TCET's inaugural Entrepreneurship Summit, organized by Axios EDIC. Inspired by IIT Bombay's E-Summit, it aims to foster innovation, connect academia with industry, and create funding opportunities for startups.

**Event Details:**
- **Dates:** January 23-24, 2026
- **Venue:** Thakur College of Engineering and Technology, Mumbai
- **Expected Attendance:** 5,000+ participants

## ✨ Key Features

- **Pass Booking System:** Multiple pass types with secure payment integration
- **QR Code Check-in:** Encrypted QR codes for event entry with real-time validation
- **Admin Dashboard:** Real-time analytics, participant management, and QR scanning
- **Event Management:** Browse events, register, and view schedules
- **User Dashboard:** Personal pass access, PDF downloads, and event registrations

## 🛠 Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI, Framer Motion  
**Backend:** Node.js, Express, TypeScript, PostgreSQL, Prisma ORM  
**Authentication:** Clerk  
**Payments:** KonfHub  
**Deployment:** Vercel (Frontend), DigitalOcean/AWS (Backend)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/esummit-2026.git
   cd esummit-2026
   ```

2. **Frontend Setup:**
   ```bash
   npm install
   npm run dev
   ```
   Access at: `http://localhost:5173`

3. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run prisma:generate
   npm run prisma:migrate
   npm run dev
   ```
   API at: `http://localhost:5000`

## 📁 Project Structure

```
ESummit-2026/
├── src/                 # Frontend (React + Vite)
│   ├── components/      # UI Components
│   ├── pages/          # Page Components
│   └── utils/          # Utilities
├── backend/            # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── middleware/
│   └── prisma/         # Database Schema
├── docs/               # Documentation
└── public/             # Static Assets
```

## 📚 Documentation

- [Backend API](./backend/README.md)
- [Architecture](./docs/BACKEND_ARCHITECTURE.md)
- [Implementation Guide](./docs/IMPLEMENTATION_GUIDE.md)
- [Setup Instructions](./docs/BACKEND_SETUP.md)

## 🤝 Contributing

This project is developed by the Axios EDIC team at TCET. For contributions or issues, please contact the development team.

## 📄 License

Proprietary software. All rights reserved.

---

**Last Updated:** January 2026

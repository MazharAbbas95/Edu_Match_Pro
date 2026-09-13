# EduMatch Pro

AI-powered career guidance and test preparation platform for students.

## Features

- **Career Assessment Engine**: Deterministic behavioral mapping with Gemini AI insights.
- **Adaptive Test Preparation**: ECAT-style adaptive MCQ system that scales difficulty based on performance.
- **AI Interview Simulator**: Interactive chat interface for University, Job, and ISSB preparation with instant AI evaluation.
- **Unified Authentication**: Secure JWT-based auth with a modern "Frosted Glass" UI.

## Tech Stack

- **Frontend**: React 19, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, MySQL.
- **AI**: Google Gemini API (Gemini 3 Flash).

## Environment Variables

Required variables in `.env`:
```env
DATABASE_URL=mysql://user:password@localhost:3306/edu_match_pro
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

## Getting Started

1. Install dependencies: `npm install`
2. Create the database schema: `mysql -u root -p < schema.sql`
3. Set up environment variables.
4. Start development server: `npm run dev`
5. Build for production: `npm run build`

## Vercel deployment

Configure these variables in Vercel Project Settings -> Environment Variables. Vercel cannot connect to a MySQL server running on your local computer, so `DATABASE_URL` must point to a hosted MySQL database.

```env
DATABASE_URL=mysql://user:password@host:3306/edu_match_pro
JWT_SECRET=use-a-long-random-secret
JWT_EXPIRES_IN=90d
APP_URL=https://edu-match-pro.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.gmail.address@gmail.com
EMAIL_PASS=your-16-character-gmail-app-password
```

After saving the variables, redeploy the latest commit. Verify the deployment at `/api/health`; it should return `database_connected: true`.

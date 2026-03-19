# ShareChat Backend API

Social networking app with AI-powered intellectual discussions.

## Features
- User registration & login
- PostgreSQL database with Prisma ORM
- Express.js REST API

## Setup
1. `npm install`
2. Set up PostgreSQL database
3. Configure `.env` file
4. `npx prisma migrate dev`
5. `npm run dev`

## API Endpoints
- POST `/api/auth/register` - Create new account
- POST `/api/auth/login` - User login
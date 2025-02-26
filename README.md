# Contest Judging Platform

## Overview

This web application is a comprehensive contest judging system designed to streamline the process of managing art or design contests across different age categories. Built with modern web technologies, the platform provides robust functionality for administrators and judges.

## 🌟 Key Features

### Admin Capabilities

- Invite and manage judges
- Create and manage contests
- Add contest entries
- Track judging progress
- Categorize entries by age groups

### Judge Interface

- View and score contest entries
- Navigate through entries efficiently
- Rate entries based on multiple criteria
- Track personal judging progress

## 🛠 Tech Stack

### Frontend

- Next.js 13
- React
- TypeScript
- Tailwind CSS
- Shadcn/UI Components

### Backend

- Supabase (Authentication & Database)
- PostgreSQL
- Row Level Security (RLS)

### Authentication

- Supabase Auth
- Magic Link Authentication
- Role-based Access Control

## 📦 Database Schema

### Key Tables

- **Contests**: Stores contest information
- **Entries**: Tracks individual contest submissions
- **Judges**: Manages judge accounts and statuses
- **Scores**: Records judge evaluations

## 🔐 Security Features

- Role-based authentication
- Row Level Security in Supabase
- Secure judge invitations
- Protected admin routes

## 🚀 Key Technical Achievements

- Implemented dynamic progress tracking for judges
- Created type-safe React components
- Developed responsive admin and judge interfaces
- Utilized Supabase's advanced authentication features
- Implemented efficient data fetching and state management

## 🖼️ Screenshots

![Judge Dashboard](/screenshots/judge-dashboard.png)

## 🔍 Getting Started

### Prerequisites

- Node.js (v18+)
- Supabase Account
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/contest-judging-platform.git
```

2. Install dependencies

```bash
npm install
```

3. Set up Supabase environment variables
4. Run the development server

```bash
npm run dev
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

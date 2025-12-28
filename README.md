# Reel Creator

A Next.js application for creating interactive videos for YouTube Shorts. Users can upload videos, provide prompts, and generate content with AI assistance.

## Features

- 🔐 **Google OAuth Authentication** - Secure login with Google accounts
- 👤 **User Profile Management** - Complete your profile after signup
- 📹 **Video Creation** - Create videos with AI-powered prompts
- 📤 **File Upload** - Upload your own video files
- 📊 **Dashboard** - Manage all your created videos
- 💾 **Download Videos** - Download generated videos for posting
- 🔒 **Protected Routes** - Secure pages with authentication middleware

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with Google Provider
- **Styling**: Tailwind CSS
- **File Upload**: Native Node.js filesystem API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Google Cloud Console account (for OAuth credentials)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Saxenaa218/reel-creator.git
cd reel-creator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy the Client ID and Client Secret to your `.env` file

### Database Setup

Run Prisma migrations to set up the database:
```bash
npx prisma migrate dev
```

Generate Prisma Client:
```bash
npx prisma generate
```

### Running the Application

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Application Structure

```
reel-creator/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/           # Login page
│   │   └── signup/          # Profile completion page
│   ├── (protected)/         # Protected pages
│   │   ├── dashboard/       # User dashboard
│   │   └── create-video/    # Video creation page
│   ├── api/                 # API routes
│   │   ├── auth/            # NextAuth endpoints
│   │   ├── user/            # User management
│   │   └── videos/          # Video CRUD operations
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/              # Reusable components
├── lib/                     # Utility functions
│   ├── auth.ts             # NextAuth configuration
│   └── prisma.ts           # Prisma client
├── prisma/                 # Database schema and migrations
├── public/                 # Static files
└── types/                  # TypeScript type definitions
```

## Usage

### 1. Sign Up / Login
- Visit the homepage
- Click "Get Started" or "Login"
- Sign in with your Google account
- Complete your profile with username, bio, and phone number

### 2. Create a Video
- Go to the Dashboard
- Click "Create New Video"
- Enter a title and prompt describing your video
- Optionally upload video files
- Click "Create Video"

### 3. Manage Videos
- View all your videos on the Dashboard
- Check video status (pending, processing, completed, failed)
- Download completed videos
- Delete unwanted videos

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Sign in with Google
- `POST /api/auth/signout` - Sign out

### User Management
- `POST /api/user/complete-profile` - Complete user profile

### Video Management
- `GET /api/videos` - Get all user videos
- `POST /api/videos` - Create new video
- `GET /api/videos/[id]` - Get specific video
- `PATCH /api/videos/[id]` - Update video
- `DELETE /api/videos/[id]` - Delete video
- `POST /api/videos/upload` - Upload video file

## Database Schema

### User
- Profile information (name, email, image)
- Additional fields (username, bio, phone number)
- Profile completion status

### Video
- Title and prompt
- Status tracking
- Video URL and thumbnail
- Duration and file size
- Timestamps

### Account & Session
- NextAuth.js models for authentication

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite database file path | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Yes |

## Security Features

- Protected routes with middleware
- Session-based authentication
- Database user validation
- File upload security
- Environment variable protection

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support, please open an issue in the GitHub repository.

## Roadmap

- [ ] AI-powered video generation
- [ ] Video editing features
- [ ] Template library
- [ ] Social media integration
- [ ] Analytics dashboard
- [ ] Team collaboration features
- [ ] Video hosting integration

---

Built with ❤️ using Next.js

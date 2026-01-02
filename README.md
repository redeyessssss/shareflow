# ShareFlow

A secure file sharing app built with React, Vite, and Supabase. Share files instantly with auto-expiring links, password protection, and download limits.

## Features

- **Drag & Drop Upload** - Easy file selection with drag and drop support
- **Auto-Expiry** - Files automatically delete after set time (10min to 7 days)
- **Password Protection** - Optional password for sensitive files
- **Download Limits** - Control how many times files can be downloaded
- **Share Codes** - Simple 6-character codes for easy sharing
- **Messages** - Include context with your shared files

## Tech Stack

- React 19
- Vite (Rolldown)
- Supabase (Storage + Database)
- Tailwind CSS
- Lucide React Icons

## Project Structure

```
src/
├── components/
│   ├── features/      # SendFiles, ReceiveFiles
│   ├── layout/        # Header, ModeToggle, FeatureCards
│   └── ui/            # DropZone, FileItem, Notification, ProgressBar
├── config/            # Supabase client configuration
├── hooks/             # Custom React hooks
├── services/          # API/Supabase service functions
├── utils/             # Helper functions and constants
├── App.jsx
├── main.jsx
└── index.css
```

## Setup

1. Clone the repo
```bash
git clone https://github.com/redeyessssss/shareflow.git
cd shareflow
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file with your Supabase credentials
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase:
   - Create a `shareflow` storage bucket (public)
   - Create a `shares` table with columns:
     - `id` (uuid, primary key)
     - `code` (text, unique)
     - `files` (jsonb)
     - `expiry` (text)
     - `expires_at` (timestamptz)
     - `password` (text, nullable)
     - `max_downloads` (text)
     - `message` (text, nullable)
     - `downloads` (integer)
     - `created_at` (timestamptz)

5. Run development server
```bash
npm run dev
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT

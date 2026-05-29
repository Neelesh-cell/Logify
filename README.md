# Logify ✨

An AI-powered Changelog Generator built with Next.js, Supabase, and Google Gemini. Logify automatically analyzes your GitHub repository's commit history and synthesizes beautifully structured, categorised release notes with zero manual effort.

## 🚀 Features

- **Automated AI Curation**: Uses Gemini 2.5 Flash with structured JSON outputs to perfectly categorize commits into Features, Fixes, and Improvements.
- **Deep GitHub Integration**: Authenticate with GitHub and dynamically fetch commit history for any of your repositories within specific date ranges.
- **Premium UI Aesthetics**: Built with Tailwind CSS, Shadcn UI, and Lucide Icons, featuring glassmorphism elements, dynamic gradients, and smooth entrance animations.
- **Serverless Database Engine**: Instantly persists generated changelogs to Supabase via securely orchestrated Next.js API endpoints.
- **Viral Public Pages**: Every generated changelog yields a shareable, SEO-optimized public URL ready to be sent to your users.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Authentication**: [NextAuth.js (v4)](https://next-auth.js.org/)
- **Database**: [Supabase](https://supabase.com/)
- **AI Model**: [Google Gen AI SDK (Gemini 2.5 Flash)](https://aistudio.google.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)

## 💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Logify.git
cd Logify
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```
You will need to provide:
- **GitHub OAuth App Credentials**
- **Supabase URL and API Keys**
- **Google Gemini API Key**
- **NextAuth Secret** (Generate via `openssl rand -base64 32`)

### 4. Setup the Database

Execute the provided SQL schema in your Supabase SQL Editor:
The schema is located at `supabase/migrations/0000_changelogs.sql`.

### 5. Run the Application

```bash
npm run dev
```

Navigate to `http://localhost:3000` to see the application running.

## 📦 Deployment

Logify is heavily optimized for edge and serverless environments. Deploy easily on [Vercel](https://vercel.com/):

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add all the environment variables from `.env.local` to your Vercel project settings.
4. Ensure `NEXTAUTH_URL` is updated to your production domain name (e.g., `https://logify.yourdomain.com`).
5. Deploy!

## 📜 License

MIT License. Do whatever you want with this beautifully crafted project!

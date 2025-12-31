# OpenScope

OpenScope is a developer-focused tool that helps you **discover, understand, and track open‑source issues** with clarity and confidence.

Reading through long GitHub issues, discussions, and repositories can be overwhelming—especially when you’re just getting started. OpenScope cuts through that noise by analyzing repositories and issues and presenting only what actually matters, so you can decide *where to contribute* and *how to begin*.

This project is built primarily for:
- Developers preparing for programs like **GSoC**
- First‑time and regular open‑source contributors
- Anyone looking to evaluate issues before investing time

---

## Live Demo

- **Production**: https://openscope.anuragx.dev  
- **Demo mode**: Available inside the app (no GitHub login required)

---

## What OpenScope Does

### Repository & Issue Browsing
- Fetch repositories and issues directly from GitHub
- Clean, distraction‑free interface focused on readability

### AI‑Generated Insights
For every issue, OpenScope generates:
- A clear **summary** of the problem
- **Difficulty level** (easy / medium / hard)
- **Required skills** and knowledge areas
- A practical **suggested approach**
- **Estimated time** to work on the issue
- A **match score** based on your profile

The goal is not to replace your judgment—but to help you make better decisions faster.

### Issue Tracking
- Save issues you’re interested in
- View all tracked issues in one place
- Avoid duplicate tracking automatically

### GitHub Authentication
- Secure login using GitHub OAuth
- Automatically syncs your GitHub profile

### Usage Limits & Plans
- Free, Pro, and Premium plans
- AI usage limits enforced on the backend
- Clear UI feedback when limits are reached

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Radix UI

### Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Neon)

### Authentication
- NextAuth.js
- GitHub OAuth

### AI
- OpenRouter API
- OpenAI‑compatible models

### DevOps & Infrastructure
- Docker
- GitHub Actions (CI/CD)
- DigitalOcean (production hosting)

---

## Architecture Overview

```
Local Machine
└─ git push

GitHub Actions (CI)
├─ install dependencies
├─ build Next.js app
├─ build Docker image
├─ export image
└─ copy image to server

Production Server (DigitalOcean)
├─ load Docker image
└─ run container
```

Builds happen entirely in CI.  
The server only runs containers—no builds, no installs.

This approach:
- Reduces RAM usage on the server
- Avoids broken SSH sessions during builds
- Makes deployments predictable and repeatable

---

## Local Development

### 1. Clone the repository
```bash
git clone https://github.com/0xarg/openscope.git
cd openscope
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret

GITHUB_ID=your_github_oauth_id
GITHUB_SECRET=your_github_oauth_secret

OPENROUTER_API_KEY=your_openrouter_api_key
```

### 4. Run the app
```bash
pnpm dev
```

The app will be available at:
```
http://localhost:3000
```

---

## Production Deployment

OpenScope is deployed using **GitHub Actions + Docker**.

Core principles:
- No builds on the production server
- CI is responsible for building images
- The server only runs containers

Deployment is triggered automatically on:
```bash
git push origin main
```

---

## Security Notes

- All secrets are stored in GitHub Actions Secrets
- Production environment variables exist only on the server
- No credentials are committed to the repository

---

## Demo Video

A short walkthrough demo covers:
- Authentication flow
- Repository and issue browsing
- AI‑generated insights
- Issue tracking workflow

(The video is linked from the website / portfolio.)

---

## Roadmap

Planned improvements:
- Team and organization support
- Smarter issue recommendations
- Token‑based AI usage limits
- Export insights as Markdown
- Public API access

---

## Contributing

Contributions are welcome.

1. Fork the repository  
2. Create a feature branch  
3. Open a pull request  

---

## License

MIT License

---

## Author

Built by **Anurag**  
Focused on open‑source, Web3, and developer tooling.

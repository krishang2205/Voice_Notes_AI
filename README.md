# Voice Notes AI

A modern, cross-platform desktop application for recording, transcribing, and summarizing voice notes using AI.

![Voice Notes AI Logo](frontend/src/assets/logo.svg)

## Features

- **High-Quality Recording:** Capture crystal clear audio with visual feedback.
- **Local Transcription:** (Mocked/Future) Fast, private transcription running locally.
- **AI-Powered Summaries:** Extract key points, action items, and summaries instantly.
- **Cross-Platform:** Runs on Windows, macOS, and Linux.
- **Dark Mode:** Sleek, professional interface with system theme support.
- **Data Persistence:** Your notes are stored securely on your local machine.

## Architecture

The project is built as a monorepo with the following structure:

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Multer (Handles storage & AI orchestration)
- **Electron:** Wraps the frontend and manages the backend process lifecycle.

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository.
2. Install dependencies for all packages:
   ```bash
   npm run install:all
   ```

### Running Locally

To start the development environment with hot-reloading:

```bash
npm run dev
```

This commands concurrently starts:
- Backend Server (Port 3000)
- Frontend Vite Server (Port 5173)
- Electron Window (Waits for Frontend)

## Building for Production

To create a distributable installer (exe/dmg/AppImage):

1. **Build all packages:**
   ```bash
   npm run build:all
   ```
   This compiles TypeScript, builds the Vite app, and synchronizes assets.

2. **Package the application:**
   ```bash
   cd electron
   npm run dist
   ```
   The output files will be in `electron/dist`.

## Configuration

- **Environment Variables:**
  - Create a `.env` file in `backend/` based on `.env.example`.
  - Keys: `OPENAI_API_KEY` (Required for AI features).

## License

MIT License. Copyright © 2025 Voice Notes AI Team.

# Influence OS

Influence OS is an AI-powered content generation and scheduling platform designed to help users manage and optimize their social media presence, particularly on LinkedIn. It leverages large language models (LLMs) to generate engaging posts based on user-defined industries and provides tools for scheduling, tracking analytics, and managing user profiles.

## Features

*   **AI-Powered Content Generation:** Generate LinkedIn posts tailored to specific industries using advanced LLMs.
*   **LinkedIn OAuth Integration:** Securely authenticate users via LinkedIn for profile access and content posting.
*   **Content Scheduling:** Schedule generated posts for future publication.
*   **Mock Analytics:** Simulate post performance (likes, comments, shares) for scheduled content.
*   **User Profile Management:** Store and retrieve user profiles linked to their LinkedIn accounts.
*   **Modular Architecture:** Backend built with FastAPI and SQLModel, frontend with Next.js.

## Technologies Used

**Backend (Python)**
*   **FastAPI:** A modern, fast (high-performance) web framework for building APIs with Python 3.7+.
*   **SQLModel:** A library for interacting with SQL databases from Python code, with Python objects. It's designed to be easy to use and robust, and it's based on Python type hints.
*   **Uvicorn:** An ASGI server for Python web applications.
*   **Gunicorn:** A Python WSGI HTTP Server for UNIX.
*   **python-dotenv:** Reads key-value pairs from a `.env` file and sets them as environment variables.
*   **httpx:** A fully featured HTTP client for Python 3, which provides sync and async APIs.
*   **psycopg2-binary:** PostgreSQL adapter for Python.
*   **OpenAI/Perplexity API:** For LLM-based content generation.
*   **Tavily API:** For search capabilities (if integrated).

**Frontend (Next.js/React)**
*   **Next.js:** A React framework for building full-stack web applications.
*   **React:** A JavaScript library for building user interfaces.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
*   **date-fns:** A modern JavaScript date utility library.
*   **react-big-calendar:** A GCal-like calendar component.
*   **recharts:** A composable charting library built on React components.

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── adapters/             # Integrations with external services (LinkedIn, LLM, Search)
│   │   ├── api/                  # FastAPI application endpoints (main.py)
│   │   ├── core/                 # Core business logic and agent orchestration
│   │   ├── db/                   # Database models (SQLModel) and connection
│   │   └── domain/               # Domain entities and business rules
│   ├── requirements.txt          # Python dependencies
│   └── runtime.txt               # Specifies Python version for deployment
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── app/                  # Next.js app router pages and layout
│   │   ├── components/           # Reusable React components
│   │   └── styles/               # Global CSS
│   ├── package.json              # Node.js dependencies and scripts
│   ├── next.config.ts            # Next.js configuration
│   └── tsconfig.json             # TypeScript configuration
├── .env                          # Environment variables (local development)
├── .gitignore                    # Git ignore rules
└── vercel.json                   # Vercel deployment configuration (if applicable)
```

## Local Development Setup

### Prerequisites

*   Python 3.11.9
*   Node.js 20.x
*   npm or yarn
*   PostgreSQL (optional, for local database)

### 1. Clone the repository

```bash
git clone https://github.com/96satyam/influence-project.git
cd influence-project
```

### 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

Create a `.env` file in the `influence-project` root directory (one level up from `backend`) with the following variables:

```env
DATABASE_URL="postgresql://user:password@host:port/database_name" # e.g., postgresql://postgres:postgres@localhost:5432/influence_db
LINKEDIN_CLIENT_ID="your_linkedin_client_id"
LINKEDIN_CLIENT_SECRET="your_linkedin_client_secret"
OPENAI_API_KEY="your_openai_api_key" # Or your Perplexity API key if using PerplexityAdapter
TAVILY_API_KEY="your_tavily_api_key" # Only if you are using Tavily search
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001" # Add your frontend URL here
LINKEDIN_REDIRECT_URI="http://localhost:8000/api/v1/auth/linkedin/callback"
FRONTEND_DASHBOARD_URL="http://localhost:3000/dashboard"
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Run the FastAPI application:

```bash
uvicorn app.api.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend API will be available at `http://localhost:8000`.

### 3. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd frontend
```

Install Node.js dependencies:

```bash
npm install
# or
yarn install
```

Run the Next.js development server:

```bash
npm run dev
# or
yarn dev
```

The frontend application will be available at `http://localhost:3000`.

## Deployment on Render

This project is designed for deployment on Render, with separate services for the backend (Python Web Service) and frontend (Next.js SSR Web Service).

### Backend Deployment (Python Web Service)

1.  **Connect Repository:**
    *   Go to the [Render Dashboard](https://dashboard.render.com/).
    *   Click "New" -> "Web Service".
    *   Connect your GitHub repository (`https://github.com/96satyam/influence-project.git`) and select the `main` branch (or your deployment branch).
    *   Set the **Root Directory** to `backend/`.
2.  **Environment:** Choose `Python`.
3.  **Build Command:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Start Command:**
    ```bash
    gunicorn -k uvicorn.workers.UvicornWorker backend.app.api.main:app --bind 0.0.0.0:$PORT
    ```
5.  **Environment Variables:** Add the following variables (get values from your `.env` file):
    *   `DATABASE_URL`: (Optional) If using Render PostgreSQL, copy the internal database URL here.
    *   `LINKEDIN_CLIENT_ID`
    *   `LINKEDIN_CLIENT_SECRET`
    *   `OPENAI_API_KEY`
    *   `TAVILY_API_KEY`
    *   `ALLOWED_ORIGINS`: `http://localhost:3000,http://localhost:3001,https://<your-frontend-service-name>.onrender.com` (update with your actual frontend URL after deployment).
    *   `LINKEDIN_REDIRECT_URI`: `https://<your-backend-service-name>.onrender.com/api/v1/auth/linkedin/callback` (update with your actual backend URL).
    *   `FRONTEND_DASHBOARD_URL`: `https://<your-frontend-service-name>.onrender.com/dashboard` (update with your actual frontend URL).
6.  **Health Check Path:** `/health`
7.  **Deploy:** Click "Create Web Service".

### Frontend Deployment (Next.js SSR Web Service)

1.  **Connect Repository:**
    *   Go to the [Render Dashboard](https://dashboard.render.com/).
    *   Click "New" -> "Web Service".
    *   Connect your GitHub repository (`https://github.com/96satyam/influence-project.git`) and select the `main` branch.
    *   Set the **Root Directory** to `frontend/`.
2.  **Environment:** Choose `Node`.
3.  **Build Command:**
    ```bash
    npm ci && npm run build
    ```
4.  **Start Command:**
    ```bash
    npm run start
    ```
    (Ensure your Next.js server listens on `process.env.PORT` which is handled by `next start` by default).
5.  **Environment Variables:**
    *   `NEXT_PUBLIC_API_URL`: `https://<your-backend-service-name>.onrender.com/api/v1` (update with your actual backend URL).
    *   `NEXT_PUBLIC_LINKEDIN_REDIRECT_URI`: `https://<your-backend-service-name>.onrender.com/api/v1/auth/linkedin/callback` (This should point to your backend's callback URL).
6.  **Deploy:** Click "Create Web Service".

### Database (Optional - PostgreSQL)

If your application requires a database:

1.  **Create PostgreSQL:**
    *   Go to the [Render Dashboard](https://dashboard.render.com/).
    *   Click "New" -> "PostgreSQL".
    *   Configure your database and create it.
2.  **Connect to Backend:**
    *   Once the database is created, copy its **Internal Database URL** (for services within Render) or **External Database URL** (for local development or external access).
    *   Add this URL to your backend service's environment variables as `DATABASE_URL`.
3.  **Run Migrations:**
    You might need to run database migrations (e.g., Alembic) as a one-off job or a "Deploy Hook" command on Render. For example, if you have a migration script:
    ```bash
    python -m alembic upgrade head
    ```

### Post-Deployment Steps

1.  **Update Environment Variables:**
    *   Once both frontend and backend services are deployed and have their public URLs, go back to their respective Render dashboards.
    *   Update the `ALLOWED_ORIGINS` in your backend service to include your frontend's Render URL (e.g., `https://influence-os-frontend.onrender.com`).
    *   Update `LINKEDIN_REDIRECT_URI` in your backend to its public Render URL.
    *   Update `FRONTEND_DASHBOARD_URL` in your backend to your frontend's public Render URL.
    *   Update `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_LINKEDIN_REDIRECT_URI` in your frontend to point to your backend's public Render URL.
    *   **Important:** After changing environment variables, you might need to manually trigger a redeploy for the changes to take effect, especially for build-time environment variables in Next.js.
2.  **LinkedIn App Settings:**
    *   Go to your LinkedIn Developer Application settings.
    *   Under "Authorized redirect URIs for your app", add the exact URL: `https://<your-backend-service-name>.onrender.com/api/v1/auth/linkedin/callback`.
3.  **Auto-Deploy:** Enable "Auto Deploy" on Git push for both services in their Render dashboards to automate future deployments.

## Common Issues and Troubleshooting

*   **CORS Errors:** Ensure `ALLOWED_ORIGINS` in your backend includes the full `https://` URL of your deployed frontend (no trailing slash).
*   **PORT Issues:** Render services must listen on `$PORT`. FastAPI and Next.js are configured to handle this by default.
*   **Node Version Mismatch:** If you encounter Node.js version issues, ensure `"engines": { "node": "20.x" }` (or your target version) is set in `frontend/package.json`.
*   **Blank Frontend Page:** Double-check the "Publish Directory" if you were deploying a static site (not applicable for Next.js SSR, but good to remember). For Next.js SSR, ensure the `start` command is correct and the server is listening.
*   **Environment Variables Not Applied:** If you change environment variables, sometimes a manual redeploy is needed for the changes to take effect, especially for frontend build-time variables.
*   **Free Tier Sleep:** Render's free tier services may spin down after inactivity, leading to slow initial requests.

---

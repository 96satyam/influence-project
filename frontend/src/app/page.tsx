// frontend/src/app/page.tsx

export default function LoginPage() {
  // The backend URL is the full address of our FastAPI server's login endpoint
  const backendLoginUrl = "http://localhost:8000/api/v1/auth/linkedin/login";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800">Influence OS Agent</h1>
        <p className="mt-2 text-lg text-gray-600">
          Your personal AI for LinkedIn branding.
        </p>
        <div className="mt-8">
          {/* We use a standard <a> tag styled as a button for simple redirection */}
          <a
            href={backendLoginUrl}
            className="inline-block rounded-md bg-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 hover:bg-blue-700"
          >
            Login with LinkedIn
          </a>
        </div>
      </div>
    </main>
  );
}
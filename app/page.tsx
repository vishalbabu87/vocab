export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-4">Welcome to Vocabo</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your vocabulary learning companion
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
          <p className="text-gray-700">
            This application is now equipped with Vercel Speed Insights to track
            and optimize performance metrics.
          </p>
        </div>
      </div>
    </main>
  );
}

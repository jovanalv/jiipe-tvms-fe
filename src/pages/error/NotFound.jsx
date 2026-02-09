export default function NotFound() {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="relative z-10 min-h-screen bg-gray-50">
      <main className="flex flex-col items-center justify-center max-w-screen-xl min-h-screen px-4 py-16 mx-auto lg:px-8">
        <div className="text-center">
          {/* Large 404 Text */}
          <h1 className="mb-8 font-bold text-gray-200 text-9xl">404</h1>

          {/* Alert Icon */}
          <div className="mb-8 animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={48}
              height={48}
              viewBox="0 0 24 24"
              fill="none"
              stroke="red"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto"
            >
              <path d="M12 16h.01" />
              <path d="M12 8v4" />
              <path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z" />
            </svg>
          </div>

          {/* Error Messages */}
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Page Not Found!
          </h2>
          <p className="mb-8 text-gray-500">
            Sorry, the page you are looking for could not be found.
          </p>

          {/* Action Button */}
          <button
            onClick={handleGoHome}
            className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Home
          </button>

          {/* Decorative Elements */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 -z-10">
            <div className="w-64 h-64 rounded-full bg-blue-50 blur-3xl opacity-30"></div>
          </div>
        </div>
      </main>
    </div>
  );
}

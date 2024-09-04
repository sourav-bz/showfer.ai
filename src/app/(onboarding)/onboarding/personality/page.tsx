import Image from "next/image";
import Link from "next/link";

export default function PersonalitySettings() {
  return (
    <div className="flex flex-col h-screen">
      <header className="p-4">
        <Image
          src="/brand-logo/dark.svg"
          alt="Showfer.ai Logo"
          width={120}
          height={40}
        />
      </header>

      <main className="flex-grow flex">
        <div className="w-2/3 p-8">
          <h1 className="text-2xl font-bold mb-6">
            Let&apos;s create your own personality.
          </h1>

          <div className="mb-6">
            <button className="bg-purple-500 text-white px-4 py-2 rounded-full mr-2">
              Personality
            </button>
            <button className="text-gray-500 px-4 py-2 rounded-full mr-2">
              Voice
            </button>
            <button className="text-gray-500 px-4 py-2 rounded-full">
              Appearance
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-2">Choose Character</label>
              <select className="w-64 p-2 border rounded-md">
                <option>Trustworthy</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Response Type</label>
              <select className="w-64 p-2 border rounded-md">
                <option>Voice</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Character visual</p>
                <p className="text-sm text-gray-500">
                  Visual of the character when it speaks
                </p>
              </div>
              <label className="switch">
                <input type="checkbox" checked />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Chat Bot voice caption</p>
                <p className="text-sm text-gray-500">
                  Voice caption when chat bot response to you
                </p>
              </div>
              <label className="switch">
                <input type="checkbox" checked />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">User voice caption</p>
                <p className="text-sm text-gray-500">
                  Voice caption when you speaks to that chat bot
                </p>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="w-1/3 bg-gray-100 p-8">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="bg-purple-500 w-2 h-2 rounded-full mr-2"></span>
                <span className="font-semibold">Showfer.ai</span>
              </div>
              <button className="text-sm bg-gray-200 px-2 py-1 rounded">
                Chat
              </button>
            </div>

            <div className="mb-4">
              <Image
                src="/personality/char-1.png"
                alt="Character"
                width={200}
                height={200}
                className="mx-auto"
              />
            </div>

            <p className="text-center mb-4">Hi, how can I help you?</p>

            <div className="flex justify-center">
              <button className="bg-gray-200 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-4 flex justify-end">
        <Link
          href="/onboarding/training"
          className="bg-purple-500 text-white px-6 py-2 rounded-full"
        >
          Next
        </Link>
      </footer>
    </div>
  );
}

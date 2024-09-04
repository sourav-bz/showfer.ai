"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BotTraining() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <Image
          src="/brand-logo/dark.svg"
          alt="Brand Logo"
          width={150}
          height={40}
        />
      </div>
      <h1 className="text-2xl font-bold mb-4">Train your website here.</h1>
      <p className="mb-6">
        Give your own personality to your website by training them here or you
        can connect to the Shopify as well.
      </p>

      <div className="flex">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add new link</h2>
          <input
            type="text"
            placeholder="Website URL"
            className="w-full p-2 border rounded mb-4"
          />
          <button className="bg-purple-600 text-white px-4 py-2 rounded">
            Fetch Links
          </button>

          <div className="mt-6">
            <p className="text-center text-gray-500">or connect with</p>
            <button className="mt-2 flex items-center justify-center w-full border border-gray-300 p-2 rounded">
              <Image
                src="/shopify-logo.svg"
                alt="Shopify"
                width={20}
                height={20}
                className="mr-2"
              />
              Shopify
            </button>
          </div>
        </div>

        <div className="ml-auto">
          <div className="mt-4 text-center text-sm text-gray-500">
            You can train up to 10 links for free.
          </div>
          <h2 className="text-xl font-semibold mb-4">Links found (246)</h2>
          <ul className="space-y-2">
            {[...Array(10)].map((_, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-white p-3 rounded"
              >
                <span>https://www.dummydomain.com/</span>
                <button className="text-red-500">&times;</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          className="bg-purple-600 text-white px-6 py-2 rounded"
          onClick={() => router.push("/onboarding/playground")}
        >
          Train Bot
        </button>
      </div>
    </div>
  );
}

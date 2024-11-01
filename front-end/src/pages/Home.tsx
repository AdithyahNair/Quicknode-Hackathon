// src/pages/Home.tsx
export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-center">
      <div className="max-w-2xl p-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-6">
          Welcome to the NFT DApp
        </h1>
        <p className="text-lg text-gray-400">
          Use the navigation links to mint NFTs, mint with PYUSD, or explore the
          Odos Insights.
        </p>
      </div>
    </div>
  );
}

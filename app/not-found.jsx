import Link from 'next/link'
import { headers } from 'next/headers'

export default async function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <div className="max-w-md">
        <h1 className="text-6xl font-bold text-gray-900 mb-2">**404**</h1>
        <div className="text-3xl text-gray-600 font-mono mb-4">32)(*@#</div>
        <p className="text-xl text-gray-700 mb-8">
          Oops! Looks like this page got scrambled
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="px-5 py-2 bg-blue-600border border-gray-300 border text-white rounded-md hover:bg-blue-700 transition duration-200">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CreateVideoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    prompt: '',
  })
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && !session?.user?.isProfileComplete) {
      router.push('/signup')
    }
  }, [status, session, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setUploading(true)
    setError('')
    const urls: string[] = []

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/videos/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Upload failed')
        }

        urls.push(data.url)
      }

      setUploadedFiles(urls)
      setFiles([])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload files'
      setError(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setCreating(true)

    try {
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create video')
        setCreating(false)
        return
      }

      router.push('/dashboard')
    } catch {
      setError('An error occurred. Please try again.')
      setCreating(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold text-blue-600">Reel Creator</h1>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-gray-700">
                {session?.user?.name || session?.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Video</h1>
          <p className="text-gray-600 mt-1">Upload videos and provide a prompt to generate your content</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Video Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="My awesome video"
              />
            </div>

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Prompt *
              </label>
              <textarea
                id="prompt"
                required
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what you want to create... e.g., 'Create a dynamic intro with upbeat music and text animations'"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Videos (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg
                    className="w-12 h-12 text-gray-400 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                    Click to upload
                  </span>
                  <span className="text-sm text-gray-500 mt-1">or drag and drop</span>
                </label>
              </div>

              {files.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Selected files: {files.length}
                  </p>
                  <ul className="space-y-1">
                    {files.map((file, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload Files'}
                  </button>
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-700 mb-2">
                    ✓ {uploadedFiles.length} file(s) uploaded successfully
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Link
                href="/dashboard"
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating...' : 'Create Video'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

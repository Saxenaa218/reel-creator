import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

// Allowed video file extensions
const ALLOWED_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v']
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 100MB limit' },
        { status: 400 }
      )
    }

    // Validate file extension
    const originalExt = path.extname(file.name).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(originalExt)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only video files are allowed.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate secure filename with validated extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const sanitizedBasename = path.basename(file.name, originalExt).replace(/[^a-zA-Z0-9-_]/g, '_')
    const filename = `${uniqueSuffix}-${sanitizedBasename}${originalExt}`
    const filepath = path.join(uploadDir, filename)

    await writeFile(filepath, buffer)

    const fileUrl = `/uploads/${filename}`
    
    return NextResponse.json({ 
      url: fileUrl,
      filename: file.name,
      size: file.size 
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

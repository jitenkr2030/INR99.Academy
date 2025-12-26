import { NextRequest } from 'next/server'

export interface User {
  id: string
  mobileNumber: string
  email?: string
  name?: string
}

export function getAuthenticatedUser(request: NextRequest): User | null {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    
    // For now, we'll use a simple token-based approach
    // In a real app, you'd want to use proper JWT tokens
    const userStr = Buffer.from(token, 'base64').toString('utf-8')
    const user: User = JSON.parse(userStr)
    
    return user
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export function createAuthToken(user: User): string {
  // Simple base64 encoding for now
  // In a real app, you'd want to use proper JWT tokens
  const userStr = JSON.stringify(user)
  return Buffer.from(userStr).toString('base64')
}
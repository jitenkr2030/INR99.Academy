import { NextRequest } from 'next/server'
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'

// Generate a consistent secret for development (in production, use NEXTAUTH_SECRET env var)
const getAuthSecret = () => {
  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET
  }
  // Fallback secret for demo purposes - in production this should be set as env var
  return 'demo-secret-key-change-in-production-use-environment-variable'
}

// User roles for RBAC
export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPER_ADMIN'

export interface User {
  id: string
  email: string
  name?: string
  role?: UserRole
}

// Rate limiting configuration
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

// Simple rate limiter using sliding window
export function checkRateLimit(identifier: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: maxAttempts - 1, resetAt: now + windowMs }
  }

  if (record.count >= maxAttempts) {
    return { success: false, remaining: 0, resetAt: record.resetAt }
  }

  record.count++
  return { success: true, remaining: maxAttempts - record.count, resetAt: record.resetAt }
}

// Simple password verification (for demo purposes)
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  // For demo purposes, we accept 'demo123' as the password
  return plainPassword === 'demo123'
}

// Audit logging function
interface AuditLogEntry {
  timestamp: string
  userId?: string
  email?: string
  ip?: string
  userAgent?: string
  event: string
  details?: Record<string, unknown>
  success: boolean
  errorMessage?: string
}

export function createAuditLogger() {
  return {
    log: (entry: Omit<AuditLogEntry, 'timestamp'>) => {
      const fullEntry: AuditLogEntry = {
        ...entry,
        timestamp: new Date().toISOString(),
      }
      // In production, this would write to a database or logging service
      console.log('[AUDIT]', JSON.stringify(fullEntry))
    },
  }
}

// Role-based permission checks
export function checkPermission(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole)
}

// Get client IP from request
export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  return '127.0.0.1'
}

// Demo user accounts - no database dependency
const demoUsers: Record<string, { id: string; name: string; role: UserRole; password: string }> = {
  'student1@inr99.com': { id: 'student1', name: 'Demo Student 1', role: 'STUDENT', password: 'demo123' },
  'student2@inr99.com': { id: 'student2', name: 'Demo Student 2', role: 'STUDENT', password: 'demo123' },
  'student3@inr99.com': { id: 'student3', name: 'Demo Student 3', role: 'STUDENT', password: 'demo123' },
  'instructor1@inr99.com': { id: 'instructor1', name: 'Demo Instructor 1', role: 'INSTRUCTOR', password: 'demo123' },
  'instructor2@inr99.com': { id: 'instructor2', name: 'Demo Instructor 2', role: 'INSTRUCTOR', password: 'demo123' },
  'admin1@inr99.com': { id: 'admin1', name: 'Demo Admin 1', role: 'ADMIN', password: 'demo123' },
  'superadmin1@inr99.com': { id: 'superadmin1', name: 'Super Admin', role: 'SUPER_ADMIN', password: 'demo123' },
}

export function getAuthenticatedUser(request: NextRequest): User | null {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const userStr = Buffer.from(token, 'base64').toString('utf-8')
    const user: User = JSON.parse(userStr)
    
    return user
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export function createAuthToken(user: User): string {
  const userStr = JSON.stringify(user)
  return Buffer.from(userStr).toString('base64')
}

export const authOptions: NextAuthOptions = {
  // Session configuration with security settings
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days absolute session timeout
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  
  // JWT configuration
  jwt: {
    secret: getAuthSecret(),
    maxAge: {
      accessToken: 15 * 60, // 15 minutes access token
      refreshToken: 7 * 24 * 60 * 60, // 7 days refresh token
    },
  },
  
  // Custom pages
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  
  // Configure providers with enhanced security
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { 
          label: 'Email', 
          type: 'email', 
          placeholder: 'your@email.com' 
        },
        password: { 
          label: 'Password', 
          type: 'password' 
        },
      },
      async authorize(credentials, request) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter both email and password')
          }

          const auditLogger = createAuditLogger()
          const ip = getClientIP(request)
          
          // Check rate limit
          const rateLimit = checkRateLimit(ip)
          if (!rateLimit.success) {
            auditLogger.log({
              event: 'LOGIN_ATTEMPT',
              email: credentials.email,
              ip,
              success: false,
              errorMessage: 'Rate limit exceeded',
            })
            throw new Error('Too many login attempts. Please try again later.')
          }

          const demoEmail = credentials.email
          const demoPassword = credentials.password

          const demoUser = demoUsers[demoEmail]
          if (!demoUser) {
            auditLogger.log({
              event: 'LOGIN_ATTEMPT',
              email: demoEmail,
              ip,
              success: false,
              errorMessage: 'User not found',
            })
            // Generic error message to prevent user enumeration
            throw new Error('Invalid email or password')
          }

          const isValid = await verifyPassword(demoPassword, demoUser.password)
          if (!isValid) {
            auditLogger.log({
              event: 'LOGIN_ATTEMPT',
              userId: demoUser.id,
              email: demoUser.email,
              ip,
              success: false,
              errorMessage: 'Invalid password',
            })
            throw new Error('Invalid email or password')
          }

          // Successful login
          auditLogger.log({
            event: 'LOGIN_SUCCESS',
            userId: demoUser.id,
            email: demoUser.email,
            ip,
            success: true,
          })

          return {
            id: demoUser.id,
            name: demoUser.name,
            email: demoEmail,
            role: demoUser.role,
          }

        } catch (error: any) {
          console.error('Auth error:', error)
          throw error
        }
      }
    })
  ],
  
  // Callbacks for customizing token and session
  callbacks: {
    // JWT callback - runs on every token refresh
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        // Initial login - add user info to token
        token.id = user.id
        token.role = (user as any).role
      }

      // Handle session update
      if (trigger === 'update' && session) {
        token.name = session.name
      }

      return token
    },
    
    // Session callback - runs on every session check
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role as UserRole
      }
      return session
    },
    
    // Redirect callback
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    
    // Sign in callback
    async signIn({ user, account }) {
      return true
    },
  },
  
  // Events for logging and cleanup
  events: {
    async signIn({ user, account, isNewUser }) {
      const auditLogger = createAuditLogger()
      auditLogger.log({
        event: 'SESSION_CREATED',
        userId: user.id,
        email: user.email || undefined,
        success: true,
        details: {
          isNewUser,
          provider: account?.provider,
        },
      })
    },
    
    async signOut({ token }) {
      const auditLogger = createAuditLogger()
      auditLogger.log({
        event: 'LOGOUT',
        userId: token?.id as string,
        success: true,
      })
    },
  },
  
  // Enable debug in development
  debug: process.env.NODE_ENV === 'development',
  
  // Trust host configuration for production
  trustHost: true,
}

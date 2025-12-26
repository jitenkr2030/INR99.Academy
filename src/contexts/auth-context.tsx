"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'

interface User {
  id: string
  email: string
  name?: string
  role?: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN' | 'SUPER_ADMIN'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  showAuthModal: () => void
  hideAuthModal: () => void
  isAuthModalOpen: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthContent({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Safe session handling with SSR protection
  const sessionResult = useSession()
  const { data: session, status } = sessionResult || {}

  // Handle mounting for client-side only features
  useEffect(() => {
    setMounted(true)
  }, [])

  // Only sync with NextAuth session after mounting
  useEffect(() => {
    if (mounted && session?.user) {
      setUser({
        id: (session.user as any).id || '',
        email: session.user.email || '',
        name: session.user.name || undefined,
        role: (session.user as any).role || 'STUDENT'
      })
    } else if (mounted) {
      setUser(null)
    }
  }, [session, status, mounted])

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
  }

  const showAuthModal = () => setIsAuthModalOpen(true)
  const hideAuthModal = () => setIsAuthModalOpen(false)

  const value: AuthContextType = {
    user: mounted ? user : null,
    isAuthenticated: mounted ? !!user : false,
    login,
    logout,
    showAuthModal,
    hideAuthModal,
    isAuthModalOpen,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthContent>{children}</AuthContent>
    </SessionProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

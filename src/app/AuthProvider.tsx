import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { mockUser, type MockUser } from '@/mock/user'

const AUTH_STORAGE_KEY = 'blixx-player-auth'

type AuthContextValue = {
  isLoggedIn: boolean
  user: MockUser | null
  login: () => void
  logout: () => void
  toggleAuth: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredAuth(): boolean {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(readStoredAuth())
  }, [])

  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, isLoggedIn ? '1' : '0')
  }, [isLoggedIn])

  const login = useCallback(() => setIsLoggedIn(true), [])
  const logout = useCallback(() => setIsLoggedIn(false), [])
  const toggleAuth = useCallback(() => setIsLoggedIn((v) => !v), [])

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoggedIn,
      user: isLoggedIn ? mockUser : null,
      login,
      logout,
      toggleAuth,
    }),
    [isLoggedIn, login, logout, toggleAuth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

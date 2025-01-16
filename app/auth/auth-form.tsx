'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'
import { Button } from "@/app/ui/button"
import { Input } from "@/app/ui/input"
import { Label } from "@/app/ui/label"
import { Alert, AlertDescription } from "@/app/ui/alert"

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleAuth = async (event: React.FormEvent, type: 'LOGIN' | 'SIGNUP') => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      if (type === 'LOGIN') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
      } else {
        // Check if the user already exists
        const { data: existingUser, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single()
  
        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError
        }
  
        if (existingUser) {
          setError('An account with this email already exists. Please log in instead.')
          return
        }
  
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        setShowConfirmationAlert(true)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }
  
    return (
      <form className="mt-6">
        {showConfirmationAlert && (
          <Alert className="mb-4">
            <AlertDescription>
              Check your email for the confirmation link.
            </AlertDescription>
          </Alert>
        )}
        <div className="mt-4">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mt-4">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-4 mt-6">
          <Button
            onClick={(e) => handleAuth(e, 'LOGIN')}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </Button>
          <Button
            onClick={(e) => handleAuth(e, 'SIGNUP')}
            variant="outline"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Sign Up'}
          </Button>
        </div>
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </form>
    )
  }


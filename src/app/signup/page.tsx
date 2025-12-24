'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../login/login.module.css'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) throw error

            // Advance to OTP step
            setStep('OTP')
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: otp,
                type: 'signup'
            })

            if (error) throw error

            router.push('/portfolio')
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`
            }
        })
    }

    if (step === 'OTP') {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Enter Code</h1>
                        <p className={styles.subtitle}>
                            We sent a 6-digit code to <strong>{email}</strong>.
                        </p>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <form onSubmit={handleVerifyOtp} className={styles.form}>
                        <div className={styles.field}>
                            <label htmlFor="otp">Confirmation Code</label>
                            <input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                placeholder="123456"
                                style={{ letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.5rem' }}
                            />
                        </div>

                        <button type="submit" className={styles.button} disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <button onClick={() => setStep('DETAILS')} className="text-sm text-gray-400 hover:text-white underline">
                            Change Email
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Create Account</h1>
                    <p className={styles.subtitle}>Track your portfolio across prediction markets and crypto</p>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSignup} className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Min 6 characters"
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? 'Sending Code...' : 'Sign Up'}
                    </button>

                    <div className={styles.divider}>
                        <span>OR</span>
                    </div>

                    <button
                        type="button"
                        className={`${styles.button} ${styles.googleButton}`}
                        onClick={handleGoogleLogin}
                    >
                        <svg className={styles.googleIcon} width="20" height="20" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign up with Google
                    </button>
                </form>

                <div className={styles.footer}>
                    Already have an account? <Link href="/login">Sign in</Link>
                </div>
            </div>
        </div>
    )
}

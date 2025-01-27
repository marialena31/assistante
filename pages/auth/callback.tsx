import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../utils/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const { code } = router.query

    if (code) {
      supabase.auth.exchangeCodeForSession(code as string).then(({ data, error }) => {
        if (!error) {
          router.push('/admin/reset-password')
        } else {
          console.error('Error exchanging code for session:', error)
          router.push('/admin/login')
        }
      })
    }
  }, [router.query])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
}

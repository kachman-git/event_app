import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { userApi } from '@/lib/api'
import { LoadingSpinner } from '@/components/loading-spinner'

export function withProtectedRoute<T>(WrappedComponent: React.ComponentType<T>) {
  return (props: T) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
      const checkAuth = async () => {
        try {
          await userApi.getMe()
          setIsAuthenticated(true)
        } catch (error) {
          router.push('/signin')
        } finally {
          setIsLoading(false)
        }
      }

      checkAuth()
    }, [router])

    if (isLoading) {
      return <LoadingSpinner />
    }

    if (!isAuthenticated) {
      return null
    }

    return <WrappedComponent {...props} />
  }
}


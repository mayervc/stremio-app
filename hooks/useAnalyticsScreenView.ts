import { logScreenView } from '@/lib/analytics'
import { usePathname } from 'expo-router'
import { useEffect, useRef } from 'react'

/**
 * Hook to automatically track screen views in Google Analytics
 * Usage: Call useAnalyticsScreenView() in any screen component
 */
export function useAnalyticsScreenView(screenName?: string) {
  const pathname = usePathname()
  const previousPathname = useRef<string | null>(null)

  useEffect(() => {
    // Only track if pathname has changed
    if (pathname && pathname !== previousPathname.current) {
      const screen = screenName || pathname.replace(/^\//, '') || 'unknown'
      logScreenView(screen)
      previousPathname.current = pathname
    }
  }, [pathname, screenName])
}

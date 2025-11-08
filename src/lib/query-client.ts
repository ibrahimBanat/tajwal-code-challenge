import { QueryClient } from '@tanstack/react-query'
import { env } from '@/lib/env'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: env.query.staleTime,
      gcTime: env.query.gcTime,
      retry: env.query.retryCount,
      retryDelay: (attemptIndex) => Math.min(env.query.retryDelayBase * 2 ** attemptIndex, env.query.retryDelayMax),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})

export default queryClient
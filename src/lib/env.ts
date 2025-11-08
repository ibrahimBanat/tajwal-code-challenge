const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key]
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new Error(`Environment variable ${key} is not defined`)
  }
  return value
}

const getEnvNumber = (key: string, defaultValue?: number): number => {
  const value = process.env[key]
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new Error(`Environment variable ${key} is not defined`)
  }
  const numValue = parseInt(value, 10)
  if (isNaN(numValue)) {
    throw new Error(`Environment variable ${key} is not a valid number`)
  }
  return numValue
}

export const env = {
  github: {
    apiBaseUrl: getEnvVar('NEXT_PUBLIC_GITHUB_API_BASE_URL', 'https://api.github.com'),
    defaultPerPage: getEnvNumber('NEXT_PUBLIC_DEFAULT_PER_PAGE', 30),
    maxPerPage: getEnvNumber('NEXT_PUBLIC_MAX_PER_PAGE', 100),
    minRequestInterval: getEnvNumber('NEXT_PUBLIC_MIN_REQUEST_INTERVAL', 100),
    apiTimeout: getEnvNumber('NEXT_PUBLIC_API_TIMEOUT', 10000),
    defaultForkCount: getEnvNumber('NEXT_PUBLIC_DEFAULT_FORK_COUNT', 3),
    maxFileTypes: getEnvNumber('NEXT_PUBLIC_MAX_FILE_TYPES', 5),
  },
  app: {
    name: getEnvVar('NEXT_PUBLIC_APP_NAME', 'GitHub Search'),
  },
  search: {
    debounceDelay: getEnvNumber('NEXT_PUBLIC_SEARCH_DEBOUNCE_DELAY', 300),
  },
  query: {
    staleTime: getEnvNumber('NEXT_PUBLIC_QUERY_STALE_TIME', 300000),
    gcTime: getEnvNumber('NEXT_PUBLIC_QUERY_GC_TIME', 600000),
    retryCount: getEnvNumber('NEXT_PUBLIC_QUERY_RETRY_COUNT', 2),
    retryDelayBase: getEnvNumber('NEXT_PUBLIC_QUERY_RETRY_DELAY_BASE', 1000),
    retryDelayMax: getEnvNumber('NEXT_PUBLIC_QUERY_RETRY_DELAY_MAX', 30000),
  },
  repositoryDetails: {
    staleTime: getEnvNumber('NEXT_PUBLIC_REPOSITORY_DETAILS_STALE_TIME', 600000),
    retryCount: getEnvNumber('NEXT_PUBLIC_REPOSITORY_DETAILS_RETRY_COUNT', 1),
  },
}
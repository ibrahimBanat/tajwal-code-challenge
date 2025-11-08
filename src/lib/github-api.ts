import axios, { AxiosResponse } from 'axios'
import { env } from '@/lib/env'
import type {
  GitHubUser,
  GitHubRepository,
  GitHubSearchResponse,
  GitHubRepositoryContent,
  GitHubFork,
  SearchParams,
  GitHubApiError,
} from '@/types/github'

const api = axios.create({
  baseURL: env.github.apiBaseUrl,
  headers: {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': env.app.name.replace(/\s+/g, '-'),
  },
  timeout: env.github.apiTimeout,
})

let lastRequestTime = 0

const rateLimit = async (): Promise<void> => {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  
  if (timeSinceLastRequest < env.github.minRequestInterval) {
    await new Promise(resolve => 
      setTimeout(resolve, env.github.minRequestInterval - timeSinceLastRequest)
    )
  }
  
  lastRequestTime = Date.now()
}

const handleApiError = (error: any): never => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as GitHubApiError
    throw new Error(
      apiError?.message || error.message || 'An error occurred while fetching data'
    )
  }
  throw error
}

export const searchRepositories = async (
  params: SearchParams
): Promise<GitHubSearchResponse<GitHubRepository>> => {
  await rateLimit()
  
  try {
    const response: AxiosResponse<GitHubSearchResponse<GitHubRepository>> = await api.get(
      '/search/repositories',
      {
        params: {
          q: params.query,
          sort: params.sort || 'score',
          order: params.order || 'desc',
          per_page: Math.min(params.per_page || env.github.defaultPerPage, env.github.maxPerPage),
          page: params.page || 1,
        },
      }
    )
    return response.data
  } catch (error) {
    return handleApiError(error)
  }
}

export const searchUsers = async (
  params: SearchParams
): Promise<GitHubSearchResponse<GitHubUser>> => {
  await rateLimit()
  
  try {
    const response: AxiosResponse<GitHubSearchResponse<GitHubUser>> = await api.get(
      '/search/users',
      {
        params: {
          q: params.query,
          sort: params.sort || 'score',
          order: params.order || 'desc',
          per_page: Math.min(params.per_page || env.github.defaultPerPage, env.github.maxPerPage),
          page: params.page || 1,
        },
      }
    )
    return response.data
  } catch (error) {
    return handleApiError(error)
  }
}

export const getRepositoryContents = async (
  owner: string,
  repo: string,
  path: string = ''
): Promise<GitHubRepositoryContent[]> => {
  await rateLimit()
  
  try {
    const response: AxiosResponse<GitHubRepositoryContent[]> = await api.get(
      `/repos/${owner}/${repo}/contents/${path}`
    )
    return Array.isArray(response.data) ? response.data : [response.data]
  } catch (error) {
    return handleApiError(error)
  }
}

export const getRepositoryForks = async (
  owner: string,
  repo: string,
  count: number = env.github.defaultForkCount
): Promise<GitHubFork[]> => {
  await rateLimit()
  
  try {
    const response: AxiosResponse<GitHubFork[]> = await api.get(
      `/repos/${owner}/${repo}/forks`,
      {
        params: {
          sort: 'newest',
          per_page: count,
        },
      }
    )
    return response.data
  } catch (error) {
    return handleApiError(error)
  }
}

export const getRepositoryLanguages = async (
  owner: string,
  repo: string
): Promise<Record<string, number>> => {
  await rateLimit()
  
  try {
    const response: AxiosResponse<Record<string, number>> = await api.get(
      `/repos/${owner}/${repo}/languages`
    )
    return response.data
  } catch (error) {
    return handleApiError(error)
  }
}

export const extractFileTypes = async (
  owner: string,
  repo: string
): Promise<string[]> => {
  try {
    const languages = await getRepositoryLanguages(owner, repo)
    const fileTypes = Object.keys(languages)
    
    if (fileTypes.length > 0) {
      return fileTypes.slice(0, env.github.maxFileTypes)
    }
    
    const contents = await getRepositoryContents(owner, repo)
    const extensions = new Set<string>()
    
    contents
      .filter(item => item.type === 'file' && item.name.includes('.'))
      .forEach(file => {
        const extension = file.name.split('.').pop()
        if (extension && extension.length <= 4) {
          extensions.add(extension.toLowerCase())
        }
      })
    
    return Array.from(extensions).slice(0, env.github.maxFileTypes)
  } catch (error) {
    return []
  }
}

export const githubApi = {
  searchRepositories,
  searchUsers,
  getRepositoryContents,
  getRepositoryForks,
  getRepositoryLanguages,
  extractFileTypes,
}

export default githubApi
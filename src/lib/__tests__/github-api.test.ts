import axios from 'axios'
import {
  searchRepositories,
  searchUsers,
  getRepositoryContents,
  getRepositoryForks,
  getRepositoryLanguages,
  extractFileTypes,
} from '../github-api'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('GitHub API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedAxios.create.mockReturnThis()
    mockedAxios.get = jest.fn()
  })

  describe('searchRepositories', () => {
    it('should search repositories successfully', async () => {
      const mockData = {
        total_count: 1,
        incomplete_results: false,
        items: [
          {
            id: 1,
            name: 'test-repo',
            full_name: 'user/test-repo',
            owner: { login: 'user', avatar_url: '', html_url: '' },
            html_url: '',
            description: 'Test repository',
            stargazers_count: 100,
            language: 'TypeScript',
          },
        ],
      }

      mockedAxios.get.mockResolvedValue({ data: mockData })

      const result = await searchRepositories({ query: 'react' })

      expect(result).toEqual(mockData)
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/search/repositories',
        expect.objectContaining({
          params: expect.objectContaining({
            q: 'react',
          }),
        })
      )
    })

    it('should handle API errors', async () => {
      const errorMessage = 'API rate limit exceeded'
      mockedAxios.get.mockRejectedValue({
        response: {
          data: { message: errorMessage },
        },
        isAxiosError: true,
      })

      mockedAxios.isAxiosError = jest.fn().mockReturnValue(true)

      await expect(searchRepositories({ query: 'test' })).rejects.toThrow(
        errorMessage
      )
    })

    it('should respect per_page parameter', async () => {
      const mockData = {
        total_count: 0,
        incomplete_results: false,
        items: [],
      }

      mockedAxios.get.mockResolvedValue({ data: mockData })

      await searchRepositories({ query: 'test', per_page: 50 })

      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/search/repositories',
        expect.objectContaining({
          params: expect.objectContaining({
            per_page: 50,
          }),
        })
      )
    })

    it('should use default sort and order if not provided', async () => {
      const mockData = {
        total_count: 0,
        incomplete_results: false,
        items: [],
      }

      mockedAxios.get.mockResolvedValue({ data: mockData })

      await searchRepositories({ query: 'test' })

      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/search/repositories',
        expect.objectContaining({
          params: expect.objectContaining({
            sort: 'score',
            order: 'desc',
          }),
        })
      )
    })
  })

  describe('searchUsers', () => {
    it('should search users successfully', async () => {
      const mockData = {
        total_count: 1,
        incomplete_results: false,
        items: [
          {
            id: 1,
            login: 'testuser',
            avatar_url: '',
            html_url: '',
            type: 'User',
          },
        ],
      }

      mockedAxios.get.mockResolvedValue({ data: mockData })

      const result = await searchUsers({ query: 'testuser' })

      expect(result).toEqual(mockData)
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/search/users',
        expect.objectContaining({
          params: expect.objectContaining({
            q: 'testuser',
          }),
        })
      )
    })

    it('should handle errors', async () => {
      mockedAxios.get.mockRejectedValue({
        response: {
          data: { message: 'Not Found' },
        },
        isAxiosError: true,
      })

      mockedAxios.isAxiosError = jest.fn().mockReturnValue(true)

      await expect(searchUsers({ query: 'nonexistent' })).rejects.toThrow()
    })
  })

  describe('getRepositoryContents', () => {
    it('should fetch repository contents', async () => {
      const mockData = [
        { name: 'README.md', type: 'file', path: 'README.md' },
        { name: 'src', type: 'dir', path: 'src' },
      ]

      mockedAxios.get.mockResolvedValue({ data: mockData })

      const result = await getRepositoryContents('owner', 'repo')

      expect(result).toEqual(mockData)
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/repos/owner/repo/contents/'
      )
    })

    it('should handle single file response', async () => {
      const mockData = { name: 'README.md', type: 'file', path: 'README.md' }

      mockedAxios.get.mockResolvedValue({ data: mockData })

      const result = await getRepositoryContents('owner', 'repo', 'README.md')

      expect(result).toEqual([mockData])
    })

    it('should handle errors', async () => {
      mockedAxios.get.mockRejectedValue({
        response: {
          data: { message: 'Not Found' },
        },
        isAxiosError: true,
      })

      mockedAxios.isAxiosError = jest.fn().mockReturnValue(true)

      await expect(
        getRepositoryContents('owner', 'repo')
      ).rejects.toThrow()
    })
  })

  describe('getRepositoryForks', () => {
    it('should fetch repository forks', async () => {
      const mockData = [
        {
          id: 1,
          owner: { login: 'user1', avatar_url: '', html_url: '' },
          html_url: '',
          created_at: '2023-01-01',
        },
        {
          id: 2,
          owner: { login: 'user2', avatar_url: '', html_url: '' },
          html_url: '',
          created_at: '2023-01-02',
        },
      ]

      mockedAxios.get.mockResolvedValue({ data: mockData })

      const result = await getRepositoryForks('owner', 'repo', 3)

      expect(result).toEqual(mockData)
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/repos/owner/repo/forks',
        expect.objectContaining({
          params: {
            sort: 'newest',
            per_page: 3,
          },
        })
      )
    })
  })

  describe('getRepositoryLanguages', () => {
    it('should fetch repository languages', async () => {
      const mockData = {
        TypeScript: 50000,
        JavaScript: 30000,
        CSS: 10000,
      }

      mockedAxios.get.mockResolvedValue({ data: mockData })

      const result = await getRepositoryLanguages('owner', 'repo')

      expect(result).toEqual(mockData)
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/repos/owner/repo/languages'
      )
    })
  })

  describe('extractFileTypes', () => {
    it('should extract file types from languages', async () => {
      const mockLanguages = {
        TypeScript: 50000,
        JavaScript: 30000,
        CSS: 10000,
      }

      mockedAxios.get.mockResolvedValueOnce({ data: mockLanguages })

      const result = await extractFileTypes('owner', 'repo')

      expect(result).toEqual(['TypeScript', 'JavaScript', 'CSS'])
    })

    it('should extract file types from contents if languages is empty', async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: {} }) // languages
        .mockResolvedValueOnce({
          data: [
            { name: 'index.js', type: 'file', path: 'index.js' },
            { name: 'style.css', type: 'file', path: 'style.css' },
            { name: 'README.md', type: 'file', path: 'README.md' },
          ],
        }) // contents

      const result = await extractFileTypes('owner', 'repo')

      expect(result).toContain('js')
      expect(result).toContain('css')
      expect(result).toContain('md')
    })

    it('should return empty array on error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'))

      const result = await extractFileTypes('owner', 'repo')

      expect(result).toEqual([])
    })

    it('should limit file types to maxFileTypes', async () => {
      const mockLanguages = {
        TypeScript: 50000,
        JavaScript: 30000,
        CSS: 10000,
        HTML: 5000,
        Python: 4000,
        Ruby: 3000,
        Go: 2000,
      }

      mockedAxios.get.mockResolvedValueOnce({ data: mockLanguages })

      const result = await extractFileTypes('owner', 'repo')

      expect(result.length).toBeLessThanOrEqual(5) // Assuming maxFileTypes is 5
    })
  })
})

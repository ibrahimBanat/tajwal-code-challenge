import { env } from '../env'

describe('Environment Configuration', () => {
  it('should export github configuration', () => {
    expect(env.github).toBeDefined()
    expect(env.github.apiBaseUrl).toBeDefined()
    expect(env.github.defaultPerPage).toBeGreaterThan(0)
    expect(env.github.maxPerPage).toBeGreaterThan(0)
  })

  it('should export app configuration', () => {
    expect(env.app).toBeDefined()
    expect(env.app.name).toBeDefined()
    expect(typeof env.app.name).toBe('string')
  })

  it('should export search configuration', () => {
    expect(env.search).toBeDefined()
    expect(env.search.debounceDelay).toBeGreaterThanOrEqual(0)
  })

  it('should export query configuration', () => {
    expect(env.query).toBeDefined()
    expect(env.query.staleTime).toBeGreaterThanOrEqual(0)
    expect(env.query.gcTime).toBeGreaterThanOrEqual(0)
    expect(env.query.retryCount).toBeGreaterThanOrEqual(0)
  })

  it('should export repository details configuration', () => {
    expect(env.repositoryDetails).toBeDefined()
    expect(env.repositoryDetails.staleTime).toBeGreaterThanOrEqual(0)
    expect(env.repositoryDetails.retryCount).toBeGreaterThanOrEqual(0)
  })

  it('should have sensible default values', () => {
    expect(env.github.apiTimeout).toBeGreaterThan(0)
    expect(env.github.minRequestInterval).toBeGreaterThanOrEqual(0)
    expect(env.github.defaultForkCount).toBeGreaterThan(0)
    expect(env.github.maxFileTypes).toBeGreaterThan(0)
  })

  it('should use HTTPS for API base URL', () => {
    expect(env.github.apiBaseUrl).toMatch(/^https:\/\//)
  })
})

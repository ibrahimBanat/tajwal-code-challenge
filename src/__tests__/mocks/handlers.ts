import { http, HttpResponse } from 'msw'
import { env } from '@/lib/env'

export const handlers = [
  http.get(`${env.github.apiBaseUrl}/search/repositories`, () => {
    return HttpResponse.json({
      total_count: 2,
      incomplete_results: false,
      items: [
        {
          id: 1,
          name: 'test-repo',
          full_name: 'user/test-repo',
          description: 'A test repository',
          html_url: 'https://github.com/user/test-repo',
          stargazers_count: 100,
          language: 'TypeScript',
          owner: {
            login: 'user',
            avatar_url: 'https://github.com/user.png',
            html_url: 'https://github.com/user',
          },
        },
      ],
    })
  }),

  http.get(`${env.github.apiBaseUrl}/search/users`, () => {
    return HttpResponse.json({
      total_count: 1,
      incomplete_results: false,
      items: [
        {
          login: 'testuser',
          avatar_url: 'https://github.com/testuser.png',
          html_url: 'https://github.com/testuser',
          type: 'User',
        },
      ],
    })
  }),
]
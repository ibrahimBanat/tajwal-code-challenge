import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchInput } from '../SearchInput'

// Mock next/navigation
const mockPush = jest.fn()
const mockSearchParams = new URLSearchParams()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/search/repositories',
}))

describe('SearchInput', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSearchParams.delete('q')
  })

  it('should render search input', () => {
    render(<SearchInput />)

    const searchInput = screen.getByPlaceholderText(/search/i)
    expect(searchInput).toBeInTheDocument()
  })

  it('should display initial query from URL params', () => {
    mockSearchParams.set('q', 'react')

    render(<SearchInput />)

    const searchInput = screen.getByDisplayValue('react')
    expect(searchInput).toBeInTheDocument()
  })

  it('should update input value when typing', async () => {
    const user = userEvent.setup()
    render(<SearchInput />)

    const searchInput = screen.getByPlaceholderText(/search/i)

    await user.type(searchInput, 'typescript')

    expect(searchInput).toHaveValue('typescript')
  })

  it('should navigate to search results on form submit', async () => {
    const user = userEvent.setup()
    render(<SearchInput />)

    const searchInput = screen.getByPlaceholderText(/search/i)
    const form = searchInput.closest('form')

    await user.type(searchInput, 'react')

    if (form) {
      fireEvent.submit(form)
    }

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('q=react')
      )
    })
  })

  it('should not submit empty search', async () => {
    const user = userEvent.setup()
    render(<SearchInput />)

    const searchInput = screen.getByPlaceholderText(/search/i)
    const form = searchInput.closest('form')

    if (form) {
      fireEvent.submit(form)
    }

    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  it('should clear search when clear button is clicked', async () => {
    const user = userEvent.setup()
    mockSearchParams.set('q', 'test query')

    render(<SearchInput />)

    const searchInput = screen.getByDisplayValue('test query')
    expect(searchInput).toHaveValue('test query')

    const clearButton = screen.getByRole('button', { name: /clear/i })
    await user.click(clearButton)

    expect(searchInput).toHaveValue('')
  })
})

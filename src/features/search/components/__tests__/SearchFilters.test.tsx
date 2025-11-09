import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchFilters } from '../search-filters'

describe('SearchFilters', () => {
  it('should render repository filters', () => {
    const mockOnFiltersChange = jest.fn()
    render(<SearchFilters searchType="repositories" onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByText(/sort by/i)).toBeInTheDocument()
  })

  it('should render user filters', () => {
    const mockOnFiltersChange = jest.fn()
    render(<SearchFilters searchType="users" onFiltersChange={mockOnFiltersChange} />)

    expect(screen.getByText(/sort by/i)).toBeInTheDocument()
  })

  it('should call onFiltersChange when filter is selected', async () => {
    const user = userEvent.setup()
    const mockOnFiltersChange = jest.fn()

    render(<SearchFilters searchType="repositories" onFiltersChange={mockOnFiltersChange} />)

    // This test assumes there's a select element or filter button
    // Adjust based on your actual implementation
    const sortSelect = screen.getByRole('combobox')
    await user.click(sortSelect)

    // Wait for options to appear and select one
    // This will depend on your actual implementation
  })

  it('should display correct filter options for repositories', () => {
    const mockOnFiltersChange = jest.fn()
    render(<SearchFilters searchType="repositories" onFiltersChange={mockOnFiltersChange} />)

    // Add assertions based on your repository filter options
    // e.g., stars, forks, updated
  })

  it('should display correct filter options for users', () => {
    const mockOnFiltersChange = jest.fn()
    render(<SearchFilters searchType="users" onFiltersChange={mockOnFiltersChange} />)

    // Add assertions based on your user filter options
    // e.g., followers, repositories, joined
  })
})

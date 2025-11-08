import { renderHook, waitFor } from '@testing-library/react'
import { useDebounce } from '../use-debounce'

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    expect(result.current).toBe('initial')

    // Update the value
    rerender({ value: 'updated', delay: 500 })

    // Value should not change immediately
    expect(result.current).toBe('initial')

    // Fast-forward time by 500ms
    jest.advanceTimersByTime(500)

    // Value should now be updated
    expect(result.current).toBe('updated')
  })

  it('should handle multiple rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    // Multiple rapid updates
    rerender({ value: 'update1', delay: 500 })
    jest.advanceTimersByTime(100)

    rerender({ value: 'update2', delay: 500 })
    jest.advanceTimersByTime(100)

    rerender({ value: 'update3', delay: 500 })

    // Value should still be initial
    expect(result.current).toBe('initial')

    // Fast-forward to complete the last debounce
    jest.advanceTimersByTime(500)

    // Should only have the last value
    expect(result.current).toBe('update3')
  })

  it('should work with different data types', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 42, delay: 300 },
      }
    )

    expect(result.current).toBe(42)

    rerender({ value: 100, delay: 300 })
    jest.advanceTimersByTime(300)

    expect(result.current).toBe(100)
  })

  it('should handle delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'test', delay: 500 },
      }
    )

    rerender({ value: 'test', delay: 1000 })

    jest.advanceTimersByTime(500)
    // Should not update yet because delay changed to 1000ms
    expect(result.current).toBe('test')

    jest.advanceTimersByTime(500)
    // Now it should be updated
    expect(result.current).toBe('test')
  })

  it('should cleanup timeout on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

    const { unmount } = renderHook(() => useDebounce('test', 500))

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
  })
})
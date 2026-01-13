// ResultsResearchGitHubName.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ResultsResearchGitHubName from './ResultsResearchGitHubName'

// -----------------------------
// HOISTED mocks
// -----------------------------
const mockUseSearchContext = vi.hoisted(() => vi.fn())

// Capture latest props passed to IntersectionObserverWrapper
let lastObserverProps: any = null

vi.mock('../../hooks/gitHubContext/GitHubContext', () => ({
    useSearchContext: mockUseSearchContext,
}))

// JSON default import mock
vi.mock('../../data/content.json', () => ({
    default: {
        mainListCard: {
            emptyState: 'EMPTY STATE TEXT',
        },
        searchInput: {
            notifications: {
                rateLimitExceeded: 'RATE LIMIT EXCEEDED',
                rateLimitWarning: 'RATE LIMIT WARNING',
            },
        },
    },
}))

// DataFetchingWrapper: just render children
vi.mock('../../../shared/components/DataFetchingWrapper', () => ({
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// ListCard: render a marker
vi.mock('../listCards/ListCards', () => ({
    default: () => <div data-testid="list-card">ListCard</div>,
}))

// IntersectionObserverWrapper: render children + a clickable trigger to simulate "visible"
vi.mock('../../../shared/components/observer/IntersectionObserver', () => ({
    IntersectionObserverWrapper: (props: any) => {
        lastObserverProps = props
        return (
            <div data-testid="observer-wrapper">
                <button
                    type="button"
                    data-testid="trigger-visible"
                    onClick={() => props.onVisible?.()}
                >
                    trigger
                </button>
                {props.children}
            </div>
        )
    },
}))

// -----------------------------
// Helpers
// -----------------------------
function makeContext(overrides?: Partial<any>) {
    const base = {
        state: {
            loading: false,
            error: null,
            query: 'react',
            results: {}, // object map
            resultsOrder: [],
            pagination: { hasNextPage: true, currentPage: 1 },
            apiLimitations: { remaining: 10 },
        },
        searchUsers: vi.fn(),
        showNotification: vi.fn(),
    }

    return {
        ...base,
        ...overrides,
        state: {
            ...base.state,
            ...(overrides?.state ?? {}),
        },
    }
}

beforeEach(() => {
    lastObserverProps = null
    vi.clearAllMocks()
})

// -----------------------------
// Tests
// -----------------------------
describe('ResultsResearchGitHubName', () => {
    it('shows empty state when query exists, not loading, and has no results', () => {
        const ctx = makeContext({
            state: {
                query: 'react',
                loading: false,
                results: {}, // empty
                resultsOrder: [],
            },
        })

        mockUseSearchContext.mockReturnValue(ctx)

        render(<ResultsResearchGitHubName />)

        expect(screen.getByText('EMPTY STATE TEXT')).toBeInTheDocument()
        expect(screen.queryByTestId('list-card')).not.toBeInTheDocument()
        expect(screen.queryByTestId('observer-wrapper')).not.toBeInTheDocument()
    })

    it('renders ListCard and IntersectionObserverWrapper when there are results', () => {
        const ctx = makeContext({
            state: {
                query: 'react',
                loading: false,
                results: { '1': { id: 1 } },
                resultsOrder: [1],
                pagination: { hasNextPage: true, currentPage: 1 },
            },
        })

        mockUseSearchContext.mockReturnValue(ctx)

        render(<ResultsResearchGitHubName />)

        expect(screen.getByTestId('list-card')).toBeInTheDocument()
        expect(screen.getByTestId('observer-wrapper')).toBeInTheDocument()

        // observerEnabled should be true with resultsOrder>0, query, hasNextPage, !loading
        expect(lastObserverProps?.enabled).toBe(true)
    })

    it('calls searchUsers(query, nextPage) when sentinel becomes visible and conditions allow', () => {
        const ctx = makeContext({
            state: {
                query: 'react',
                loading: false,
                results: { '1': { id: 1 } },
                resultsOrder: [1],
                pagination: { hasNextPage: true, currentPage: 3 },
                apiLimitations: { remaining: 10 },
            },
        })

        mockUseSearchContext.mockReturnValue(ctx)

        render(<ResultsResearchGitHubName />)

        fireEvent.click(screen.getByTestId('trigger-visible'))

        expect(ctx.searchUsers).toHaveBeenCalledTimes(1)
        expect(ctx.searchUsers).toHaveBeenCalledWith('react', 4)
    })

    it('rate limit exceeded: shows notification and does not call searchUsers', () => {
        const ctx = makeContext({
            state: {
                query: 'react',
                loading: false,
                results: { '1': { id: 1 } },
                resultsOrder: [1],
                pagination: { hasNextPage: true, currentPage: 1 },
                apiLimitations: { remaining: 0 },
            },
        })

        mockUseSearchContext.mockReturnValue(ctx)

        render(<ResultsResearchGitHubName />)

        fireEvent.click(screen.getByTestId('trigger-visible'))

        expect(ctx.showNotification).toHaveBeenCalledTimes(1)
        expect(ctx.showNotification).toHaveBeenCalledWith('RATE LIMIT EXCEEDED', 6000)
        expect(ctx.searchUsers).not.toHaveBeenCalled()
    })

    it('rate limit warning (<=2): shows warning and still calls searchUsers if allowed', () => {
        const ctx = makeContext({
            state: {
                query: 'react',
                loading: false,
                results: { '1': { id: 1 } },
                resultsOrder: [1],
                pagination: { hasNextPage: true, currentPage: 2 },
                apiLimitations: { remaining: 2 },
            },
        })

        mockUseSearchContext.mockReturnValue(ctx)

        render(<ResultsResearchGitHubName />)

        fireEvent.click(screen.getByTestId('trigger-visible'))

        expect(ctx.showNotification).toHaveBeenCalledWith('RATE LIMIT WARNING')
        expect(ctx.searchUsers).toHaveBeenCalledWith('react', 3)
    })
})

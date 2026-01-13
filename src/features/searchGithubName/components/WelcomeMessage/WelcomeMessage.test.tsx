import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// ✅ create the mock in a hoisted-safe way
const mockUseSearchContext = vi.hoisted(() => vi.fn())

// ✅ mock JSON default export (because your component uses `import content from ...`)
vi.mock('../../data/content.json', () => ({
    default: {
        mainListCard: {
            startState: 'Test welcome',
            emptyState: 'Test empty',
        },
    },
}))

vi.mock('../../hooks/gitHubContext/GitHubContext', () => ({
    useSearchContext: mockUseSearchContext,
}))

import WelcomeMessage from './WelcomeMessage'

describe('WelcomeMessage', () => {
    it('renders welcome message', () => {
        mockUseSearchContext.mockReturnValue({
            state: { results: {} },
        })

        render(<WelcomeMessage />)

        expect(screen.getByText('Test welcome')).toBeInTheDocument()
    })
})

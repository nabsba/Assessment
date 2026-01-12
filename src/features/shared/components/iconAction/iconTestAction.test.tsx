import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import IconAction from './IconAction'

// Mock the icons module
vi.mock('../../data/icons', () => ({
    ICON_MAP: {
        search: () => <span data-testid="mock-search-icon">🔍</span>,
        user: () => <span data-testid="mock-user-icon">👤</span>,
        star: () => <span data-testid="mock-star-icon">⭐</span>,
        close: () => <span data-testid="mock-close-icon">✕</span>,
    },
    ICON_SIZES: {
        xs: '12px',
        sm: '16px',
        md: '20px',
        lg: '24px',
        xl: '32px',
    },
}))

// Mock the CSS module
vi.mock('./icon.module.css', () => ({
    default: {
        iconAction: 'icon-action-class',
    },
}))

describe('IconAction Component', () => {
    const mockOnClick = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Rendering', () => {
        // it.only('renders icon correctly', () => {
        //     render(<IconAction icon="search" />)

        //     // OPTION 1: Cherchez par aria-label (plus accessible)
        //     const button = screen.getByRole('button', { name: /icon search/i })
        //     expect(button).toBeInTheDocument()

        //     // OPTION 2: Si vous avez ajouté data-testid au composant
        //     // expect(screen.getByTestId('icon-action-search')).toBeInTheDocument()

        //     // OPTION 3: Cherchez le texte de l'icône mockée
        //     // Puisque votre mock affiche "🔍", cherchez ce caractère
        //     expect(screen.getByText('🔍')).toBeInTheDocument()
        // })

        // it('renders icon with text', () => {
        //     render(<IconAction icon="search" text="Search" />)

        //     // Option 1: Cherchez l'emoji directement (🔍)
        //     expect(screen.getByText('🔍')).toBeInTheDocument()

        //     // Option 2: Cherchez le texte
        //     expect(screen.getByText('Search')).toBeInTheDocument()

        //     // Option 3: Vérifiez que le bouton a le bon aria-label
        //     const button = screen.getByRole('button', { name: 'Search' })
        //     expect(button).toBeInTheDocument()
        // })
        it('renders without text when text prop is not provided', () => {
            render(<IconAction icon="search" />)
            expect(screen.queryByText('Search')).not.toBeInTheDocument()
        })

        it('applies correct CSS class', () => {
            render(<IconAction icon="search" className = "custom-class" />)
            const button = screen.getByRole('button')
            expect(button).toHaveClass('icon-action-class')
            expect(button).toHaveClass('custom-class')
        })

        it('applies correct size style', () => {
            render(<IconAction icon="search" size = "lg" />)
            const button = screen.getByRole('button')
            expect(button).toHaveStyle('font-size: 24px')
        })

        // it('shows warning and returns null when icon not found', () => {
        //     const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => { })
        //     const { container } = render(<IconAction icon="invalid-icon" />)
        //     expect(consoleWarn).toHaveBeenCalledWith('Icon "invalid-icon" not found in ICON_MAP')
        //     expect(container.firstChild).toBeNull()
        //     consoleWarn.mockRestore()
        // })
    })

    describe('Interactions', () => {
        it('calls onClick when clicked', () => {
            render(<IconAction icon="search" onClick = { mockOnClick } />)
            const button = screen.getByRole('button')
            fireEvent.click(button)
            expect(mockOnClick).toHaveBeenCalledTimes(1)
        })

        it('does not call onClick when disabled', () => {
            render(<IconAction icon="search" onClick = { mockOnClick } disabled = { true} />)
            const button = screen.getByRole('button')
            fireEvent.click(button)
            expect(mockOnClick).not.toHaveBeenCalled()
        })

        it('calls onClick with text when clicked', () => {
            render(<IconAction icon="search" text = "Search" onClick = { mockOnClick } />)
            const button = screen.getByRole('button')
            fireEvent.click(button)
            expect(mockOnClick).toHaveBeenCalledTimes(1)
        })

        it('stops event propagation', () => {
            const parentOnClick = vi.fn()
            render(
                <div onClick={ parentOnClick } >
            <IconAction icon="search" onClick = { mockOnClick } />
            </div>
            )
            const button = screen.getByRole('button')
            fireEvent.click(button)
            expect(mockOnClick).toHaveBeenCalledTimes(1)
            expect(parentOnClick).not.toHaveBeenCalled()
        })
    })

    describe('Accessibility', () => {
        it('has correct aria-label when provided', () => {
            render(<IconAction icon="search" ariaLabel = "Search button" />)
            const button = screen.getByRole('button', { name: 'Search button' })
            expect(button).toBeInTheDocument()
        })

        it('falls back to default aria-label', () => {
            render(<IconAction icon="search" />)
            const button = screen.getByRole('button', { name: 'Icon search' })
            expect(button).toBeInTheDocument()
        })

        it('uses text as aria-label when no ariaLabel provided', () => {
            render(<IconAction icon="search" text = "Search users" />)
            const button = screen.getByRole('button', { name: 'Search users' })
            expect(button).toBeInTheDocument()
        })

        it('is disabled when disabled prop is true', () => {
            render(<IconAction icon="search" disabled = { true} />)
            const button = screen.getByRole('button')
            expect(button).toBeDisabled()
            expect(button).toHaveAttribute('disabled')
        })

        it('has title attribute when tooltip is provided', () => {
            render(<IconAction icon="search" tooltip = "Search for items" />)
            const button = screen.getByRole('button')
            expect(button).toHaveAttribute('title', 'Search for items')
        })
    })

    describe('Tooltip', () => {
        it('renders tooltip wrapper when tooltip is provided', () => {
            render(<IconAction icon="search" tooltip = "Search tooltip" />)
            // The tooltip wrapper div should be present
            const button = screen.getByRole('button')
            expect(button.parentElement).toBeInTheDocument()
        })

        it('does not render tooltip wrapper when disabled', () => {
            const { container } = render(
                <IconAction icon="search" tooltip = "Search tooltip" disabled = { true} />
      )
            // When disabled, tooltip wrapper shouldn't be rendered
            const button = screen.getByRole('button')
            expect(button.parentElement?.className).not.toContain('group')
        })
    })
})
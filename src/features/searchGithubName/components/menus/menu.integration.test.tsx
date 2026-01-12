import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Menus from './Menus'

// Mock du contexte
vi.mock('../../hooks/GitHubContext', () => ({
    useSearchContext: vi.fn(() => ({
        state: {
            selectedUsers: {} // Objet vide par défaut
        }
    }))
}))

describe('Menus Component - Integration', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { })

    afterEach(() => {
        consoleSpy.mockClear()
    })

    afterAll(() => {
        consoleSpy.mockRestore()
    })

    it('calls console.log when search icon is clicked', () => {
        render(<Menus />)
        const buttons = screen.getAllByRole('button')

        fireEvent.click(buttons[0])
        expect(consoleSpy).toHaveBeenCalledWith('Search clicked')
    })

    // ... autres tests
})
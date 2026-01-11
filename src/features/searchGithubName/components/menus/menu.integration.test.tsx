import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Menus from './Menus'

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

        // Click search button (first button)
        fireEvent.click(buttons[0])
        expect(consoleSpy).toHaveBeenCalledWith('Search clicked')
    })

    it('calls console.log when duplicate icon is clicked', () => {
        render(<Menus />)
        const buttons = screen.getAllByRole('button')

        // Click duplicate button (second button)
        fireEvent.click(buttons[1])
        expect(consoleSpy).toHaveBeenCalledWith('duplicateItem')
    })

    it('calls console.log when delete icon is clicked', () => {
        render(<Menus />)
        const buttons = screen.getAllByRole('button')

        // Click delete button (third button)
        fireEvent.click(buttons[2])
        expect(consoleSpy).toHaveBeenCalledWith('deleteItem')
    })
})
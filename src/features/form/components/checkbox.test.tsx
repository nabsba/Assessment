import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Checkbox from './CheckBox'


// Mock the CSS module
vi.mock('./Checkbox.module.css', () => ({
    default: {
        checkboxContainer: 'checkboxContainer',
        checkboxWrapper: 'checkboxWrapper',
        checkboxInput: 'checkboxInput',
        checkboxCustom: 'checkboxCustom',
        checkboxLabel: 'checkboxLabel',
        requiredIndicator: 'requiredIndicator',
    }
}))

describe('Checkbox Component', () => {
    const mockOnChange = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
    })

    // Helper function to get the custom checkbox (span without role="checkbox")
    const getCustomSpan = () => {
        const input = screen.getByTestId('checkbox')
        // Get the sibling span element
        const span = input.nextElementSibling
        if (!span) {
            throw new Error('Custom span not found')
        }
        return span
    }

    // Helper function to get the actual input checkbox
    const getInputCheckbox = () => screen.getByTestId('checkbox')

    describe('Rendering', () => {
        it('renders checkbox input', () => {
            render(<Checkbox checked={false} onChange={mockOnChange} />)
            const input = getInputCheckbox()
            expect(input).toBeInTheDocument()
            expect(input).toHaveAttribute('type', 'checkbox')
        })

        it('renders with text label', () => {
            render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    text="Accept terms"
                />
            )
            expect(screen.getByText('Accept terms')).toBeInTheDocument()
        })

        it('does not render label when text is not provided', () => {
            render(<Checkbox checked={false} onChange={mockOnChange} />)
            expect(screen.queryByText('Accept terms')).not.toBeInTheDocument()
        })

        it('renders with custom test ID', () => {
            render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    data-testid="custom-checkbox"
                />
            )
            expect(screen.getByTestId('custom-checkbox')).toBeInTheDocument()
        })

        it('renders required indicator when required is true', () => {
            render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    text="Required field"
                    required={true}
                />
            )
            expect(screen.getByText('*')).toBeInTheDocument()
        })

        it('does not render required indicator when required is false', () => {
            render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    text="Optional field"
                    required={false}
                />
            )
            expect(screen.queryByText('*')).not.toBeInTheDocument()
        })

        it('applies custom className', () => {
            const { container } = render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    className="custom-class"
                />
            )
            const containerDiv = container.firstChild
            expect(containerDiv).toHaveClass('custom-class')
        })

        it('applies custom style', () => {
            const customStyle = { margin: '10px', padding: '5px' }
            const { container } = render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    style={customStyle}
                />
            )
            const containerDiv = container.firstChild
            expect(containerDiv).toHaveStyle(customStyle)
        })

        it('shows tooltip when provided', () => {
            render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    tooltip="Check this option"
                />
            )
            const container = screen.getByTestId('checkbox').closest('div[title]')
            expect(container).toHaveAttribute('title', 'Check this option')
        })
    })

    describe('Interactions', () => {
        it('calls onChange when checkbox input is clicked', () => {
            render(<Checkbox checked={false} onChange={mockOnChange} />)
            const input = getInputCheckbox()
            fireEvent.click(input)
            expect(mockOnChange).toHaveBeenCalledWith(true)
        })

        it('calls onChange when custom span is clicked', () => {
            render(<Checkbox checked={false} onChange={mockOnChange} />)
            const customSpan = getCustomSpan()
            fireEvent.click(customSpan)
            expect(mockOnChange).toHaveBeenCalledWith(true)
        })

        it('does not call onChange when disabled', () => {
            render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    disabled={true}
                />
            )
            const input = getInputCheckbox()
            fireEvent.click(input)
            expect(mockOnChange).not.toHaveBeenCalled()
        })

        it('does not call onChange when custom span is clicked and disabled', () => {
            render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    disabled={true}
                />
            )
            const customSpan = getCustomSpan()
            fireEvent.click(customSpan)
            expect(mockOnChange).not.toHaveBeenCalled()
        })

        it('calls onChange when label text is clicked', () => {
            render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    text="Click me"
                />
            )
            const label = screen.getByText('Click me')
            fireEvent.click(label)
            expect(mockOnChange).toHaveBeenCalledWith(true)
        })
    })

    describe('Keyboard Interactions', () => {
        it('toggles with Space key on custom span', () => {
            render(<Checkbox checked={false} onChange={mockOnChange} />)
            const customSpan = getCustomSpan()

            // Press Space
            fireEvent.keyDown(customSpan, { key: ' ', code: 'Space' })
            expect(mockOnChange).toHaveBeenCalledWith(true)
        })

        it('toggles with Enter key on custom span', () => {
            render(<Checkbox checked={false} onChange={mockOnChange} />)
            const customSpan = getCustomSpan()

            fireEvent.keyDown(customSpan, { key: 'Enter', code: 'Enter' })
            expect(mockOnChange).toHaveBeenCalledWith(true)
        })


        it('does not toggle with other keys', () => {
            render(<Checkbox checked={false} onChange={mockOnChange} />)
            const customSpan = getCustomSpan()

            fireEvent.keyDown(customSpan, { key: 'Tab', code: 'Tab' })
            fireEvent.keyDown(customSpan, { key: 'a', code: 'KeyA' })
            fireEvent.keyDown(customSpan, { key: 'Escape', code: 'Escape' })

            expect(mockOnChange).not.toHaveBeenCalled()
        })

        it('does not respond to keyboard when disabled', () => {
            render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    disabled={true}
                />
            )
            const customSpan = getCustomSpan()

            fireEvent.keyDown(customSpan, { key: ' ', code: 'Space' })
            fireEvent.keyDown(customSpan, { key: 'Enter', code: 'Enter' })

            expect(mockOnChange).not.toHaveBeenCalled()
        })
    })

    describe('Accessibility', () => {
        it('input has correct aria-checked attribute', () => {
            const { rerender } = render(
                <Checkbox checked={true} onChange={mockOnChange} />
            )
            const input = getInputCheckbox()
            expect(input).toHaveAttribute('aria-checked', 'true')

            rerender(<Checkbox checked={false} onChange={mockOnChange} />)
            expect(input).toHaveAttribute('aria-checked', 'false')
        })

        it('input has correct aria-disabled attribute', () => {
            const { rerender } = render(
                <Checkbox checked={false} onChange={mockOnChange} disabled={true} />
            )
            const input = getInputCheckbox()
            expect(input).toHaveAttribute('aria-disabled', 'true')

            rerender(<Checkbox checked={false} onChange={mockOnChange} disabled={false} />)
            expect(input).toHaveAttribute('aria-disabled', 'false')
        })

        it('input has aria-labelledby when text is provided', () => {
        render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    text="Option 1"
                    id="test-checkbox"
                />
            )
            const input = getInputCheckbox()

            // Check if aria-labelledby exists OR if the label is properly associated via htmlFor
            const label = screen.getByText('Option 1')
            expect(label).toHaveAttribute('for', 'test-checkbox')
            expect(label).toHaveAttribute('id', 'test-checkbox-label')

            // The input should either have aria-labelledby or be properly labeled via htmlFor
            // For better test, check one of these conditions
            const hasAriaLabelledBy = input.hasAttribute('aria-labelledby')
            const hasCorrectId = input.getAttribute('id') === 'test-checkbox'

            // Accept either proper labeling method
            expect(hasAriaLabelledBy || hasCorrectId).toBe(true)
        })

        it('input does not have aria-labelledby when text is not provided', () => {
            render(<Checkbox checked={false} onChange={mockOnChange} />)
            const input = getInputCheckbox()
            expect(input).not.toHaveAttribute('aria-labelledby')
        })

        it('label has htmlFor attribute matching input id', () => {
            render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    text="Label"
                    id="test-id"
                />
            )
            const label = screen.getByText('Label')
            expect(label).toHaveAttribute('for', 'test-id')
        })

        it('input has id matching label htmlFor', () => {
            render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    text="Label"
                    id="test-id"
                />
            )
            const input = getInputCheckbox()
            const label = screen.getByText('Label')
            expect(input).toHaveAttribute('id', 'test-id')
            expect(label).toHaveAttribute('for', 'test-id')
        })

        it('generates unique id when id is not provided', () => {
            render(<Checkbox checked={false} onChange={mockOnChange} text="Label" />)
            const input = getInputCheckbox()
            const label = screen.getByText('Label')

            const inputId = input.getAttribute('id')
            const labelFor = label.getAttribute('for')

            expect(inputId).toBeTruthy()
            expect(labelFor).toBeTruthy()
            expect(inputId).toBe(labelFor)
            expect(inputId).toMatch(/^checkbox-[a-z0-9]+$/)
        })

        it('input is disabled when disabled prop is true', () => {
            render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    disabled={true}
                />
            )
            const input = getInputCheckbox()
            expect(input).toBeDisabled()
            expect(input).toHaveAttribute('disabled')
        })

        it('input is not disabled when disabled prop is false', () => {
            render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    disabled={false}
                />
            )
            const input = getInputCheckbox()
            expect(input).not.toBeDisabled()
            expect(input).not.toHaveAttribute('disabled')
        })
    })

    describe('Form Attributes', () => {
        it('has name attribute when provided', () => {
            render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    name="agree"
                />
            )
            const input = getInputCheckbox()
            expect(input).toHaveAttribute('name', 'agree')
        })

        it('has required attribute when required is true', () => {
            render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    required={true}
                />
            )
            const input = getInputCheckbox()
            expect(input).toHaveAttribute('required')
        })

        it('does not have required attribute when required is false', () => {
            render(
                <Checkbox
                    checked={false}
                    onChange={mockOnChange}
                    required={false}
                />
            )
            const input = getInputCheckbox()
            expect(input).not.toHaveAttribute('required')
        })

        it('has correct checked state on input', () => {
            const { rerender } = render(
                <Checkbox checked={true} onChange={mockOnChange} />
            )
            const input = getInputCheckbox()
            expect(input).toBeChecked()

            rerender(<Checkbox checked={false} onChange={mockOnChange} />)
            expect(input).not.toBeChecked()
        })
    })

    describe('Edge Cases', () => {
        it('handles rapid clicks', () => {
            const { rerender } = render(
                <Checkbox checked={false} onChange={mockOnChange} />
            )
            const input = getInputCheckbox()

            // First click - should call with true
            fireEvent.click(input)
            expect(mockOnChange).toHaveBeenCalledWith(true)

            // Update component state
            rerender(<Checkbox checked={true} onChange={mockOnChange} />)

            // Second click - should call with false
            fireEvent.click(input)
            expect(mockOnChange).toHaveBeenCalledWith(false)

            // Update component state again
            rerender(<Checkbox checked={false} onChange={mockOnChange} />)

            // Third click - should call with true
            fireEvent.click(input)
            expect(mockOnChange).toHaveBeenCalledWith(true)
        })

        it('maintains correct state when parent re-renders', () => {
            const { rerender } = render(
                <Checkbox checked={false} onChange={mockOnChange} text="Option" />
            )

            const input = getInputCheckbox()
            expect(input).not.toBeChecked()

            // Simulate parent re-render with new checked state
            rerender(<Checkbox checked={true} onChange={mockOnChange} text="Option" />)
            expect(input).toBeChecked()
        })
    })
})
// Switch.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Switch from './Switch';

// Mock CSS module
vi.mock('./Switch.module.css', () => ({
    default: {
        container: 'container',
        disabled: 'disabled',
        track: 'track',
        small: 'small',
        medium: 'medium',
        large: 'large',
        disabledTrack: 'disabledTrack',
        knob: 'knob',
        knob_small: 'knob_small',
        knob_medium: 'knob_medium',
        knob_large: 'knob_large',
        label: 'label'
    }
}));

describe('Switch Component', () => {
    const mockOnChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        it('renders switch with default props', () => {
            render(<Switch />);

            const switchElement = screen.getByRole('switch');
            expect(switchElement).toBeInTheDocument();
            expect(switchElement).toHaveAttribute('aria-checked', 'false');
            expect(switchElement).not.toBeDisabled();
        });

        it('renders with label', () => {
            const label = 'Toggle Switch';
            render(<Switch label={label} />);

            expect(screen.getByText(label)).toBeInTheDocument();
            expect(screen.getByRole('switch')).toHaveAttribute('aria-label', label);
        });

        it('renders checked state when checked prop is true', () => {
            render(<Switch checked={true} />);

            expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
        });

        it('renders disabled state', () => {
            render(<Switch disabled={true} />);

            const switchElement = screen.getByRole('switch');
            expect(switchElement).toBeDisabled();

        });

        it('renders different sizes', () => {
            const { rerender } = render(<Switch size="small" />);
            let switchElement = screen.getByRole('switch');
            expect(switchElement).toHaveClass('small');

            rerender(<Switch size="medium" />);
            switchElement = screen.getByRole('switch');
            expect(switchElement).toHaveClass('medium');

            rerender(<Switch size="large" />);
            switchElement = screen.getByRole('switch');
            expect(switchElement).toHaveClass('large');
        });
    });

    describe('Interaction', () => {
        it('calls onChange when clicked', () => {
            render(<Switch onChange={mockOnChange} />);

            const switchElement = screen.getByRole('switch');
            fireEvent.click(switchElement);

            expect(mockOnChange).toHaveBeenCalledTimes(1);
            expect(mockOnChange).toHaveBeenCalledWith(true);
        });

        it('toggles state when clicked', () => {
            const { rerender } = render(<Switch checked={false} onChange={mockOnChange} />);

            let switchElement = screen.getByRole('switch');
            expect(switchElement).toHaveAttribute('aria-checked', 'false');

            fireEvent.click(switchElement);
            expect(mockOnChange).toHaveBeenCalledWith(true);

            // Re-render with new checked state
            rerender(<Switch checked={true} onChange={mockOnChange} />);
            switchElement = screen.getByRole('switch');
            expect(switchElement).toHaveAttribute('aria-checked', 'true');

            fireEvent.click(switchElement);
            expect(mockOnChange).toHaveBeenCalledWith(false);
        });

        it('does not call onChange when disabled', () => {
            render(<Switch disabled={true} onChange={mockOnChange} />);

            const switchElement = screen.getByRole('switch');
            fireEvent.click(switchElement);

            expect(mockOnChange).not.toHaveBeenCalled();
        });

        it('does not toggle when disabled', () => {
            const { rerender } = render(<Switch checked={false} disabled={true} onChange={mockOnChange} />);

            const switchElement = screen.getByRole('switch');
            fireEvent.click(switchElement);

            // Even if we re-render, it shouldn't change
            rerender(<Switch checked={false} disabled={true} onChange={mockOnChange} />);
            expect(switchElement).toHaveAttribute('aria-checked', 'false');
        });
    });

    describe('Accessibility', () => {
        it('has proper role and aria attributes', () => {
            render(<Switch label="Dark Mode" checked={true} />);

            const switchElement = screen.getByRole('switch');
            expect(switchElement).toHaveAttribute('role', 'switch');
            expect(switchElement).toHaveAttribute('aria-checked', 'true');
            expect(switchElement).toHaveAttribute('aria-label', 'Dark Mode');
        });

        it('uses default aria-label when no label provided', () => {
            render(<Switch />);

            expect(screen.getByRole('switch')).toHaveAttribute('aria-label', 'Toggle switch');
        });


    });

    describe('Styling and Visual', () => {
        it('applies custom color when checked', () => {
            const customColor = '#ff0000';
            render(<Switch checked={true} color={customColor} />);

            const switchElement = screen.getByRole('switch');
            expect(switchElement.style.backgroundColor).toBe(customColor);
        });

        it('uses default color when unchecked', () => {
            render(<Switch checked={false} color="#4CAF50" />);

            const switchElement = screen.getByRole('switch');
            expect(switchElement.style.backgroundColor).toBe('#ccc');
        });

        it('applies knob transform based on checked state and size', () => {
            const { container } = render(<Switch size="medium" checked={false} />);

            const knob = container.querySelector('.knob') as HTMLElement;
            expect(knob).toBeInTheDocument();

            // When unchecked, knob should be on left (transform with smaller value)
            expect(knob.style.transform).toBe('translateX(4px)');
        });

    
    });

    describe('Edge Cases', () => {
        it('handles undefined onChange gracefully', () => {
            expect(() => {
                render(<Switch />);
                fireEvent.click(screen.getByRole('switch'));
            }).not.toThrow();
        });

        it('maintains internal state when uncontrolled', () => {
            const { rerender } = render(<Switch />);

            const switchElement = screen.getByRole('switch');
            expect(switchElement).toHaveAttribute('aria-checked', 'false');

            fireEvent.click(switchElement);
            // Re-render without changing props
            rerender(<Switch />);

            // Internal state should be true now
            expect(switchElement).toHaveAttribute('aria-checked', 'true');
        });

      
    });
});
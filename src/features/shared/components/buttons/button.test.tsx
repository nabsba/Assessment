import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import ButtonV1 from './ButtonV1';

describe('ButtonV1', () => {
    const onClick = vi.fn();

    it('renders correctly', () => {
        render(<ButtonV1 text="Save" onClick={onClick} />);
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('handles click', () => {
        render(<ButtonV1 text="Click" onClick={onClick} />);
        fireEvent.click(screen.getByText('Click'));
        expect(onClick).toHaveBeenCalled();
    });

    it('respects disabled state', () => {
        render(<ButtonV1 text="Disabled" onClick={onClick} disabled />);
        expect(screen.getByText('Disabled')).toBeDisabled();
    });
});
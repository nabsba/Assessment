// test file
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loader, { LoaderType } from './Loader'; 


vi.mock('./Loader.module.css', () => ({
    default: {
        defaultLoader: 'defaultLoader',
        spinner: 'spinner',
        dotsLoader: 'dotsLoader',
        dot: 'dot',
        barLoader: 'barLoader',
        bar: 'bar',
    }
}));

describe('Loader', () => {
    it('exports LoaderType correctly', () => {
        expect(LoaderType).toEqual({
            DEFAULT: 'default',
            DOTS: 'dots',
            BAR: 'bar',
            CARDS: 'cards' 
        });
    });

    it('uses DEFAULT as default prop', () => {
        const { container: withDefault } = render(<Loader />);
        const { container: withExplicit } = render(<Loader type={LoaderType.DEFAULT} />);

        expect(withDefault.innerHTML).toBe(withExplicit.innerHTML);
    });

    it('has accessible ARIA attributes', () => {
        render(<Loader />);

        const loader = screen.getByRole('status');
        expect(loader).toHaveAttribute('aria-label', 'Loading');
    });
});
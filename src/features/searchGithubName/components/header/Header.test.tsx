// Header.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Header from './Header';

// Mock JSON import
vi.mock('../../data/content.json', () => ({
    default: {
        header: {
            title: 'Test Header Title'
        }
    }
}));

// Mock CSS module to get predictable class names
vi.mock('./Header.module.css', () => ({
    default: {
        header: 'header',
        title: 'title'
    }
}));

describe('Header Component', () => {
    test('renders the header title from content', () => {
        render(<Header />);
        const titleElement = screen.getByText('Test Header Title');
        expect(titleElement).toBeInTheDocument();
    });

    test('has correct CSS class', () => {
        const { container } = render(<Header />);

        // Now it will have class "header" instead of "_header_12a4aa"
        expect(container.firstChild).toHaveClass('header');

        // Also test the paragraph has the title class
        const paragraph = screen.getByText('Test Header Title');
        expect(paragraph).toHaveClass('title');
    });
});
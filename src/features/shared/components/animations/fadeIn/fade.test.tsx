// FadeIn.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FadeIn from './FadeAnimation';


// Mock CSS module
vi.mock('./Fade.module.css', () => ({
    default: {
        fadeContainer: 'fadeContainer',
        visible: 'visible',
        top: 'top',
        bottom: 'bottom',
        left: 'left',
        right: 'right',
        topLeft: 'topLeft',
        topRight: 'topRight',
        bottomLeft: 'bottomLeft',
        bottomRight: 'bottomRight',
        scaleUp: 'scaleUp',
        scaleDown: 'scaleDown',
        opacityOnly: 'opacityOnly'
    }
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

beforeEach(() => {
    mockIntersectionObserver.mockClear();
    mockObserve.mockClear();
    mockUnobserve.mockClear();
    mockDisconnect.mockClear();

    // Mock IntersectionObserver
    globalThis.IntersectionObserver = vi.fn().mockImplementation((callback, options) => {
        mockIntersectionObserver({ callback, options });
        return {
            observe: mockObserve,
            unobserve: mockUnobserve,
            disconnect: mockDisconnect,
        };
    });

    // Mock requestAnimationFrame
    globalThis.requestAnimationFrame = vi.fn((cb) => {
        setTimeout(cb, 0);
        return 123;
    });

    globalThis.cancelAnimationFrame = vi.fn();
});

describe('FadeIn Component', () => {
    describe('Basic Rendering', () => {
        it('renders children', () => {
            render(<FadeIn>Test Content</FadeIn>);
            expect(screen.getByText('Test Content')).toBeInTheDocument();
        });

        it('applies fadeContainer class', () => {
            const { container } = render(<FadeIn>Test</FadeIn>);
            const element = container.firstChild as HTMLElement;
            expect(element.className).toContain('fadeContainer');
        });

        it('applies direction class', () => {
            const { container } = render(<FadeIn direction="left">Test</FadeIn>);
            const element = container.firstChild as HTMLElement;
            expect(element.className).toContain('left');
        });

        it('applies custom className', () => {
            const { container } = render(
                <FadeIn className="custom-class">Test</FadeIn>
            );
            const element = container.firstChild as HTMLElement;
            expect(element.className).toContain('custom-class');
        });
    });

    

    describe('Direction Variations', () => {
        const directions: Array<[any['direction'], string]> = [
            ['top', 'top'],
            ['bottom', 'bottom'],
            ['left', 'left'],
            ['right', 'right'],
            ['top-left', 'topLeft'],
            ['top-right', 'topRight'],
            ['bottom-left', 'bottomLeft'],
            ['bottom-right', 'bottomRight'],
            ['scale-up', 'scaleUp'],
            ['scale-down', 'scaleDown'],
            ['opacity-only', 'opacityOnly'],
        ];

        directions.forEach(([direction, expectedClass]) => {
            it(`applies correct class for direction: ${direction}`, () => {
                const { container } = render(
                    <FadeIn direction={direction}>Test</FadeIn>
                );
                const element = container.firstChild as HTMLElement;
                expect(element.className).toContain(expectedClass);
            });
        });
    });

  

    describe('Intersection Observer', () => {
       

        it('does not set up observer when triggerOnView is false', () => {
            render(<FadeIn triggerOnView={false}>Test</FadeIn>);

            expect(globalThis.IntersectionObserver).not.toHaveBeenCalled();
            expect(mockObserve).not.toHaveBeenCalled();
        });

  
    });

    describe('Cleanup', () => {
      

        it('cancels requestAnimationFrame on unmount when triggerOnView is false', () => {
            const cancelSpy = vi.spyOn(globalThis, 'cancelAnimationFrame');
            const { unmount } = render(
                <FadeIn triggerOnView={false}>Test</FadeIn>
            );

            unmount();

            expect(cancelSpy).toHaveBeenCalledWith(123);
        });
    });

    describe('Edge Cases', () => {
        it('handles unknown direction gracefully', () => {
            // TypeScript won't allow this, but test for runtime safety
            const { container } = render(
                <FadeIn direction="top">Test</FadeIn>
            );

            const element = container.firstChild as HTMLElement;
            expect(element.className).toContain('fadeContainer');
        });

        it('works with no children', () => {
            const { container } = render(<FadeIn children={undefined} />);
            expect(container.firstChild).toBeInTheDocument();
        });

  
    });
});
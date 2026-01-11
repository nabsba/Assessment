import { describe, it, expect } from 'vitest';

describe('Testing setup verification', () => {
    it('vitest works', () => {
        expect(1 + 1).toBe(2);
    });

    it('TypeScript works', () => {
        const message: string = 'Hello';
        expect(message).toBe('Hello');
    });
});
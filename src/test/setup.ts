import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Clear React Testing Library after each test
afterEach(() => {
    cleanup();
});
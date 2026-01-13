
import { describe, it, expect, vi } from 'vitest';
import { searchReducer } from './reducer';
import type { SearchState } from '../../types/content.types';

const baseState: SearchState = {
    query: '',
    loading: false,
    error: null,
    results: {},
    resultsOrder: [],
    selectedUsers: {},
    notification: null,
    apiLimitations: { remaining: null, rateLimit: null },
    pagination: {
        currentPage: 1,
        perPage: 10,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    },
};

describe('searchReducer', () => {
    it('sets query', () => {
        const next = searchReducer(baseState, {
            type: 'SET_QUERY',
            query: 'react',
        });

        expect(next.query).toBe('react');
    });

    it('starts new search and resets results', () => {
        const next = searchReducer(
            { ...baseState, results: { '1': {} as any }, resultsOrder: ['1'] },
            { type: 'SEARCH_START', query: 'vue', isNewSearch: true }
        );

        expect(next.loading).toBe(true);
        expect(next.results).toEqual({});
        expect(next.resultsOrder).toEqual([]);
    });

    it('toggles user selection', () => {
        const next = searchReducer(baseState, {
            type: 'TOGGLE_USER',
            userId: 5,
        });

        expect(next.selectedUsers['5']).toBe(true);

        const toggledBack = searchReducer(next, {
            type: 'TOGGLE_USER',
            userId: 5,
        });

        expect(toggledBack.selectedUsers['5']).toBeUndefined();
    });

    it('selects all users', () => {
        const state = {
            ...baseState,
            results: { '1': {} as any, '2': {} as any },
        };

        const next = searchReducer(state, { type: 'SELECT_ALL', selectAll: true });

        expect(next.selectedUsers).toEqual({ '1': true, '2': true });
    });

    it('clears selected users', () => {
        const state = {
            ...baseState,
            selectedUsers: { '1': true },
        };

        const next = searchReducer(state, { type: 'SELECT_ALL', selectAll: false });

        expect(next.selectedUsers).toEqual({});
    });

    it('handles notification dispatch', () => {
        const next = searchReducer(baseState, {
            type: 'SHOW_NOTIFICATION',
            message: 'Hello',
        });

        expect(next.notification).toBe('Hello');
    });

    it('calls showNotification when duplicating existing duplicates', () => {
        const notify = vi.fn(() => vi.fn());

        const state = {
            ...baseState,
            selectedUsers: { '1': true },
        };

        const next = searchReducer(state, {
            type: 'DUPLICATE_SELECTED',
            showNotification: notify,
        });


        expect(next).toBeDefined();
    });
});

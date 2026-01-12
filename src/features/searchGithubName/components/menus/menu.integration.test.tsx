// Menus.test.tsx - FIXED VERSION
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterAll } from 'vitest';
import Menus from './Menus';

// Mock the dependencies
vi.mock('../../../shared/components/iconAction/IconAction', () => ({
    default: ({ icon, onClick, text, disabled }: any) => (
        <button
            onClick={onClick}
            disabled={disabled}
            data-testid={`icon-action-${icon}`}
            aria-label={icon}
        >
            {icon} {text && `(${text})`}
        </button>
    )
}));

vi.mock('../../../form/components/Switch', () => ({
    default: ({ checked, onChange, label, 'data-testid': testId }: any) => (
        <div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                data-testid={testId || 'switch'}
                aria-label={label}
            >
                {label}
            </button>
        </div>
    )
}));

// Mock the context - create a mutable mock
const mockContext = {
    state: {
        selectedUsers: {} // Start with empty
    },
    deleteUserSelection: vi.fn(),
    duplicateUserSelection: vi.fn()
};

vi.mock('../../hooks/GitHubContext', () => ({
    useSearchContext: vi.fn(() => mockContext)
}));

// Mock the content JSON
vi.mock('../../data/content.json', () => ({
    default: {
        menu: {
            editModeLabel: 'Edit Mode'
        }
    }
}));

describe('Menus Component', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();
        // Reset context to default
        mockContext.state.selectedUsers = {};
        mockContext.deleteUserSelection.mockClear();
        mockContext.duplicateUserSelection.mockClear();
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    it('renders the switch with correct label', () => {
        render(<Menus />);

        const switchElement = screen.getByTestId('edit-mode-switch');
        expect(switchElement).toBeInTheDocument();
        expect(switchElement).toHaveAttribute('aria-label', 'Edit Mode');
    });

    it('does not show action buttons when edit mode is off', () => {
        render(<Menus />);

        expect(screen.queryByTestId('icon-action-search')).not.toBeInTheDocument();
        expect(screen.queryByTestId('icon-action-duplicate')).not.toBeInTheDocument();
        expect(screen.queryByTestId('icon-action-bin')).not.toBeInTheDocument();
    });

    it('shows action buttons when edit mode is turned on', () => {
        render(<Menus />);

        // Turn on edit mode
        const switchButton = screen.getByTestId('edit-mode-switch');
        fireEvent.click(switchButton);

        // Action buttons should now be visible
        expect(screen.getByTestId('icon-action-search')).toBeInTheDocument();
        expect(screen.getByTestId('icon-action-duplicate')).toBeInTheDocument();
        expect(screen.getByTestId('icon-action-bin')).toBeInTheDocument();
    });

    it('calls console.log when search icon is clicked', () => {
        render(<Menus />);

        // Enable edit mode
        const switchButton = screen.getByTestId('edit-mode-switch');
        fireEvent.click(switchButton);

        // Click search button
        const searchButton = screen.getByTestId('icon-action-search');
        fireEvent.click(searchButton);

        expect(consoleSpy).toHaveBeenCalledWith('Search clicked');
    });

    it('displays selected count in search button when there are selected users', () => {
        // Set selected users before rendering
        mockContext.state.selectedUsers = { user1: true, user2: true };

        render(<Menus />);

        // Enable edit mode
        const switchButton = screen.getByTestId('edit-mode-switch');
        fireEvent.click(switchButton);

        // Check that search button shows count (2)
        const searchButton = screen.getByTestId('icon-action-search');
        expect(searchButton.textContent).toBe('search (2)');
    });

    it('calls duplicateUserSelection when duplicate icon is clicked with users selected', () => {
        // Set selected users
        mockContext.state.selectedUsers = { user1: true };

        render(<Menus />);

        // Enable edit mode
        const switchButton = screen.getByTestId('edit-mode-switch');
        fireEvent.click(switchButton);

        // Click duplicate button (should not be disabled)
        const duplicateButton = screen.getByTestId('icon-action-duplicate');
        expect(duplicateButton).not.toBeDisabled();

        fireEvent.click(duplicateButton);
        expect(mockContext.duplicateUserSelection).toHaveBeenCalledTimes(1);
    });

    it('disables duplicate and bin buttons when no users are selected', () => {
        render(<Menus />); // Default mock has empty selectedUsers

        // Enable edit mode
        const switchButton = screen.getByTestId('edit-mode-switch');
        fireEvent.click(switchButton);

        // Duplicate and bin buttons should be disabled
        const duplicateButton = screen.getByTestId('icon-action-duplicate');
        const binButton = screen.getByTestId('icon-action-bin');

        expect(duplicateButton).toBeDisabled();
        expect(binButton).toBeDisabled();
    });

    it('calls deleteUserSelection when bin icon is clicked with users selected', () => {
        // Set selected users
        mockContext.state.selectedUsers = { user1: true };

        render(<Menus />);

        // Enable edit mode
        const switchButton = screen.getByTestId('edit-mode-switch');
        fireEvent.click(switchButton);

        // Click bin button
        const binButton = screen.getByTestId('icon-action-bin');
        fireEvent.click(binButton);

        expect(mockContext.deleteUserSelection).toHaveBeenCalledTimes(1);
    });

    it('hides action buttons when edit mode is turned off', () => {
        render(<Menus />);

        // Turn edit mode ON
        const switchButton = screen.getByTestId('edit-mode-switch');
        fireEvent.click(switchButton);

        // Verify buttons are visible
        expect(screen.getByTestId('icon-action-search')).toBeInTheDocument();

        // Turn edit mode OFF
        fireEvent.click(switchButton);

        // Verify buttons are hidden
        expect(screen.queryByTestId('icon-action-search')).not.toBeInTheDocument();
    });


});
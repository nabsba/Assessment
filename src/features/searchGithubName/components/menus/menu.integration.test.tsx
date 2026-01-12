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

vi.mock('../../../shared/components/animations/fadeIn/FadeAnimation', () => ({
    default: ({ children }: any) => <div>{children}</div>
}));

// Mock the context - create a mutable mock
let mockEditMode = false;
const mockContext = {
    state: {
        selectedUsers: {} // Start with empty
    },
    deleteUserSelection: vi.fn(),
    duplicateUserSelection: vi.fn(),
    editMode: mockEditMode,
    handleEditModeChange: vi.fn((newValue: boolean) => {
        mockEditMode = newValue;
        // Update the mock context
        mockContext.editMode = newValue;
    })
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
        // Reset all mocks and state
        vi.clearAllMocks();
        mockEditMode = false;

        // Reset context to default
        mockContext.state.selectedUsers = {};
        mockContext.deleteUserSelection.mockClear();
        mockContext.duplicateUserSelection.mockClear();
        mockContext.editMode = mockEditMode;

        // Reset the handleEditModeChange mock
        mockContext.handleEditModeChange.mockImplementation((newValue: boolean) => {
            mockEditMode = newValue;
            mockContext.editMode = newValue;
        });
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    it('renders the switch with correct label and checked state from context', () => {
        // Set editMode to true for this test
        mockContext.editMode = true;

        render(<Menus />);

        const switchElement = screen.getByTestId('edit-mode-switch');
        expect(switchElement).toBeInTheDocument();
        expect(switchElement).toHaveAttribute('aria-label', 'Edit Mode');
        expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });

    it('does not show action buttons when edit mode is off', () => {
        mockContext.editMode = false;

        render(<Menus />);

        expect(screen.queryByTestId('icon-action-search')).not.toBeInTheDocument();
        expect(screen.queryByTestId('icon-action-duplicate')).not.toBeInTheDocument();
        expect(screen.queryByTestId('icon-action-bin')).not.toBeInTheDocument();
    });

    it('shows action buttons when edit mode is on', () => {
        mockContext.editMode = true;

        render(<Menus />);

        // Action buttons should be visible
        expect(screen.getByTestId('icon-action-search')).toBeInTheDocument();
        expect(screen.getByTestId('icon-action-duplicate')).toBeInTheDocument();
        expect(screen.getByTestId('icon-action-bin')).toBeInTheDocument();
    });

    it('calls handleEditModeChange when switch is clicked', () => {
        mockContext.editMode = false;

        render(<Menus />);

        // Click the switch
        const switchButton = screen.getByTestId('edit-mode-switch');
        fireEvent.click(switchButton);

        expect(mockContext.handleEditModeChange).toHaveBeenCalledTimes(1);
        expect(mockContext.handleEditModeChange).toHaveBeenCalledWith(true);
    });

    it('calls console.log when search icon is clicked', () => {
        mockContext.editMode = true;

        render(<Menus />);

        // Click search button
        const searchButton = screen.getByTestId('icon-action-search');
        fireEvent.click(searchButton);

        expect(consoleSpy).toHaveBeenCalledWith('Search clicked');
    });

    it('displays selected count in search button when there are selected users', () => {
        mockContext.editMode = true;
        mockContext.state.selectedUsers = { user1: true, user2: true };

        render(<Menus />);

        // Check that search button shows count (2)
        const searchButton = screen.getByTestId('icon-action-search');
        expect(searchButton.textContent).toBe('search (2)');
    });

    it('calls duplicateUserSelection when duplicate icon is clicked with users selected', () => {
        mockContext.editMode = true;
        mockContext.state.selectedUsers = { user1: true };

        render(<Menus />);

        // Click duplicate button (should not be disabled)
        const duplicateButton = screen.getByTestId('icon-action-duplicate');
        expect(duplicateButton).not.toBeDisabled();

        fireEvent.click(duplicateButton);
        expect(mockContext.duplicateUserSelection).toHaveBeenCalledTimes(1);
    });

    it('disables duplicate and bin buttons when no users are selected', () => {
        mockContext.editMode = true;
        mockContext.state.selectedUsers = {};

        render(<Menus />);

        // Duplicate and bin buttons should be disabled
        const duplicateButton = screen.getByTestId('icon-action-duplicate');
        const binButton = screen.getByTestId('icon-action-bin');

        expect(duplicateButton).toBeDisabled();
        expect(binButton).toBeDisabled();
    });

    it('calls deleteUserSelection when bin icon is clicked with users selected', () => {
        mockContext.editMode = true;
        mockContext.state.selectedUsers = { user1: true };

        render(<Menus />);

        // Click bin button
        const binButton = screen.getByTestId('icon-action-bin');
        fireEvent.click(binButton);

        expect(mockContext.deleteUserSelection).toHaveBeenCalledTimes(1);
    });

    it('re-renders when editMode changes', () => {
        const { rerender } = render(<Menus />);

        // Initially, editMode is false, so no buttons
        expect(screen.queryByTestId('icon-action-search')).not.toBeInTheDocument();

        // Change the mock to simulate context update
        mockContext.editMode = true;

        // Re-render with new context value
        rerender(<Menus />);

        // Now buttons should be visible
        expect(screen.getByTestId('icon-action-search')).toBeInTheDocument();
    });

    it('uses content from content.json for switch label', () => {
        render(<Menus />);

        const switchElement = screen.getByTestId('edit-mode-switch');
        expect(switchElement).toHaveAttribute('aria-label', 'Edit Mode');
    });
});
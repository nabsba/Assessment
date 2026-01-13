import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterAll } from "vitest";
import Menus from "./Menus";

// Mock IconAction
vi.mock("../../../shared/components/iconAction/IconAction", () => ({
    default: ({ icon, onClick, text, disabled }: any) => {
        let textContent = "";

        if (text && text.props && text.props.children) {
            const children = text.props.children;
            if (Array.isArray(children)) {
                textContent = children
                    .map((child: any) => {
                        if (typeof child === "string") return child;
                        if (child && child.props && child.props.children) return child.props.children;
                        return "";
                    })
                    .join("");
            } else if (typeof children === "string") {
                textContent = children;
            }
        } else if (typeof text === "string") {
            textContent = text;
        }

        return (
            <button
                onClick={onClick}
                disabled={disabled}
                data-testid={`icon-action-${icon}`}
                aria-label={icon}
            >
                {icon} {textContent && `(${textContent})`}
            </button>
        );
    },
}));

// Mock Switch (calls onChange with boolean)
vi.mock("../../../form/components/Switch", () => ({
    default: ({ checked, onChange, label, "data-testid": testId }: any) => (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange?.(!checked)}
            data-testid={testId || "switch"}
            aria-label={label}
        >
            {label} (checked: {checked.toString()})
        </button>
    ),
}));

// Mock FadeIn
vi.mock("../../../shared/components/animations/fadeIn/FadeAnimation", () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

// Mock content.json
vi.mock("../../data/content.json", () => ({
    default: {
        menu: {
            indiceSelection: "selection",
            indiceSelections: "selections",
            editModeLabel: "Edit Mode",
            selectAll: "Select All",
        },
    },
}));

// Mutable mock context
let mockEditMode = false;

const mockContext: any = {
    state: {
        selectedUsers: {},
        results: { "1": { id: "1", name: "test" } },   // ✅ map
        resultsOrder: ["1"],                            // ✅ order ids (needed for Switch render)
    },
    deleteUserSelection: vi.fn(),
    duplicateUserSelection: vi.fn(),
    editMode: mockEditMode,
    handleEditModeChange: vi.fn((newValue: boolean) => {
        mockEditMode = newValue;
        mockContext.editMode = newValue;
    }),
    toggleSelectAllUsers: vi.fn(),
};

vi.mock("../../hooks/GitHubContext", () => ({
    useSearchContext: vi.fn(() => mockContext),
}));

describe("Menus Component", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => { });

    beforeEach(() => {
        vi.clearAllMocks();
        mockEditMode = false;

        mockContext.state = {
            selectedUsers: {},
            results: { "1": { id: "1", name: "test" } },
            resultsOrder: ["1"],
        };
        mockContext.editMode = false;

        mockContext.handleEditModeChange.mockImplementation((newValue: boolean) => {
            mockEditMode = newValue;
            mockContext.editMode = newValue;
        });
    });

    afterAll(() => {
        consoleSpy.mockRestore();
    });

    it("renders the switch with correct label and checked state from context", () => {
        mockContext.editMode = true;

        render(<Menus />);

        const switchElement = screen.getByTestId("edit-mode-switch");
        expect(switchElement).toBeInTheDocument();
        expect(switchElement).toHaveAttribute("aria-label", "Edit Mode");
        expect(switchElement).toHaveAttribute("aria-checked", "true");
    });

    it("does not show action buttons when edit mode is off", () => {
        mockContext.editMode = false;

        render(<Menus />);

        expect(screen.queryByTestId("icon-action-stackIcon")).not.toBeInTheDocument();
        expect(screen.queryByTestId("icon-action-stackIconEmpty")).not.toBeInTheDocument();
        expect(screen.queryByTestId("icon-action-duplicate")).not.toBeInTheDocument();
        expect(screen.queryByTestId("icon-action-bin")).not.toBeInTheDocument();
    });

    it("shows action buttons when edit mode is on (no selected users -> empty icon)", () => {
        mockContext.editMode = true;
        mockContext.state.selectedUsers = {};

        render(<Menus />);

        expect(screen.getByTestId("icon-action-stackIconEmpty")).toBeInTheDocument();
        expect(screen.getByTestId("icon-action-duplicate")).toBeInTheDocument();
        expect(screen.getByTestId("icon-action-bin")).toBeInTheDocument();
    });

    it("shows stackIcon when users are selected", () => {
        mockContext.editMode = true;
        mockContext.state.selectedUsers = { "1": true };

        render(<Menus />);

        expect(screen.getByTestId("icon-action-stackIcon")).toBeInTheDocument();
        expect(screen.queryByTestId("icon-action-stackIconEmpty")).not.toBeInTheDocument();
    });

    it("calls handleEditModeChange when switch is clicked", () => {
        mockContext.editMode = false;

        render(<Menus />);

        const switchButton = screen.getByTestId("edit-mode-switch");
        fireEvent.click(switchButton);

        expect(mockContext.handleEditModeChange).toHaveBeenCalledTimes(1);
        expect(mockContext.handleEditModeChange).toHaveBeenCalledWith(true);
    });

    it("calls toggleSelectAllUsers when select all icon is clicked", () => {
        mockContext.editMode = true;
        mockContext.state.selectedUsers = {};

        render(<Menus />);

        const selectAllButton = screen.getByTestId("icon-action-stackIconEmpty");
        fireEvent.click(selectAllButton);

        expect(mockContext.toggleSelectAllUsers).toHaveBeenCalledTimes(1);
        // When none selected, hasSelectedUsers=false => toggleSelectAllUsers(true)
        expect(mockContext.toggleSelectAllUsers).toHaveBeenCalledWith(true);
    });

    it("calls duplicateUserSelection when duplicate icon is clicked with users selected", () => {
        mockContext.editMode = true;
        mockContext.state.selectedUsers = { "1": true };

        render(<Menus />);

        const duplicateButton = screen.getByTestId("icon-action-duplicate");
        expect(duplicateButton).not.toBeDisabled();

        fireEvent.click(duplicateButton);
        expect(mockContext.duplicateUserSelection).toHaveBeenCalledTimes(1);
    });

    it("disables duplicate and bin buttons when no users are selected", () => {
        mockContext.editMode = true;
        mockContext.state.selectedUsers = {};

        render(<Menus />);

        const duplicateButton = screen.getByTestId("icon-action-duplicate");
        const binButton = screen.getByTestId("icon-action-bin");

        expect(duplicateButton).toBeDisabled();
        expect(binButton).toBeDisabled();
    });

    it("calls deleteUserSelection when bin icon is clicked with users selected", () => {
        mockContext.editMode = true;
        mockContext.state.selectedUsers = { "1": true };

        render(<Menus />);

        const binButton = screen.getByTestId("icon-action-bin");
        fireEvent.click(binButton);

        expect(mockContext.deleteUserSelection).toHaveBeenCalledTimes(1);
    });

    it("re-renders when editMode changes", () => {
        const { rerender } = render(<Menus />);

        expect(screen.queryByTestId("icon-action-duplicate")).not.toBeInTheDocument();

        mockContext.editMode = true;
        rerender(<Menus />);

        expect(screen.getByTestId("icon-action-duplicate")).toBeInTheDocument();
    });

    it("uses content from content.json for switch label", () => {
        render(<Menus />);

        const switchElement = screen.getByTestId("edit-mode-switch");
        expect(switchElement).toHaveAttribute("aria-label", "Edit Mode");
        expect(switchElement.textContent).toContain("Edit Mode");
    });

    it("does not render switch when resultsOrder is empty", () => {
        mockContext.state.resultsOrder = [];

        render(<Menus />);

        expect(screen.queryByTestId("edit-mode-switch")).not.toBeInTheDocument();
    });
});

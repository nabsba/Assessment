import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Menus from "./Menus";

// --------------------
// Mocks
// --------------------

// IconAction -> simple button with testid based on icon
vi.mock("../../../shared/components/iconAction/IconAction", () => ({
    default: ({ icon, onClick, text, disabled }: any) => {
        // make text readable for assertions (optional)
        let textContent = "";
        if (typeof text === "string") textContent = text;
        else if (text?.props?.children) {
            const children = text.props.children;
            if (Array.isArray(children)) {
                textContent = children
                    .map((c: any) => (typeof c === "string" ? c : c?.props?.children ?? ""))
                    .join("");
            } else {
                textContent = typeof children === "string" ? children : children?.props?.children ?? "";
            }
        }

        return (
            <button
                type="button"
                onClick={onClick}
                disabled={disabled}
                data-testid={`icon-action-${icon}`}
                aria-label={icon}
            >
                {icon} {textContent ? `(${textContent})` : ""}
            </button>
        );
    },
}));

// Switch -> button that toggles onChange(!checked)
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
            {label} (checked: {String(checked)})
        </button>
    ),
}));

// FadeIn -> pass-through wrapper
vi.mock("../../../shared/components/animations/fadeIn/FadeAnimation", () => ({
    default: ({ children }: any) => <div data-testid="fadein">{children}</div>,
}));

// CSS module
vi.mock("./menu.module.css", () => ({
    default: { wrapper_icons_right: "wrapper_icons_right" },
}));

// content.json
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

// --------------------
// Context mocks
// --------------------

const mockSearchContext: any = {
    state: {
        selectedUsers: {},
        resultsOrder: ["1"],
    },
    deleteUserSelection: vi.fn(),
    duplicateUserSelection: vi.fn(),
    toggleSelectAllUsers: vi.fn(),
};

vi.mock("../../hooks/GitHubContext", () => ({
    useSearchContext: vi.fn(() => mockSearchContext),
}));

let mockEditMode = false;
const toggleEditModeMock = vi.fn((next?: boolean) => {
    // Switch calls onChange(!checked) so it will pass a boolean.
    // But we support both patterns: toggleEditMode() or toggleEditMode(boolean)
    if (typeof next === "boolean") mockEditMode = next;
    else mockEditMode = !mockEditMode;
});

vi.mock("../../hooks/EditContext", () => ({
    useEditModeContext: vi.fn(() => ({
        editMode: mockEditMode,
        toggleEditMode: toggleEditModeMock,
    })),
}));

// --------------------
// Tests
// --------------------

describe("Menus", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockEditMode = false;

        mockSearchContext.state = {
            selectedUsers: {},
            resultsOrder: ["1"],
        };
    });



    it("switch has correct label and reflects editMode in aria-checked", () => {
        mockEditMode = true;
        render(<Menus />);

        const sw = screen.getByTestId("edit-mode-switch");
        expect(sw).toHaveAttribute("aria-label", "Edit Mode");
        expect(sw).toHaveAttribute("aria-checked", "true");
    });

    it("does not show action buttons when editMode is false", () => {
        mockEditMode = false;
        render(<Menus />);

        expect(screen.queryByTestId("icon-action-stackIcon")).not.toBeInTheDocument();
        expect(screen.queryByTestId("icon-action-stackIconEmpty")).not.toBeInTheDocument();
        expect(screen.queryByTestId("icon-action-duplicate")).not.toBeInTheDocument();
        expect(screen.queryByTestId("icon-action-bin")).not.toBeInTheDocument();
    });

    it("shows actions when editMode is true and no users selected (stackIconEmpty)", () => {
        mockEditMode = true;
        mockSearchContext.state.selectedUsers = {};

        render(<Menus />);

        expect(screen.getByTestId("fadein")).toBeInTheDocument();
        expect(screen.getByTestId("icon-action-stackIconEmpty")).toBeInTheDocument();
        expect(screen.getByTestId("icon-action-duplicate")).toBeInTheDocument();
        expect(screen.getByTestId("icon-action-bin")).toBeInTheDocument();
    });

    it("shows stackIcon when at least one user is selected", () => {
        mockEditMode = true;
        mockSearchContext.state.selectedUsers = { "1": true };

        render(<Menus />);

        expect(screen.getByTestId("icon-action-stackIcon")).toBeInTheDocument();
        expect(screen.queryByTestId("icon-action-stackIconEmpty")).not.toBeInTheDocument();
    });

    it("disables duplicate and bin when no users are selected", () => {
        mockEditMode = true;
        mockSearchContext.state.selectedUsers = {};

        render(<Menus />);

        expect(screen.getByTestId("icon-action-duplicate")).toBeDisabled();
        expect(screen.getByTestId("icon-action-bin")).toBeDisabled();
    });

    it("enables duplicate and bin when users are selected", () => {
        mockEditMode = true;
        mockSearchContext.state.selectedUsers = { "1": true };

        render(<Menus />);

        expect(screen.getByTestId("icon-action-duplicate")).not.toBeDisabled();
        expect(screen.getByTestId("icon-action-bin")).not.toBeDisabled();
    });

    it("calls toggleEditMode when switch is clicked", () => {
        mockEditMode = false;
        render(<Menus />);

        fireEvent.click(screen.getByTestId("edit-mode-switch"));

        expect(toggleEditModeMock).toHaveBeenCalledTimes(1);
        // Switch mock calls onChange(!checked) => true
        expect(toggleEditModeMock).toHaveBeenCalledWith(true);
    });

    it("calls toggleSelectAllUsers(true) when none selected and stackIconEmpty clicked", () => {
        mockEditMode = true;
        mockSearchContext.state.selectedUsers = {};

        render(<Menus />);

        fireEvent.click(screen.getByTestId("icon-action-stackIconEmpty"));
        expect(mockSearchContext.toggleSelectAllUsers).toHaveBeenCalledTimes(1);
        expect(mockSearchContext.toggleSelectAllUsers).toHaveBeenCalledWith(true);
    });

    it("calls toggleSelectAllUsers(false) when some selected and stackIcon clicked", () => {
        mockEditMode = true;
        mockSearchContext.state.selectedUsers = { "1": true };

        render(<Menus />);

        fireEvent.click(screen.getByTestId("icon-action-stackIcon"));
        expect(mockSearchContext.toggleSelectAllUsers).toHaveBeenCalledTimes(1);
        expect(mockSearchContext.toggleSelectAllUsers).toHaveBeenCalledWith(false);
    });

    it("calls duplicateUserSelection when duplicate clicked (selected users)", () => {
        mockEditMode = true;
        mockSearchContext.state.selectedUsers = { "1": true };

        render(<Menus />);

        fireEvent.click(screen.getByTestId("icon-action-duplicate"));
        expect(mockSearchContext.duplicateUserSelection).toHaveBeenCalledTimes(1);
    });

    it("calls deleteUserSelection when bin clicked (selected users)", () => {
        mockEditMode = true;
        mockSearchContext.state.selectedUsers = { "1": true };

        render(<Menus />);

        fireEvent.click(screen.getByTestId("icon-action-bin"));
        expect(mockSearchContext.deleteUserSelection).toHaveBeenCalledTimes(1);
    });

    it("renders selection count text (1 selection / 2 selections)", () => {
        mockEditMode = true;

        mockSearchContext.state.selectedUsers = { "1": true };
        const { rerender } = render(<Menus />);
        // icon button includes text in parentheses from mock IconAction
        expect(screen.getByTestId("icon-action-stackIcon").textContent).toContain("(1 selection)");

        mockSearchContext.state.selectedUsers = { "1": true, "2": true };
        rerender(<Menus />);
        expect(screen.getByTestId("icon-action-stackIcon").textContent).toContain("(2 selections)");
    });

    it('renders "Select All" when none selected', () => {
        mockEditMode = true;
        mockSearchContext.state.selectedUsers = {};

        render(<Menus />);
        expect(screen.getByTestId("icon-action-stackIconEmpty").textContent).toContain("( Select All)");
    });
});

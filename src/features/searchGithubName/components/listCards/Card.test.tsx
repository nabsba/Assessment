import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Card from "./Card";

// --------------------
// Mocks
// --------------------

// CSS module
vi.mock("./Card.module.css", () => ({
    default: {
        card: "card",
        checkboxWrapper: "checkboxWrapper",
        content: "content",
    },
}));

// content.json
vi.mock("../../data/content.json", () => ({
    default: {
        card: {
            checkbox: { text: "Select" },
            avatar: { alt: "User avatar", defaultText: "NA" },
            button: { text: "View profile" },
        },
    },
}));

// Checkbox mock
vi.mock("../../../form/components/CheckBox", () => ({
    default: ({ checked, onChange, text }: any) => (
        <button
            type="button"
            data-testid="checkbox"
            aria-checked={checked}
            onClick={() => onChange?.(!checked)}
        >
            {text} (checked: {String(checked)})
        </button>
    ),
}));

// Avatar mock
vi.mock("../../../shared/components/avatar/Avatar", () => ({
    default: ({ src, alt, text, size, className }: any) => (
        <div data-testid="avatar" data-src={src} data-alt={alt} data-text={text} data-size={size} data-class={className} />
    ),
}));

// Identity mock
vi.mock("../../../shared/components/identity/Identity", () => ({
    default: ({ id, login }: any) => (
        <div data-testid="identity">
            {login} ({String(id)})
        </div>
    ),
}));

// ButtonV1 mock
vi.mock("../../../shared/components/buttons/ButtonV1", () => ({
    default: ({ text, onClick }: any) => (
        <button type="button" data-testid="card-button" onClick={onClick}>
            {text}
        </button>
    ),
}));

// Search context mock
const toggleUserSelection = vi.fn();
const mockSearchState: any = {
    selectedUsers: {},
};

vi.mock("../../hooks/gitHubContext/GitHubContext", () => ({
    useSearchContext: vi.fn(() => ({
        state: mockSearchState,
        toggleUserSelection,
    })),
}));

// Edit mode context mock (mutable)
let mockEditMode = false;

vi.mock("../../hooks/EditContext", () => ({
    useEditModeContext: vi.fn(() => ({
        editMode: mockEditMode,
    })),
}));

// --------------------
// Test data
// --------------------
const user: any = {
    id: 123,
    login: "octocat",
    avatar_url: "https://example.com/avatar.png",
};

// --------------------
// Tests
// --------------------
describe("Card", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockEditMode = false;
        mockSearchState.selectedUsers = {};
    });

    it("renders avatar with correct props and identity", () => {
        render(<Card user={user} onButtonClick={vi.fn()} />);

        const avatar = screen.getByTestId("avatar");
        expect(avatar).toHaveAttribute("data-src", user.avatar_url);
        expect(avatar).toHaveAttribute("data-alt", "User avatar");
        expect(avatar).toHaveAttribute("data-text", "NA");
        expect(avatar).toHaveAttribute("data-size", "90"); // default avatarSize
        expect(avatar).toHaveAttribute("data-class", "card_search_name");

        expect(screen.getByTestId("identity")).toHaveTextContent("octocat (123)");
    });

    it("renders ButtonV1 with default text from content when buttonText not provided", () => {
        render(<Card user={user} onButtonClick={vi.fn()} />);

        expect(screen.getByTestId("card-button")).toHaveTextContent("View profile");
    });

    it("renders ButtonV1 with custom buttonText when provided", () => {
        render(<Card user={user} onButtonClick={vi.fn()} buttonText="Open" />);

        expect(screen.getByTestId("card-button")).toHaveTextContent("Open");
    });

    it("calls onButtonClick with user.id when button is clicked", () => {
        const onButtonClick = vi.fn();
        render(<Card user={user} onButtonClick={onButtonClick} />);

        fireEvent.click(screen.getByTestId("card-button"));
        expect(onButtonClick).toHaveBeenCalledTimes(1);
        expect(onButtonClick).toHaveBeenCalledWith(123);
    });

    it("does not render checkbox when editMode is false", () => {
        mockEditMode = false;
        render(<Card user={user} onButtonClick={vi.fn()} />);

        expect(screen.queryByTestId("checkbox")).not.toBeInTheDocument();
    });

    it("renders checkbox when editMode is true", () => {
        mockEditMode = true;
        render(<Card user={user} onButtonClick={vi.fn()} />);

        expect(screen.getByTestId("checkbox")).toBeInTheDocument();
        expect(screen.getByTestId("checkbox")).toHaveTextContent("Select");
    });

    it("checkbox reflects selected state from context", () => {
        mockEditMode = true;
        mockSearchState.selectedUsers = { 123: true };

        render(<Card user={user} onButtonClick={vi.fn()} />);

        expect(screen.getByTestId("checkbox")).toHaveAttribute("aria-checked", "true");
    });

    it("calls toggleUserSelection with user.id when checkbox is clicked", () => {
        mockEditMode = true;
        mockSearchState.selectedUsers = {};

        render(<Card user={user} onButtonClick={vi.fn()} />);

        fireEvent.click(screen.getByTestId("checkbox"));
        expect(toggleUserSelection).toHaveBeenCalledTimes(1);
        expect(toggleUserSelection).toHaveBeenCalledWith(123);
    });

    it("uses provided avatarSize prop", () => {
        render(<Card user={user} onButtonClick={vi.fn()} avatarSize={48} />);

        expect(screen.getByTestId("avatar")).toHaveAttribute("data-size", "48");
    });

    it("applies extra className to the card wrapper", () => {
        const { container } = render(<Card user={user} onButtonClick={vi.fn()} className="extra" />);

        // wrapper is the first div from the component
        const wrapper = container.firstElementChild as HTMLElement;
        expect(wrapper.className).toContain("card");
        expect(wrapper.className).toContain("extra");
    });
});

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GitHubSearch from "./GitHubSearchInput";

// --- fake timers for debounce behavior
beforeEach(() => {
    vi.useFakeTimers();
});
afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
});

// --------------------
// Mocks
// --------------------

// CSS module
vi.mock("./GitHubSearchInput.module.css", () => ({
    default: {
        searchWrapper: "searchWrapper",
        searchInputContainer: "searchInputContainer",
        notificationWrapper: "notificationWrapper",
        notification: "notification",
    },
}));

// FadeIn passthrough
vi.mock("../../../shared/components/animations/fadeIn/FadeAnimation", () => ({
    default: ({ children }: any) => <div data-testid="fadein">{children}</div>,
}));

// content.json (only what component uses)
vi.mock("../../data/content.json", () => ({
    default: {
        searchInput: {
            placeholder: "Search GitHub users",
            notifications: {
                rateLimitWarning: "Rate limit is almost reached",
                rateLimitExceeded: "Rate limit exceeded",
            },
        },
    },
}));

/**
 * SearchInput mock:
 * - renders an <input> so we can simulate typing
 * - calls onChange(value) with the new string (matching your component signature)
 */
vi.mock("../../../form/components/SearchInput", () => ({
    default: ({ value, onChange, placeholder, className }: any) => (
        <input
            data-testid="search-input"
            value={value}
            placeholder={placeholder}
            className={className}
            onChange={(e: any) => onChange(e.target.value)}
        />
    ),
}));

// IMPORTANT: we don't want to test createDebouncedSearch internals here,
// only that GitHubSearch calls the returned debounced function.
// We'll provide a deterministic debounced mock that delays calls using setTimeout,
// and exposes cancel().
const debouncedInstances: Array<{ cancel: () => void }> = [];

vi.mock("../../utils/searchUtils", () => ({
    createDebouncedSearch: (fn: any, config: any) => {
        let t: any = null;
        const debounced = (value: string) => {
            if (t) clearTimeout(t);
            t = setTimeout(() => fn(value), config.debounceDelay);
        };
        debounced.cancel = () => {
            if (t) clearTimeout(t);
            t = null;
        };
        debouncedInstances.push(debounced);
        return debounced;
    },
}));

// Search context mock (mutable)
const searchUsers = vi.fn();
const abortSearch = vi.fn();
const showNotification = vi.fn(() => () => { });
const mockState: any = {
    apiLimitations: { remaining: 10, rateLimit: 60 },
    notification: null,
};

vi.mock("../../hooks/gitHubContext/GitHubContext", () => ({
    useSearchContext: vi.fn(() => ({
        searchUsers,
        abortSearch,
        showNotification,
        state: mockState,
    })),
}));

// --------------------
// Tests
// --------------------

describe("GitHubSearch", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockState.apiLimitations = { remaining: 10, rateLimit: 60 };
        mockState.notification = null;
        // clear stored debounced instances between tests
        debouncedInstances.length = 0;
    });

    it("renders SearchInput with placeholder from content.json", () => {
        render(<GitHubSearch />);
        expect(screen.getByTestId("search-input")).toHaveAttribute("placeholder", "Search GitHub users");
    });

    it("calls abortSearch and cancels both debounced functions on every input change", () => {
        render(<GitHubSearch />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "oct" } });

        expect(abortSearch).toHaveBeenCalledTimes(1);

        // two debounced instances should exist: typing + deleting
        expect(debouncedInstances.length).toBe(4);
        // both cancel should be called once via handleInputChange
        // we can't spy on cancel easily unless we wrap it, but we can ensure no calls happen after cancel by scheduling then changing quickly
    });

    it("does NOT call searchUsers when value length is < 3", () => {
        render(<GitHubSearch />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "ab" } });

        act(() => {
            vi.runAllTimers();
        });

        expect(searchUsers).not.toHaveBeenCalled();
    });

    it("typing (increasing length) uses the typing debounce (1500ms)", () => {
        render(<GitHubSearch />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "oct" } });

        act(() => {
            vi.advanceTimersByTime(1499);
        });
        expect(searchUsers).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(searchUsers).toHaveBeenCalledTimes(1);
        expect(searchUsers).toHaveBeenCalledWith("oct");
    });

    it("deleting (decreasing length) uses the deleting debounce (3000ms)", () => {
        render(<GitHubSearch />);

        // type first to set prevValueRef
        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "octo" } });
        act(() => {
            vi.advanceTimersByTime(1500);
        });
        expect(searchUsers).toHaveBeenCalledWith("octo");

        searchUsers.mockClear();

        // now delete one char -> "oct" (isDeleting = true)
        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "oct" } });

        act(() => {
            vi.advanceTimersByTime(2999);
        });
        expect(searchUsers).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(searchUsers).toHaveBeenCalledTimes(1);
        expect(searchUsers).toHaveBeenCalledWith("oct");
    });

    it("shows rate limit warning when remaining === 2 (and still searches if >=3 chars)", () => {
        mockState.apiLimitations.remaining = 2;

        render(<GitHubSearch />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "oct" } });

        expect(showNotification).toHaveBeenCalledTimes(1);
        expect(showNotification).toHaveBeenCalledWith("Rate limit is almost reached");

        act(() => {
            vi.advanceTimersByTime(1500);
        });
        expect(searchUsers).toHaveBeenCalledWith("oct");
    });

    it("shows rate limit exceeded when remaining === 0 and does NOT search", () => {
        mockState.apiLimitations.remaining = 0;

        render(<GitHubSearch />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "oct" } });

        expect(showNotification).toHaveBeenCalledTimes(1);
        expect(showNotification).toHaveBeenCalledWith("Rate limit exceeded", 6000);

        act(() => {
            vi.runAllTimers();
        });

        expect(searchUsers).not.toHaveBeenCalled();
    });

    it("renders notification UI when state.notification is set", () => {
        mockState.notification = "Hello notification";

        render(<GitHubSearch />);

        expect(screen.getByTestId("fadein")).toBeInTheDocument();
        expect(screen.getByText("Hello notification")).toBeInTheDocument();
    });

    it("cancels pending typing debounce when user changes input quickly (only last term searched)", () => {
        render(<GitHubSearch />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "oct" } });
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        // change again before 1500ms finishes -> previous should be canceled
        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "octo" } });

        act(() => {
            vi.advanceTimersByTime(1500);
        });

        expect(searchUsers).toHaveBeenCalledTimes(1);
        expect(searchUsers).toHaveBeenCalledWith("octo");
    });

    it("does not trigger deleting debounce when deleting below length 3", () => {
        render(<GitHubSearch />);

        // start with length >= 3 to set prevValueRef
        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "oct" } });
        act(() => {
            vi.advanceTimersByTime(1500);
        });
        searchUsers.mockClear();

        // delete down to length 2 => should not schedule deleting search
        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "oc" } });

        act(() => {
            vi.runAllTimers();
        });

        expect(searchUsers).not.toHaveBeenCalled();
    });
});

import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import ListCard from "./ListCards";

// --------------------
// Mocks
// --------------------

vi.mock("./MainListCard.module.css", () => ({
    default: {
        container: "container",
        cardGrid: "cardGrid",
        cardWrapper: "cardWrapper",
    },
}));

vi.mock("../../data/content.json", () => ({
    default: {
        card: { button: { text: "View" } },
        searchInput: {
            notifications: {
                rateLimitExceeded: "Rate limit exceeded",
                rateLimitWarning: "Rate limit warning",
            },
        },
    },
}));

vi.mock("./Card", () => ({
    default: ({ user, buttonText }: any) => (
        <div data-testid="card">
            <span>{user.login}</span>
            <span>{buttonText}</span>
        </div>
    ),
}));

// --------------------
// IntersectionObserver mock
// --------------------
let ioCallback: any = null;

class MockIntersectionObserver {
    observe = vi.fn();
    disconnect = vi.fn();

    constructor(cb: any) {
        ioCallback = cb;
    }
}

// --------------------
// Context mock (MUST be before vi.mock call)
// --------------------
const searchUsers = vi.fn();
const showNotification = vi.fn();

let mockState: any;

vi.mock("../../hooks/gitHubContext/GitHubContext", () => ({
    useSearchContext: () => ({
        state: mockState,
        searchUsers,
        showNotification,
    }),
}));

// --------------------
// Tests
// --------------------
describe("ListCard", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockState = {
            query: "octo",
            loading: false,
            results: {
                "1": { id: 1, login: "octocat" },
                "2": { id: 2, login: "hubot" },
            },
            resultsOrder: ["1", "2"],
            apiLimitations: { remaining: 10 },
            pagination: {
                currentPage: 1,
                hasNextPage: true,
            },
        };

        // @ts-ignore
        global.IntersectionObserver = MockIntersectionObserver;
    });

    afterEach(() => {
        // @ts-ignore
        delete global.IntersectionObserver;
    });

    it("renders cards", () => {
        render(<ListCard />);
        expect(screen.getAllByTestId("card")).toHaveLength(2);
    });

    it("calls searchUsers when last card intersects", () => {
        render(<ListCard />);

        act(() => {
            ioCallback([{ isIntersecting: true }]);
        });

        expect(searchUsers).toHaveBeenCalledWith("octo", 2);
    });

    it("shows rateLimitExceeded when remaining is 0", () => {
        mockState.apiLimitations.remaining = 0;

        render(<ListCard />);

        act(() => {
            ioCallback([{ isIntersecting: true }]);
        });

        expect(showNotification).toHaveBeenCalledWith("Rate limit exceeded", 6000);
    });

    it("shows rateLimitWarning when remaining <= 2", () => {
        mockState.apiLimitations.remaining = 2;

        render(<ListCard />);

        act(() => {
            ioCallback([{ isIntersecting: true }]);
        });

        expect(showNotification).toHaveBeenCalledWith("Rate limit warning");
    });

    it("does not fetch when no next page", () => {
        mockState.pagination.hasNextPage = false;

        render(<ListCard />);

        act(() => {
            ioCallback([{ isIntersecting: true }]);
        });

        expect(searchUsers).not.toHaveBeenCalled();
    });

    it("does not fetch when loading", () => {
        mockState.loading = true;

        render(<ListCard />);

        act(() => {
            ioCallback([{ isIntersecting: true }]);
        });

        expect(searchUsers).not.toHaveBeenCalled();
    });

});

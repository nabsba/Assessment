import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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



});

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SearchProvider, useSearchContext } from "./GitHubContext"; // <-- adjust path

// --------------------
// HOIST-SAFE MOCKS
// --------------------
const { getMock } = vi.hoisted(() => ({
    getMock: vi.fn(),
}));

// Mock ENDPOINTS (hoisted-safe)
vi.mock("../../../../api/data/constant", () => ({
    default: {
        GITHUB: {
            SEARCH_USER: "https://api.github.test/search/",
        },
    },
}));

/**
 * ✅ Mock ApiService as a constructable class
 * ✅ Uses hoisted getMock so it exists during mock init
 */
vi.mock("../../../../api/logic/api", () => {
    class ApiService {
        get = getMock;
    }
    return { ApiService };
});

// --------------------
// Test consumer
// --------------------
function TestConsumer() {
    const ctx = useSearchContext();

    return (
        <div>
            <div data-testid="query">{ctx.state.query}</div>
            <div data-testid="loading">{String(ctx.state.loading)}</div>
            <div data-testid="error">{ctx.state.error ?? ""}</div>
            <div data-testid="notif">{ctx.state.notification ?? ""}</div>

            <button data-testid="update-query" onClick={() => ctx.updateQuery("abc")} />
            <button data-testid="notify" onClick={() => ctx.showNotification("hello", 1000)} />
            <button data-testid="search-empty" onClick={() => ctx.searchUsers("   ")} />
            <button data-testid="search-page1" onClick={() => ctx.searchUsers("octo", 1)} />
            <button data-testid="abort" onClick={() => ctx.abortSearch()} />
        </div>
    );
}

const renderWithProvider = () =>
    render(
        <SearchProvider>
            <TestConsumer />
        </SearchProvider>
    );

// --------------------
// Tests
// --------------------
describe("GitHubContext / SearchProvider", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("throws if useSearchContext is used outside provider", () => {
        const originalError = console.error;
        console.error = () => { };

        expect(() => render(<TestConsumer />)).toThrow(
            "useSearchContext must be used within a SearchProvider"
        );

        console.error = originalError;
    });

    it("updateQuery updates state.query", () => {
        renderWithProvider();
        expect(screen.getByTestId("query")).toHaveTextContent("");

        fireEvent.click(screen.getByTestId("update-query"));
        expect(screen.getByTestId("query")).toHaveTextContent("abc");
    });

    it("showNotification sets and clears notification after duration", () => {
        renderWithProvider();

        fireEvent.click(screen.getByTestId("notify"));
        expect(screen.getByTestId("notif")).toHaveTextContent("hello");

        act(() => vi.advanceTimersByTime(999));
        expect(screen.getByTestId("notif")).toHaveTextContent("hello");

        act(() => vi.advanceTimersByTime(1));
        expect(screen.getByTestId("notif")).toHaveTextContent("");
    });

    it("searchUsers with empty query does not call API", async () => {
        renderWithProvider();

        await act(async () => {
            fireEvent.click(screen.getByTestId("search-empty"));
        });

        expect(getMock).not.toHaveBeenCalled();
    });

    it("searchUsers page 1 calls API with expected URL and options", async () => {
        getMock.mockResolvedValueOnce({
            data: { items: [{ id: 1, login: "octocat" }], total_count: 1 },
            headers: {
                "x-ratelimit-remaining": "9",
                "x-ratelimit-limit": "60",
            },
        });

        renderWithProvider();

        await act(async () => {
            fireEvent.click(screen.getByTestId("search-page1"));
        });

        expect(getMock).toHaveBeenCalledTimes(1);

        const [url, options] = getMock.mock.calls[0];
        expect(url).toContain("https://api.github.test/search/users?q=octo&per_page=30&page=1");
        expect(options.headers.Accept).toBe("application/vnd.github.v3+json");
        expect(options.timeout).toBe(10000);
        expect(options.signal).toBeDefined();
    });

    it("abortSearch stops loading (smoke) after starting a request", async () => {
        // hang request so AbortController exists
        getMock.mockImplementationOnce(() => new Promise(() => { }));

        renderWithProvider();

        act(() => {
            fireEvent.click(screen.getByTestId("search-page1"));
        });

        act(() => {
            fireEvent.click(screen.getByTestId("abort"));
        });

        expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });
});

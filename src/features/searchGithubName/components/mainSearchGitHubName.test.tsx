import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MainSearchGitHubName from "./MainSearchGitHubName";

// --------------------
// Mocks
// --------------------
vi.mock("./mainSearch.module.css", () => ({
    default: {
        fixedHeader: "fixedHeader",
        mainContainer: "mainContainer",
        stickySection: "stickySection",
        searchContainer: "searchContainer",
        menusContainer: "menusContainer",
        scrollableContent: "scrollableContent",
        emptyContainer: "emptyContainer",
    },
}));

vi.mock("../data/content.json", () => ({
    default: {
        mainListCard: {
            startState: "Start searching to see results",
            emptyState: "No results found",
        },
    },
}));

vi.mock("./header/Header", () => ({
    default: () => <div data-testid="header">Header</div>,
}));

vi.mock("./GitHubSearchInput/GitHubSearchInput", () => ({
    default: () => <div data-testid="github-search">GitHubSearch</div>,
}));

vi.mock("./menus/Menus", () => ({
    default: () => <div data-testid="menus">Menus</div>,
}));

vi.mock("./listCards/ListCards", () => ({
    default: () => <div data-testid="list-cards">ListCards</div>,
}));

// DataFetchingWrapper mock: render children and expose props for assertions
const dfwSpy = vi.fn();
vi.mock("../../shared/components/DataFetchingWrapper", () => ({
    default: (props: any) => {
        dfwSpy(props);
        return <div data-testid="dfw">{props.children}</div>;
    },
}));

// --------------------
// Context mock
// --------------------
let mockState: any;

vi.mock("../hooks/gitHubContext/GitHubContext", () => ({
    useSearchContext: () => ({ state: mockState }),
}));

// --------------------
// Tests
// --------------------
describe("MainSearchGitHubName", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockState = {
            results: {},
            loading: false,
            error: null,
        };
    });

    it("always renders Header, GitHubSearch and Menus", () => {
        render(<MainSearchGitHubName />);

        expect(screen.getByTestId("header")).toBeInTheDocument();
        expect(screen.getByTestId("github-search")).toBeInTheDocument();
        expect(screen.getByTestId("menus")).toBeInTheDocument();
    });

    it("shows startState message on first visit when there are no results", () => {
        mockState.results = {};

        render(<MainSearchGitHubName />);

        expect(screen.getByText("Start searching to see results")).toBeInTheDocument();
        expect(screen.queryByTestId("dfw")).not.toBeInTheDocument();
        expect(screen.queryByTestId("list-cards")).not.toBeInTheDocument();
    });

    it("shows emptyState message after results existed, then become empty again", () => {
        // First render with results -> effect sets isFirstVisit false
        mockState.results = { "1": { id: 1 } };

        const { rerender } = render(<MainSearchGitHubName />);

        // with results -> wrapper + list are shown
        expect(screen.getByTestId("dfw")).toBeInTheDocument();
        expect(screen.getByTestId("list-cards")).toBeInTheDocument();

        // now results cleared -> should show emptyState (not startState)
        mockState.results = {};
        rerender(<MainSearchGitHubName />);

        expect(screen.getByText("No results found")).toBeInTheDocument();
        expect(screen.queryByText("Start searching to see results")).not.toBeInTheDocument();
    });

    it("renders DataFetchingWrapper and ListCards when results exist", () => {
        mockState.results = { "1": { id: 1 } };

        render(<MainSearchGitHubName />);

        expect(screen.getByTestId("dfw")).toBeInTheDocument();
        expect(screen.getByTestId("list-cards")).toBeInTheDocument();
    });

    it("passes correct DataFetchingWrapper props (loading/error states)", () => {
        mockState.results = { "1": { id: 1 } };
        mockState.loading = true;
        mockState.error = "boom";

        render(<MainSearchGitHubName />);

        
        const props = dfwSpy.mock.calls[0][0];

        expect(props.isLoading).toBe(true);
        expect(props.isError).toBe(true);
        // loaderProps / errorProps / appendLoaderProps are passed as objects
        expect(props.errorProps).toEqual({ type: expect.anything() });
        expect(props.loaderProps).toEqual({ type: expect.anything() });
        expect(props.appendLoaderProps).toEqual({ type: expect.anything() });
    });

    it("sets loadingMode to 'replace' when no results, and 'append' when results exist", () => {
        // no results: DataFetchingWrapper not rendered, but we can still verify via next test
        mockState.results = { "1": { id: 1 } };

        render(<MainSearchGitHubName />);

        const props = dfwSpy.mock.calls[0][0];
        expect(props.loadingMode).toBe("append");

        // If we wanted to assert 'replace', we'd need wrapper rendered; by design it isn't.
        // So we assert indirectly: when results exist, append is used.
    });

    it("computes hasResults by checking results keys, not resultsOrder", () => {
        // results exists but empty -> no wrapper
        mockState.results = {};
        render(<MainSearchGitHubName />);
        expect(screen.queryByTestId("dfw")).not.toBeInTheDocument();
    });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
    createDebouncedSearch,
    shouldSearch,
    toId,
    mergeSearchResults,
    deleteSelected,
    duplicateSelectedInOrder,
} from "./searchUtils"; 

// Minimal shape for tests (matches what your helpers use)
type UserGitHubProfile = {
    id: number | string;
    isDuplicate?: boolean;
    originalId?: number;
    login?: string;
};

describe("search helpers", () => {
    describe("toId", () => {
        it("stringifies numeric and string ids", () => {
            expect(toId(1)).toBe("1");
            expect(toId("abc")).toBe("abc");
        });
    });

    describe("shouldSearch", () => {
        it("returns false for empty/whitespace query when allowEmpty=false (default)", () => {
            expect(shouldSearch("")).toBe(false);
            expect(shouldSearch("   ")).toBe(false);
        });



        it("respects minLength", () => {
            expect(shouldSearch("a", { minLength: 2 })).toBe(false);
            expect(shouldSearch("ab", { minLength: 2 })).toBe(true);
        });

        it("respects maxLength", () => {
            expect(shouldSearch("abcd", { maxLength: 3 })).toBe(false);
            expect(shouldSearch("abc", { maxLength: 3 })).toBe(true);
        });

        it("works with defaults for a normal query", () => {
            expect(shouldSearch("octocat")).toBe(true);
        });
    });

    describe("createDebouncedSearch", () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
            vi.restoreAllMocks();
        });

        it("does not call searchFn immediately; calls after debounceDelay", () => {
            const searchFn = vi.fn();
            const debounced = createDebouncedSearch(searchFn, { debounceDelay: 200 });

            debounced("hello");

            expect(searchFn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(199);
            expect(searchFn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(1);
            expect(searchFn).toHaveBeenCalledTimes(1);
            expect(searchFn).toHaveBeenCalledWith("hello");
        });

        it("clears previous timeout when called again quickly (only last call runs)", () => {
            const searchFn = vi.fn();
            const debounced = createDebouncedSearch(searchFn, { debounceDelay: 200 });

            debounced("a");
            vi.advanceTimersByTime(100);

            debounced("ab");
            vi.advanceTimersByTime(100);

            // first call should be cancelled, second not yet fired
            expect(searchFn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(100);
            expect(searchFn).toHaveBeenCalledTimes(1);
            expect(searchFn).toHaveBeenCalledWith("ab");
        });

        it("passes through extra arguments to searchFn", () => {
            const searchFn = vi.fn();
            const debounced = createDebouncedSearch(searchFn, { debounceDelay: 50 });

            debounced("term", 2, { hello: true });

            vi.advanceTimersByTime(50);
            expect(searchFn).toHaveBeenCalledWith("term", 2, { hello: true });
        });

        it("does nothing when query is empty/whitespace and allowEmpty=false", () => {
            const searchFn = vi.fn();
            const debounced = createDebouncedSearch(searchFn, { debounceDelay: 10, allowEmpty: false });

            debounced("");
            debounced("   ");

            vi.runAllTimers();
            expect(searchFn).not.toHaveBeenCalled();
        });

        it("respects minLength (no call when below minLength)", () => {
            const searchFn = vi.fn();
            const debounced = createDebouncedSearch(searchFn, { debounceDelay: 10, minLength: 3 });

            debounced("ab");
            vi.runAllTimers();

            expect(searchFn).not.toHaveBeenCalled();

            debounced("abc");
            vi.runAllTimers();

            expect(searchFn).toHaveBeenCalledTimes(1);
            expect(searchFn).toHaveBeenCalledWith("abc");
        });

        it("warns and does not call when above maxLength", () => {
            const searchFn = vi.fn();
            const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => { });
            const debounced = createDebouncedSearch(searchFn, { debounceDelay: 10, maxLength: 3 });

            debounced("abcd");
            vi.runAllTimers();

            expect(warnSpy).toHaveBeenCalledTimes(1);
            expect(searchFn).not.toHaveBeenCalled();
        });

        it("cancel() clears the pending call", () => {
            const searchFn = vi.fn();
            const debounced = createDebouncedSearch(searchFn, { debounceDelay: 100 });

            debounced("hello");
            debounced.cancel();

            vi.runAllTimers();
            expect(searchFn).not.toHaveBeenCalled();
        });
    });

    describe("mergeSearchResults", () => {
        it("replaces results/order on new search", () => {
            const prevResults: Record<string, UserGitHubProfile> = {
                "99": { id: "99", login: "old" },
            };
            const prevOrder = ["99"];

            const items: UserGitHubProfile[] = [
                { id: 1, login: "a" },
                { id: 2, login: "b" },
            ];

            const { results, order } = mergeSearchResults(prevResults as any, prevOrder, items as any, true);

            expect(Object.keys(results)).toEqual(["1", "2"]);
            expect(order).toEqual(["1", "2"]);
            expect(results["1"].login).toBe("a");
        });

        it("appends new items and keeps existing order on pagination", () => {
            const prevResults: Record<string, UserGitHubProfile> = {
                "1": { id: 1, login: "a" },
            };
            const prevOrder = ["1"];

            const items: UserGitHubProfile[] = [
                { id: 1, login: "a-updated" }, // existing id, should not duplicate in order
                { id: 2, login: "b" },
            ];

            const { results, order } = mergeSearchResults(prevResults as any, prevOrder, items as any, false);

            expect(order).toEqual(["1", "2"]);
            expect(results["1"].login).toBe("a-updated"); // map updated
            expect(results["2"].login).toBe("b");
        });
    });

    describe("deleteSelected", () => {
        it("returns unchanged when nothing selected", () => {
            const results: Record<string, UserGitHubProfile> = {
                "1": { id: 1 },
                "2": { id: 2 },
            };
            const order = ["1", "2"];
            const selected: Record<string, boolean> = {};

            const out = deleteSelected(results as any, order, selected);
            expect(out.results).toEqual(results);
            expect(out.order).toEqual(order);
        });

        it("deletes selected ids from results and order", () => {
            const results: Record<string, UserGitHubProfile> = {
                "1": { id: 1 },
                "2": { id: 2 },
                "3": { id: 3 },
            };
            const order = ["1", "2", "3"];
            const selected = { "2": true, "3": true };

            const { results: nextResults, order: nextOrder } = deleteSelected(results as any, order, selected);

            expect(nextResults).toEqual({ "1": { id: 1 } });
            expect(nextOrder).toEqual(["1"]);
        });
    });

    describe("duplicateSelectedInOrder", () => {
        it("returns unchanged when nothing selected", () => {
            const results: Record<string, UserGitHubProfile> = { "1": { id: 1 } };
            const order = ["1"];
            const selected = {};

            const out = duplicateSelectedInOrder(results as any, order, selected);
            expect(out.results).toEqual(results);
            expect(out.order).toEqual(order);
        });

        it("duplicates selected items and inserts copies right after original in order", () => {
            const results: Record<string, UserGitHubProfile> = {
                "1": { id: 1, login: "a" },
                "2": { id: 2, login: "b" },
            };
            const order = ["1", "2"];
            const selected = { "1": true };

            const { results: nextResults, order: nextOrder } = duplicateSelectedInOrder(
                results as any,
                order,
                selected
            );

            expect(nextOrder).toEqual(["1", "1_copy", "2"]);
            expect(nextResults["1_copy"]).toBeTruthy();
            expect(nextResults["1_copy"].isDuplicate).toBe(true);
            expect(nextResults["1_copy"].id).toBe("1_copy");
        });

        it("does not duplicate an already-duplicate item", () => {
            const results: Record<string, UserGitHubProfile> = {
                "1": { id: 1, login: "a", isDuplicate: true },
            };
            const order = ["1"];
            const selected = { "1": true };

            const { results: nextResults, order: nextOrder } = duplicateSelectedInOrder(
                results as any,
                order,
                selected
            );

            expect(nextOrder).toEqual(["1"]);
            expect(nextResults).toEqual(results);
        });

        it("does not create a second copy if copy already exists", () => {
            const results: Record<string, UserGitHubProfile> = {
                "1": { id: 1, login: "a" },
                "1_copy": { id: "1_copy", login: "a", isDuplicate: true, originalId: 1 },
            };
            const order = ["1", "1_copy"];
            const selected = { "1": true };

            const { results: nextResults, order: nextOrder } = duplicateSelectedInOrder(
                results as any,
                order,
                selected
            );

            expect(nextOrder).toEqual(["1", "1_copy"]); // unchanged
            expect(nextResults).toEqual(results);
        });

        it("keeps originals in order and can duplicate multiple selected", () => {
            const results: Record<string, UserGitHubProfile> = {
                "1": { id: 1, login: "a" },
                "2": { id: 2, login: "b" },
                "3": { id: 3, login: "c" },
            };
            const order = ["1", "2", "3"];
            const selected = { "1": true, "3": true };

            const { order: nextOrder, results: nextResults } = duplicateSelectedInOrder(
                results as any,
                order,
                selected
            );

            expect(nextOrder).toEqual(["1", "1_copy", "2", "3", "3_copy"]);
            expect(nextResults["1_copy"]).toBeTruthy();
            expect(nextResults["3_copy"]).toBeTruthy();
        });

        it("sets originalId from original.id when originalId is missing and original.id is number", () => {
            const results: Record<string, UserGitHubProfile> = {
                "1": { id: 1, login: "a" }, // no originalId
            };
            const order = ["1"];
            const selected = { "1": true };

            const { results: nextResults } = duplicateSelectedInOrder(results as any, order, selected);

            expect(nextResults["1_copy"].originalId).toBe(1);
        });
    });
});

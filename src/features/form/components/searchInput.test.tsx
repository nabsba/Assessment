import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SearchInput from "./SearchInput";

// Mock CSS module
vi.mock("./SearchInput.module.css", () => ({
    default: {
        customClass: "customClass",
    },
}));

describe("SearchInput", () => {
    it("renders with default placeholder and aria-label", () => {
        render(<SearchInput value="" onChange={vi.fn()} />);

        const input = screen.getByTestId("search-input");
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute("placeholder", "Search...");
        expect(input).toHaveAttribute("aria-label", "Search...");
    });

    it("renders with custom placeholder and aria-label", () => {
        render(<SearchInput value="" onChange={vi.fn()} placeholder="GitHub user" ariaLabel="Search user" />);

        const input = screen.getByTestId("search-input");
        expect(input).toHaveAttribute("placeholder", "GitHub user");
        expect(input).toHaveAttribute("aria-label", "Search user");
    });

    it("calls onChange with input value when typing", () => {
        const onChange = vi.fn();
        render(<SearchInput value="" onChange={onChange} />);

        const input = screen.getByTestId("search-input");
        fireEvent.change(input, { target: { value: "octocat" } });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith("octocat");
    });

    it("applies disabled attribute", () => {
        render(<SearchInput value="" onChange={vi.fn()} disabled />);

        const input = screen.getByTestId("search-input");
        expect(input).toBeDisabled();
    });

    it("applies type, id, and name props", () => {
        render(
            <SearchInput
                value=""
                onChange={vi.fn()}
                type="search"
                id="github-search"
                name="github"
            />
        );

        const input = screen.getByTestId("search-input");
        expect(input).toHaveAttribute("type", "search");
        expect(input).toHaveAttribute("id", "github-search");
        expect(input).toHaveAttribute("name", "github");
    });

    it("applies maxLength and minLength", () => {
        render(<SearchInput value="" onChange={vi.fn()} maxLength={10} minLength={3} />);

        const input = screen.getByTestId("search-input");
        expect(input).toHaveAttribute("maxLength", "10");
        expect(input).toHaveAttribute("minLength", "3");
    });

    it("applies autoFocus", () => {
        render(<SearchInput value="" onChange={vi.fn()} autoFocus />);

        const input = screen.getByTestId("search-input");
        expect(input).toHaveFocus();
    });

    it("applies custom class from CSS module", () => {
        render(<SearchInput value="" onChange={vi.fn()} className="customClass" />);

        const input = screen.getByTestId("search-input");
        expect(input).toHaveClass("customClass");
    });

    it("uses default class when no className is provided", () => {
        render(<SearchInput value="" onChange={vi.fn()} />);

        const input = screen.getByTestId("search-input");
        expect(input).toHaveClass("search-input");
    });

    it("passes through focus, blur, keydown, and keyup handlers", () => {
        const onFocus = vi.fn();
        const onBlur = vi.fn();
        const onKeyDown = vi.fn();
        const onKeyUp = vi.fn();

        render(
            <SearchInput
                value=""
                onChange={vi.fn()}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
            />
        );

        const input = screen.getByTestId("search-input");

        fireEvent.focus(input);
        fireEvent.blur(input);
        fireEvent.keyDown(input, { key: "Enter" });
        fireEvent.keyUp(input, { key: "Enter" });

        expect(onFocus).toHaveBeenCalledTimes(1);
        expect(onBlur).toHaveBeenCalledTimes(1);
        expect(onKeyDown).toHaveBeenCalledTimes(1);
        expect(onKeyUp).toHaveBeenCalledTimes(1);
    });

    it("supports custom data-testid", () => {
        render(<SearchInput value="" onChange={vi.fn()} data-testid="my-input" />);

        expect(screen.getByTestId("my-input")).toBeInTheDocument();
    });

    it("applies inline styles", () => {
        render(
            <SearchInput
                value=""
                onChange={vi.fn()}
                style={{ backgroundColor: "red" }}
            />
        );

        const input = screen.getByTestId("search-input");
        expect(input).toHaveStyle({ backgroundColor: "red" });
    });
});

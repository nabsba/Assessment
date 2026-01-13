import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EditModeProvider, useEditModeContext } from "./EditContext";

// Small test component to read/use the context
function TestConsumer() {
    const { editMode, toggleEditMode, setEditMode } = useEditModeContext();

    return (
        <div>
            <div data-testid="value">{String(editMode)}</div>

            <button data-testid="toggle" onClick={toggleEditMode}>
                toggle
            </button>

            <button data-testid="set-true" onClick={() => setEditMode(true)}>
                set true
            </button>

            <button data-testid="set-false" onClick={() => setEditMode(false)}>
                set false
            </button>
        </div>
    );
}

describe("EditModeContext", () => {
    it("throws if useEditModeContext is used outside provider", () => {
        // Suppress React error boundary noise
        const originalError = console.error;
        console.error = () => { };

        expect(() => render(<TestConsumer />)).toThrow(
            "useEditModeContext must be used within an EditModeProvider"
        );

        console.error = originalError;
    });

    it("provides default editMode=false", () => {
        render(
            <EditModeProvider>
                <TestConsumer />
            </EditModeProvider>
        );

        expect(screen.getByTestId("value")).toHaveTextContent("false");
    });

    it("toggleEditMode flips editMode", () => {
        render(
            <EditModeProvider>
                <TestConsumer />
            </EditModeProvider>
        );

        fireEvent.click(screen.getByTestId("toggle"));
        expect(screen.getByTestId("value")).toHaveTextContent("true");

        fireEvent.click(screen.getByTestId("toggle"));
        expect(screen.getByTestId("value")).toHaveTextContent("false");
    });

    it("setEditMode(true/false) sets exact value", () => {
        render(
            <EditModeProvider>
                <TestConsumer />
            </EditModeProvider>
        );

        fireEvent.click(screen.getByTestId("set-true"));
        expect(screen.getByTestId("value")).toHaveTextContent("true");

        fireEvent.click(screen.getByTestId("set-false"));
        expect(screen.getByTestId("value")).toHaveTextContent("false");
    });
});

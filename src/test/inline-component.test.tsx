import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';


const InlineButton = () => {
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount(count + 1)}>
            Clicked {count} times
        </button>
    );
};

describe('Inline Component Test', () => {
    it('renders and interacts with inline component', async () => {
        const user = userEvent.setup();

        render(<InlineButton />);

        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('Clicked 0 times');

        await user.click(button);
        expect(button).toHaveTextContent('Clicked 1 times');

        await user.click(button);
        await user.click(button);
        expect(button).toHaveTextContent('Clicked 3 times');
    });
});
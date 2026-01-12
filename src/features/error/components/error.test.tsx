import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorComponent, { ErrorType } from './ErrorComponent';

// Mock the JSON import
vi.mock('../data/content.json', () => ({
    default: {  // <-- Add 'default' wrapper
        errors: {
            default: {
                title: 'Error',
                message: 'Something went wrong. Please try again.',
                buttonText: 'Try Again',
                icon: '❌'
            },
            '404': {
                title: 'Not Found',
                message: 'The requested resource was not found.',
                buttonText: 'Search Again',
                icon: '🔍'
            },
            network: {
                title: 'Network Error',
                message: 'Network error. Please check your connection.',
                buttonText: 'Retry Connection',
                icon: '📡'
            },
            '500': {
                title: 'Server Error',
                message: 'Server error. Please try again later.',
                buttonText: 'Retry',
                icon: '⚙️'
            },
            '401': {
                title: 'Access Denied',
                message: 'You are not authorized to access this resource.',
                buttonText: 'Login',
                icon: '🔒'
            },
            '403': {
                title: 'Forbidden',
                message: "You don't have permission to access this resource.",
                buttonText: 'Go Back',
                icon: '🚫'
            },
            '429': {
                title: 'Rate Limit Exceeded',
                message: 'Too many requests. Please wait and try again.',
                buttonText: 'Try Again Later',
                icon: '⏱️'
            },
            '400': {
                title: 'Validation Error',
                message: 'Please check your input and try again.',
                buttonText: 'Fix Input',
                icon: '✏️'
            },
            github_api: {
                title: 'GitHub API Error',
                message: 'Failed to fetch data from GitHub. The API might be down.',
                buttonText: 'Retry',
                icon: '🐙'
            }
        }
    }
}));

describe('ErrorComponent', () => {
    const onRetryMock = vi.fn();

    beforeEach(() => {
        onRetryMock.mockClear();
    });

    it('renders default error when no type specified', () => {
        render(<ErrorComponent />);

        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
    });

    it('renders 404 error when type is NOT_FOUND', () => {
        render(<ErrorComponent type={ ErrorType.NOT_FOUND } />);

        expect(screen.getByText('Not Found')).toBeInTheDocument();
        expect(screen.getByText('The requested resource was not found.')).toBeInTheDocument();
    });

    it('renders network error when type is NETWORK', () => {
        render(<ErrorComponent type={ ErrorType.NETWORK } />);

        expect(screen.getByText('Network Error')).toBeInTheDocument();
        expect(screen.getByText('Network error. Please check your connection.')).toBeInTheDocument();
    });

    it('renders custom message when provided', () => {
        const customMessage = 'Custom error message';
        render(<ErrorComponent type={ ErrorType.NETWORK } message = { customMessage } />);

        expect(screen.getByText(customMessage)).toBeInTheDocument();
        expect(screen.queryByText('Network error. Please check your connection.')).not.toBeInTheDocument();
    });

    it('calls onRetry when retry button is clicked', () => {
        render(<ErrorComponent onRetry={ onRetryMock } />);

        const retryButton = screen.getByText('Try Again');
        fireEvent.click(retryButton);

        expect(onRetryMock).toHaveBeenCalledTimes(1);
    });

    it('does not show retry button when onRetry is not provided', () => {
        render(<ErrorComponent />);

        expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
    });

    it('uses statusCode to determine error type when provided', () => {
        render(<ErrorComponent statusCode={ 404} />);

        expect(screen.getByText('Not Found')).toBeInTheDocument();
    });

    it('falls back to default when statusCode is not found', () => {
        render(<ErrorComponent statusCode={ 999} />);

        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
    });

    it('has accessible ARIA attributes', () => {
        render(<ErrorComponent />);

        const errorElement = screen.getByRole('alert');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveAttribute('aria-live', 'assertive');
    });

    it('renders button with accessible label', () => {
        render(<ErrorComponent onRetry={ onRetryMock } />);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Try Again');
    });

    it('matches snapshot for default error', () => {
        const { container } = render(<ErrorComponent />);
        expect(container).toMatchSnapshot();
    });

    it('matches snapshot for 404 error', () => {
        const { container } = render(<ErrorComponent type={ ErrorType.NOT_FOUND } />);
        expect(container).toMatchSnapshot();
    });
});
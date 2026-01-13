// components/__tests__/DataFetchingWrapper.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DataFetchingWrapper from './DataFetchingWrapper';

const Child = () => <div data-testid="child">Child Content</div>;
const CustomError = () => <div data-testid="custom-error">Error</div>;
const CustomLoader = () => <div data-testid="custom-loader">Loading...</div>;

describe('DataFetchingWrapper', () => {
    it('renders children when not loading and no error', () => {
        render(
            <DataFetchingWrapper isLoading={false}>
                <Child />
            </DataFetchingWrapper>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('renders default loading state in replace mode', () => {
        render(
            <DataFetchingWrapper isLoading>
                <Child />
            </DataFetchingWrapper>
        );

        expect(screen.getByTestId('data-fetching-loading')).toBeInTheDocument();
    });

    it('renders custom loading component in replace mode', () => {
        render(
            <DataFetchingWrapper
                isLoading
                loadingComponent={<CustomLoader />}
            >
                <Child />
            </DataFetchingWrapper>
        );

        expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
    });

    it('renders append loading mode with children', () => {
        render(
            <DataFetchingWrapper isLoading loadingMode="append">
                <Child />
            </DataFetchingWrapper>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByTestId('data-fetching-loading-append')).toBeInTheDocument();
    });

    it('renders custom append loader content', () => {
        render(
            <DataFetchingWrapper
                isLoading
                loadingMode="append"
                appendLoaderContent={<CustomLoader />}
            >
                <Child />
            </DataFetchingWrapper>
        );

        expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
    });

    it('renders error state with default error component', () => {
        render(
            <DataFetchingWrapper isLoading={false} isError>
                <Child />
            </DataFetchingWrapper>
        );

        expect(screen.getByTestId('data-fetching-error')).toBeInTheDocument();
    });

    it('renders custom error component', () => {
        render(
            <DataFetchingWrapper
                isLoading={false}
                isError
                errorComponent={<CustomError />}
            >
                <Child />
            </DataFetchingWrapper>
        );

        expect(screen.getByTestId('custom-error')).toBeInTheDocument();
    });
});

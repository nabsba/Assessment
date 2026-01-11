import type { ErrorComponentProps } from "../error/types";
import type { LoaderProps } from "../loader/types";

interface DataFetchingWrapperProps {
    isLoading: boolean;
    isError?: boolean;

    // Error handling - either a custom component or props for the default ErrorComponent
    errorComponent?: React.ReactNode;
    errorProps?: ErrorComponentProps;

    // Loading handling - either a custom component or props for the default Loader
    loadingComponent?: React.ReactNode;
    loaderProps?: LoaderProps;

    // Styling
    className?: string;
    style?: React.CSSProperties;

    // Content
    children: React.ReactNode;

}

export type { DataFetchingWrapperProps };

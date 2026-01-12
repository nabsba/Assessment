import type { ErrorComponentProps } from "../error/types";
import type { LoaderProps } from "../loader/components/Loader";

import type { ICON_MAP, ICON_SIZES } from "./data/icons";
export type IconSize = keyof typeof ICON_SIZES;
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

export type IconName = keyof typeof ICON_MAP;
interface IconActionProps {
    icon: IconName;
    onClick?: () => void;
    size?: IconSize;
    className?: string;
    color?: string;

    ariaLabel?: string;
    disabled?: boolean;
    tooltip?: string;
    text?: string | React.ReactNode | undefined;
}

export type { DataFetchingWrapperProps, IconActionProps };

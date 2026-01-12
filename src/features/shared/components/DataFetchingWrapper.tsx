// components/DataFetchingWrapper.tsx
import React from 'react';
import ErrorComponent from '../../error/components/ErrorComponent';
import Loader from '../../loader/components/Loader';
import type { DataFetchingWrapperProps } from '../types';





const DataFetchingWrapper: React.FC<DataFetchingWrapperProps> = ({
    isLoading,
    isError = false,
    errorComponent,
    errorProps,
    loadingComponent,
    loaderProps,
    style = { height: '100%' },
    children,

}) => {
    if (isError) {
        return (
            <div
                data-testid="data-fetching-error"
                style={style}
            >
                {errorComponent || <ErrorComponent  {...errorProps} />}
            </div>
        );
    }

    if (isLoading) {
        return (
            <div
                data-testid="data-fetching-loading"
                style={{ ...style, margin: 'auto' }}
            >
                {loadingComponent || <Loader {...loaderProps} />}
            </div>
        );
    }

    return <>{children}</>;
};

export default DataFetchingWrapper;
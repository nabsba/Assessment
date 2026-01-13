// components/DataFetchingWrapper.tsx
import React from 'react';
import ErrorComponent from '../../error/components/ErrorComponent';
import Loader from '../../loader/components/Loader';
import type { DataFetchingWrapperProps } from '../types';

interface EnhancedDataFetchingWrapperProps extends DataFetchingWrapperProps {
    loadingMode?: 'replace' | 'append';
    appendLoaderProps?: any;
    appendLoaderContent?: React.ReactNode;
    appendLoaderStyle?: React.CSSProperties;
}

const DataFetchingWrapper: React.FC<EnhancedDataFetchingWrapperProps> = ({
    isLoading,
    isError = false,
    errorComponent,
    errorProps,
    loadingComponent,
    loaderProps,
    style = { height: '100%' },
    children,
    loadingMode = 'replace',
    appendLoaderProps,
    appendLoaderContent,
    appendLoaderStyle = {}
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
        if (loadingMode === 'append') {
            return (
                <div style={style}>
                    {children}
                    <div
                        data-testid="data-fetching-loading-append"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '20px',
                            ...appendLoaderStyle
                        }}
                    >
                        {appendLoaderContent || <Loader {...(appendLoaderProps || loaderProps)} />}
                    </div>
                </div>
            );
        }

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
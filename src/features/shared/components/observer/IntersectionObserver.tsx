import { useEffect, useRef, type ReactNode, forwardRef } from 'react';

interface IntersectionObserverWrapperProps {
    children: ReactNode;
    onVisible: () => void;
    onHidden?: () => void;
    options?: IntersectionObserverInit;
    enabled?: boolean;
    className?: string;
}

export const IntersectionObserverWrapper = forwardRef<HTMLDivElement, IntersectionObserverWrapperProps>(
    ({
        children,
        onVisible,
        onHidden,
        options = { root: null, rootMargin: '100px', threshold: 0.1 },
        enabled = true,
        className = ''
    }, ref) => {
        const internalRef = useRef<HTMLDivElement>(null);
        const elementRef = ref || internalRef;

        useEffect(() => {
            const element = (elementRef as React.MutableRefObject<HTMLDivElement>)?.current;
            if (!element || !enabled) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            onVisible();
                        } else if (onHidden) {
                            onHidden();
                        }
                    });
                },
                options
            );

            observer.observe(element);

            return () => observer.disconnect();
        }, [onVisible, onHidden, options, enabled, elementRef]);

        return (
            <div ref={elementRef} className={className}>
                {children}
            </div>
        );
    }
);

IntersectionObserverWrapper.displayName = 'IntersectionObserverWrapper';
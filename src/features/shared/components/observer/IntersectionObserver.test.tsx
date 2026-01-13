// IntersectionObserver.test.tsx
import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { IntersectionObserverWrapper } from './IntersectionObserver'

type IOCallback = IntersectionObserverCallback

let ioCallback: IOCallback | null = null

const observe = vi.fn()
const unobserve = vi.fn()
const disconnect = vi.fn()

class MockIntersectionObserver {
    readonly root: Element | Document | null = null
    readonly rootMargin: string = ''
    readonly thresholds: ReadonlyArray<number> = []

    constructor(cb: IOCallback, _options?: IntersectionObserverInit) {
        ioCallback = cb
    }

    observe = observe
    unobserve = unobserve
    disconnect = disconnect

    takeRecords(): IntersectionObserverEntry[] {
        return []
    }
}

beforeEach(() => {
    ioCallback = null
    observe.mockClear()
    unobserve.mockClear()
    disconnect.mockClear()

        // ✅ set the global constructor to a real class
        ; (globalThis as any).IntersectionObserver = MockIntersectionObserver
})

afterEach(() => {
    vi.clearAllMocks()
})

describe('IntersectionObserverWrapper', () => {
    it('calls onVisible when element becomes visible', () => {
        const onVisible = vi.fn()

        render(
            <IntersectionObserverWrapper onVisible={onVisible}>
                <div>Sentinel</div>
            </IntersectionObserverWrapper>
        )

        expect(observe).toHaveBeenCalledTimes(1)
        expect(ioCallback).toBeTypeOf('function')

        // Trigger intersection
        ioCallback?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver)

        expect(onVisible).toHaveBeenCalledTimes(1)
    })

    it('calls onHidden when element becomes hidden', () => {
        const onVisible = vi.fn()
        const onHidden = vi.fn()

        render(
            <IntersectionObserverWrapper onVisible={onVisible} onHidden={onHidden}>
                <div>Sentinel</div>
            </IntersectionObserverWrapper>
        )

        expect(observe).toHaveBeenCalledTimes(1)

        ioCallback?.([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver)

        expect(onHidden).toHaveBeenCalledTimes(1)
        expect(onVisible).not.toHaveBeenCalled()
    })

    it('does not observe when disabled', () => {
        const onVisible = vi.fn()

        render(
            <IntersectionObserverWrapper onVisible={onVisible} enabled={false}>
                <div>Sentinel</div>
            </IntersectionObserverWrapper>
        )

        expect(observe).not.toHaveBeenCalled()
        expect(ioCallback).toBeNull()
    })

    it('disconnects observer on unmount', () => {
        const onVisible = vi.fn()

        const { unmount } = render(
            <IntersectionObserverWrapper onVisible={onVisible}>
                <div>Sentinel</div>
            </IntersectionObserverWrapper>
        )

        unmount()

        expect(disconnect).toHaveBeenCalledTimes(1)
    })
})

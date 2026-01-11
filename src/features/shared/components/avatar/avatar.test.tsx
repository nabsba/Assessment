import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Avatar from './Avatar'

import type { AvatarProps } from '../../types'

// Mock the CSS module
vi.mock('./avatar.module.css', () => ({
    default: {
        'avatar-large': 'avatar-large',
        'avatar-small': 'avatar-small',
        'avatar-custom': 'avatar-custom',
    }
}))

describe('Avatar Component', () => {
    describe('Rendering', () => {
        it('renders image when src is provided', () => {
            render(
                <Avatar
                    src="https://example.com/photo.jpg"
                    alt="User profile"
                />
            )

            const img = screen.getByAltText('User profile')
            expect(img).toBeInTheDocument()
            expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg')
            expect(img).toHaveStyle({
                width: '100%',
                height: '100%',
                objectFit: 'cover'
            })
        })

        it('renders text when src is not provided', () => {
            render(<Avatar text="John Doe" />)

            expect(screen.getByText('John Doe')).toBeInTheDocument()
            expect(screen.queryByRole('img')).not.toBeInTheDocument()
        })

        it('renders default text when no src or text provided', () => {
            render(<Avatar />)

            expect(screen.getByText('Avatar')).toBeInTheDocument()
        })

        it('uses default alt text when not provided', () => {
            render(<Avatar src="photo.jpg" />)

            const img = screen.getByAltText('Avatar')
            expect(img).toBeInTheDocument()
        })

        it('uses custom alt text when provided', () => {
            render(<Avatar src="photo.jpg" alt="Profile picture" />)

            const img = screen.getByAltText('Profile picture')
            expect(img).toBeInTheDocument()
        })

        it('applies CSS module class when className matches', () => {
            const { container } = render(
                <Avatar className="avatar-large" />
            )

            const div = container.firstChild
            expect(div).toHaveClass('avatar-large')
            expect(div).toHaveClass('flex-center')
        })



        it('has flex-center class by default', () => {
            const { container } = render(<Avatar />)

            const div = container.firstChild
            expect(div).toHaveClass('flex-center')
        })
    })

    describe('Error Handling', () => {
        it('does not crash when src is empty string', () => {
            render(<Avatar src="" />)

            // Should show text since src is falsy
            expect(screen.getByText('Avatar')).toBeInTheDocument()
        })

        it('handles broken image URLs gracefully', () => {
            // The component doesn't have error handling for broken images
            // This test just ensures it doesn't crash
            render(<Avatar src="broken-image.jpg" />)

            const img = screen.getByAltText('Avatar')
            expect(img).toBeInTheDocument()
        })
    })

    describe('Edge Cases', () => {
        it('renders empty span when text is empty string', () => {
            render(<Avatar text="" />)

            const span = screen.getByText((content, element) => {
                return element?.tagName.toLowerCase() === 'span' && content === ''
            })
            expect(span).toBeInTheDocument()
            expect(span).toBeEmptyDOMElement()
        })
        it('renders text with whitespace', () => {
            render(<Avatar text="  John  " />)

            expect(screen.getByText('John', { exact: false })).toBeInTheDocument()
        })

        it('works with special characters in text', () => {
            render(<Avatar text="Jöhn Döe 123" />)

            expect(screen.getByText('Jöhn Döe 123')).toBeInTheDocument()
        })
    })

    describe('Combined Classes', () => {
        it('combines flex-center with CSS module class', () => {
            const { container } = render(
                <Avatar className="avatar-small" />
            )

            const div = container.firstChild
            expect(div).toHaveClass('flex-center avatar-small')
        })

        it('combines flex-center with regular class', () => {
            const { container } = render(
                <Avatar className="bg-blue-500" />
            )

            const div = container.firstChild
            expect(div).toHaveClass('flex-center bg-blue-500')
        })
    })
})
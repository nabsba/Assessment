import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import Identity from './Identity'

// Mock the CSS module
vi.mock('./identity.module.css', () => ({
  default: {
    identity: 'identity-styles',
  }
}))

describe('Identity Component', () => {
  describe('Rendering', () => {
    it('renders ID and login correctly', () => {
      render(<Identity id={123} login="john_doe" />)
      
      expect(screen.getByText('123')).toBeInTheDocument()
      expect(screen.getByText('john_doe')).toBeInTheDocument()
    })

    it('renders string ID correctly', () => {
      render(<Identity id="abc-123" login="jane_smith" />)
      
      expect(screen.getByText('abc-123')).toBeInTheDocument()
      expect(screen.getByText('jane_smith')).toBeInTheDocument()
    })

    it('renders numeric ID correctly', () => {
      render(<Identity id={999} login="user999" />)
      
      expect(screen.getByText('999')).toBeInTheDocument()
      expect(screen.getByText('user999')).toBeInTheDocument()
    })

    it('has correct CSS classes', () => {
      const { container } = render(<Identity id={1} login="test" />)
      
      const div = container.firstChild
      expect(div).toHaveClass('flex-col')

    })

    it('renders both spans', () => {
      render(<Identity id={1} login="test" />)
      
      const spans = screen.getAllByText((_, element) => 
        element?.tagName.toLowerCase() === 'span'
      )
      expect(spans).toHaveLength(2)
    })

    it('has ID in first span and login in second span', () => {
      const { container } = render(<Identity id={456} login="developer" />)
      
      const spans = container.querySelectorAll('span')
      expect(spans[0]).toHaveTextContent('456')
      expect(spans[1]).toHaveTextContent('developer')
    })
  })

  describe('Accessibility', () => {
    it('has no images or interactive elements', () => {
      render(<Identity id={1} login="test" />)
      
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty login string', () => {
      const { container } = render(<Identity id={1} login="" />)

      // Get both spans
      const spans = container.querySelectorAll('span')

      // First span has ID
      expect(spans[0]).toHaveTextContent('1')

      // Second span is empty (login)
      expect(spans[1]).toBeEmptyDOMElement()
      expect(spans[1]).toHaveTextContent('')
    })

    it('handles special characters in login', () => {
      render(<Identity id={1} login="user-name_123@test.com" />)
      
      expect(screen.getByText('user-name_123@test.com')).toBeInTheDocument()
    })

    it('handles zero as ID', () => {
      render(<Identity id={0} login="admin" />)
      
      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.getByText('admin')).toBeInTheDocument()
    })

    it('handles negative ID', () => {
      render(<Identity id={-1} login="system" />)
      
      expect(screen.getByText('-1')).toBeInTheDocument()
      expect(screen.getByText('system')).toBeInTheDocument()
    })

    it('handles long ID string', () => {
      const longId = '123e4567-e89b-12d3-a456-426614174000'
      render(<Identity id={longId} login="uuid_user" />)
      
      expect(screen.getByText(longId)).toBeInTheDocument()
    })
  })

  describe('Structure', () => {
    it('has correct DOM structure', () => {
      const { container } = render(<Identity id={1} login="test" />)
      
      const div = container.firstChild as HTMLDivElement
      expect(div.tagName).toBe('DIV')
      expect(div.children).toHaveLength(2)
      
      const spans = div.querySelectorAll('span')
      expect(spans).toHaveLength(2)
      expect(spans[0].tagName).toBe('SPAN')
      expect(spans[1].tagName).toBe('SPAN')
    })

    it('has flex-col class', () => {
      const { container } = render(<Identity id={1} login="test" />)
      
      const div = container.firstChild
      expect(div).toHaveClass('flex-col')
    })

   
  })

  
})
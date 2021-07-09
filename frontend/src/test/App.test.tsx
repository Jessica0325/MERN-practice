import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../App'

// TODO: Add some simple test cases, e.g. checking components are rendered successfully
test('app test', () => {
    render(<App  />)
    const h1Text = screen.getByText("My Todos")
    expect(h1Text).toBeInTheDocument()
  })
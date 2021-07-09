import React from 'react'
import { render, screen } from '@testing-library/react'
import TodoItem from '../components/TodoItem'

// TODO: Add some simple test cases, e.g. checking components are rendered successfully
test('todo item test', () => {
    const mockTodo: ITodo = {
      _id: '',
      name: '',
      description: '',
      status: false
    }
    render(<TodoItem
      updateTodo={() => { }}
      deleteTodo={() => { }}
      todo={mockTodo}
    />)
    const completeText = screen.getByText("Complete")
    expect(completeText).toBeInTheDocument()
  
    const deleteText = screen.getByText("Delete")
    expect(deleteText).toBeInTheDocument()
  })
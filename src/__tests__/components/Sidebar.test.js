// src/__tests__/components/Sidebar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../../components/Sidebar';

describe('Sidebar component', () => {
  const mockConversations = [
    { id: '1', first_message: 'Hello', last_message_time: new Date().toISOString() },
    { id: '2', first_message: 'Test', last_message_time: new Date().toISOString() },
  ];

  test('renders conversation list and allows selection', () => {
    const mockSelectConversation = jest.fn();
    render(
      <Sidebar
        sidebarOpen={true}
        conversations={mockConversations}
        selectConversation={mockSelectConversation}
      />
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Hello'));
    expect(mockSelectConversation).toHaveBeenCalledWith('1');
  });
});
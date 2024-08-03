// src/__tests__/components/Sidebar.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "../../components/Sidebar";

describe("Sidebar component", () => {
  const mockConversations = [
    {
      id: "1",
      title: "Conversation 1",
      last_message_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Conversation 2",
      last_message_at: new Date().toISOString(),
    },
  ];

  test("renders conversation list and allows selection", () => {
    const mockSelectConversation = jest.fn();
    render(
      <Sidebar
        sidebarOpen={true}
        conversations={mockConversations}
        selectConversation={mockSelectConversation}
        currentConversationId={null}
        startNewConversation={() => {}}
      />,
    );

    expect(screen.getByText("Conversation 1")).toBeInTheDocument();
    expect(screen.getByText("Conversation 2")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Conversation 1"));
    expect(mockSelectConversation).toHaveBeenCalledWith("1");
  });
});

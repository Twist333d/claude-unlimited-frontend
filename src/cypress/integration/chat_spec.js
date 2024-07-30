describe("Chat functionality", () => {
  it("allows user to send a message and receive a response", () => {
    cy.visit("/");
    cy.get('textarea[placeholder="How can I help you today?"]').type("Hello");
    cy.get('button[aria-label="Send message"]').click();
    cy.contains("Hello");
    cy.contains("Hello! How can I assist you today?", { timeout: 10000 });
  });
});

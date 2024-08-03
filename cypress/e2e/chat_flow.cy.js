describe('Chat Application E2E Test', () => {
  it('should send a message and receive a reply successfully', () => {
    // Step 1. Visit the base URL
    cy.visit('/');
    cy.log('Visited the base URL');

    // Step 2: Intercept the API call for sending a message
    cy.intercept('POST', '/chat').as('sendMessage');
    cy.log('Intercepted the API call for sending a message');

    // Step 4: Type and send a message
    const userMessage = "Hello, Claude!";
    cy.get('.message-input-text-area').type(userMessage);
    cy.log('Typed the user message');

    cy.get('.send-button').click();
    cy.log('Clicked the send button');

    // Step 5: Verify the message was sent successfully and a reply was received
    cy.wait('@sendMessage').then((interception) => {
      expect(interception.response.statusCode).to.equal(200, 'Expected a 200 status code for the send message API call');
      cy.log('Send message API call was successful');
      expect(interception.response.body).to.have.property('response', 'Expected a response property in the API response');
      cy.log('API response contains the expected response property');
    });

    // Step 6: Verify the sent message appears in the chat
    cy.contains('Hello, Claude!').should('be.visible');
    cy.log('Sent message is visible in the chat');

    // Step 7: Verify that a new message (the reply) appears in the chat
    cy.get('.bg-white.border-1.border-gray-500.mr-auto').should('have.length.at.least', 1);
    cy.log('At least one reply message is visible in the chat');

    // Pause for debugging if needed
    // cy.pause();
  });
});
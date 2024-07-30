describe('Chat Application E2E Test', () => {
  it('should send a message and receive a reply successfully', () => {
    // Step 1. Visit the base URL
    cy.visit('/')
    // Step 2: Intercept the API call for sending a message
    cy.intercept('POST', '/chat').as('sendMessage');
    // Step 3: Intercept the API call for receiving a reply (part of the same request)
    // We don't need a separate intercept for this as it's handled in the POST response

    // Step 4: Type and send a message
    const userMessage = "Hello, Claude!"
    cy.get('.message-input-text-area').type(userMessage)
    cy.get('.send-button').click()


    // Step 5: Verify the message was sent successfully and a reply was received
    cy.wait('@sendMessage').then((interception) => {
      expect(interception.response.statusCode).to.equal(200)
      expect(interception.response.body).to.have.property('response');
        }
    );
    // Step 6: Verify the sent message appears in the chat
    cy.contains('Hello, Claude!').should('be.visible');
    // Step 8: Verify that a new message (the reply) appears in the chat
    cy.get('.bg-white.border-1.border-gray-500.mr-auto').should('have.length.at.least', 1);


  })
    }
    )
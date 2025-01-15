describe('Search Functionality', () => {
    beforeEach(() => {
      // Add error handling for server connection
      cy.visit('/', {
        failOnStatusCode: false,
        retryOnNetworkFailure: true,
        timeout: 30000,
      }).then((resp) => {
        // Verify the page loaded successfully
        cy.get('[data-test="search-input"]', { timeout: 10000 }).should('be.visible')
      })
    })
  
    describe('Search with Valid Input', () => {
      const validSearchTerms = [
        { term: 'tu100', expectedResults: true },
        { term: 'tu102', expectedResults: true },
        { term: 'tu103', expectedResults: true },
        { term: 'การเป็นพลเมือง', expectedResults: true },
        { term: 'ทักษะชีวิตทางสังคม', expectedResults: true },
        { term: 'Civil', expectedResults: true },
        { term: 'Social Life Skill', expectedResults: true }
      ]
  
      validSearchTerms.forEach(({ term, expectedResults }) => {
        it(`should display results for valid search term: ${term}`, () => {
          // Add retry ability for network requests
          cy.intercept('GET', 'http://localhost:3000/api/place/suggestion').as('searchAPI')
  
          cy.get('[data-test="search-input"]')
            .should('be.visible')
            .type(term, { delay: 100 })
            .should('have.value', term)
  
          // Verify results with extended timeout
          cy.get('[data-test="search-results"]', { timeout: 30000 })
            .should('exist')
          
          cy.get('[data-test="result-item"]').each(($el) => {
            const text = $el.text().toLowerCase()
            const searchTerm = term.toLowerCase()
            expect(text).to.satisfy((txt) => 
              txt.includes(searchTerm) || 
              validSearchTerms.some(valid => 
                txt.includes(valid.term.toLowerCase())
              )
            )
          })
  
          // Test navigation with error handling
          cy.get('[data-test="result-item"]')
            .first()
            .click()
          
          cy.url()
            .should('match', /\/[a-zA-Z0-9]+$/)
        })
      })
    })
  
    describe('Search with Invalid Input', () => {
      const invalidSearchTerms = [
        'มธ100',
        'invalid123',
        'nonexistentcourse',
        '!@#$%',
        '     '
      ]
  
      invalidSearchTerms.forEach(term => {
        it(`should handle invalid search term: ${term}`, () => {
          cy.intercept('GET', '**/api/**').as('searchAPI')
  
          cy.get('[data-test="search-input"]')
            .should('be.visible')
            .type(term, { delay: 100 })
            .should('have.value', term)
  
          // Wait for API response
          cy.wait('@searchAPI', { timeout: 10000 })
  
          // Verify no results
          cy.get('[data-test="search-results"]')
            .should('not.exist')
        })
      })
    })
  })
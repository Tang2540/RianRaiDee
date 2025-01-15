describe('Sign-Up Functionality', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('/auth')
  })

  it('successfully signs up a new user with valid data', () => {
    cy.get('[data-test=signup-btn]').click()
    cy.get('[data-test=signup-email]').type('test@example.com')
    cy.get('[data-test=signup-displayname]').type('testuser')
    cy.get('[data-test=signup-password]').type('Password123!')
    cy.get('[data-test=signup-confirm-password]').type('Password123!')
    cy.get('[data-test=signup-submit]').click()

    // Assert successful signup
    cy.url().should('include', '/auth')
    cy.get('[data-test=login-email]').type('test@example.com')
    cy.get('[data-test=login-password]').type('Password123!')
    cy.get('[data-test=login-submit]').click()

    cy.url().should('include','/')
    cy.get('[data-test=navbar-profile-name]').should('contain','testuser')

  })

  it('verifies passwords match', () => {
    cy.get('[data-test=signup-btn]').click()
    cy.get('[data-test=signup-email]').type('test1@example.com')
    cy.get('[data-test=signup-displayname]').type('testuser1')
    cy.get('[data-test=signup-password]').type('Password123!')
    cy.get('[data-test=signup-confirm-password]').type('DifferentPassword123!')
    cy.get('[data-test=signup-submit]').click()

    cy.get('.alert-error')
      .should('be.visible')
      .and('contain', "รหัสผ่านไม่ตรงกัน")
  })

  it('prevent email duplication', () => {
    cy.get('[data-test=signup-btn]').click()
    cy.get('[data-test=signup-email]').type('test@example.com')
    cy.get('[data-test=signup-displayname]').type('testuser1')
    cy.get('[data-test=signup-password]').type('Password123!')
    cy.get('[data-test=signup-confirm-password]').type('Password123!')
    cy.get('[data-test=signup-submit]').click()

    cy.get('.alert-error')
      .should('be.visible')
      .and('contain', "อีเมลนี้ได้ถูกใช้งานแล้ว")
  })

  it('prevent display-name duplication', () => {
    cy.get('[data-test=signup-btn]').click()
    cy.get('[data-test=signup-email]').type('test1@example.com')
    cy.get('[data-test=signup-displayname]').type('testuser')
    cy.get('[data-test=signup-password]').type('Password123!')
    cy.get('[data-test=signup-confirm-password]').type('Password123!')
    cy.get('[data-test=signup-submit]').click()

    cy.get('.alert-error')
      .should('be.visible')
      .and('contain', "ชื่อนี้ถูกใช้งานแล้ว")
  })

})
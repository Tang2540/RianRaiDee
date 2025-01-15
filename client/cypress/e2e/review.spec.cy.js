describe("Review functionality",() => {
  function formatDateThai(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear() + 543; // เพิ่ม 543 ให้เป็น พ.ศ.
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${day}/${month}/${year}`;
  }
    describe("User isn't logged in",() => {
      it("Pop-up should show if a user isn't logged in",() => {
        cy.visit("/6734e2e4e40e56eb05fd9af3")
        cy.get('[data-test=open-review-box-btn]').click()
        cy.get('[data-test=review-login-btn]').should('exist').click()
        cy.url().should('include','/auth')
      })
    })

    describe("User logged in",() => {
        const valid_text = "เป็นวิชาที่ดีมาก"
        const valid_grade = "B"
        const valid_sec = "2000"
        const valid_year = "2567"
        before(()=>{
            cy.visit('/auth')
            cy.get('[data-test=login-email]').type('test@gmail.com')
            cy.get('[data-test=login-password]').type('1234')
            cy.get('[data-test=login-submit]').click()
            cy.url('include','/')
            cy.get('a[href="/6734e2e4e40e56eb05fd9af3"]').click()
            cy.url('include','/6734e2e4e40e56eb05fd9af3')
        })

        it("input with valid data",() => {
            cy.get('[data-test=open-review-box-btn]').click()
            cy.get('[data-test=review-text]').should('exist').type(valid_text)
            cy.get('select').should('exist').find('option')
            cy.get('select').select(valid_grade)
            cy.get('[data-test=review-sec]').should('exist').type(valid_sec)
            cy.get('[data-test=review-year]').should('exist').type(valid_year)
            cy.get('[data-test=review-submit-btn]').should('exist').click()
            cy.get('[data-test=comment-box]').last().within(()=>{
                cy.get('[data-test=comment-display-name]').should('have.text','ทดสอบ')
                cy.get('[data-test=comment-content]').should('have.text',valid_text)
                cy.get('[data-test=grade]').should('contain',valid_grade)
                cy.get('[data-test=sec]').should('contain',valid_sec)
                cy.get('[data-test=year]').should('contain',valid_year)
                cy.get('[data-test=date]').should('have.text',formatDateThai(Date.now()))
            })
        })

        //it("input with invalid data",() => {
        //  const invalidData = [
        //    {data:"เอบวก", type:"grade"},
        //    {data:"F-"},
        //    {data:"A+"},
        //    {data:"fff"},
        //    {data:"หนึ่งสองสาม"},
        //    
        //  ]
        //})
    })
  })
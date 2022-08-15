/// <reference types="cypress" />

describe('Calcular média', () => {
  beforeEach(() => {
    cy.visit('media')
  })

  context('informando valores válidos', () => {
    it('Deve retornar a média', () => {
      const number1 = Math.floor(Math.random() * 100_000)
      const number2 = Math.floor(Math.random() * 100_000)

      const media = (Math.round(((number1 + number2) / 2.0) * 100) / 100).toFixed(2)

      cy.get('#number1')
        .type(number1)

      cy.get('#number2')
        .type(number2)

      cy.get('.btn')
        .click()

      cy.contains(`Média: ${media}`).should('exist')

      cy.contains('Informe um número válido').should('not.exist')
    })
  })

  context('informando apenas um valor válido', () => {
    it('Deve retornar uma mensagem de erro', () => {
      const number1 = Math.floor(Math.random() * 100_000)
      const number2 = 'not a number'

      cy.get('#number1')
        .type(number1)

      cy.get('#number2')
        .type(number2)

      cy.get('.btn')
        .click()

      cy.contains('Média:').should('not.exist')

      cy.contains('Informe um número válido no SEGUNDO campo!').should('exist')
    })
  })

  context('com valor negativo', () => {
    it('Deve retornar a média', () => {
      const number1 = Math.floor(Math.random() * 100_000)
      const number2 = Math.floor(Math.random() * 100_000) * (-1)

      const media = (Math.round(((number1 + number2) / 2.0) * 100) / 100).toFixed(2)

      cy.get('#number1')
        .type(number1)

      cy.get('#number2')
        .type(number2)

      cy.get('.btn')
        .click()

      cy.contains(`Média: ${media}`).should('exist')

      cy.contains('Informe um número válido').should('not.exist')
    })
  })

  context('sem informar valor', () => {
    it('Não deve realizar a requisição', () => {

      cy.get('#media-form').invoke('submit', (e) => {
        e.preventDefault()
        throw new Error('Requesição realizada!')
      })

      cy.get('#media-form').within(() => {
        cy.get('input:invalid').should('have.length', 2)

        cy.get('#number1')
          .type(Math.floor(Math.random() * 100_000))

        cy.get('input:invalid').should('have.length', 1)
        cy.get('input:valid').should('have.length', 1)
      })

      cy.get('#media-form').within(() => {
        cy.get('#number1')
          .clear()

        cy.get('.btn')
          .click()
      })

      cy.get('#number1')
        .invoke('prop', 'validationMessage')
        .should('equal', 'Preencha este campo.')
    })
  })
})
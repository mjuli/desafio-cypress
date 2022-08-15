/// <reference types='cypress' />

describe('Buscar CEP', () => {
  beforeEach(() => {
    cy.visit('buscarcep')
  })

  context('válido e com bairro', () => {
    it('Deve retornar o endereço com o bairro', () => {
      const validCEP = '58073-197'

      cy.get('.form-control')
        .type(`${validCEP}`)

      cy.get('.btn')
        .click()

      cy.contains('CEP: 58073-197').should('exist')
      cy.contains('Logradouro: Rua Aposentado Abel Odilon Paulo').should('exist')
      cy.contains('Bairro: Cidade dos Colibris').should('exist')

      cy.contains('Não foi possível encontrar o bairro deste CEP').should('not.exist')
      cy.contains('CEP inválido').should('not.exist')
    })
  })

  context('válido, mas sem bairro', () => {
    it('Deve retornar o endereço sem o bairro', () => {
      const validCEP = '18150000'

      cy.get('.form-control')
        .type(`${validCEP}`)
      cy.get('.btn')
        .click()

      cy.contains('CEP: 18150-000').should('exist')
      cy.contains('Cidade: Ibiúna').should('exist')
      cy.contains('Bairro: ').should('not.exist')

      cy.contains('Não foi possível encontrar o bairro deste CEP').should('exist')
      cy.contains('CEP inválido').should('not.exist')
    })
  })

  context('inválido', () => {
    it('Deve retornar uma mensagem de erro', () => {
      const invalidCEP = '12345678'

      cy.get('.form-control')
        .type(`${invalidCEP}`)
      cy.get('.btn')
        .click()

      cy.contains('CEP: ').should('not.exist')
      cy.contains('Não foi possível encontrar o bairro deste CEP').should('not.exist')
      cy.contains('CEP inválido').should('exist')
    })
  })

  context('sem informar o cep', () => {
    it('Não deve realizar a requisição', () => {

      cy.get('#cep-form').invoke('submit', (e) => {
        e.preventDefault()
        throw new Error('Requesição realizada!')
      })

      cy.get('#cep-form').within(() => {
        cy.get('.form-control')
          .click()
      })

      cy.get('.form-control')
        .invoke('prop', 'validationMessage')
        .should('equal', 'Preencha este campo.')
    })
  })
})
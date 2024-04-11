import {
	When,
	Then,
	And,
	Before,
	Given,
} from 'cypress-cucumber-preprocessor/steps'
import LoginPage from '../../pages/LoginPage'

Cypress.on('uncaught:exception', (err, runnable) => {
	// returning false here prevents Cypress from failing the test
	return false
})

Before(() => {
	cy.visit(Cypress.env('URL'))
	LoginPage.fillLoginData(Cypress.env('standard_user'), Cypress.env('password'))
})

var itemNames =[]
var itemPrices =[]
var itemDescription =[]
var total, totalWithTax, subtotal, tax, temp
Given("I extract current prices", ()=>{
    itemPrices=[]
    cy.get('.inventory_item_price').each(el=>{
        let temp = el.text().replace('$', '')
        itemPrices.push(+temp)
    })
})

Given("I extract current description", ()=>{
    itemDescription=[]
    cy.get('.inventory_item_desc').each(el=>{
        itemDescription.push(el.text())
    })
})

When("I extract current item names", ()=>{
    itemNames=[]
    cy.get('.inventory_item_name').each(el=>{
        itemNames.push(el.text())
    })
})
When("I add them all 1 by 1 in the cart and inspect the pricing", ()=>{
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist')
    for (let index = 0; index < itemNames.length; index++) {
        cy.get('.btn_primary').contains('Add to cart').eq(0).click()
        cy.get('[data-test="shopping-cart-badge"]').should('contain', index+1)
        cy.get('[data-test="shopping-cart-link"]').click()
        cy.get('.cart_item').eq(index).find('.inventory_item_name').should('contain', itemNames[index])
        cy.get('.cart_item').eq(index).find('.inventory_item_desc').should('contain', itemDescription[index])
        cy.get('.cart_item').eq(index).find('.inventory_item_price').should('contain', itemPrices[index])
        cy.get('#continue-shopping').click()
    }
})

// When("I go to checkout", ()=>{
//     cy.get('[data-test="shopping-cart-link"]').click()
//     cy.get('.btn').contains('Checkout').click()
//     cy.get('[data-test="error"]').should('not.exist')
//     cy.get('.btn').contains('Continue').click()
//     //cy.get('[data-test="error"]').should('exist').should('contain', )
//     cy.get('[placeholder="First Name"]').type(Cypress.env('NAME'))
//     cy.get('[placeholder="Last Name"]').type(Cypress.env('SURNAME'))
//     cy.get('[placeholder="Zip/Postal Code"]').type(Cypress.env('ZIP'))

// })
When("I go to checkout", ()=>{
    cy.get('[data-test="shopping-cart-link"]').click()
    cy.get('.btn').contains('Checkout').click()
    cy.get('[placeholder="First Name"]').type(Cypress.env('NAME'))
    cy.get('[placeholder="Last Name"]').type(Cypress.env('SURNAME'))
    cy.get('[placeholder="Zip/Postal Code"]').type(Cypress.env('ZIP'))
    cy.get('.btn').contains('Continue').click()
})

When("I compare all the results on the final page", ()=>{
    total=0
    for (let index = 0; index < itemNames.length; index++) {
        cy.get('.cart_item').contains(itemNames[index]).parent().parent().find('.inventory_item_desc').should('contain', itemDescription[index])
        cy.get('.cart_item').contains(itemNames[index]).parent().parent().find('.inventory_item_price').should('contain', itemPrices[index])
        total += itemPrices[index]
    }
    cy.get('[data-test="subtotal-label"]').then(el=>{
        temp = el.text().split('$')
        subtotal = +temp[1]
        console.log(subtotal)
    })
    cy.get('[data-test="tax-label"]').then(el=>{
        temp = el.text().split('$')
        tax = +temp[1]
        console.log(tax)
    })
    cy.get('[data-test="total-label"]').then(el=>{
        temp = el.text().split('$')
        totalWithTax = +temp[1]
        console.log(totalWithTax)
    })
})

When("I compare all calculations", ()=>{
   expect(subtotal).to.eq(total)
   let taxCalculated = subtotal*0.08
   taxCalculated = Math.round(taxCalculated * 10) / 10
   expect(taxCalculated).to.eq(tax)
   expect(totalWithTax).to.eq(subtotal+taxCalculated)
})
When("I remove then all 1 by 1 in the cart and inspect the pricing", ()=>{

    for (let index = itemNames.length; index > 0; index--) {
        cy.get('[data-test="shopping-cart-badge"]').should('contain', index)
        cy.get('.btn').eq(index-1).click()
        if(index!=0){
            cy.get('[data-test="shopping-cart-badge"]').should('contain', index-1)
        }
        cy.get('[data-test="shopping-cart-link"]').click()
        cy.get('.cart_item')
        .should('not.contain', itemNames[index])
        .should('not.contain', itemDescription[index])
        .should('not.contain', itemPrices[index])
        cy.get('#continue-shopping').click()
    }
    cy.get('[data-test="shopping-cart-badge"]').should('not.exist')
})
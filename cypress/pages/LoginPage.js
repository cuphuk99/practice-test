export default class LoginPage {

    static fillLoginData(username, password){
        cy.get('#user-name').click().clear().type(username)
        cy.get('#password').click().clear().type(password)
        cy.get('#login-button').click()
    }

}
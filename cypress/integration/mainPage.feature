Feature: Main Page items to checkout

Standart user
Scenario: Removing items from court
    Given I extract current prices
    And I extract current description
    And I extract current item names
    When I add them all 1 by 1 in the cart and inspect the pricing
    Then I remove then all 1 by 1 in the cart and inspect the pricing

Scenario: Adding items to court and counting correct pricing
    Given I extract current prices
    And I extract current description
    And I extract current item names
    When I add them all 1 by 1 in the cart and inspect the pricing
    And I go to checkout
    Then I compare all the results on the final page
    And I compare all calculations
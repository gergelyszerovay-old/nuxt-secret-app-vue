Feature: FormNewSecret

  Scenario Outline: The TTL field accepts only positive integers
    Given I visit /
    When I enter into the TTL field: <TTL>
    Then The TTL field's error message is: <MESSAGE>

    Examples:

      | TTL        | MESSAGE |
      | -1         | You should enter the TTL in minutes or you can set it to 0 |
      | xxx        | You should enter the TTL in minutes or you can set it to 0 |

  Scenario: New secret creation
    Given I visit /
    When I fill the fields
    And I press the Create secret button
    Then The app stores the new secret and shows its link

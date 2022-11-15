describe("App", () => {
  describe("network errors", () => {
    const exec = () => {
      cy.get('[data-testid="init-spinner"]', {
        timeout: 100000,
      }).should("not.exist");
    };

    it("should try again after network error", () => {
      cy.intercept(
        "https://www.anapioficeandfire.com/api/books?page=1&pageSize=6",

        { times: 1 },
        {
          forceNetworkError: true,
        }
      ).as("getNetworkFailure");

      cy.visit("/");
      cy.get('[data-testid="init-spinner"]').should("exist");

      cy.wait("@getNetworkFailure");
      cy.get('[data-testid="init-spinner"]').should("not.exist");
      cy.get('[data-testid="error"]').should("exist");
      cy.get('[data-testid="error"]').contains("Try Again").click();
      cy.get('[data-testid="init-spinner"]').should("exist");
      exec();
      cy.get('[data-testid="book"]').should("have.length", 6);
    });

    it("should try again after network error for getting more more books", () => {
      const url =
        "https://www.anapioficeandfire.com/api/books?page=2&pageSize=6";

      cy.intercept(url, { times: 1 }, { forceNetworkError: true }).as(
        "getNetworkFailure"
      );

      cy.intercept(url).as("getBooks");

      cy.visit("/");

      exec();
      cy.wait(5000);
      cy.get('[data-testid="book"]').eq(5).scrollIntoView();
      cy.get('[data-testid="next-spinner"]').should("exist");
      cy.wait("@getNetworkFailure");
      cy.get('[data-testid="next-spinner"]').should("not.exist");
      cy.get('[data-testid="error"]').should("exist");
      cy.get('[data-testid="error"]').contains("Try Again").click();
      cy.get('[data-testid="next-spinner"]').should("exist");
      cy.wait("@getBooks");
      cy.get('[data-testid="next-spinner"]').should("not.exist");
      cy.get('[data-testid="book"]').should("have.length", 12);
    });
  });
});

import * as moment from "moment";

describe("App", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.get('[data-testid="init-spinner"]', {
      timeout: 100000,
    }).should("not.exist");
  });

  describe("rendering books", () => {
    it("should render the list of books with publisher, name, isbn, authors and end date", () => {
      cy.get('[data-testid="book"]').then((items) => {
        expect(items).to.have.length(6);
        expect(items[0]).to.contain.text("Bantam Books");
        expect(items[0]).to.contain.text("A Game of Thrones");
        expect(items[0]).to.contain.text("978-0553103540");
        expect(items[0]).to.contain.text("George R. R. Martin");
        expect(items[0]).to.contain.text(moment("1996-08-01").format("L"));
      });
    });

    it("should render 6 more books after scrolling to the last book", () => {
      cy.get('[data-testid="book"]').eq(5).scrollIntoView();
      cy.get('[data-testid="next-spinner"]').should("exist");
      cy.intercept(
        "GET",
        "https://www.anapioficeandfire.com/api/books?page=2&pageSize=6"
      ).as("getBooks");
      cy.wait("@getBooks");
      cy.get('[data-testid="next-spinner"]').should("not.exist");
      cy.get('[data-testid="book"]').should("have.length", 12);
    });
  });

  describe("searching for books", () => {
    it("should search for a book using it name", () => {
      cy.get("#search").type("A Game of Thrones");
      cy.get('[data-testid="search-result"]').should("be.visible");
      cy.get('[data-testid="search-result"]')
        .should("contain.text", "A Game of Thrones")
        .click();
      cy.window()
        .its("scrollY")
        .should(
          "equal",
          cy.$$('[data-testid="book"]:nth-child(1)').offset().top - 24
        );
    });

    it("should search for a book using it publisher", () => {
      cy.get("#filter").select("Publisher");
      cy.get("#search").type("Dabel Brothers Publishing");
      cy.get('[data-testid="search-result"]').should("be.visible");
      cy.get('[data-testid="search-result"]')
        .should("contain.text", "The Hedge Knight")
        .click();
    });

    it("should search for a book using it isbn", () => {
      cy.get("#filter").select("ISBN");
      cy.get("#search").type("978-0553108033");
      cy.get('[data-testid="search-result"]').should("be.visible");
      cy.get('[data-testid="search-result"]')
        .should("contain.text", "A Clash of Kings")
        .click();
    });

    it("should search for a book using it end date", () => {
      cy.get("#filter").select("End Date");
      cy.get("#search").type("2000-10-31");
      cy.get('[data-testid="search-result"]').should("be.visible");
      cy.get('[data-testid="search-result"]')
        .should("contain.text", "A Storm of Swords")
        .click();
    });

    it("should search for a book using it authors", () => {
      cy.get("#filter").select("Authors");
      cy.get("#search").type("George R. R. Martin");
      cy.get('[data-testid="search-result"]').should("be.visible");
      cy.get('[data-testid="search-result"]')
        .should("contain.text", "A Feast for Crows")
        .click();
    });

    it("should search for a book using it characters name", () => {
      cy.get("#filter").select("Characters Name");
      cy.get("#search").type("Walder");
      cy.get('[data-testid="search-result"]').should("be.visible");
      cy.get('[data-testid="search-result"]')
        .should("contain.text", "A Game of Thrones")
        .click();
    });

    it("should search for a book using it characters culture", () => {
      cy.get("#filter").select("Characters Culture");
      cy.get("#search").type("Braavosi");
      cy.get('[data-testid="search-result"]').should("be.visible");
      cy.get('[data-testid="search-result"]')
        .should("contain.text", "A Game of Thrones")
        .click();
    });
  });
});

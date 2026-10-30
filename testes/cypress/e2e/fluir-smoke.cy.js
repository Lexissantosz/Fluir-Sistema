describe("Fluir - smoke e validações", () => {
  it("CT001 - login web renderiza", () => {
    cy.visit("/html/login.html");
    cy.get("#loginForm").should("be.visible");
  });
  it("CT007 - login em branco é validado", () => {
    cy.visit("/html/login.html");
    cy.get("#loginForm button[type=submit]").click();
    cy.get("#loginMessage").should("contain.text", "Preencha");
  });
  it("CT038 - formulário cabe em 320px", () => {
    cy.viewport(320,568);
    cy.visit("/html/login.html");
    cy.get("#loginForm").should("be.visible");
    cy.document().then(d => expect(d.documentElement.scrollWidth).to.be.at.most(d.documentElement.clientWidth));
  });
  it("CT025 - quatro atalhos de hidratação aparecem", () => {
    cy.visit("/html/water.html");
    cy.get("[data-water-amount]").should("have.length",4);
  });
  it("CT035 - filtros de conquistas aparecem", () => {
    cy.visit("/html/achievements.html");
    cy.get("[data-filter=all]").should("exist");
    cy.get("[data-filter=unlocked]").should("exist");
  });
});

describe("Fluir - QA visual e funcional (sem dados reais)", () => {
  const reset = (win) => { win.localStorage.clear(); win.sessionStorage.clear(); };

  it("CT001 | login abre com formulario", () => {
    cy.visit("/html/login.html", { onBeforeLoad: reset });
    cy.get("#loginForm").should("be.visible");
    cy.get("#loginForm button[type=submit]").should("contain.text", "Entrar");
  });

  it("CT007 | login vazio mostra validacao", () => {
    cy.visit("/html/login.html", { onBeforeLoad: reset });
    cy.get("#loginForm button[type=submit]").click();
    cy.get("#loginMessage").should("be.visible").and("contain.text", "Preencha");
  });

  it("CT038 | formulario de login no viewport de 320px", () => {
    cy.viewport(320, 568);
    cy.visit("/html/login.html", { onBeforeLoad: reset });
    cy.get("#loginForm").should("be.visible");
    cy.document().then(doc => {
      expect(doc.documentElement.scrollWidth).to.be.at.most(doc.documentElement.clientWidth);
    });
  });

  it("CT025 | registrar 200ml atualiza total e porcentagem", () => {
    cy.visit("/html/water.html", { onBeforeLoad: reset });
    cy.get("#todayCups").should("contain.text", "0ml");
    cy.get('[data-water-amount="200"]').click();
    cy.get("#todayCups").should("contain.text", "200ml");
    cy.get("#waterProgress").should("contain.text", "10%");
    cy.reload();
    cy.get("#todayCups").should("contain.text", "200ml");
  });

  it("CT026 | registrar 250ml incrementa total", () => {
    cy.visit("/html/water.html", { onBeforeLoad: reset });
    cy.get('[data-water-amount="250"]').click();
    cy.get("#todayCups").should("contain.text", "250ml");
  });

  it("CT029 | mais de 1000ml por registro e rejeitado", () => {
    cy.visit("/html/water.html", { onBeforeLoad: reset });
    cy.get("#openCustomWaterBtn").click();
    cy.get("#customWaterAmountInput").clear().type("1001");
    cy.get("#addCustomWaterBtn").click();
    cy.get("#todayCups").should("contain.text", "0ml");
  });

  it("CT035 | filtros de conquistas reagem ao clique", () => {
    cy.visit("/html/achievements.html", { onBeforeLoad: reset });
    cy.get("#achievementsGrid .achievement-card").should("have.length.greaterThan", 0);
    cy.get('[data-filter="locked"]').click();
    cy.get('[data-filter="locked"]').should("have.class", "active");
    cy.get('[data-filter="all"]').click();
    cy.get('[data-filter="all"]').should("have.class", "active");
  });

  it("CT037 | modal de conquista abre e fecha", () => {
    cy.visit("/html/achievements.html", { onBeforeLoad: reset });
    cy.get('#achievementsGrid .achievement-card[data-achievement-id]').first().click();
    cy.get("#achievementModal").should("have.class", "active");
    cy.get("#modalTitle").should("not.be.empty");
    cy.get("#closeAchievementModal").click();
    cy.get("#achievementModal").should("not.have.class", "active");
  });
});

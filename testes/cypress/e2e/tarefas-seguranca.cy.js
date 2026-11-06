// Missão 01B · Segurança de tarefas (Dawid)
// Cenários com interceptações: nenhuma chamada de tarefas chega à produção.
describe("Fluir - tarefas protegidas por Bearer (UC10)", () => {
  const API = "https://fluir-sistema.onrender.com/api/tarefas";
  const user = { id: 42, token: "token-qa-ficticio" };

  const task = (id, completed = false) => ({
    id,
    titulo: `Tarefa fictícia ${id}`,
    descricao: "Dado exclusivo de teste",
    categoria: "Estudos",
    prioridade: "low",
    horario: "",
    dataTarefa: new Date().toLocaleDateString("en-CA"),
    criadoEm: new Date().toISOString(),
    concluida: completed,
  });

  const visitWithSession = (items = []) => {
    cy.intercept("GET", `${API}/usuario/42`, {
      statusCode: 200,
      body: items,
    }).as("listTasks");

    cy.visit("/html/tasks.html", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("fluir-user", JSON.stringify(user));
        win.localStorage.removeItem("fluir-timeline-events");
        win.alert = () => {};
      },
    });

    cy.wait("@listTasks")
      .its("request.headers.authorization")
      .should("eq", `Bearer ${user.token}`);
  };

  it("CT-SEG-01 | GET envia Bearer e lista tarefas", () => {
    visitWithSession([task(1)]);
    cy.get(".task-card").should("have.length", 1);
    cy.get(".task-card").first().should("contain.text", "Tarefa fictícia 1");
  });

  it("CT-SEG-02 | POST envia Bearer e Content-Type JSON", () => {
    visitWithSession([]);

    cy.intercept("POST", API, (request) => {
      expect(request.headers.authorization).to.eq(`Bearer ${user.token}`);
      expect(request.headers["content-type"]).to.include("application/json");
      expect(request.body.usuarioId).to.eq(user.id);
      request.reply({
        statusCode: 200,
        body: { ...task(101), ...request.body, id: 101 },
      });
    }).as("createTask");

    cy.get("#newTaskBtn").click();
    cy.get("#taskTitleInput").type("Tarefa criada no teste");
    cy.get("#saveTaskBtn").click();
    cy.wait("@createTask");
    cy.get(".task-card").should("contain.text", "Tarefa criada no teste");
  });

  it("CT-SEG-03 | PUT de conclusão envia Bearer", () => {
    visitWithSession([task(3)]);

    cy.intercept("PUT", `${API}/3/status?*`, (request) => {
      expect(request.headers.authorization).to.eq(`Bearer ${user.token}`);
      request.reply({ statusCode: 200, body: task(3, true) });
    }).as("completeTask");

    cy.get(".task-card input[type=checkbox]").check();
    cy.wait("@completeTask");
    cy.get(".task-card input[type=checkbox]").should("be.checked");
  });

  it("CT-SEG-04 | DELETE individual envia Bearer", () => {
    visitWithSession([task(4)]);

    cy.intercept("DELETE", `${API}/4`, (request) => {
      expect(request.headers.authorization).to.eq(`Bearer ${user.token}`);
      request.reply({ statusCode: 204 });
    }).as("deleteTask");

    cy.get(".task-card .delete-task-btn").click();
    cy.wait("@deleteTask");
    cy.get(".task-card").should("have.length", 0);
  });

  it("CT-SEG-05 | limpeza em lote envia Bearer em cada DELETE", () => {
    visitWithSession([task(5, true), task(6, true), task(7, false)]);

    [5, 6].forEach((id) => {
      cy.intercept("DELETE", `${API}/${id}`, (request) => {
        expect(request.headers.authorization).to.eq(`Bearer ${user.token}`);
        request.reply({ statusCode: 204 });
      }).as(`delete${id}`);
    });

    cy.get("#clearCompletedBtn").click();
    cy.wait(["@delete5", "@delete6"]);
    cy.get(".task-card").should("have.length", 1);
    cy.get(".task-card").should("contain.text", "Tarefa fictícia 7");
  });

  it("CT-SEG-06 | sem sessão não envia requisição e volta ao login", () => {
    cy.intercept("GET", `${API}/usuario/*`, cy.stub().as("unexpectedGet"));
    cy.visit("/html/tasks.html", {
      onBeforeLoad(win) {
        win.sessionStorage.removeItem("fluir-user");
        win.alert = () => {};
      },
    });
    cy.location("pathname").should("eq", "/html/login.html");
    cy.get("@unexpectedGet").should("not.have.been.called");
  });

  it("CT-SEG-07 | 401 remove sessão e direciona ao login", () => {
    cy.intercept("GET", `${API}/usuario/42`, {
      statusCode: 401,
      body: { mensagem: "Não autenticado" },
    }).as("expiredSession");

    cy.visit("/html/tasks.html", {
      onBeforeLoad(win) {
        win.sessionStorage.setItem("fluir-user", JSON.stringify(user));
        win.alert = () => {};
      },
    });

    cy.wait("@expiredSession");
    cy.location("pathname").should("eq", "/html/login.html");
    cy.window().then((win) => {
      expect(win.sessionStorage.getItem("fluir-user")).to.be.null;
    });
  });

  it("CT-SEG-08 | 403 mantém sessão e estado da tarefa", () => {
    visitWithSession([task(8)]);

    cy.intercept("PUT", `${API}/8/status?*`, {
      statusCode: 403,
      body: { mensagem: "Acesso negado" },
    }).as("forbiddenUpdate");

    cy.get(".task-card input[type=checkbox]").check();
    cy.wait("@forbiddenUpdate");
    cy.get(".task-card input[type=checkbox]").should("not.be.checked");
    cy.location("pathname").should("eq", "/html/tasks.html");
    cy.window().then((win) => {
      expect(JSON.parse(win.sessionStorage.getItem("fluir-user")).id).to.eq(42);
    });
  });
  it("CT-SEG-09 | sessão removida após carregar bloqueia criação", () => {
    visitWithSession([]);

    // Intercepta qualquer POST de tarefas: nenhum deve chegar à API.
    cy.intercept("POST", API, cy.stub().as("unexpectedPost"));

    cy.window().then((win) => {
      win.sessionStorage.removeItem("fluir-user");
    });

    cy.get("#newTaskBtn").click();
    cy.get("#taskTitleInput").type("Tarefa fictícia sem sessão");
    cy.get("#saveTaskBtn").click();

    cy.location("pathname").should("eq", "/html/login.html");
    cy.get("@unexpectedPost").should("not.have.been.called");
  });

  it("CT-SEG-10 | POST com 401 encerra sessão sem criar tarefa", () => {
    visitWithSession([]);

    cy.intercept("POST", API, (request) => {
      expect(request.headers.authorization).to.eq(`Bearer ${user.token}`);
      request.reply({
        statusCode: 401,
        body: { mensagem: "Sessão expirada" },
      });
    }).as("unauthorizedCreate");

    cy.get("#newTaskBtn").click();
    cy.get("#taskTitleInput").type("Tarefa fictícia rejeitada");
    cy.get("#saveTaskBtn").click();

    cy.wait("@unauthorizedCreate");
    cy.location("pathname").should("eq", "/html/login.html");
    cy.window().then((win) => {
      expect(win.sessionStorage.getItem("fluir-user")).to.be.null;
      expect(win.localStorage.getItem("fluir-timeline-events")).to.be.null;
    });
  });

  it("CT-SEG-11 | Enter repetido durante POST pendente não duplica tarefa", () => {
    visitWithSession([]);

    let postCount = 0;
    cy.intercept("POST", API, (request) => {
      postCount += 1;
      request.reply({
        statusCode: 200,
        delay: 800,
        body: { ...task(111), ...request.body, id: 111 },
      });
    }).as("createOnce");

    cy.get("#newTaskBtn").click();
    cy.get("#taskTitleInput").type("Tarefa única");
    cy.get("#taskTitleInput").type("{enter}{enter}{enter}");
    cy.wait("@createOnce");

    cy.get(".task-card").should("have.length", 1);
    cy.get(".task-card").should("contain.text", "Tarefa única");
    cy.then(() => {
      expect(postCount, "apenas uma requisição POST").to.eq(1);
    });
  });

});

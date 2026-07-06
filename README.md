# Fluir

O Fluir é um sistema modular de organização pessoal, pensado para ajudar o usuário a acompanhar diferentes áreas da vida em um só lugar.

A ideia é que cada usuário escolha o que quer acompanhar, e o sistema mostre apenas o que faz sentido para ele.

---

## Ideia central do projeto

O Fluir deve evoluir para um sistema:

- Modular
- Personalizado
- Guiado por perguntas
- Adaptável ao perfil do usuário
- Integrado entre web, mobile, backend e banco de dados

O objetivo é evitar que o usuário entre em um dashboard vazio ou genérico.

---

## Arquitetura do sistema

O Fluir será dividido em três partes principais:

### 1. Frontend Web

A versão web do sistema será feita com:

- HTML
- CSS
- JavaScript

Essa versão roda no navegador e será usada como painel principal do usuário.

Principais telas web:

- Login
- Cadastro
- Onboarding
- Dashboard
- Perfil
- Configurações
- Módulos do sistema

---

### 2. Frontend Mobile

A versão mobile será desenvolvida separadamente da versão web.

Tecnologia planejada:

- React Native
- TypeScript

Essa versão será usada como aplicativo para celular, com telas adaptadas para uso mobile.

O app mobile deverá consumir a mesma API do backend usada pela versão web.

Principais telas mobile planejadas:

- Login
- Cadastro
- Onboarding
- Dashboard mobile
- Perfil
- Configurações
- Módulos escolhidos pelo usuário

---

### 3. Backend/API

O backend será responsável por guardar e fornecer os dados para o frontend web e para o app mobile.

Tecnologia usada:

- Java
- Spring Boot
- MySQL

O backend funcionará como uma API, permitindo que tanto o site web quanto o aplicativo mobile acessem os mesmos dados.

Exemplo de funcionamento:

```text
Frontend Web
        \
         → Backend/API → Banco de Dados
        /
Frontend Mobile
```

---

## Observação sobre Web e Mobile

A versão web e a versão mobile não serão o mesmo projeto visual.

A versão web será feita para navegador, usando HTML, CSS e JavaScript.

A versão mobile será feita como aplicativo, usando React Native com TypeScript.

Mesmo sendo projetos separados, os dois devem usar o mesmo backend e o mesmo banco de dados.

---

## Tecnologias utilizadas

### Web

- HTML
- CSS
- JavaScript

### Mobile

- React Native
- TypeScript

### Backend

- Java
- Spring Boot

### Banco de dados

- MySQL

---

## Fluxo principal desejado

```text
Cadastro/Login
→ Onboarding
→ Escolha de módulos
→ Perguntas específicas
→ Dashboard personalizado
```

No futuro, o fluxo ideal será:

```text
Cadastro realizado
→ Login automático ou autenticação
→ Onboarding
→ Dashboard personalizado
```

---

## Onboarding / Configuração inicial

Após o cadastro ou primeiro login, o usuário deve passar por uma tela de configuração inicial.

O onboarding funciona como uma tela inicial de boas-vindas, usada para conhecer o usuário e preparar o sistema para ele.

### Etapas do onboarding

1. Informações pessoais
2. Escolha de módulos
3. Configuração inicial dos módulos escolhidos

### Informações pessoais

Campos planejados:

- Nome
- Data de nascimento
- Pronomes
- Gênero de nascimento
- Altura
- Peso atual
- Objetivo geral no app

### Objetivos possíveis

- Organizar rotina
- Cuidar da saúde
- Melhorar hábitos
- Acompanhar treinos
- Controlar alimentação
- Monitorar ciclo menstrual
- Controlar finanças
- Registrar emoções / diário

### Observação sobre pronomes e gênero de nascimento

Pronomes e gênero de nascimento devem ser campos separados.

Pronomes servem para personalizar a forma como o sistema trata o usuário.

Gênero de nascimento pode ser usado em funcionalidades específicas de saúde, como ciclo menstrual, caso o usuário queira ativar esse módulo.

---

## Módulos do sistema

O usuário deve poder escolher quais áreas quer usar no Fluir.

### Módulos planejados

- Dashboard
- Timeline
- Tarefas
- Diário
- Água
- Hábitos
- Nutrição
- Treinos / Saúde física
- Ciclo menstrual
- Sono
- Finanças
- Anexos
- Conquistas
- Configurações
- Perfil
- Planos

### Módulos opcionais

- Tarefas
- Diário
- Água
- Hábitos
- Nutrição
- Treinos / Saúde física
- Ciclo menstrual
- Sono
- Finanças

### Módulos fixos

Algumas áreas devem continuar disponíveis mesmo que o usuário não escolha módulos específicos:

- Dashboard
- Timeline
- Anexos
- Conquistas
- Configurações
- Perfil
- Planos

Mensagem sugerida:

```text
Você pode mudar essas escolhas depois nas configurações.
```

---

## Dashboard personalizado

O dashboard deve mostrar apenas os módulos escolhidos pelo usuário.

Exemplo:

Se o usuário escolheu apenas:

- Água
- Hábitos
- Treinos

O dashboard deve esconder:

- Ciclo menstrual
- Nutrição
- Finanças
- Sono
- Diário

A ideia é deixar o sistema mais limpo, útil e personalizado.

---

## Configurações rápidas

Foi criada uma área de configuração rápida na tela `settings.html`.

Essa área permite alterar dados principais sem refazer o onboarding inicial.

Funcionalidades disponíveis:

- Alterar nome ou apelido do usuário
- Alterar meta diária de água
- Ativar ou desativar módulos principais
- Salvar as alterações no `localStorage`
- Atualizar o perfil exibido nas configurações

O onboarding continua sendo usado apenas como tela inicial de boas-vindas e configuração inicial do usuário.

---

## Configurações de módulos

Criar uma área chamada:

```text
Meus módulos
```

ou:

```text
Configurações do Fluir
```

Nessa área, o usuário poderá:

- Ativar módulos que recusou no começo
- Desativar módulos que não usa mais
- Atualizar peso, altura, objetivos e preferências
- Configurar preferências específicas de cada módulo

Quando ativar um módulo novo, o sistema deve fazer as perguntas específicas daquele módulo.

---

## Módulo Água

Usar altura e peso para sugerir uma meta diária de água.

### Funcionalidades planejadas

- Calcular meta automática de água
- Permitir meta manual
- Registrar consumo diário
- Mostrar progresso do dia
- Salvar histórico
- Permitir alteração futura do peso
- Recalcular meta quando necessário

### Cálculo inicial possível

```text
Peso x 35 ml
```

Exemplo:

```text
70 kg x 35 ml = 2450 ml por dia
```

Resultado exibido:

```text
Meta diária: 2,45 L
```

### Preferência de registro de água

No onboarding, perguntar como o usuário prefere registrar a água:

- Por copos personalizados
- Por medidas em ml

### Opção 1: Copos personalizados

O usuário poderá criar copos ou garrafas com quantidades diferentes, por exemplo:

- Copo pequeno: 200 ml
- Copo médio: 300 ml
- Garrafa: 500 ml
- Garrafa grande: 1 L

Essa opção deixa o visual mais concreto e fácil de usar, mostrando os copos criados pela pessoa.

### Opção 2: Medidas em ml

O usuário poderá registrar quantidades diretas, por exemplo:

- 100 ml
- 200 ml
- 300 ml
- 500 ml
- Valor personalizado

Essa opção deixa o visual mais simples, limpo e direto.

### Observação

O usuário deve poder mudar essa preferência depois nas configurações.

---

## Módulo Hábitos

Criar uma área para o usuário montar hábitos e acompanhar frequência.

### Perguntas planejadas

- Qual hábito você quer criar?
- Quantas vezes por semana quer cumprir?
- Em qual horário?
- Quer receber incentivo?
- Esse hábito tem prazo ou é contínuo?

### Categorias de hábitos

- Saúde
- Estudos
- Organização
- Sono
- Água
- Exercícios
- Autocuidado
- Produtividade
- Espiritualidade
- Finanças
- Alimentação

### Sugestões de hábitos

- Beber água ao acordar
- Dormir antes de meia-noite
- Estudar 30 minutos
- Fazer alongamento
- Arrumar o quarto
- Ler algumas páginas
- Anotar como foi o dia
- Evitar celular antes de dormir
- Separar dinheiro da semana
- Planejar o dia seguinte

Também seria interessante ter mensagens de incentivo quando o usuário concluir hábitos.

---

## Módulo Ciclo menstrual

Módulo opcional para quem quiser acompanhar ciclo menstrual.

### Perguntas planejadas

- Você quer acompanhar seu ciclo menstrual?
- Quando começou sua última menstruação?
- Você lembra a data?
- Qual a duração média do seu ciclo?
- Quantos dias costuma durar a menstruação?
- Você quer estimativa de ovulação?
- Você quer registrar sintomas?
- Você está tentando engravidar?

### Opções importantes

- Não lembro
- Prefiro não responder agora
- Não quero usar esse módulo

### Registros possíveis

- Início do ciclo
- Fim do ciclo
- Atraso
- Fluxo
- Cólicas
- Sintomas
- Humor
- Uso de pílula do dia seguinte
- Relações sexuais
- Tentativa de gravidez
- Estimativa de ovulação
- Período fértil estimado

### Aviso importante no sistema

```text
As datas são estimativas e não substituem orientação médica.
```

### Observação

O sistema pode ajudar a organizar informações e estimar datas, mas não deve prometer certeza sobre ovulação, gravidez ou ciclo.

---

## Módulo Nutrição

Criar área para metas alimentares e controle básico de calorias.

### Perguntas planejadas

- Peso atual
- Altura
- Idade
- Objetivo
- Nível de atividade física
- Meta de peso
- Prazo desejado
- Está fazendo dieta?
- Quer emagrecer, manter ou ganhar massa?

### Objetivos possíveis

- Emagrecer
- Manter peso
- Ganhar massa
- Melhorar alimentação
- Organizar refeições

### Funcionalidades planejadas

- Calcular estimativa de calorias diárias
- Mostrar meta calórica no dashboard
- Registrar refeições
- Registrar peso ao longo do tempo
- Acompanhar evolução
- Permitir atualizar meta de peso

### Aviso sugerido

```text
Esse cálculo é apenas uma estimativa inicial.
```

---

## Módulo Treinos / Saúde física

Criar área para montar treinos e acompanhar execução.

### Funcionalidades planejadas

- Criar treino por dia da semana
- Cadastrar exercícios
- Definir séries
- Definir repetições
- Definir tempo de descanso
- Registrar treinos concluídos
- Mostrar treino de hoje
- Mostrar últimos treinos

### Exemplo de treino

```text
Treino: Perna
Dia: Sexta-feira
```

Exercícios:

- Agachamento: 3 séries de 12, descanso de 1 min
- Leg press: 4 séries de 10, descanso de 1 min
- Cadeira extensora: 3 séries de 15, descanso de 45s

Durante o treino, o sistema deve mostrar:

- Exercício atual
- Série atual
- Quantidade de repetições
- Botão "Concluir série"
- Cronômetro de descanso
- Próxima série
- Próximo exercício
- Finalizar treino

Exemplo:

```text
Flexão
Série 1 de 3
12 repetições
```

Botão:

```text
Concluir série
```

Depois:

```text
Descanso: 01:00
```

Ao terminar o descanso:

```text
Flexão
Série 2 de 3
```

No dashboard:

- Treino de hoje
- Últimos treinos
- Próximo treino
- Tempo total treinado

---

## Módulo Diário

Criar área para registros pessoais.

### Funcionalidades planejadas

- Escrever como foi o dia
- Registrar humor
- Registrar acontecimentos importantes
- Adicionar tags
- Ver histórico
- Filtrar por data

### Possíveis perguntas

- Como você está se sentindo hoje?
- Quer escrever algo sobre seu dia?
- Quer marcar esse dia com alguma categoria?

### Categorias possíveis

- Feliz
- Triste
- Ansioso
- Produtivo
- Cansado
- Estressado
- Motivado
- Neutro

---

## Módulo Sono

Criar área para acompanhar sono.

### Perguntas planejadas

- Que horas você costuma dormir?
- Que horas costuma acordar?
- Quantas horas quer dormir por noite?
- Quer registrar qualidade do sono?

### Funcionalidades planejadas

- Registrar horário de dormir
- Registrar horário de acordar
- Calcular horas dormidas
- Mostrar histórico
- Mostrar média semanal
- Relacionar sono com humor ou hábitos futuramente

---

## Módulo Finanças

Criar área para organização financeira pessoal.

### Funcionalidades planejadas

- Registrar ganhos
- Registrar gastos
- Criar metas financeiras
- Separar categorias
- Ver saldo mensal
- Ver histórico

### Categorias possíveis

- Alimentação
- Transporte
- Lazer
- Estudos
- Saúde
- Compras
- Assinaturas
- Outros

### Perguntas possíveis

- Você quer controlar seus gastos?
- Quer criar uma meta de economia?
- Qual valor quer guardar?
- Até quando?

---

## Sistema de incentivo

Criar frases de incentivo no cadastro, dashboard e hábitos.

Usar incentivo em momentos como:

- Quando o usuário conclui um hábito
- Quando bate meta de água
- Quando finaliza treino
- Quando registra diário
- Quando mantém sequência por vários dias

### Exemplos

- Boa, você manteve o ritmo hoje.
- Mais um passo concluído.
- Consistência vale mais que perfeição.
- Você está construindo uma rotina melhor.

Evitar frases exageradamente artificiais ou muito estilo coach.

---

## Sistema de idiomas

Adicionar suporte a múltiplos idiomas no Fluir.

### Idiomas iniciais planejados

- Português do Brasil
- Português de Portugal
- Inglês
- Espanhol

Futuramente, permitir adicionar mais idiomas conforme necessário.

### Funcionalidades planejadas

- Criar seletor de idioma no sistema
- Permitir trocar o idioma nas configurações
- Salvar idioma escolhido pelo usuário
- Aplicar o idioma escolhido em textos, botões, menus, mensagens e telas principais
- Adaptar diferenças entre Português do Brasil e Português de Portugal
- Preparar o sistema para receber novos idiomas no futuro

### Exemplo de idioma salvo

```js
{
  idioma: "pt-BR"
}
```

---

## Desenvolvimento mobile

Criar a versão mobile do Fluir usando React Native com TypeScript.

A versão mobile deverá ter telas próprias para celular e consumir a mesma API do backend usado pela versão web.

---

## Salvar preferências no banco

Futuramente, criar tabelas no backend para salvar as configurações.

### Tabelas possíveis

- usuarios
- perfis_usuario
- modulos_usuario
- metas_agua
- habitos
- registros_habitos
- ciclos_menstruais
- registros_ciclo
- metas_nutricao
- refeicoes
- treinos
- exercicios_treino
- series_treino
- registros_treino
- sono
- financas
- diario

### Observação

Essas tabelas devem ser criadas aos poucos, sem tentar fazer tudo de uma vez.

---

## Ordem sugerida de implementação

Ordem ideal para não quebrar o projeto:

1. Criar tela `onboarding.html`
2. Criar `js/onboarding.js`
3. Criar ou reaproveitar CSS da tela de onboarding
4. Salvar escolhas inicialmente no `localStorage`
5. Fazer dashboard ler os módulos escolhidos
6. Mostrar ou esconder cards no dashboard
7. Criar área de configurações para ativar/desativar módulos
8. Criar tabelas no backend
9. Salvar perfil e módulos no MySQL
10. Criar funcionalidades específicas de cada módulo

---

## Funcionalidades já implementadas

### Onboarding

Status: funcionando em primeira versão.

Já foi feito:

- Criada a tela `html/onboarding.html`
- Criado o arquivo `js/onboarding.js`
- Criado o arquivo `css/onboarding.css`
- Onboarding dividido em 3 etapas
- Etapa 1: informações pessoais
- Etapa 2: escolha de módulos
- Etapa 3: configuração inicial dos módulos escolhidos
- Formulário com nome, pronomes, gênero de nascimento, altura e peso
- Escolha de módulos
- Validação básica dos campos
- Cálculo inicial da meta de água com base no peso
- Água mostra meta calculada por peso
- Água permite escolher meta manual futuramente
- Água permite escolher registro por copos personalizados ou por ml
- Tarefas considera primeira tarefa, tempo estimado, energia que a tarefa gasta e energia atual da pessoa
- Hábitos permite criar primeiro hábito inicial
- Hábitos considera frequência semanal e melhor horário
- Salvamento temporário no `localStorage`
- Redirecionamento para `dashboard.html`
- Dashboard lê os dados salvos pelo onboarding
- Dashboard mostra/esconde módulos conforme a escolha do usuário
- Tarefas virou módulo opcional
- Onboarding ficou mais preparado para o backend salvar dados reais

---

### Fluxo Login → Onboarding → Dashboard

Foi adicionada uma lógica no `js/login.js` para redirecionar o usuário após o login:

- Se o usuário ainda não concluiu o onboarding, deve ir para `onboarding.html`
- Se o usuário já concluiu o onboarding, deve ir direto para `dashboard.html`

Essa lógica ainda precisa ser testada com o backend rodando, porque no PC do curso o Java disponível é Java 11, e o backend Spring Boot atual precisa de Java 17.

Teste necessário no PC com backend funcionando:

1. Rodar o backend Spring Boot
2. Abrir o login pelo Live Server
3. Limpar o onboarding salvo no navegador:

```js
localStorage.removeItem("fluir-setup");
localStorage.removeItem("fluir-onboarding");
```

4. Fazer login com um usuário válido
5. Confirmar se o sistema redireciona para `onboarding.html`
6. Concluir o onboarding
7. Fazer login novamente
8. Confirmar se agora o sistema redireciona para `dashboard.html`

Status:

- Código adicionado no `js/login.js`
- Teste real pendente com backend rodando

---

### Proteção do dashboard

Foi adicionada uma proteção no `js/dashboard.js`.

Se o usuário tentar acessar o dashboard sem ter concluído o onboarding, o sistema redireciona automaticamente para `onboarding.html`.

Status:

- Código adicionado
- Testado no front
- Funcionando com dados do `localStorage`

---

### Configurações rápidas

Foi criada uma área de configuração rápida na tela `settings.html`.

Essa área permite alterar dados principais sem refazer o onboarding inicial.

Funcionalidades disponíveis:

- Alterar nome ou apelido do usuário
- Alterar meta diária de água
- Ativar ou desativar módulos principais
- Salvar as alterações no `localStorage`
- Atualizar o perfil exibido nas configurações

Status:

- HTML criado
- JS criado
- CSS criado
- Testado no front
- Funcionando com dados do `localStorage`

---

### Perfil nas configurações

O card de perfil da tela `settings.html` foi ajustado visualmente.

Melhorias feitas:

- Avatar reduzido
- Nome e e-mail melhor alinhados
- Menos espaço vazio dentro do card
- Botão "Editar perfil" mais integrado ao layout
- Visual mais consistente com os outros cards da tela de configurações

---

## Melhorias futuras

### Backend

- Criar backend completo do onboarding
- Criar endpoints para salvar e buscar onboarding
- Salvar perfil do usuário no banco
- Salvar módulos ativos no banco
- Salvar preferências de água no banco
- Salvar primeira tarefa no banco
- Salvar primeiro hábito no banco
- Integrar configurações rápidas ao backend

---

### Configurações

A tela de configurações já possui edição rápida de dados principais.

Melhorias futuras planejadas:

- Melhorar ainda mais o layout do perfil em telas menores
- Adicionar edição rápida de mais módulos
- Permitir configurar preferências específicas de cada módulo
- Integrar essas configurações ao backend quando a API estiver pronta

---

### Onboarding

Melhorias futuras planejadas:

- Salvar informações no banco de dados
- Permitir que o backend envie os dados já salvos
- Melhorar perguntas específicas por módulo
- Adicionar mais campos personalizados
- Validar melhor os dados inseridos
- Adaptar o onboarding para versão mobile

---

### Dashboard

Melhorias futuras planejadas:

- Melhorar cards de resumo
- Criar indicadores reais por módulo
- Mostrar dados vindos do backend
- Melhorar responsividade
- Adicionar atalhos para módulos ativos
- Criar mensagens de incentivo personalizadas

---

### Eventos, agenda e calendário

Criar uma área de eventos no Fluir para organizar compromissos, lembretes e datas importantes.

Funcionalidades planejadas:

- Criar eventos com título, data e horário
- Adicionar descrição ou observação ao evento
- Definir categoria do evento, como estudo, saúde, trabalho, pessoal ou financeiro
- Mostrar eventos do dia no dashboard
- Criar visualização em calendário
- Visualizar eventos por dia, semana e mês
- Adicionar lembretes futuros
- Integrar eventos com a timeline
- Futuramente permitir integração com Google Calendar

A ideia é que o Fluir também ajude o usuário a organizar compromissos, não apenas hábitos, tarefas e registros pessoais.

### Eventos, agenda e calendário

Criar uma área de eventos no Fluir para o usuário organizar compromissos, lembretes e datas importantes.

Funcionalidades planejadas:

- Criar eventos com título, data e horário
- Adicionar descrição ou observação ao evento
- Definir categoria do evento, como estudo, saúde, trabalho, pessoal ou financeiro
- Mostrar eventos do dia no dashboard
- Criar uma visualização em calendário
- Permitir visualizar eventos por dia, semana e mês
- Adicionar lembretes futuros
- Integrar eventos com a timeline
- Futuramente permitir integração com Google Calendar

A ideia é que o Fluir também ajude o usuário a organizar compromissos e não apenas hábitos, tarefas e registros pessoais.

### Mobile

Melhorias futuras planejadas:

- Criar projeto React Native com TypeScript
- Criar tela de login mobile
- Criar tela de cadastro mobile
- Criar onboarding mobile
- Criar dashboard mobile
- Consumir a mesma API do backend
- Adaptar navegação para celular

---

## Testes pendentes

### Fluxo Login → Onboarding → Dashboard

Ainda precisa ser testado com o backend rodando em um PC com Java 17.

### Backend do onboarding

Quando o backend estiver pronto, testar:

- `POST /api/onboarding/salvar`
- `GET /api/onboarding/usuario/{usuarioId}`

### Integração futura

Depois que o backend do onboarding estiver funcionando, trocar gradualmente o salvamento em `localStorage` por salvamento no banco de dados.

---

## Observações importantes

- O projeto web usa HTML, CSS e JavaScript puro.
- O projeto mobile será separado e usará React Native com TypeScript.
- O backend será compartilhado entre web e mobile.
- O banco de dados será o mesmo para as duas versões.
- O `localStorage` está sendo usado temporariamente no front até a integração com o backend.
- O onboarding é uma experiência inicial de boas-vindas.
- As configurações rápidas servem para alterações simples depois que o usuário já configurou o sistema.

### Melhorias futuras no mobile web

A versão web responsiva já possui navegação mobile, menu lateral e barra inferior, mas algumas telas ainda precisam de ajustes visuais.

Melhorias planejadas:

- Trocar o topo mobile de "Fluir / Organização da vida" para informações do perfil do usuário
- Remover emoji do cumprimento no dashboard mobile
- Melhorar o texto de boas-vindas para não quebrar linha de forma estranha
- Compactar melhor a lista de tarefas de hoje no dashboard mobile
- Corrigir alinhamento das bolinhas/indicadores da timeline mobile
- Melhorar a visualização dos hábitos no mobile
- Aumentar os indicadores de hábitos para ficarem mais visíveis
- Mostrar de forma mais clara se o hábito já foi feito hoje ou não
- Melhorar telas vazias de registros, anexos, nutrição, saúde física e ciclo menstrual
- Revisar cards grandes demais em telas pequenas
- Melhorar a tela de planos no mobile
- Ajustar a tela de água no mobile para ocupar melhor o espaço

### Eventos, agenda e calendário

Criar uma área de eventos no Fluir para organizar compromissos, lembretes e datas importantes.

Funcionalidades planejadas:

- Criar eventos com título, data e horário
- Adicionar descrição ou observação ao evento
- Definir categoria do evento, como estudo, saúde, trabalho, pessoal ou financeiro
- Mostrar eventos do dia no dashboard
- Criar visualização em calendário
- Visualizar eventos por dia, semana e mês
- Adicionar lembretes futuros
- Integrar eventos com a timeline
- Futuramente permitir integração com Google Calendar

A ideia é que o Fluir também ajude o usuário a organizar compromissos, não apenas hábitos, tarefas e registros pessoais.
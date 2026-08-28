# Fluir

O **Fluir** é um sistema modular de organização pessoal criado para reunir diferentes áreas da vida em um só lugar.

A proposta é permitir que cada pessoa escolha quais funcionalidades deseja utilizar, fazendo com que o sistema se adapte à sua rotina em vez de apresentar um painel genérico cheio de recursos desnecessários.

O Fluir busca integrar organização de tarefas, hábitos, saúde, hidratação, sono, alimentação, finanças, registros pessoais e outras áreas em uma experiência única e personalizável.

---

# Ideia central do projeto

O Fluir deve evoluir para um sistema:

- Modular
- Personalizado
- Guiado pelas escolhas do usuário
- Adaptável ao perfil de cada pessoa
- Integrado entre frontend, backend e banco de dados
- Preparado para web e aplicativo mobile
- Capaz de conectar informações entre diferentes módulos

O objetivo é evitar que o usuário entre em um dashboard vazio ou genérico.

Cada pessoa poderá ativar apenas as áreas que deseja acompanhar e alterar essas escolhas posteriormente.

---

# Arquitetura do sistema

O Fluir é dividido em diferentes partes que compartilham os mesmos dados através do backend.

```text
Frontend Web
       \
        → Backend / API → Banco de dados
       /
Aplicativo Mobile
```

---

## Frontend Web

A versão web é atualmente a principal versão em desenvolvimento.

Tecnologias:

- HTML
- CSS
- JavaScript

Ela funciona diretamente no navegador e contém as principais telas e módulos do Fluir.

Entre as telas existentes estão:

- Login
- Cadastro
- Configuração inicial
- Dashboard
- Timeline
- Tarefas
- Hábitos
- Água
- Sono
- Finanças
- Diário emocional
- Alimentação
- Saúde física
- Ciclo menstrual
- Anexos
- Conquistas
- Configurações
- Perfil
- Planos

Alguns módulos ainda utilizam `localStorage` temporariamente enquanto a integração com o backend acontece gradualmente.

---

## Aplicativo Mobile

O aplicativo mobile definitivo será desenvolvido separadamente da versão web.

Tecnologias planejadas:

- React Native
- TypeScript

O aplicativo deverá possuir interfaces próprias para celular, mas compartilhar o mesmo backend e banco de dados utilizados pela versão web.

A ideia é desenvolver o aplicativo mobile depois que as principais funcionalidades e regras de negócio da versão web estiverem mais consolidadas.

### Observação sobre a pasta `mobile`

Atualmente existe uma pasta `mobile/` no repositório contendo um protótipo baseado em:

- React
- TypeScript
- Vite

Esse projeto não é o aplicativo React Native definitivo.

A arquitetura do aplicativo mobile ainda deverá ser definida e organizada antes do desenvolvimento da versão nativa.

---

## Backend / API

O backend centraliza os dados e regras compartilhadas pelo sistema.

Tecnologias utilizadas:

- Java 21
- Spring Boot
- Spring Data JPA
- Spring Security
- Flyway

O backend funciona como uma API REST utilizada pela versão web e deverá futuramente ser utilizada também pelo aplicativo mobile.

A presença do Spring Security atualmente não significa que todo o sistema de autenticação e autorização esteja finalizado.

---

## Banco de dados

O banco de dados utilizado atualmente é:

- PostgreSQL

As alterações de estrutura do banco são controladas através de migrations utilizando Flyway.

O objetivo é que tanto a versão web quanto o futuro aplicativo mobile trabalhem com os mesmos dados através do backend.

---

# Tecnologias utilizadas

## Web

- HTML
- CSS
- JavaScript

## Mobile planejado

- React Native
- TypeScript

## Protótipo mobile atual

- React
- TypeScript
- Vite

## Backend

- Java 21
- Spring Boot
- Spring Data JPA
- Spring Security
- Flyway

## Banco de dados

- PostgreSQL

---

# Fluxo principal do sistema

O fluxo atual planejado para o usuário é:

```text
Cadastro / Login
        ↓
Configuração inicial
        ↓
Escolha de módulos
        ↓
Preferências dos módulos
        ↓
Revisão
        ↓
Dashboard personalizado
```

Após entrar no sistema, o usuário deve ser direcionado para a configuração inicial caso ainda não tenha concluído o onboarding.

Caso já tenha concluído, deverá acessar diretamente o dashboard.

### Situação atual

O login já possui integração com o backend.

Entretanto, a decisão entre abrir a configuração inicial ou acessar diretamente o dashboard ainda depende de informações mantidas temporariamente no `localStorage`.

### Fluxo desejado

Futuramente:

```text
Login
  ↓
Backend verifica onboarding
  ↓
Onboarding necessário?
  ↓
Sim → Configuração inicial
Não → Dashboard
```

O backend deverá ser a fonte oficial para decidir se o onboarding já foi concluído.

---

# Onboarding

O onboarding é a experiência de configuração inicial do Fluir.

Sua função é conhecer algumas características e preferências do usuário antes de montar o dashboard.

Arquivos principais:

```text
html/setup.html
css/setup.css
js/setup.js
```

---

## Etapas atuais

O onboarding possui **4 etapas**.

### 1. Sobre você

São coletadas informações como:

- Nome
- Nome ou apelido de preferência
- Sexo atribuído ao nascer
- Pronomes
- Pronomes personalizados
- Idade
- Forma de comunicação preferida

A idade atualmente possui validação entre:

```text
13 e 120 anos
```

---

### 2. Funcionalidades

O usuário escolhe quais áreas do Fluir deseja utilizar.

A Timeline permanece disponível como parte estrutural do sistema.

Outros módulos podem ser ativados conforme a necessidade da pessoa.

---

### 3. Preferências

O sistema gera perguntas diferentes dependendo dos módulos selecionados.

Atualmente existem perguntas específicas relacionadas a:

- Tarefas
- Hábitos
- Sono
- Água
- Finanças
- Diário emocional
- Alimentação
- Saúde física
- Ciclo menstrual
- Anexos

---

### 4. Revisão final

Antes de concluir, o usuário pode revisar:

- Dados pessoais
- Funcionalidades escolhidas
- Preferências configuradas

Depois da conclusão, o usuário é direcionado para o dashboard.

---

## Integração atual do onboarding

O onboarding já possui integração parcial com o backend.

Atualmente são enviados:

- ID do usuário
- Nome
- Apelido
- Pronomes
- Sexo/gênero atribuído ao nascer
- Módulos ativos

Parte das demais preferências ainda permanece temporariamente no `localStorage`.

A migração deverá acontecer gradualmente para evitar quebrar módulos que ainda dependem desses dados locais.

---

# Módulos do sistema

O Fluir possui módulos estruturais e módulos opcionais.

---

## Áreas estruturais

São áreas relacionadas ao funcionamento geral do sistema:

- Dashboard
- Timeline
- Conquistas
- Configurações
- Perfil
- Planos

---

## Módulos opcionais

O usuário pode escolher quais deseja utilizar:

- Tarefas
- Hábitos
- Água
- Sono
- Finanças
- Diário emocional
- Alimentação / Nutrição
- Saúde física / Treinos
- Ciclo menstrual
- Anexos

O sistema deve permitir que essas escolhas sejam alteradas posteriormente.

---

# Dashboard

O dashboard funciona como a tela central do Fluir.

Ele deve reunir informações importantes dos módulos ativados pelo usuário.

### Comportamentos desejados

- Mostrar apenas módulos relevantes
- Apresentar resumo do dia
- Mostrar tarefas
- Mostrar hábitos
- Mostrar hidratação
- Mostrar sono
- Mostrar finanças
- Mostrar registros recentes
- Mostrar progresso
- Apresentar atalhos para módulos
- Exibir mensagens adaptadas ao usuário

### Situação atual

Já existe lógica para mostrar ou esconder partes do dashboard dependendo dos módulos escolhidos.

Alguns dados ainda são obtidos de `localStorage`, enquanto outros módulos já possuem integração com o backend.

Essa diferença deverá ser eliminada gradualmente.

---

# Configurações

A área de configurações permite modificar preferências depois da configuração inicial.

Atualmente existe uma área de configurações rápidas.

Ela permite alterar dados como:

- Nome
- Apelido
- Meta de água
- Alguns módulos ativos
- Tema do sistema

Parte dessas alterações ainda é armazenada localmente.

---

## Meus módulos

O sistema deverá possuir uma área completa para gerenciamento de módulos.

O usuário deverá poder:

- Ativar módulos novos
- Desativar módulos
- Alterar preferências
- Configurar detalhes específicos
- Atualizar informações utilizadas pelos módulos

Ao ativar um módulo novo, o Fluir poderá apresentar as perguntas necessárias para configurar aquela área.

---

# Timeline e Eventos

A Timeline reúne acontecimentos e registros realizados dentro do Fluir.

Ela deve funcionar como uma visão cronológica das ações e eventos do usuário.

---

## Eventos, agenda e calendário

Também está planejada uma área própria para organização de compromissos.

### Funcionalidades planejadas

- Criar eventos
- Definir título
- Definir data
- Definir horário
- Adicionar descrição
- Adicionar observações
- Definir categoria

Categorias possíveis:

- Estudos
- Saúde
- Trabalho
- Pessoal
- Financeiro

Também estão planejados:

- Mostrar eventos do dia no dashboard
- Visualização em calendário
- Visualização por dia
- Visualização por semana
- Visualização por mês
- Lembretes futuros
- Integração com a Timeline
- Futuramente integração com Google Calendar

A proposta é fazer com que o Fluir ajude a organizar compromissos e datas importantes, além de hábitos, tarefas e registros pessoais.

---

# Tarefas

O módulo de tarefas permite organizar atividades e pendências.

### Funcionalidades existentes

- Criar tarefas
- Definir título
- Definir descrição
- Definir categoria
- Definir prioridade
- Definir horário
- Definir data
- Marcar tarefa como concluída
- Reabrir tarefa
- Excluir tarefa
- Filtrar tarefas
- Visualizar tarefas por período

### Backend

O módulo de Tarefas já possui integração com o backend.

As tarefas são carregadas e alteradas através da API.

Essa integração deverá servir como referência para a migração dos demais módulos.

---

# Hábitos

O módulo de Hábitos permite criar atividades recorrentes e acompanhar consistência.

### Informações utilizadas

- Nome do hábito
- Categoria
- Frequência
- Dias da semana
- Horário
- Progresso
- Histórico de conclusão

### Frequência

O sistema deve permitir frequências flexíveis como:

- Todos os dias
- Dias específicos
- 1 vez por semana
- 2 vezes por semana
- 3 vezes por semana
- Frequência personalizada

### Funcionalidades futuras

- Melhorar visualização de sequências
- Melhorar indicadores de progresso
- Criar incentivos contextuais
- Integrar completamente ao backend

---

# Água

O módulo Água permite acompanhar a hidratação diária.

### Funcionalidades

- Definir meta diária
- Registrar água consumida
- Mostrar progresso diário
- Mostrar histórico
- Registrar valores personalizados
- Utilizar medidas em ml
- Utilizar copos ou garrafas
- Ajustar preferências posteriormente

---

## Sugestão automática de consumo

O sistema pode sugerir uma meta inicial utilizando:

```text
Peso × 35 ml
```

Exemplo:

```text
70 kg × 35 ml = 2450 ml
```

Resultado:

```text
2,45 L por dia
```

Essa sugestão é apenas uma referência inicial e pode ser alterada pelo usuário.

---

## Copos personalizados

O usuário poderá ter recipientes personalizados, por exemplo:

- Copo pequeno
- Copo médio
- Copo grande
- Garrafa
- Garrafa grande

Cada recipiente poderá possuir uma quantidade diferente.

### Personalização futura

Uma ideia futura é permitir que o usuário personalize visualmente seus próprios copos.

Uma versão mais avançada poderá possuir um editor de desenho interno semelhante a uma ferramenta simples de pintura.

---

## Melhorias pendentes

- Permitir editar copos personalizados
- Definir limites adequados para registros de consumo
- Adicionar confirmação antes de reiniciar o consumo diário
- Padronizar os botões de adicionar água
- Melhorar interface mobile

---

# Sono

O módulo Sono permite acompanhar a rotina de descanso.

### Dados acompanhados

- Horário de dormir
- Horário de acordar
- Duração do sono
- Meta de sono
- Qualidade do sono

### Funcionalidades

- Registrar sono
- Calcular duração
- Mostrar histórico
- Mostrar médias

### Melhorias planejadas

- Permitir editar registros de sono
- Selecionar diferentes dias
- Não limitar a visualização somente à última noite
- Melhorar integração com outros módulos futuramente

Exemplos de possíveis relações:

- Sono e humor
- Sono e hábitos
- Sono e energia
- Sono e treino

---

# Finanças

O módulo Finanças ajuda na organização financeira pessoal.

### Funcionalidades

- Registrar entradas
- Registrar saídas
- Definir categorias
- Acompanhar saldo
- Ver histórico
- Criar metas financeiras

Categorias possíveis:

- Alimentação
- Transporte
- Lazer
- Estudos
- Saúde
- Compras
- Assinaturas
- Casa
- Dívidas
- Investimentos
- Outros

---

## Melhorias planejadas

- Formatar valores automaticamente como moeda brasileira
- Exibir valores em `R$`
- Limitar valores inválidos ou excessivamente grandes
- Melhorar formulário de novos lançamentos
- Evitar fechamento acidental do formulário/modal
- Permitir excluir lançamentos
- Pedir confirmação antes da exclusão
- Integrar dados ao backend

---

# Diário emocional

O Diário permite registrar pensamentos, acontecimentos e emoções.

### Funcionalidades

- Escrever sobre o dia
- Registrar humor
- Registrar acontecimentos importantes
- Utilizar categorias
- Consultar histórico

Categorias possíveis:

- Feliz
- Triste
- Ansioso
- Produtivo
- Cansado
- Estressado
- Motivado
- Neutro

### Melhorias planejadas

- Editar registros
- Excluir registros
- Pedir confirmação antes de excluir
- Melhorar filtros por data
- Integrar ao backend

---

# Alimentação / Nutrição

O módulo Alimentação ajuda a acompanhar refeições e objetivos relacionados à alimentação.

### Informações possíveis

- Altura
- Peso
- Objetivo
- Número de refeições
- Restrições
- Observações alimentares

Objetivos possíveis:

- Melhorar alimentação
- Emagrecer
- Manter peso
- Ganhar massa
- Organizar refeições
- Melhorar energia

### Funcionalidades planejadas

- Registrar refeições
- Mostrar histórico
- Registrar peso
- Acompanhar evolução
- Definir metas
- Mostrar informações no dashboard

### Pendência conhecida

Os registros realizados na área de alimentação ainda precisam ser revisados para garantir que sejam corretamente exibidos no histórico.

---

# Saúde física / Treinos

O módulo Saúde física deverá permitir acompanhar atividade física, treinos e evolução.

### Informações possíveis

- Frequência semanal
- Tipo de atividade
- Energia
- Dores
- Limitações
- Observações

### Tipos de atividade

- Musculação
- Corrida
- Caminhada
- Cardio
- Alongamento
- Outros

---

## Sistema de treinos planejado

Futuramente será possível:

- Criar treinos
- Organizar treino por dia da semana
- Cadastrar exercícios
- Definir séries
- Definir repetições
- Definir descanso
- Registrar conclusão
- Mostrar treino atual
- Mostrar próximo exercício
- Mostrar próximos treinos

Exemplo:

```text
Treino: Perna
Dia: Sexta-feira

Agachamento
3 séries de 12
Descanso: 1 minuto
```

Durante o treino:

```text
Agachamento

Série 1 de 3
12 repetições

[ Concluir série ]
```

Depois:

```text
Descanso
00:59
```

---

# Ciclo menstrual

O módulo Ciclo menstrual é opcional.

Seu objetivo é ajudar o usuário a organizar informações relacionadas ao ciclo.

### Informações que podem ser acompanhadas

- Última menstruação
- Duração do ciclo
- Duração do sangramento
- Regularidade
- Fluxo
- Cólicas
- Sintomas
- Humor
- Métodos hormonais
- Histórico

### Sintomas possíveis

- Cólicas
- Dor de cabeça
- Inchaço
- Alterações de humor
- Cansaço
- Acne
- Desejos alimentares

O usuário deve poder deixar perguntas sem resposta quando não desejar informar determinados dados.

### Aviso

```text
As informações e datas apresentadas são estimativas e não substituem avaliação ou orientação médica.
```

O sistema não deve apresentar previsões relacionadas a ovulação, gravidez ou ciclo como certezas.

---

# Anexos

O módulo Anexos permite guardar referências e documentos relacionados às diferentes áreas do Fluir.

### Tipos possíveis

- PDFs
- Imagens
- Comprovantes
- Documentos
- Relatórios
- Arquivos de estudo
- Links

Os anexos poderão futuramente ser relacionados a:

- Tarefas
- Finanças
- Diário
- Saúde
- Alimentação

### Melhorias pendentes

- Validar URLs antes de salvar links
- Melhorar integração com outros módulos
- Corrigir inconsistências de navegação relacionadas ao menu

---

# Conquistas

O Fluir possui uma área de Conquistas relacionada à gamificação.

As conquistas podem considerar informações de diferentes módulos.

Exemplos:

- Primeiras tarefas concluídas
- Hábitos cumpridos
- Metas de água
- Registros de sono
- Uso do sistema
- Consistência

O sistema de conquistas deverá evoluir junto com a integração dos módulos ao backend.

---

# Sistema de incentivo

O Fluir pode apresentar mensagens de incentivo em diferentes momentos.

Exemplos:

- Conclusão de uma tarefa
- Conclusão de um hábito
- Meta de água atingida
- Treino finalizado
- Registro no diário
- Sequência mantida

As mensagens devem evitar um estilo exageradamente artificial ou excessivamente motivacional.

A comunicação deve respeitar o tom escolhido pelo usuário durante a configuração inicial.

---

# Sistema de idiomas

Existe planejamento para suporte a diferentes idiomas.

Idiomas iniciais desejados:

- Português do Brasil
- Português de Portugal
- Inglês
- Espanhol

### Funcionalidades necessárias

- Selecionar idioma
- Salvar preferência
- Traduzir textos
- Traduzir menus
- Traduzir botões
- Traduzir mensagens
- Traduzir telas
- Preparar estrutura para novos idiomas

A existência de um seletor visual de idioma não significa que o sistema de internacionalização esteja completamente implementado.

---

# Mobile Web

A versão web já possui adaptações para telas menores.

Entre os recursos existentes estão:

- Navegação mobile
- Menu lateral mobile
- Barra inferior
- Layout responsivo

Ainda existem telas que precisam de ajustes visuais.

---

## Dashboard mobile

Melhorias planejadas:

- Remover emoji do cumprimento
- Melhorar quebra de linha da mensagem de boas-vindas
- Compactar a lista de tarefas do dia

---

## Timeline mobile

- Corrigir alinhamento dos indicadores visuais

---

## Hábitos mobile

- Melhorar visualização dos hábitos
- Aumentar indicadores
- Mostrar claramente se o hábito foi concluído no dia

---

## Telas vazias

Melhorar estados vazios em áreas como:

- Anexos
- Alimentação
- Saúde física
- Ciclo menstrual
- Registros sem conteúdo

---

## Outros ajustes mobile

- Revisar cards grandes em telas pequenas
- Melhorar tela de Planos
- Melhorar aproveitamento de espaço na tela de Água

---

# Aplicativo Mobile

O aplicativo mobile nativo será desenvolvido futuramente com:

- React Native
- TypeScript

Principais telas planejadas:

- Login
- Cadastro
- Onboarding
- Dashboard
- Perfil
- Configurações
- Timeline
- Tarefas
- Hábitos
- Água
- Sono
- Outros módulos habilitados pelo usuário

O aplicativo deverá utilizar a mesma API do backend da versão web.

---

# Persistência de dados

O projeto está em processo de migração de armazenamento local para armazenamento através do backend.

O `localStorage` ainda é utilizado por módulos que não foram completamente integrados.

Essa migração será feita gradualmente.

---

## Situação geral

| Área | Situação |
|---|---|
| Login | Integrado ao backend |
| Cadastro | Integrado ao backend |
| Onboarding | Integração parcial |
| Dashboard | Dados mistos entre local e backend |
| Tarefas | Integrado ao backend |
| Hábitos | Versão inicial / armazenamento local |
| Água | Versão inicial / armazenamento local |
| Sono | Versão inicial / armazenamento local |
| Finanças | Versão inicial / armazenamento local |
| Diário | Versão inicial / armazenamento local |
| Alimentação | Versão inicial / armazenamento local |
| Saúde física | Versão inicial / armazenamento local |
| Ciclo menstrual | Versão inicial / armazenamento local |
| Anexos | Versão inicial / armazenamento local |
| Timeline | Integração parcial entre módulos |
| Conquistas | Calculadas a partir dos dados disponíveis |
| Configurações | Principalmente armazenamento local |

---

# Melhorias gerais conhecidas

Alguns problemas afetam mais de uma página e deverão ser corrigidos de forma global.

### Interface

- Melhorar visual individual das abas
- Tornar os seletores de período realmente funcionais
- Padronizar ícones entre páginas
- Corrigir pequenos glitches da sidebar
- Manter navegação consistente entre todos os módulos

### Dados

- Reduzir dependência do `localStorage`
- Evitar módulos utilizando fontes de dados diferentes
- Utilizar o backend como fonte principal
- Manter Dashboard e Timeline sincronizados com os módulos

---

# Funcionalidades futuras

Além das melhorias específicas de cada módulo, existem funcionalidades planejadas para versões futuras.

### Busca global

Pesquisar informações entre diferentes módulos.

---

### Relatórios

Criar relatórios:

- Semanais
- Mensais

Possíveis informações:

- Tarefas
- Hábitos
- Sono
- Água
- Finanças
- Humor
- Alimentação
- Treinos

---

### Notificações e lembretes

Criar um sistema real de notificações configuráveis.

Exemplos:

- Tarefas
- Hábitos
- Água
- Sono
- Eventos
- Ciclo

---

### Streaks

Melhorar visualização de sequências de dias.

---

### Exportação de dados

Permitir exportar dados do usuário.

Formatos possíveis:

- JSON
- CSV

---

### Modo offline

Futuramente permitir uso parcial sem conexão com sincronização posterior.

---

### Tour guiado

Criar explicações contextuais para ajudar usuários a entender cada módulo.

---

### Google Calendar

Futuramente permitir sincronização entre eventos do Fluir e Google Calendar.

---

# Testes

O projeto deverá possuir testes funcionais e de integração conforme os módulos forem evoluindo.

### Fluxos importantes

- Cadastro
- Login
- Onboarding
- Dashboard
- Criação de tarefas
- Alteração de tarefas
- Exclusão de tarefas
- Configurações
- Ativação e desativação de módulos

### Testes de regressão

Após mudanças maiores, revisar:

- Dashboard
- Timeline
- Tarefas
- Hábitos
- Sono
- Água
- Finanças
- Diário
- Alimentação
- Anexos
- Navegação
- Responsividade

---

# Limitações atuais

O Fluir ainda está em desenvolvimento.

Algumas funcionalidades possuem interface pronta, mas ainda dependem de dados locais.

Também existem áreas onde frontend e backend ainda não estão completamente sincronizados.

Entre as limitações atuais estão:

- Uso temporário de `localStorage`
- Onboarding parcialmente integrado
- Configurações ainda não completamente integradas
- Alguns módulos sem API própria
- Timeline ainda dependente de dados locais
- Dashboard ainda utilizando dados locais em algumas áreas
- Aplicativo mobile nativo ainda não iniciado
- Sistema de idiomas ainda incompleto
- Notificações reais ainda não implementadas

---

# Estratégia de desenvolvimento

Para evitar retrabalho, o projeto deve evoluir gradualmente.

Uma ordem recomendada é:

```text
1. Corrigir problemas globais do frontend
2. Revisar Dashboard
3. Revisar Timeline
4. Finalizar comportamento dos módulos
5. Revisar Mobile Web
6. Integrar módulos ao backend
7. Remover dependências antigas de localStorage
8. Realizar testes gerais
9. Desenvolver funcionalidades futuras
10. Desenvolver aplicativo mobile nativo
```

A ideia é definir bem o comportamento de cada módulo antes de criar toda a infraestrutura de backend correspondente.

---

# Objetivo final

O objetivo do Fluir é funcionar como um sistema pessoal centralizado capaz de conectar diferentes áreas da rotina.

Em vez de utilizar vários aplicativos separados para tarefas, hábitos, água, sono, finanças, alimentação, diário e saúde, o usuário poderá escolher quais recursos deseja acompanhar dentro de uma única plataforma.

O sistema deverá continuar priorizando:

- Personalização
- Modularidade
- Clareza
- Controle do usuário
- Integração entre módulos
- Evolução gradual

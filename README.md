# Fluir
## Melhorias futuras planejadas para o Fluir

O Fluir deve evoluir para um sistema modular, personalizado e guiado por perguntas.  
A ideia é que cada usuário escolha o que quer acompanhar, e o sistema mostre apenas o que faz sentido para ele.

---

## 1. Onboarding / Configuração inicial

Após o cadastro ou primeiro login, o usuário deve passar por uma tela de configuração inicial.

Fluxo desejado:

Cadastro/Login  
→ Configuração inicial  
→ Escolha de módulos  
→ Perguntas específicas  
→ Dashboard personalizado

A ideia é evitar que o usuário entre em um dashboard vazio ou genérico.

---

## 2. Perfil pessoal

Criar uma etapa para coletar dados básicos do usuário.

Perguntas planejadas:

- Nome
- Data de nascimento
- Pronomes
- Gênero de nascimento
- Altura
- Peso atual
- Objetivo geral no app

Objetivos possíveis:

- Organizar rotina
- Cuidar da saúde
- Melhorar hábitos
- Acompanhar treinos
- Controlar alimentação
- Monitorar ciclo menstrual
- Controlar finanças
- Registrar emoções / diário

Observação:

Pronomes e gênero de nascimento devem ser campos separados.  
Pronomes servem para personalizar a forma como o sistema trata o usuário.  
Gênero de nascimento pode ser usado em funcionalidades específicas de saúde, como ciclo menstrual, caso o usuário queira ativar esse módulo.

---

## 3. Escolha de módulos

Permitir que o usuário escolha quais áreas quer usar no Fluir.

Módulos planejados:

- Diário
- Água
- Hábitos
- Nutrição
- Treinos / Saúde física
- Ciclo menstrual
- Sono
- Finanças

O usuário deve poder ativar ou desativar módulos depois nas configurações.

Mensagem sugerida:

"Você pode mudar essas escolhas depois nas configurações."

---

## 4. Dashboard personalizado

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

## 5. Configurações de módulos

Criar uma área chamada:

- Meus módulos

ou

- Configurações do Fluir

Nessa área, o usuário poderá:

- Ativar módulos que recusou no começo
- Desativar módulos que não usa mais
- Editar respostas do onboarding
- Atualizar peso, altura, objetivos e preferências

Quando ativar um módulo novo, o sistema deve fazer as perguntas específicas daquele módulo.

---

## 6. Módulo Água

Usar altura e peso para sugerir uma meta diária de água.

Funcionalidades planejadas:

- Calcular meta automática de água
- Permitir meta manual
- Registrar consumo diário
- Mostrar progresso do dia
- Salvar histórico
- Permitir alteração futura do peso
- Recalcular meta quando necessário

Cálculo inicial possível:

Peso x 35 ml

Exemplo:

70 kg x 35 ml = 2450 ml por dia

Resultado exibido:

Meta diária: 2,45 L

---

## 7. Módulo Hábitos

Criar uma área para o usuário montar hábitos e acompanhar frequência.

Perguntas planejadas:

- Qual hábito você quer criar?
- Quantas vezes por semana quer cumprir?
- Em qual horário?
- Quer receber incentivo?
- Esse hábito tem prazo ou é contínuo?

Categorias de hábitos:

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

Sugestões de hábitos:

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

## 8. Módulo Ciclo menstrual

Módulo opcional para quem quiser acompanhar ciclo menstrual.

Perguntas planejadas:

- Você quer acompanhar seu ciclo menstrual?
- Quando começou sua última menstruação?
- Você lembra a data?
- Qual a duração média do seu ciclo?
- Quantos dias costuma durar a menstruação?
- Você quer estimativa de ovulação?
- Você quer registrar sintomas?
- Você está tentando engravidar?

Opções importantes:

- Não lembro
- Prefiro não responder agora
- Não quero usar esse módulo

Registros possíveis:

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

Aviso importante no sistema:

"As datas são estimativas e não substituem orientação médica."

Observação:

O sistema pode ajudar a organizar informações e estimar datas, mas não deve prometer certeza sobre ovulação, gravidez ou ciclo.

---

## 9. Módulo Nutrição

Criar área para metas alimentares e controle básico de calorias.

Perguntas planejadas:

- Peso atual
- Altura
- Idade
- Objetivo
- Nível de atividade física
- Meta de peso
- Prazo desejado
- Está fazendo dieta?
- Quer emagrecer, manter ou ganhar massa?

Objetivos possíveis:

- Emagrecer
- Manter peso
- Ganhar massa
- Melhorar alimentação
- Organizar refeições

Funcionalidades planejadas:

- Calcular estimativa de calorias diárias
- Mostrar meta calórica no dashboard
- Registrar refeições
- Registrar peso ao longo do tempo
- Acompanhar evolução
- Permitir atualizar meta de peso

Aviso sugerido:

"Esse cálculo é apenas uma estimativa inicial."

---

## 10. Módulo Treinos / Saúde física

Criar área para montar treinos e acompanhar execução.

Funcionalidades planejadas:

- Criar treino por dia da semana
- Cadastrar exercícios
- Definir séries
- Definir repetições
- Definir tempo de descanso
- Registrar treinos concluídos
- Mostrar treino de hoje
- Mostrar últimos treinos

Exemplo de treino:

Treino: Perna  
Dia: Sexta-feira

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

Flexão  
Série 1 de 3  
12 repetições

Botão: Concluir série

Depois:

Descanso: 01:00

Ao terminar o descanso:

Flexão  
Série 2 de 3

No dashboard:

- Treino de hoje
- Últimos treinos
- Próximo treino
- Tempo total treinado

---

## 11. Módulo Diário

Criar área para registros pessoais.

Funcionalidades planejadas:

- Escrever como foi o dia
- Registrar humor
- Registrar acontecimentos importantes
- Adicionar tags
- Ver histórico
- Filtrar por data

Possíveis perguntas:

- Como você está se sentindo hoje?
- Quer escrever algo sobre seu dia?
- Quer marcar esse dia com alguma categoria?

Categorias possíveis:

- Feliz
- Triste
- Ansioso
- Produtivo
- Cansado
- Estressado
- Motivado
- Neutro

---

## 12. Módulo Sono

Criar área para acompanhar sono.

Perguntas planejadas:

- Que horas você costuma dormir?
- Que horas costuma acordar?
- Quantas horas quer dormir por noite?
- Quer registrar qualidade do sono?

Funcionalidades planejadas:

- Registrar horário de dormir
- Registrar horário de acordar
- Calcular horas dormidas
- Mostrar histórico
- Mostrar média semanal
- Relacionar sono com humor ou hábitos futuramente

---

## 13. Módulo Finanças

Criar área para organização financeira pessoal.

Funcionalidades planejadas:

- Registrar ganhos
- Registrar gastos
- Criar metas financeiras
- Separar categorias
- Ver saldo mensal
- Ver histórico

Categorias possíveis:

- Alimentação
- Transporte
- Lazer
- Estudos
- Saúde
- Compras
- Assinaturas
- Outros

Perguntas possíveis:

- Você quer controlar seus gastos?
- Quer criar uma meta de economia?
- Qual valor quer guardar?
- Até quando?

---

## 14. Sistema de incentivo

Criar frases de incentivo no cadastro, dashboard e hábitos.

Usar incentivo em momentos como:

- Quando o usuário conclui um hábito
- Quando bate meta de água
- Quando finaliza treino
- Quando registra diário
- Quando mantém sequência por vários dias

Exemplos:

- Boa, você manteve o ritmo hoje.
- Mais um passo concluído.
- Consistência vale mais que perfeição.
- Você está construindo uma rotina melhor.

Evitar frases exageradamente artificiais ou muito estilo coach.

---

## 15. Melhorar fluxo depois do cadastro

Hoje o cadastro cria a conta e manda o usuário fazer login.

Fluxo futuro desejado:

Cadastro realizado  
→ Ir para onboarding  
→ Salvar preferências  
→ Ir para dashboard

Ou:

Cadastro realizado  
→ Login automático  
→ Onboarding  
→ Dashboard

---

## 16. Salvar preferências no banco

Futuramente, criar tabelas no backend para salvar as configurações.

Tabelas possíveis:

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

Observação:

Essas tabelas devem ser criadas aos poucos, sem tentar fazer tudo de uma vez.

---

## 17. Ordem sugerida de implementação

Ordem ideal para não quebrar o projeto:

1. Criar tela onboarding.html
2. Criar js/onboarding.js
3. Reaproveitar ou criar CSS da tela de onboarding
4. Salvar escolhas inicialmente no localStorage
5. Fazer dashboard ler os módulos escolhidos
6. Mostrar/esconder cards no dashboard
7. Criar área de configurações para ativar/desativar módulos
8. Depois criar tabelas no backend
9. Depois salvar perfil e módulos no MySQL
10. Depois criar funcionalidades específicas de cada módulo

---

## 18. Primeira versão simples do onboarding

Status: iniciado e funcionando parcialmente.

Já foi feito:

- Criada a tela `html/onboarding.html`
- Criado o arquivo `js/onboarding.js`
- Formulário com nome, pronomes, gênero de nascimento, altura e peso
- Escolha de módulos
- Validação básica dos campos
- Cálculo inicial da meta de água com base no peso
- Salvamento temporário no `localStorage`
- Redirecionamento para `dashboard.html`
- O dashboard já lê os dados salvos pelo onboarding
- O dashboard mostra/esconde módulos conforme a escolha do usuário
- Tarefas também virou módulo opcional

Ainda falta:

- Criar opção para editar essas escolhas depois
- Salvar essas informações no banco futuramente

## 20. Sistema de idiomas

Adicionar suporte a múltiplos idiomas no Fluir.

Idiomas iniciais planejados:

- Português do Brasil
- Português de Portugal
- Inglês
- Espanhol

Futuramente, permitir adicionar mais idiomas conforme necessário.

Funcionalidades planejadas:

- Criar seletor de idioma no sistema
- Permitir trocar o idioma nas configurações
- Salvar idioma escolhido pelo usuário
- Aplicar o idioma escolhido em textos, botões, menus, mensagens e telas principais
- Adaptar diferenças entre Português do Brasil e Português de Portugal
- Preparar o sistema para receber novos idiomas no futuro

Exemplo de idiomas salvos:

```js
{
  idioma: "pt-BR"
}
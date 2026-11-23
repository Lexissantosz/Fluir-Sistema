# Fluir | QA e especificação — Etapa de planos no onboarding
Data: 22/11/2026 | Branch: `alex/onboarding-planos-personalizados-22-11`

## Decisão de produto
Criada uma quinta etapa no onboarding original: **1. Sobre você → 2. Funcionalidades → 3. Preferências → 4. Planos e escolhas → 5. Resumo final**. Não foi feito um protótipo paralelo, nem alterada a página de produção.

Os três nomes e valores de referência são os da tela `html/plans.html`: **Gratuito R$ 0/mês; Pessoal R$ 19,90/mês; Completo R$ 39,90/mês**. O sistema ainda não possui cobrança integrada. Não há compra, pagamento, ativação automática de assinatura ou desbloqueio de permissões neste fluxo.

## Regras da recomendação
- Sem itens pagos selecionados: **Gratuito**. A comparação entre os três planos fica recolhida, para não ocupar espaço inutilmente.
- Com itens exclusivos do Pessoal: recomendar **Pessoal**.
- Com ao menos um item exclusivo do Completo: recomendar **Completo**.
- Ao remover só o item do Completo: retornar ao Pessoal sem retirar os outros recursos.
- Ao remover os últimos itens do Pessoal: retornar ao Gratuito.
- Permitir **Remover** de cada item; permitir **Adicionar** opções por um painel recolhível.
- Permitir **Retirar todas as escolhas pagas** com confirmação.
- Ao trocar a recomendação, redefinir a seleção de interesse. Não presumir que a pessoa quer contratar outro plano.
- Opções **Tenho interesse no plano indicado** e **Não quero contratar agora**. Ambas são apenas preferências, sem cobrança; interesse não equivale a autorização de marketing.

Os recursos Pessoal são classificados conforme os módulos selecionados (ex.: Finanças, Diário, Alimentação e Saúde Física). O acompanhamento básico do próprio ciclo e de uma pessoa continua gratuito conforme regra de produto aprovada; perfis adicionais são solicitações planejadas do Pessoal e requerem autorização do titular antes de qualquer acesso. Recursos avançados e futuros podem ser adicionados individualmente (relatórios avançados, IA, backup futuro etc.), sem liberá-los.

## Persistência segura
- Novo `PUT /api/planos/interesse` autenticado registra apenas IDs de funcionalidades e a manifestação voluntária de interesse do usuário. **Não modifica assinatura, pagamentos ou direitos de acesso.**
- Novo `GET /api/planos/interesse` devolve apenas os dados do usuário autenticado.
- A camada de backend recalcula o plano pelas escolhas; ignora `userId` e `recommendedPlan` enviados pelo navegador e rejeita códigos desconhecidos, duplicados ou excessivos.
- Migration `V21__interesse_planos_onboarding.sql` cria uma tabela isolada, que não interfere na política de permissões.
- Salvamento segue a sequência cadastro geral → ciclo (quando ativado) → interesse de planos, com tentativas repetidas sem duplicar o POST principal.
- Em modo `?qa=1` estritamente local, não há envio de dados ao backend nem gravação local.
- **Não liberar produção até verificar Postgres, LGPD, políticas de preço e assinatura.**

## Testes locais
- `mvn -f backend/pom.xml -Dtest=PlanosInteresseControllerTest,CicloOnboardingControllerTest,CicloPerfisControllerTest test`: **26 testes aprovados, BUILD SUCCESS**, incluindo autenticação, preço recomendado a partir das escolhas, rejeição de payload falso e ausência de concessão de permissões.
- `node tests/onboarding-cycle.e2e.cjs`: **21 testes de regressão aprovados** após adaptação ao onboarding de cinco etapas.
- `node tests/onboarding-plans.e2e.cjs`: testes de sequência 2 Pessoal+1 Completo, remoção individual, voltar ao Gratuito, seleção de interesse, opções recolhidas quando não há seleção, várias pessoas no ciclo, e viewport móvel de 390 px. **17/17 cenários aprovados**, registrados em `tests/relatorio-planos-qa.txt`.
- Screenshots locais: `tests/evidencia-planos-pc.png`, `tests/evidencia-planos-mobile.png`, `tests/evidencia-planos-lista.png` e `tests/evidencia-planos-resumo.png`.

## Limitações e bloqueios para liberação
1. API de planos e migration V21 ainda não foram implantadas no Render; testar primeiro em PostgreSQL isolado.
2. Assinaturas e gateway de pagamento ainda não existem. Nomes e preços são **propostas comerciais**, não cobranças reais.
3. Sem integração real end-to-end entre conta A/B, plano e compartilhamento de dados de saúde; autorização do ciclo continua separada de assinatura.
4. Testes Android físico, iPhone/Safari, IA e app desktop ficam na fila de homologação já definida.
5. Revisão humana do layout, linguagem comercial e tratamento de dados antes da integração na main.

## Próxima microetapa humana
Alex no PC, em `http://127.0.0.1:5505/html/setup.html?qa=1`: avançar com dados fictícios até a nova **Etapa 4** e conferir somente a posição dela entre Preferências e Resumo final e a indicação de um plano. Não passar à próxima microetapa antes de enviar print e resultado.

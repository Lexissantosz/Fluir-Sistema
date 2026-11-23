# Fluir | Backlog de UX: transições com carregamento

**Registrado em:** 23/11/2026
**Prioridade:** implementação antecipada após solicitação em 23/11/2026; revisar antes da integração na main.
**Status:** IMPLEMENTADO E TESTADO LOCALMENTE, pendente revisão humana e integração na main.

## Ideia aprovada para avaliação

Criar telas/estados de carregamento com a identidade **clássica oficial do Fluir**, para que a navegação não fique parada na mesma tela enquanto o sistema processa uma etapa:

1. **Cadastro → Onboarding:** após cadastrar conta, mostrar transição visual discreta enquanto a sessão é criada/verificada e a configuração inicial é preparada.
2. **Conclusão do onboarding → Dashboard:** mostrar confirmação de conclusão e estado de carregamento enquanto preferências, módulos e dados necessários são salvos e o dashboard fica pronto.
3. Reavaliar, na mesma rodada, se outras transições realmente assíncronas (ex.: login → dashboard, troca de perfil) também precisam de estado próprio, sem acrescentar animações inúteis.

## Critérios de qualidade obrigatórios

- Preservar a aparência tradicional do Fluir (logo, cores, fontes e componentes), sem voltar ao protótipo roxo.
- Feedback claro do que está acontecendo: “Preparando seu espaço…” ou “Salvando suas preferências…”, conforme a operação real.
- **Nunca usar tempo artificial de carregamento** para esconder falhas; mostrar transição apenas enquanto a operação legítima estiver pendente.
- **Não redirecionar antes de confirmar a persistência**; se a API falhar, manter contexto, exibir erro compreensível e permitir tentar novamente sem duplicar cadastro ou dados.
- Prevenir duplo clique e requisições duplicadas; não apagar token válido por falha temporária de rede.
- Aplicar movimento discreto e compatível com `prefers-reduced-motion`, com texto acessível e `aria-live`.
- Responsividade e consistência para web/desktop, Android e iPhone, respeitando áreas seguras.
- Verificar que as transições não exponham dados sensíveis, token, stack trace nem telas indevidas.
- Registrar testes automatizados (operações rápidas/lentas, falha de rede, retry, navegação e sessão), mais avaliação humana no PC e no celular.

## Regra de execução

**Implementado em branch separada**: `alex/transicoes-loading-windows-signing-23-11`. A correção permanece em prévia, sem merge na `main` ou publicação no backend de produção.

## Próxima avaliação

Verificar com Alex e Dawid a aparência no navegador/desktop e Android físico após a aprovação do fluxo. Testes automatizados: `tests/loading-transitions.e2e.cjs`, 8/8, incluindo falha de rede, carregamento real, retry, movimento reduzido e viewport móvel. A assinatura digital do instalador Windows permanece pendente de credencial confiável.

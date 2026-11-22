# Fluir | Ciclo Menstrual: perfis, consentimento e planos
**Estado:** especificação para revisão. NÃO implementado em produção. 22/11/2026.

## Alteração principal de linguagem
Perguntar: **"Você deseja acompanhar o ciclo menstrual de mais de uma pessoa?"**. A resposta não identifica titular, número de ciclos fisiológicos, orientação sexual ou gênero. Oferecer "Sim", "Não" e "Agora não". Porém, para reduzir etapas, recomenda-se que o fluxo operacional comece com "Quem você quer acompanhar?" (meu ciclo, outra pessoa, ambos, agora não) e, se necessário, pergunte depois se deseja adicionar outras pessoas. Preservar a frase solicitada como rótulo da opção de múltiplas pessoas nas telas de configuração.

## Inclusão e dados mínimos
Não determinar menstruação por sexo atribuído ao nascer, gênero ou relação afetiva. Mulheres trans geralmente não menstruam por não possuírem útero; homens trans e pessoas não binárias com útero podem menstruar. A pergunta "Você menstrua atualmente?" só aparece se a pessoa optar por configurar seu próprio ciclo; respostas: sim, não, prefiro não responder. Se não menstruar ou preferir não responder, pode pular ou acompanhar outra pessoa. Não exigir informação sobre sexo, gravidez ou identidade para liberar módulo. Explicar por que cada pergunta é feita.

## Modelo de plano para revisão comercial
Gratuito: até **dois titulares distintos**, sendo no máximo um perfil próprio e um de outra pessoa; quem não acompanha o próprio ciclo pode acompanhar uma pessoa gratuitamente. Este é um limite de produto proposto, não uma regra já aplicada. Cobrar apenas acima do limite combinado. A permissão nunca depende apenas de uma compra. **Nunca desabilitar revogação, exportação ou exclusão de dados por causa do plano.**
Pro: permitir mais perfis, sujeito a validação financeira e técnica; não inventar preço ou cobrança neste estágio.

## Identidade dos perfis
Cada perfil tem ID estável, titular, apelido local opcional, foto opcional autorizada, tipo SELF/SHARED, status (INVITED/PENDING/ACTIVE/REVOKED), escopos permitidos e data de expiração. Nunca usar nome, apelido ou foto para autorizar acesso. Imagens devem ter consentimento de uso e possibilidade de retirar sincronização. Mostrar seleção inequívoca e confirmação do perfil ativo antes de salvar qualquer sintoma.

## Compartilhamento
O titular autenticado gera um convite temporário de uso único. O convidado insere o código e o titular aprova explicitamente a conta solicitante e os escopos (calendário, estimativas, sintomas, notas, foto, lembretes). O código não libera dados automaticamente. Evitar códigos curtos previsíveis; guardar hash, limitar tentativas e aplicar expiração e auditoria; não mostrar dados sensíveis em notificações ou prévias. O compartilhamento pode ser revogado imediatamente pelo titular; mudanças de escopos devem valer no servidor e invalidar cache e sessões onde aplicável.
Sem conta Fluir: apenas convite para cadastro, sem persistir cópia de dados sensíveis por uma pessoa não titular. A alternativa de registro por responsável/representante exige avaliação jurídica específica e não integra o MVP.

## API e persistência: NÃO CODIFICAR sem revisão de segurança
Proposta de entidades: cycle_profile (owner_user_id), cycle_share_invitation (hash do token, expires_at, consumed_at), cycle_share_grant (owner, viewer, scopes, revoked_at), cycle_record (profile_id, created_by, content), cycle_audit (actor, action, profile, time). Cada consulta, gravação ou exclusão deve validar identidade autenticada, vínculo do titular e escopo antes da operação. Não confiar em profile_id enviado pelo cliente. Índices e políticas de migração devem considerar a tabela atual preferencias_ciclo_menstrual (única por usuario_id).
Endpoint de geração de convite, aceite condicionado à aprovação posterior, permissões, lista autorizada, revogação, registro e histórico. Testar IDOR/BOLA, acesso cruzado, expiração, repetição, concorrência, revogação, edição depois da revogação e ausência de dados em logs.

## Privacidade e precisão
Os dados de saúde são dados pessoais sensíveis pela LGPD. Definir base legal adequada, minimização, retenção, transparência, direitos do titular, canal para exclusão, medidas de segurança e revisão jurídica antes de lançar. Não tratar o aceite de convite como solução automática para todos os requisitos legais. Previsões são estimativas e não devem ser apresentadas como método contraceptivo ou diagnóstico.

## Plataforma desktop
Primeira entrega sugerida: PWA instalável de modo verificável com manifest, service worker, HTTPS, ícones, offline adequado e instalação por navegadores compatíveis. Uma janela/atalho não é aplicativo desktop nativo. Para executável instalável (Windows/macOS/Linux), avaliar Tauri ou Electron em projeto e pipeline próprios com assinatura, atualização, armazenamento seguro e QA. Android via Capacitor existente não equivale a iOS publicado.

## Critérios de aceite
- Perguntas tratam quantidade de pessoas, não "mais de um ciclo".
- Opção de pular e mudar escolhas depois.
- Foto e apelido opcionais.
- Perfis e históricos sem mistura; titular claramente identificado.
- Convite sozinho não concede acesso.
- Titular pode negar, ajustar escopos ou revogar.
- Registro em perfil alheio exige autorização explícita de edição.
- Sem conta, não há compartilhamento real até cadastro e autorização.
- Plano nunca desbloqueia acesso sem permissão.
- Fluxo responsivo e navegável por teclado.
- Testes automatizados de autenticação e isolamento obrigatórios antes de ativar integração.

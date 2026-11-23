/* Planejamento comercial no onboarding: nunca ativa assinatura ou cobrança.
 * Preços de referência sincronizados com a página visual plans.html (2026-11).
 */
(function () {
  "use strict";
  const PRICES = {
    free: {name:"Gratuito",price:"R$ 0",monthly:"R$ 0/mês",description:"Tarefas, hábitos, sono, água e acompanhamento básico de ciclo."},
    personal: {name:"Pessoal",price:"R$ 19,90",monthly:"R$ 19,90/mês",description:"Finanças básicas, diário completo, conquistas e relatórios simples."},
    complete: {name:"Completo",price:"R$ 39,90",monthly:"R$ 39,90/mês",description:"Finanças completas, relatórios avançados e futuros insights com IA."}
  };
  // Apenas vantagens planejadas, sem transformar funcionalidades existentes em bloqueio pago.
  const FEATURES = [
    {id:"finance.basic",name:"Finanças básicas",tier:"personal",module:"finances",
     description:"Metas e organização financeira adicional."},
    {id:"diary.full",name:"Diário emocional completo",tier:"personal",module:"diary",
     description:"Histórico ampliado do diário."},
    {id:"nutrition.basic",name:"Alimentação básica",tier:"personal",module:"nutrition",
     description:"Acompanhamento de refeições."},
    {id:"health.physical",name:"Saúde física",tier:"personal",module:"physicalHealth",
     description:"Acompanhamento de atividades e evolução."},
    {id:"attachments.extra",name:"Recursos adicionais de anexos",tier:"personal",module:"attachments",
     description:"Opções adicionais de organização de arquivos."},
    {id:"achievements",name:"Conquistas e metas",tier:"personal",optional:true,
     description:"Progressão e conquistas adicionais."},
    {id:"reports.simple",name:"Relatórios simples",tier:"personal",optional:true,
     description:"Resumos da sua rotina."},
    {id:"finance.advanced",name:"Finanças completas",tier:"complete",optional:true,requires:"finances",
     description:"Orçamentos, cartões e análises mais detalhadas."},
    {id:"diary.daylio",name:"Diário com análise avançada",tier:"complete",optional:true,requires:"diary",
     description:"Análise ampliada do diário."},
    {id:"nutrition.calories",name:"Alimentação com calorias",tier:"complete",optional:true,requires:"nutrition",
     description:"Acompanhamento nutricional mais detalhado."},
    {id:"reports.advanced",name:"Relatórios avançados",tier:"complete",optional:true,
     description:"Análises de dados e indicadores."},
    {id:"ai.insights",name:"Insights futuros com IA",tier:"complete",optional:true,
     description:"Assistência analítica com IA, ainda em desenvolvimento."},
    {id:"backup.cloud",name:"Backup futuro na nuvem",tier:"complete",optional:true,
     description:"Proteção e sincronização, ainda em desenvolvimento."}
  ];
  const EXTRAS = FEATURES.filter(f=>f.optional);
  const own = () => window.FluirCycleOnboarding;
  const byId = new Map(FEATURES.map(f=>[f.id,f]));
  const $ = id=>document.getElementById(id);
  const state={extras:new Set(),interest:"later",lastRecommended:null};
  let context=null;
  function attach(ctx){
    context=ctx;
    $("planSelectedList").addEventListener("click",e=>{
      const btn=e.target.closest("[data-remove-feature]");
      if(btn)remove(btn.dataset.removeFeature);
    });
    $("planExploreList").addEventListener("click",e=>{
      const btn=e.target.closest("[data-add-feature]");
      if(btn)add(btn.dataset.addFeature);
    });
    $("planInterestChoices").addEventListener("click",e=>{
      const btn=e.target.closest("[data-interest]");
      if(!btn)return;
      state.interest=btn.dataset.interest;
      render();
    });
    $("planRemoveAll").addEventListener("click",()=>{
      if(!confirm("Retirar todas as escolhas pagas desta configuração e manter apenas os recursos gratuitos?"))return;
      clearAll();
      render();
    });
    $("planComparison").addEventListener("toggle",()=>{
      if($("planComparison").open) $("planComparison").scrollIntoView({block:"nearest"});
    });
  }
  function currentCycle(){
    if(!context?.modules.menstrualCycle)return null;
    return own()?.getState()||null;
  }
  function cycleExtraCount(){
    const cycle=currentCycle();
    if(!cycle||!["both","other"].includes(cycle.modo))return 0;
    return Math.max(0,cycle.pessoas.length-1);
  }
  function selections(){
    if(!context)return[];
    const picked=FEATURES.filter(f=>f.module&&context.modules[f.module]);
    const extraCount=cycleExtraCount();
    for(let i=1;i<=extraCount;i++){
      picked.push({id:"cycle.extra."+i,name:"Acompanhamento adicional · pessoa "+(i+1),
        tier:"personal",cycleIndex:i,description:"Identificação planejada, sem acesso antes de autorização."});
    }
    for(const feature of EXTRAS){
      if(state.extras.has(feature.id) && (!feature.requires||context.modules[feature.requires]))
        picked.push(feature);
    }
    return picked;
  }
  function recommendation(){
    const list=selections();
    return list.some(f=>f.tier==="complete")?"complete":
      list.some(f=>f.tier==="personal")?"personal":"free";
  }
  function create(tag,cls,text){
    const el=document.createElement(tag);
    if(cls)el.className=cls;
    if(text!=null)el.textContent=text;
    return el;
  }
  function remove(id){
    if(id.startsWith("cycle.extra.")){
      const index=Number(id.split(".")[2]);
      own()?.removeExtraPerson?.(index);
    }else{
      const item=byId.get(id);
      if(!item)return;
      if(item.module){
        const cb=document.querySelector('.module-option input[value="'+item.module+'"]');
        if(cb){cb.checked=false;context.modules[item.module]=false;context.updateCards();}
        document.querySelector('#moduleQuestions [data-module="'+item.module+'"]')?.remove();
        if(item.module==="menstrualCycle")own()?.reset();
        delete context.preferences[item.module];
        // Extras that rely on a removed module must be cleared as well.
        for(const feature of EXTRAS)if(feature.requires===item.module)state.extras.delete(feature.id);
      }else state.extras.delete(id);
    }
    if(recommendation()==="free")state.interest="later";
    render();
  }
  function add(id){
    const feature=byId.get(id);
    if(!feature?.optional || feature.requires&&!context.modules[feature.requires])return;
    state.extras.add(id);
    render();
  }
  function clearAll(){
    for(const item of [...selections()].filter(f=>f.module)){
      const checkbox=document.querySelector('.module-option input[value="'+item.module+'"]');
      if(checkbox){checkbox.checked=false;context.modules[item.module]=false;}
      document.querySelector('#moduleQuestions [data-module="'+item.module+'"]')?.remove();
      delete context.preferences[item.module];
    }
    context.updateCards();
    state.extras.clear();
    own()?.reduceExtraProfiles?.();
    state.interest="later";
  }
  function renderSelected(){
    const dest=$("planSelectedList");dest.replaceChildren();
    const list=selections();
    if(!list.length){
      dest.append(create("p","plan-empty","Você ainda não selecionou nenhum recurso pago. O Gratuito é suficiente para continuar."));
      return;
    }
    for(const feature of list){
      const row=create("div","plan-feature");
      const info=create("div","plan-feature-info");
      info.append(create("strong",null,feature.name),
        create("small",null,feature.description||""));
      const tier=create("span","plan-tier",PRICES[feature.tier].name);
      const removeButton=create("button","secondary-btn","Remover");
      removeButton.type="button";
      removeButton.dataset.removeFeature=feature.id;
      removeButton.setAttribute("aria-label","Remover "+feature.name);
      row.append(info,tier,removeButton);
      dest.append(row);
    }
  }
  function renderExplore(){
    const list=$("planExploreList");list.replaceChildren();
    const selected=new Set(selections().map(f=>f.id));
    const available=EXTRAS.filter(f=>!selected.has(f.id) &&
      (!f.requires||context.modules[f.requires]));
    for(const feature of available){
      const row=create("div","plan-feature");
      const info=create("div","plan-feature-info");
      info.append(create("strong",null,feature.name),
        create("small",null,feature.description+" · "+PRICES[feature.tier].name));
      const addButton=create("button","secondary-btn","Adicionar");
      addButton.type="button";
      addButton.dataset.addFeature=feature.id;
      row.append(info,addButton);list.append(row);
    }
    if(!available.length)list.append(create("p","plan-empty","Todas as opções disponíveis para sua seleção já foram adicionadas."));
  }
  function renderCards(tier){
    const area=$("planCards");area.replaceChildren();
    for(const [key,plan] of Object.entries(PRICES)){
      const card=create("div","plan-brief-card"+(key===tier?" plan-recommended":""));
      card.dataset.plan=key;
      card.append(create("h4",null,plan.name),create("strong","plan-price",plan.monthly),
        create("p",null,plan.description));
      if(key===tier)card.append(create("span","plan-recommendation-tag","Indicado pelas suas escolhas"));
      area.append(card);
    }
  }
  function renderInterest(tier){
    const area=$("planInterestChoices");area.replaceChildren();
    if(tier==="free"){
      state.interest="later";
      area.append(create("p","plan-empty","Seu conjunto atual cabe no Gratuito. Você pode continuar sem contratar nada."));
    }else{
      const interested=create("button","secondary-btn",state.interest==="interested"?
        "✓ Tenho interesse no "+PRICES[tier].name:"Tenho interesse no "+PRICES[tier].name);
      interested.type="button";interested.dataset.interest="interested";
      interested.setAttribute("aria-pressed",String(state.interest==="interested"));
      const later=create("button","secondary-btn","Não quero contratar agora");
      later.type="button";later.dataset.interest="later";
      later.setAttribute("aria-pressed",String(state.interest!=="interested"));
      area.append(interested,later);
    }
    $("planRemoveAll").hidden=tier==="free";
    $("planSelectionNotice").textContent=tier==="free"?
      "Nenhuma cobrança. Se quiser, abra a comparação para conhecer os planos disponíveis.":
      state.interest==="interested"?
      "Interesse registrado somente como preferência de onboarding. Nenhum pagamento será iniciado e recursos pagos não serão desbloqueados.":
      "Sem contratação. Recursos pagos continuam apenas como escolhas planejadas, até existir uma forma de contratação.";
  }
  function render(){
    if(!context)return;
    // Prune extras linked to a module that was deselected on a prior step.
    for(const feature of EXTRAS){
      if(feature.requires&&!context.modules[feature.requires])state.extras.delete(feature.id);
    }
    const list=selections(),tier=recommendation();
    // Mudou a recomendação? Não presumimos interesse em outro plano.
    if(state.lastRecommended!==null && state.lastRecommended!==tier)state.interest="later";
    state.lastRecommended=tier;
    const medium=list.filter(f=>f.tier==="personal").length;
    const complete=list.filter(f=>f.tier==="complete").length;
    $("planCountSummary").textContent=medium+" escolha(s) do Pessoal · "+complete+" do Completo";
    $("planSuggestedName").textContent=PRICES[tier].name;
    $("planSuggestedPrice").textContent=PRICES[tier].monthly;
    $("planSuggestedReason").textContent=tier==="free"?
      "Você não selecionou recursos pagos.":
      tier==="personal"?
      "Suas escolhas pagas estão cobertas pelo Pessoal. O Completo também está disponível se quiser ampliar.":
      "Há pelo menos um recurso do Completo entre suas escolhas. Removê-lo pode reduzir a indicação para o Pessoal.";
    renderSelected();renderExplore();renderCards(tier);renderInterest(tier);
  }
  function reset(){
    state.extras.clear();state.interest="later";state.lastRecommended=null;
    if(context)render();
  }
  async function persist(token){
    const url=(
      ["localhost","127.0.0.1"].includes(location.hostname)?
        "http://localhost:8080":"https://fluir-sistema.onrender.com"
    )+"/api/planos/interesse";
    let response;
    try {
      response=await fetch(url,{method:"PUT",cache:"no-store",
        headers:{"Content-Type":"application/json","Authorization":"Bearer "+token},
        body:JSON.stringify(snapshot())});
    } catch {
      throw Error("O cadastro geral foi salvo, mas não foi possível registrar sua preferência de planos. Verifique a conexão e tente novamente.");
    }
    if(!response.ok)throw Error("O cadastro geral foi salvo, mas a preferência de planos não pôde ser registrada (HTTP "+response.status+"). Tente novamente antes de sair.");
  }
  function snapshot(){
    const features=selections(),tier=recommendation();
    return {
      suggestedPlan:tier,
      interest:state.interest,
      selectedFeatures:features.map(f=>f.id),
      counts:{personal:features.filter(f=>f.tier==="personal").length,
        complete:features.filter(f=>f.tier==="complete").length}
    };
  }
  function summaryHtml(){
    const snap=snapshot();
    const names=selections().map(f=>f.name);
    const lines=names.map(n=>"<li>"+String(n).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))+"</li>").join("");
    const status=snap.interest==="interested"?"Interesse no plano indicado":"Sem interesse em contratar agora";
    return '<div class="review-section"><h4>Planos e funcionalidades</h4>'+
      '<p>Plano indicado: <strong>'+PRICES[snap.suggestedPlan].name+
      '</strong> ('+PRICES[snap.suggestedPlan].monthly+
      ', valor de referência).</p><p>'+status+'. Não há contratação ou ativação automática de recursos pagos.</p>'+
      (lines?'<ul class="plan-review-list">'+lines+'</ul>':'<p>Nenhum recurso pago selecionado.</p>')+'</div>';
  }
  window.FluirPlansOnboarding={attach,render,reset,snapshot,summaryHtml,
    recommend:recommendation,selectFeature:add,removeFeature:remove,removeAll:clearAll,persist};
})();

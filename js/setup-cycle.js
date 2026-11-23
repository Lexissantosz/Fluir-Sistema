/* Ciclo menstrual integrado à etapa 3 do onboarding tradicional do Fluir.
 * Rascunhos não dão acesso a dados de outra pessoa. Fotos de terceiros são prévias
 * locais e NÃO são enviadas ao servidor sem autorização do titular.
 */
(function () {
  "use strict";
  const blankPerson=()=>({id:Math.random().toString(36).slice(2),apelido:"",possuiFluir:"nao-sei",sincronizar:false,fotoPreview:null});
  const blank=()=>({multi:"later",modo:"later",pessoas:[],menstrua:"sim",ultimaMenstruacao:"",
    duracaoCiclo:"",duracaoMenstruacao:"",lembretes:"nao-sei",foto:null});
  let state=blank();
  const $=id=>document.getElementById(id);
  const enc=value=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const hasOwn=()=>state.modo==="self"||state.modo==="both";
  const hasOthers=()=>state.modo==="other"||state.modo==="both";
  function html(){
    return `<div class="question-block cycle-onboard" data-module="menstrualCycle" id="fluirCycleBlock">
      <h4>Acompanhamento de ciclos</h4>
      <p class="question-block-description">O mesmo Fluir, com cuidado para cada pessoa. Você pode configurar depois e não precisa informar seu gênero para usar o módulo.</p>
      <div class="question-grid">
        <div class="field question-full" id="cycleCountBox">
          <span>Você deseja acompanhar o ciclo menstrual de mais de uma pessoa?</span>
          <div class="cycle-count-buttons" role="group" aria-label="Quantidade de pessoas">
            <button id="cycleCountNo" type="button" class="secondary-btn" aria-pressed="false">Não, apenas uma</button>
            <button id="cycleCountYes" type="button" class="secondary-btn" aria-pressed="false">Sim, mais de uma</button>
            <button id="cycleCountLater" type="button" class="secondary-btn" aria-pressed="false">Agora não</button>
          </div>
          <small>Uma pessoa pode ser você ou alguém que autorize o acompanhamento.</small>
        </div>
        <label class="field question-full" id="cycleModeField" hidden>
          <span id="cycleModeLabel">Quem você deseja acompanhar?</span>
          <select id="cycleMode" aria-labelledby="cycleModeLabel"></select>
        </label>
      </div>
      <section id="cycleOwn" hidden aria-label="Meu próprio ciclo">
        <h5>Meu ciclo</h5>
        <p class="question-block-description">Todas as perguntas são opcionais. As previsões são estimativas, não diagnósticos.</p>
        <div class="question-grid">
          <label class="field question-full" id="cycleMenstruationQuestion"><span>Você menstrua atualmente?</span><select id="cycleMenstruates">
            <option value="prefiro-nao-responder">Prefiro não responder</option>
            <option value="sim">Sim</option><option value="nao">Não</option>
          </select></label>
          <p class="soft-note question-full" id="cycleOwnIncludedNote" hidden>
            Seu próprio ciclo foi incluído nesta escolha. Você poderá atualizar seus dados depois nas configurações.
          </p>
          <div id="cycleOwnMenstrualFields" class="question-full question-grid">
            <label class="field"><span>Data da última menstruação (se souber)</span><input id="cycleLastDate" type="date"></label>
            <label class="field"><span>Duração habitual do ciclo (dias)</span><input id="cycleDuration" type="number" min="15" max="90" placeholder="Ex.: 28"></label>
            <label class="field"><span>Duração da menstruação (dias)</span><input id="cycleBleeding" type="number" min="1" max="20" placeholder="Ex.: 5"></label>
            <label class="field"><span>Deseja receber lembretes?</span><select id="cycleReminders">
              <option value="nao-sei">Decidirei depois</option><option value="sim">Sim</option><option value="nao">Não</option>
            </select></label>
          </div>
          <p class="soft-note question-full" id="cycleOwnNoPeriodNote" hidden>
            Você informou que não menstrua atualmente. Não pediremos datas ou duração do ciclo. É possível atualizar isso depois.
          </p>
          <div class="field question-full"><span>Foto opcional do meu perfil</span>
            <span class="cycle-upload">
              <input id="cycleOwnPhoto" class="cycle-file-input" type="file" accept="image/png,image/jpeg,image/webp" aria-describedby="cycleOwnFileName">
              <label class="cycle-upload-button" for="cycleOwnPhoto">Escolher foto</label>
              <span id="cycleOwnFileName" class="cycle-upload-name" aria-live="polite">Nenhuma foto selecionada</span>
            </span>
            <small>JPG, PNG ou WebP. Até 8 MB, reduzida antes de salvar.</small></div>
          <div class="cycle-avatar-line question-full"><span id="cycleOwnAvatar" class="cycle-avatar" aria-hidden="true">EU</span>
            <button id="cycleClearOwnPhoto" class="secondary-btn" type="button" hidden>Remover foto</button></div>
        </div>
      </section>
      <section id="cycleOthers" hidden aria-label="Pessoas que desejo acompanhar">
        <h5>Outras pessoas</h5>
        <p class="question-block-description">Crie identificações para organizar seus futuros convites. O código sozinho não concede acesso; a pessoa precisa autorizar.</p>
        <div id="cycleDraftList"></div>
        <button id="cycleAddPerson" class="secondary-btn" type="button">+ Adicionar outra pessoa</button>
        <p id="cyclePlanNote" class="soft-note" role="status"></p>
      </section>
      <div id="cyclePauseNote" class="soft-note">Tudo bem deixar para depois. O módulo pode ser configurado nas suas preferências.</div>
      <div class="cycle-toolbar">
        <button type="button" class="secondary-btn" id="cycleReset">Recomeçar só a configuração do ciclo</button>
        <span id="cycleError" class="cycle-error" role="alert" hidden></span>
      </div>
    </div>`;
  }
  function renderPerson(person,index){
    const free=index===0;
    const inputId="cyclePersonPhoto_"+person.id;
    const card=document.createElement("article");card.className="cycle-person";card.dataset.personId=person.id;
    card.innerHTML=`<div class="cycle-person-head">
      <span class="cycle-avatar" data-avatar aria-hidden="true"></span>
      <div class="cycle-person-title"><strong data-name>Pessoa ${index+1}</strong>
        <small>${free?"Vaga gratuita":"Vaga extra, requer plano pago (ainda indisponível)"}</small></div>
      <button type="button" class="secondary-btn" data-remove aria-label="Remover pessoa ${index+1}">Remover</button></div>
      <div class="question-grid"><label class="field"><span>Nome ou apelido da pessoa ${index+1}</span>
        <input data-alias maxlength="60" autocomplete="off" placeholder="Ex.: Ana" value="${enc(person.apelido)}"></label>
      <label class="field"><span>A pessoa já utiliza o Fluir?</span>
        <select data-has-app><option value="nao-sei">Não sei</option><option value="sim">Sim</option><option value="nao">Não</option></select></label>
      <div class="field question-full"><span>Foto de identificação (prévia apenas neste navegador)</span>
        <span class="cycle-upload">
          <input id="${inputId}" data-photo class="cycle-file-input" type="file" accept="image/png,image/jpeg,image/webp">
          <label for="${inputId}" data-upload-button class="cycle-upload-button">${person.fotoPreview?"Trocar foto":"Escolher foto"}</label>
          <span data-upload-name class="cycle-upload-name" aria-live="polite">${person.fotoPreview?"Foto selecionada":"Nenhuma foto selecionada"}</span>
        </span>
        <small>Prévia local; a foto não é enviada sem autorização.</small></div>
      <button type="button" data-remove-photo class="secondary-btn cycle-remove-photo question-full" ${person.fotoPreview?"":"hidden"}>Remover foto desta pessoa</button>
      <label class="cycle-check question-full"><input data-sync type="checkbox">
        Solicitar sincronização de nome, apelido e foto quando o convite for aprovado.</label></div>`;
    card.querySelector("[data-has-app]").value=person.possuiFluir;
    card.querySelector("[data-sync]").checked=person.sincronizar;
    card.querySelector("[data-alias]").addEventListener("input",e=>{
      person.apelido=e.target.value;
      card.querySelector("[data-name]").textContent=person.apelido.trim()||"Pessoa "+(index+1);
      setAvatar(card.querySelector("[data-avatar]"),person.apelido,person.fotoPreview);
    });
    card.querySelector("[data-has-app]").addEventListener("change",e=>person.possuiFluir=e.target.value);
    card.querySelector("[data-sync]").addEventListener("change",e=>person.sincronizar=e.target.checked);
    card.querySelector("[data-photo]").addEventListener("change",async e=>{
      try{
        const photo=await fileImage(e.target.files?.[0]);
        if(!state.pessoas.includes(person))return;
        person.fotoPreview=photo;
        setAvatar(card.querySelector("[data-avatar]"),person.apelido,photo);
        card.querySelector("[data-upload-name]").textContent=photo?"Foto selecionada":"Nenhuma foto selecionada";
        card.querySelector("[data-upload-button]").textContent=photo?"Trocar foto":"Escolher foto";
        card.querySelector("[data-remove-photo]").hidden=!photo;
        error("");
      }catch(err){e.target.value="";error(err.message);}
    });
    card.querySelector("[data-remove-photo]").addEventListener("click",()=>{
      person.fotoPreview=null;card.querySelector("[data-photo]").value="";
      card.querySelector("[data-upload-name]").textContent="Nenhuma foto selecionada";
      card.querySelector("[data-upload-button]").textContent="Escolher foto";
      card.querySelector("[data-remove-photo]").hidden=true;
      setAvatar(card.querySelector("[data-avatar]"),person.apelido,null);
    });
    card.querySelector("[data-remove]").addEventListener("click",()=>{
      state.pessoas=state.pessoas.filter(p=>p.id!==person.id);
      if(!state.pessoas.length)state.pessoas=[blankPerson()];
      refresh();
    });
    card.querySelector("[data-name]").textContent=person.apelido.trim()||"Pessoa "+(index+1);
    setAvatar(card.querySelector("[data-avatar]"),person.apelido,person.fotoPreview);
    return card;
  }
  function setAvatar(el,name,photo){
    el.replaceChildren();
    if(photo && /^data:image\/(png|jpeg|webp);base64,/.test(photo)){
      const img=document.createElement("img");img.alt="";img.src=photo;el.append(img);
    }else el.textContent=(name||"P").trim().slice(0,1).toLocaleUpperCase("pt-BR");
  }
  async function fileImage(file){
    if(!file)return null;
    if(!["image/png","image/jpeg","image/webp"].includes(file.type)||file.size>8*1024*1024)throw Error("Escolha uma foto JPG, PNG ou WebP de até 8 MB.");
    return new Promise((resolve,reject)=>{
      const u=URL.createObjectURL(file),img=new Image();
      img.onload=()=>{
        URL.revokeObjectURL(u);
        const scale=Math.min(1,240/Math.max(img.width,img.height));
        const canvas=document.createElement("canvas");
        canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));
        canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
        const result=canvas.toDataURL("image/jpeg",.7);
        result.length>200000?reject(Error("A foto ainda é grande demais. Selecione outra.")):resolve(result);
      };
      img.onerror=()=>{URL.revokeObjectURL(u);reject(Error("Não foi possível abrir essa imagem."));};
      img.src=u;
    });
  }
  function error(msg){const n=$("cycleError");if(n){n.hidden=!msg;n.textContent=msg||"";}}
  function normaliseSelection(){
    if(state.multi==="later"){state.modo="later";state.pessoas=[];return;}
    if(state.multi==="one"){
      if(state.modo!=="self"&&state.modo!=="other")state.modo="self";
      if(state.modo==="self")state.pessoas=[];
      else state.pessoas=state.pessoas.slice(0,1);
    }else{
      if(state.modo!=="both"&&state.modo!=="other")state.modo="both";
      if(state.modo==="both")state.pessoas=state.pessoas.slice(0,5);
    }
    if(hasOthers()){
      const minimum=state.multi==="many"&&state.modo==="other"?2:1;
      while(state.pessoas.length<minimum)state.pessoas.push(blankPerson());
    }
  }
  function refresh(){
    if(!$("fluirCycleBlock"))return;
    normaliseSelection();
    for(const [id,value] of [["cycleCountNo","one"],["cycleCountYes","many"],["cycleCountLater","later"]])
      $(id).setAttribute("aria-pressed",String(state.multi===value));
    $("cycleModeField").hidden=state.multi==="later";
    const select=$("cycleMode");
    const options=state.multi==="one"?
      [["self","Meu próprio ciclo"],["other","O ciclo de outra pessoa"]]:
      [["both","Meu ciclo e outras pessoas"],["other","Só outras pessoas"]];
    select.replaceChildren();
    if(state.multi!=="later")options.forEach(([value,label])=>{
      const option=document.createElement("option");option.value=value;option.textContent=label;select.append(option);
    });
    select.value=state.modo;
    $("cycleOwn").hidden=!hasOwn();
    $("cycleOthers").hidden=!hasOthers();
    $("cyclePauseNote").hidden=state.multi!=="later";
    if(state.modo==="both")state.menstrua="sim";
    $("cycleMenstruates").value=state.menstrua;
    $("cycleMenstruationQuestion").hidden=!hasOwn()||state.modo==="both";
    $("cycleOwnIncludedNote").hidden=state.modo!=="both";
    const showPeriodDetails=hasOwn()&&state.menstrua==="sim";
    $("cycleOwnMenstrualFields").hidden=!showPeriodDetails;
    $("cycleOwnNoPeriodNote").hidden=!hasOwn()||state.menstrua==="sim";
    $("cycleOwnNoPeriodNote").textContent=state.menstrua==="nao"?
      "Você informou que não menstrua atualmente. Não pediremos datas ou duração do ciclo. É possível atualizar isso depois.":
      "Você preferiu não responder. Não pediremos datas nem duração do ciclo neste momento.";
    $("cycleLastDate").value=showPeriodDetails?state.ultimaMenstruacao:"";
    $("cycleDuration").value=showPeriodDetails?state.duracaoCiclo:"";
    $("cycleBleeding").value=showPeriodDetails?state.duracaoMenstruacao:"";
    $("cycleReminders").value=state.lembretes;
    $("cycleOwnFileName").textContent=state.foto?"Foto selecionada":"Nenhuma foto selecionada";
    $("cycleClearOwnPhoto").hidden=!state.foto;
    setAvatar($("cycleOwnAvatar"),"Eu",state.foto);
    const list=$("cycleDraftList");list.replaceChildren();
    if(hasOthers())state.pessoas.forEach((person,i)=>list.append(renderPerson(person,i)));
    $("cycleAddPerson").hidden=state.multi!=="many";
    $("cycleAddPerson").disabled=state.pessoas.length>=5;
    const extra=Math.max(0,state.pessoas.length-1);
    $("cyclePlanNote").textContent=extra?
      "A primeira pessoa está no plano gratuito; "+extra+" identificação(ões) adicional(is) ficam como planejamento. Acesso extra e cobrança ainda não estão disponíveis.":
      "O plano gratuito permite acompanhar o próprio ciclo e uma outra pessoa, ou apenas uma pessoa de sua escolha. Acesso somente com convite e autorização.";
    error("");
  }
  function mount(root){
    if(!root.querySelector("#fluirCycleBlock"))return;
    for(const [id,value] of [["cycleCountNo","one"],["cycleCountYes","many"],["cycleCountLater","later"]])
      $(id).addEventListener("click",()=>{
        const previous=state.multi;
        state.multi=value;
        if(value==="later")state.modo="later";
        else if(value==="one")state.modo=previous==="many"&&state.modo==="other"?"other":"self";
        else state.modo=previous==="one"&&state.modo==="other"?"other":"both";
        normaliseSelection();refresh();
      });
    $("cycleMode").addEventListener("change",e=>{
      state.modo=e.target.value;normaliseSelection();refresh();
    });
    $("cycleMenstruates").addEventListener("change",e=>{
      state.menstrua=e.target.value;
      if(state.menstrua!=="sim"){
        state.ultimaMenstruacao="";state.duracaoCiclo="";state.duracaoMenstruacao="";state.lembretes="nao-sei";
      }
      refresh();
    });
    for(const [id,key] of [["cycleLastDate","ultimaMenstruacao"],["cycleDuration","duracaoCiclo"],
      ["cycleBleeding","duracaoMenstruacao"],["cycleReminders","lembretes"]])
      $(id).addEventListener("change",e=>{state[key]=e.target.value});
    $("cycleAddPerson").addEventListener("click",()=>{
      if(state.multi==="many"&&state.pessoas.length<5){state.pessoas.push(blankPerson());refresh();}
    });
    $("cycleOwnPhoto").addEventListener("change",async e=>{
      try{
        const photo=await fileImage(e.target.files?.[0]);
        state.foto=photo;setAvatar($("cycleOwnAvatar"),"Eu",photo);
        $("cycleOwnFileName").textContent=photo?"Foto selecionada":"Nenhuma foto selecionada";
        $("cycleClearOwnPhoto").hidden=!photo;
        error("");
      }catch(err){e.target.value="";error(err.message);}
    });
    $("cycleClearOwnPhoto").addEventListener("click",()=>{
      state.foto=null;$("cycleOwnPhoto").value="";
      $("cycleOwnFileName").textContent="Nenhuma foto selecionada";
      $("cycleClearOwnPhoto").hidden=true;
      setAvatar($("cycleOwnAvatar"),"Eu",null);
    });
    $("cycleReset").addEventListener("click",()=>{
      if(confirm("Limpar todas as escolhas e fotos desta configuração de ciclo?")){reset();refresh();}
    });
    refresh();
  }
  function validate(){
    if(state.modo==="later")return true;
    const today=new Date(),iso=[today.getFullYear(),String(today.getMonth()+1).padStart(2,"0"),String(today.getDate()).padStart(2,"0")].join("-");
    if(hasOwn()&&state.menstrua==="sim"){
      if(state.ultimaMenstruacao && state.ultimaMenstruacao>iso){error("A última menstruação não pode ter data futura.");$("cycleLastDate")?.focus();return false}
      for(const [key,min,max] of [["duracaoCiclo",15,90],["duracaoMenstruacao",1,20]]){
        if(state[key]!=="" && (!Number.isInteger(Number(state[key]))||Number(state[key])<min||Number(state[key])>max)){
          error("Confira os valores de duração em dias.");$(key==="duracaoCiclo"?"cycleDuration":"cycleBleeding")?.focus();return false}
      }
    }
    if(hasOthers()&&(!state.pessoas.length||state.pessoas.length>5||
        (state.multi==="many"&&state.modo==="other"&&state.pessoas.length<2))){error("Adicione entre uma e cinco identificações.");return false;}
    if(hasOthers()&&state.pessoas.some(p=>p.apelido.trim().length===0)){
      error("Informe um nome ou apelido para identificar cada pessoa.");$("cycleDraftList").querySelector("[data-alias]:placeholder-shown")?.focus();return false;
    }
    error("");return true;
  }
  function legacy(){
    if(!hasOwn())return null;
    const active=state.menstrua==="sim";
    return {currentlyMenstruates:state.menstrua,lastPeriodDate:active?state.ultimaMenstruacao:"",
      cycleLength:active?state.duracaoCiclo:"",bleedingLength:active?state.duracaoMenstruacao:"",
      reminders:active&&state.lembretes!=="nao-sei"?state.lembretes:""};
  }
  function photoBadge(photo,name){
    if(photo && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(photo))
      return '<span class="cycle-avatar"><img src="'+enc(photo)+'" alt=""></span>';
    return '<span class="cycle-avatar" aria-hidden="true">'+enc((name||"P").trim().slice(0,1).toUpperCase())+'</span>';
  }
  function reviewHtml(){
    if(state.modo==="later")
      return '<div class="review-section"><h4>Ciclo menstrual</h4><p>Configuração adiada. Você pode ativar depois.</p></div>';
    const labels={self:"Meu próprio ciclo",other:"Outra pessoa",both:"Meu ciclo e outra pessoa"};
    let content='<div class="review-section"><h4>Ciclo menstrual</h4><p>'+labels[state.modo]+'</p><div class="cycle-review-cards">';
    if(hasOwn())content+='<div class="cycle-review-person">'+photoBadge(state.foto,"Meu ciclo")+
      '<span><strong>Meu ciclo</strong><small>Perfil próprio</small></span></div>';
    if(hasOthers())state.pessoas.forEach((p,i)=>{
      content+='<div class="cycle-review-person">'+photoBadge(p.fotoPreview,p.apelido)+
        '<span><strong>'+enc(p.apelido||"Pessoa "+(i+1))+'</strong><small>'+
        (i===0?"Vaga gratuita":"Vaga planejada, plano pago")+
        ' · aguardando convite e autorização</small></span></div>';
    });
    return content+'</div><p class="question-block-description">As fotos de terceiros são apenas prévias locais; não serão enviadas ao servidor sem autorização.</p></div>';
  }
  async function persist(token, nickname){
    if(state.modo==="later")return;
    if(!validate())throw Error("Revise a configuração do ciclo antes de salvar.");
    const payload={
      modo:state.modo,apelido:hasOwn()?String(nickname||"").slice(0,60):null,
      foto:hasOwn()?state.foto:null,menstrua:hasOwn()?state.menstrua:null,
      ultimaMenstruacao:hasOwn()&&state.menstrua==="sim"?state.ultimaMenstruacao:null,
      duracaoCiclo:hasOwn()&&state.menstrua==="sim"&&state.duracaoCiclo?Number(state.duracaoCiclo):null,
      duracaoMenstruacao:hasOwn()&&state.menstrua==="sim"&&state.duracaoMenstruacao?Number(state.duracaoMenstruacao):null,
      rascunhos:hasOthers()?state.pessoas.map(p=>({
        apelido:p.apelido.trim(),possuiFluir:p.possuiFluir,sincronizar:p.sincronizar
      })):[]
    };
    const url=(["localhost","127.0.0.1"].includes(location.hostname)?"http://localhost:8080":"https://fluir-sistema.onrender.com")+"/api/ciclos/configuracao-inicial";
    const response=await fetch(url,{method:"PUT",cache:"no-store",headers:{"Content-Type":"application/json","Authorization":"Bearer "+token},body:JSON.stringify(payload)});
    if(!response.ok)throw Error("O cadastro geral foi salvo, mas o módulo Ciclo Menstrual não pôde ser configurado agora (HTTP "+response.status+"). Tente novamente antes de sair.");
  }
  function removeExtraPerson(index){
    if(!hasOthers()||index<1||index>=state.pessoas.length)return false;
    state.pessoas.splice(index,1);
    if(state.modo==="other"&&state.pessoas.length===1)state.multi="one";
    refresh();
    return true;
  }
  function reduceExtraProfiles(){
    if(hasOthers()){
      state.pessoas=state.pessoas.slice(0,1);
      if(state.modo==="other"&&state.pessoas.length===1)state.multi="one";
      refresh();
    }
  }
  function reset(){
    state=blank();
    if($("cycleOwnPhoto"))$("cycleOwnPhoto").value="";
    if($("fluirCycleBlock"))refresh();
  }
  window.FluirCycleOnboarding={html,mount,validate,legacy,reviewHtml,persist,reset,
    removeExtraPerson,reduceExtraProfiles,getState:()=>structuredClone({
    multi:state.multi,modo:state.modo,pessoas:state.pessoas.map(p=>({apelido:p.apelido,possuiFluir:p.possuiFluir,sincronizar:p.sincronizar})),
    menstrua:state.menstrua,ultimaMenstruacao:state.ultimaMenstruacao,duracaoCiclo:state.duracaoCiclo,
    duracaoMenstruacao:state.duracaoMenstruacao,lembretes:state.lembretes,hasPhoto:!!state.foto
  })};
})();

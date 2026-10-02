(() => {
  "use strict";

  const KEY = "fluir-mvp-state-v1";

  const defaults = {
    user: { name: "Alex", email: "alex@fluir.app", setupDone: false },
    waterGoal: 2000,
    waterTotal: 1400,
    waterHistory: [
      { amount: 400, time: "08:10" },
      { amount: 300, time: "10:05" },
      { amount: 400, time: "12:40" },
      { amount: 300, time: "14:20" }
    ],
    tasks: [
      { id: 1, title: "Revisar apresentação do PI", category: "Estudos", time: "10:30", done: true },
      { id: 2, title: "Finalizar tela do MVP", category: "Projeto", time: "14:00", done: false },
      { id: 3, title: "Preparar material do curso", category: "Curso", time: "18:20", done: false }
    ],
    habits: [
      { id: 1, name: "Beber água ao acordar", target: "1 copo", done: true, streak: 8 },
      { id: 2, name: "Estudar inglês", target: "20 min", done: true, streak: 5 },
      { id: 3, name: "Organizar espaço de trabalho", target: "rápido", done: false, streak: 3 }
    ]
  };

  function clone(v){ return JSON.parse(JSON.stringify(v)); }
  function load(){
    try{
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      return saved ? { ...clone(defaults), ...saved } : clone(defaults);
    }catch{ return clone(defaults); }
  }
  let state = load();
  function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }

  function applyTheme(){
    document.documentElement.dataset.theme = localStorage.getItem("fluir-mvp-theme") || "light";
  }
  function toggleTheme(){
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("fluir-mvp-theme", next);
  }

  const nav = [
    ["dashboard","Dashboard","dashboard.html","⌂"],
    ["tasks","Tarefas","tasks.html","✓"],
    ["habits","Hábitos","habits.html","↻"],
    ["water","Água","water.html","◌"],
    ["settings","Config.","settings.html","⚙"]
  ];

  function renderNav(){
    const page = document.body.dataset.page;
    const side = document.querySelector("[data-sidebar]");
    const bottom = document.querySelector("[data-bottom-nav]");
    if(side){
      side.innerHTML = `
        <a class="sidebar-brand" href="../index.html"><span>F</span><div><strong>Fluir</strong><small>MVP</small></div></a>
        <nav>${nav.map(([k,l,h,i])=>`<a class="${page===k?"active":""}" href="${h}"><i>${i}</i><span>${l}</span></a>`).join("")}</nav>
        <div class="sidebar-foot"><strong>Um dia de cada vez.</strong><small>Organize sem rigidez excessiva.</small></div>
      `;
    }
    if(bottom){
      bottom.innerHTML = nav.map(([k,l,h,i])=>`<a class="${page===k?"active":""}" href="${h}"><i>${i}</i><span>${l}</span></a>`).join("");
    }
  }

  function toast(message){
    const el = document.querySelector("[data-toast]");
    if(!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(window.__fluirToast);
    window.__fluirToast = setTimeout(()=>el.classList.remove("show"),1800);
  }

  function auth(){
    document.querySelectorAll("[data-auth-tab]").forEach(btn=>btn.addEventListener("click",()=>{
      document.querySelectorAll("[data-auth-tab]").forEach(x=>x.classList.toggle("active",x===btn));
      document.querySelectorAll("[data-auth-panel]").forEach(x=>x.classList.toggle("hidden",x.dataset.authPanel!==btn.dataset.authTab));
    }));

    const login = document.querySelector("[data-login-form]");
    if(login) login.addEventListener("submit",e=>{
      e.preventDefault();
      const fd = new FormData(login);
      const email = String(fd.get("email")||"").trim();
      const password = String(fd.get("password")||"");
      if(!email.includes("@") || password.length < 6){
        document.querySelector("[data-auth-message]").textContent = "Use um e-mail válido e uma senha com pelo menos 6 caracteres.";
        return;
      }
      state.user.email = email;
      save();
      window.location.href = state.user.setupDone ? "dashboard.html" : "setup.html";
    });

    const register = document.querySelector("[data-register-form]");
    if(register) register.addEventListener("submit",e=>{
      e.preventDefault();
      const fd = new FormData(register);
      state.user.name = String(fd.get("name")||"Alex").trim() || "Alex";
      state.user.email = String(fd.get("email")||"").trim();
      state.user.setupDone = false;
      save();
      window.location.href = "setup.html";
    });
  }

  function setupFlow(){
    const steps=[...document.querySelectorAll("[data-step]")];
    if(!steps.length) return;
    let current=0;
    const next=document.querySelector("[data-setup-next]");
    const back=document.querySelector("[data-setup-back]");
    const progress=document.querySelector("[data-progress]");
    const name=document.querySelector("[data-setup-name]");
    const water=document.querySelector("[data-setup-water]");
    if(name) name.value=state.user.name || "Alex";
    if(water) water.value=state.waterGoal || 2000;

    function render(){
      steps.forEach((s,i)=>s.classList.toggle("active",i===current));
      progress.style.width=((current+1)/steps.length*100)+"%";
      back.disabled=current===0;
      next.textContent=current===steps.length-1?"Entrar no Fluir":"Continuar";
    }
    next.addEventListener("click",()=>{
      if(current===0 && name) state.user.name=name.value.trim()||"Alex";
      if(current===2 && water) state.waterGoal=Math.max(500,Math.min(5000,Number(water.value)||2000));
      save();
      if(current<steps.length-1){current++;render();}
      else{state.user.setupDone=true;save();window.location.href="dashboard.html";}
    });
    back.addEventListener("click",()=>{if(current>0){current--;render();}});
    render();
  }

  function dashboard(){
    const name=document.querySelector("[data-user-name]");
    if(!name) return;
    name.textContent=state.user.name||"Alex";

    const td=state.tasks.filter(x=>x.done).length;
    const hd=state.habits.filter(x=>x.done).length;
    const taskPct=state.tasks.length?td/state.tasks.length:0;
    const habitPct=state.habits.length?hd/state.habits.length:0;
    const waterPct=Math.min(1,state.waterTotal/state.waterGoal);
    const score=Math.round((taskPct+habitPct+waterPct)/3*100);

    document.querySelector("[data-score]").textContent=score+"%";
    document.querySelector("[data-stat-tasks]").textContent=td+"/"+state.tasks.length;
    document.querySelector("[data-stat-habits]").textContent=hd+"/"+state.habits.length;
    document.querySelector("[data-stat-water]").textContent=state.waterTotal+" ml";
    document.querySelector("[data-stat-water-goal]").textContent="de "+state.waterGoal+" ml";

    const tasks=document.querySelector("[data-dashboard-tasks]");
    tasks.innerHTML=state.tasks.slice(0,4).map(t=>`<div class="simple-row ${t.done?"done":""}"><span>${t.done?"✓":"○"}</span><div><strong>${escapeHtml(t.title)}</strong><small>${escapeHtml(t.category)} · ${t.time||"sem horário"}</small></div></div>`).join("");

    const habits=document.querySelector("[data-dashboard-habits]");
    habits.innerHTML=state.habits.slice(0,4).map(h=>`<div class="simple-row ${h.done?"done":""}"><span>${h.done?"✓":"○"}</span><div><strong>${escapeHtml(h.name)}</strong><small>${escapeHtml(h.target||"meta livre")} · sequência ${h.streak||0} dias</small></div></div>`).join("");
  }

  let taskFilter="all";
  function tasks(){
    const list=document.querySelector("[data-task-list]");
    if(!list) return;

    function filtered(){
      if(taskFilter==="pending") return state.tasks.filter(t=>!t.done);
      if(taskFilter==="done") return state.tasks.filter(t=>t.done);
      return state.tasks;
    }
    function render(){
      const data=filtered();
      list.innerHTML=data.map(t=>`
        <div class="task-row ${t.done?"done":""}">
          <button class="check" data-toggle-task="${t.id}" aria-label="Alternar tarefa">${t.done?"✓":""}</button>
          <div><strong>${escapeHtml(t.title)}</strong><small>${escapeHtml(t.category)} · ${t.time||"sem horário"}</small></div>
          <button class="delete" data-delete-task="${t.id}" aria-label="Excluir">×</button>
        </div>`).join("");
      document.querySelector("[data-task-count]").textContent=state.tasks.length+" tarefas";
      document.querySelector("[data-task-empty]").classList.toggle("hidden",data.length>0);

      list.querySelectorAll("[data-toggle-task]").forEach(btn=>btn.addEventListener("click",()=>{
        const item=state.tasks.find(t=>t.id===Number(btn.dataset.toggleTask));
        if(item){item.done=!item.done;save();render();}
      }));
      list.querySelectorAll("[data-delete-task]").forEach(btn=>btn.addEventListener("click",()=>{
        state.tasks=state.tasks.filter(t=>t.id!==Number(btn.dataset.deleteTask));save();render();toast("Tarefa removida");
      }));
    }

    document.querySelectorAll("[data-task-filter]").forEach(btn=>btn.addEventListener("click",()=>{
      taskFilter=btn.dataset.taskFilter;
      document.querySelectorAll("[data-task-filter]").forEach(x=>x.classList.toggle("active",x===btn));
      render();
    }));

    function addTask(title,category,time){
      title=String(title||"").trim();
      if(!title) return;
      state.tasks.unshift({id:Date.now(),title,category:category||"Pessoal",time:time||"",done:false});
      save();render();toast("Tarefa adicionada");
    }

    const form=document.querySelector("[data-new-task-form]");
    if(form) form.addEventListener("submit",e=>{
      e.preventDefault(); const fd=new FormData(form);
      addTask(fd.get("title"),fd.get("category"),fd.get("time"));form.reset();
    });

    const dialog=document.querySelector("[data-task-dialog]");
    const opener=document.querySelector("[data-open-task-form]");
    if(opener && dialog) opener.addEventListener("click",()=>{ if(window.innerWidth<760) dialog.showModal(); else form?.querySelector("input")?.focus(); });
    const mobileSave=document.querySelector("[data-save-mobile-task]");
    if(mobileSave) mobileSave.addEventListener("click",()=>{
      addTask(dialog.querySelector('[name="mobileTitle"]').value,dialog.querySelector('[name="mobileCategory"]').value,dialog.querySelector('[name="mobileTime"]').value);
      dialog.close();
      dialog.querySelector('[name="mobileTitle"]').value="";
    });

    render();
  }

  function habits(){
    const list=document.querySelector("[data-habit-list]");
    if(!list) return;
    function render(){
      const done=state.habits.filter(h=>h.done).length;
      document.querySelector("[data-habit-stat]").textContent=done+"/"+state.habits.length;
      document.querySelector("[data-habit-streak]").textContent=Math.max(0,...state.habits.map(h=>h.streak||0))+" dias";
      document.querySelector("[data-habit-consistency]").textContent=(state.habits.length?Math.round(done/state.habits.length*100):0)+"%";
      list.innerHTML=state.habits.map(h=>`
        <div class="habit-row ${h.done?"done":""}">
          <button class="check" data-toggle-habit="${h.id}">${h.done?"✓":""}</button>
          <div><strong>${escapeHtml(h.name)}</strong><small>${escapeHtml(h.target||"meta livre")}</small></div>
          <span>${h.streak||0} dias</span>
          <button class="delete" data-delete-habit="${h.id}">×</button>
        </div>`).join("");
      list.querySelectorAll("[data-toggle-habit]").forEach(btn=>btn.addEventListener("click",()=>{
        const h=state.habits.find(x=>x.id===Number(btn.dataset.toggleHabit));
        if(h){h.done=!h.done;if(h.done)h.streak=(h.streak||0)+1;save();render();}
      }));
      list.querySelectorAll("[data-delete-habit]").forEach(btn=>btn.addEventListener("click",()=>{
        state.habits=state.habits.filter(h=>h.id!==Number(btn.dataset.deleteHabit));save();render();
      }));
    }
    const form=document.querySelector("[data-new-habit-form]");
    form?.addEventListener("submit",e=>{
      e.preventDefault(); const fd=new FormData(form); const name=String(fd.get("name")||"").trim(); if(!name)return;
      state.habits.push({id:Date.now(),name,target:String(fd.get("target")||""),done:false,streak:0});save();form.reset();render();toast("Hábito adicionado");
    });
    render();
  }

  function water(){
    const total=document.querySelector("[data-water-total]");
    if(!total) return;
    function render(){
      const pct=Math.min(100,Math.round(state.waterTotal/state.waterGoal*100));
      total.textContent=state.waterTotal;
      document.querySelector("[data-water-percent]").textContent=pct+"%";
      document.querySelector("[data-water-goal]").textContent=state.waterGoal+" ml";
      document.querySelector("[data-water-ring]").style.setProperty("--p",pct+"%");
      document.querySelector("[data-water-history]").innerHTML=state.waterHistory.map(x=>`<div><span>${x.time}</span><strong>+${x.amount} ml</strong></div>`).join("") || '<div class="empty-state">Nenhum registro hoje.</div>';
    }
    document.querySelectorAll("[data-water-add]").forEach(btn=>btn.addEventListener("click",()=>{
      const amount=Number(btn.dataset.waterAdd);state.waterTotal+=amount;
      state.waterHistory.unshift({amount,time:new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})});
      save();render();toast(amount+" ml registrados");
    }));
    document.querySelector("[data-water-reset]")?.addEventListener("click",()=>{state.waterTotal=0;state.waterHistory=[];save();render();toast("Registros de hoje zerados");});
    render();
  }

  function settings(){
    const name=document.querySelector("[data-settings-name]");
    if(!name) return;
    const goal=document.querySelector("[data-settings-water]");
    name.value=state.user.name||"Alex";
    goal.value=state.waterGoal||2000;
    document.querySelector("[data-profile-form]")?.addEventListener("submit",e=>{e.preventDefault();state.user.name=name.value.trim()||"Alex";save();toast("Nome atualizado");});
    document.querySelector("[data-water-goal-form]")?.addEventListener("submit",e=>{e.preventDefault();state.waterGoal=Math.max(500,Math.min(5000,Number(goal.value)||2000));goal.value=state.waterGoal;save();toast("Meta atualizada");});
    document.querySelector("[data-reset-app]")?.addEventListener("click",()=>{localStorage.removeItem(KEY);state=clone(defaults);save();toast("MVP restaurado");setTimeout(()=>location.reload(),700);});
  }

  function escapeHtml(value){
    return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  }

  applyTheme();
  renderNav();
  document.querySelectorAll("[data-theme-toggle]").forEach(btn=>btn.addEventListener("click",toggleTheme));
  document.querySelectorAll("[data-nav]").forEach(btn=>btn.addEventListener("click",()=>window.location.href=btn.dataset.nav));
  auth(); setupFlow(); dashboard(); tasks(); habits(); water(); settings();
})();
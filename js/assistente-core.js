/* Regras deterministicas de avaliacao: jamais salvar sem confirmacao explicita. */
(function (root) {
  "use strict";

  const ROUTES = Object.freeze([
    ["Tarefas","tasks.html"],["Hábitos","habits.html"],["Sono","sleep.html"],
    ["Água","water.html"],["Finanças","finances.html"],["Diário","diary.html"],
    ["Alimentação","nutrition.html"],["Saúde física","physical-health.html"],
    ["Ciclo menstrual","menstrual-cycle.html"],["Anexos","attachments.html"],
    ["Timeline","timeline.html"],["Conquistas","achievements.html"]
  ]);

  function normalize(value) {
    return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }
  function parseIntent(input) {
    const source = String(input || "").trim().slice(0,1200);
    const text = normalize(source);
    const actions = [];
    if (!source) return actions;

    const moodTerms = [
      [/\b(feliz|alegre|contente|leve|animad[oa]|bem|otim[oa])\b/, "positive"],
      [/\b(triste|ansios[oa]|mal|pesad[oa]|irritad[oa]|pessim[oa]|chatead[oa])\b/, "heavy"],
      [/\b(neutr[oa]|normal|mais ou menos)\b/, "neutral"]
    ];
    const moodContext = /\b(humor|me sinto|estou|me sentindo|sentimento)\b/.test(text);
    if (moodContext) {
      for (const [pattern, value] of moodTerms) {
        if (pattern.test(text)) {
          actions.push({type:"mood", value, label:value==="positive"?"Leve":value==="heavy"?"Pesado":"Neutro"});
          break;
        }
      }
    }

    const energyLow = /\b(sem energia|sem disposicao|cansad[oa]|exaust[oa]|esgotad[oa]|disposicao baixa|energia baixa)\b/;
    const energyHigh = /\b(com muita energia|disposicao alta|energia alta|chei[oa] de energia|muito dispost[oa])\b/;
    const energyMid = /\b(disposicao media|energia media|disposicao normal)\b/;
    if (energyLow.test(text)) actions.push({type:"energy", value:"low", label:"Baixa"});
    else if (energyHigh.test(text)) actions.push({type:"energy",value:"high",label:"Alta"});
    else if (energyMid.test(text)) actions.push({type:"energy",value:"medium",label:"Média"});

    const fragments = source.split(/(?:\n|;|\s+e\s+(?=(?:crie|criar|adicione|anote|registre|salve)\b))/i);
    for (const part of fragments) {
      const task = part.match(/(?:crie|criar|adicione|adicionar|anote|registre)\s+(?:uma\s+)?tarefa\s*(?:de|para|:)?\s*([^.!?\n]{3,150})/i);
      if (task) {
        const title = task[1].trim().replace(/[.,;]+$/, "");
        if (title.length >= 3) actions.push({type:"task",value:title,label:title});
      }
      const diary = part.match(/(?:registre|anote|salve|escreva)\s+(?:isso\s+)?(?:no\s+)?di[aá]rio\s*(?:que|:|-)?\s*([^.!?\n]{5,500})/i);
      if (diary) {
        const note = diary[1].trim();
        if (note.length >= 5) actions.push({type:"diary",value:note,label:note});
      }
    }


    // Pedidos específicos para outros módulos, sempre como proposta de registro.
    const water = text.match(/\\b(?:bebi|tomei|consumi|registrar|anotei)\\s+(?:(\\d+(?:[.,]\\d+)?)\\s*(ml|mililitros|l|litro|litros)\\s*(?:de\\s*)?)?(?:agua)?/);
    if (water && water[1] && (text.includes("agua") || /\\b(?:ml|mililitros|litros?)\\b/.test(text))) {
      const quantity = Number(water[1].replace(",", "."));
      const ml = water[2]?.startsWith("l") ? quantity * 1000 : quantity;
      if (Number.isFinite(ml) && ml >= 1 && ml <= 3000) {
        actions.push({ type:"water", value:String(Math.round(ml))+" mL", label:Math.round(ml)+" mL de água" });
      }
    }
    const sleep = text.match(/\\b(?:dormi|dormir|sono de|durmo)\\s+(\\d+(?:[.,]\\d+)?)\\s*(?:horas?|h)\\b/);
    if (sleep) {
      const hours = Number(sleep[1].replace(",","."));
      if (Number.isFinite(hours) && hours >= 0.5 && hours <= 24) {
        actions.push({type:"sleep",value:String(hours)+" h",label:String(hours)+" horas de sono"});
      }
    }
    const money = text.match(/\\b(gastei|paguei|recebi|ganhei)\\s+(?:r\\$\\s*)?(\\d+(?:[.,]\\d{1,2})?)\\b(?:\\s*(?:reais|com|por|de)\\s*([a-z\\s]{2,60}))?/);
    if (money && /\\b(?:gastei|paguei|recebi|ganhei)\\s+(?:r\\$|\\d)/.test(text)) {
      const amount = Number(money[2].replace(",","."));
      if (Number.isFinite(amount) && amount > 0 && amount < 1000000) {
        const side = /^(gastei|paguei)$/.test(money[1]) ? "Saída" : "Entrada";
        const description = money[3]?.trim()||"sem descrição";
        actions.push({type:"finances",value:side+": R$ "+amount.toFixed(2)+" • "+description,
                      label:side+" de R$ "+amount.toFixed(2)});
      }
    }
    const habit = text.match(/\\b(?:cumpri|completei|fiz)\\s+(?:o\\s+)?(?:habito|hábito)\\s+(?:de\\s+)?([^.!?\\n]{3,100})/);
    if (habit) actions.push({type:"habit",value:habit[1].trim(),label:"Hábito: "+habit[1].trim()});

    return actions.filter((item,index,all)=>all.findIndex(other=>other.type===item.type&&other.value===item.value)===index).slice(0,10);
  }

  function describe(record) {
    if (record.type==="task") return "Tarefa: "+record.value;
    if (record.type==="mood") return "Humor: "+record.label;
    if (record.type==="energy") return "Disposição: "+record.label;
    if (record.type==="diary") return "Diário: "+record.value;
    if (record.type==="water") return "Água: "+record.label;
    if (record.type==="sleep") return "Sono: "+record.label;
    if (record.type==="finances") return "Finanças: "+record.value;
    if (record.type==="habit") return "Hábito: "+record.label;
    return "Registro";
  }
  function getSummary(records) {
    const r=Array.isArray(records)?records:[];
    const count = (type) => r.filter(item=>item.type===type).length;
    const latest = (type) => [...r].reverse().find(item=>item.type===type);
    return {
      tasks:count("task"), diary:count("diary"), moods:count("mood"), energy:count("energy"), water:count("water"), sleep:count("sleep"), finances:count("finances"), habits:count("habit"),
      lastMood:latest("mood")?.label||"sem registro",
      lastEnergy:latest("energy")?.label||"sem registro"
    };
  }

  function messageForTone(tone, category="welcome") {
    const messages = {
      calmo:{welcome:"Estou aqui para ajudar com tranquilidade. Podemos começar por uma coisa de cada vez.",confirm:"Separei algumas informações. Confira com calma antes de registrar.",empty:"Pode me contar o que precisa ou escolher uma opção abaixo."},
      direto:{welcome:"Escolha uma ação ou descreva seu pedido. Vou organizar por etapas.",confirm:"Identifiquei estes registros. Confirme o que deseja salvar.",empty:"Escreva um pedido ou selecione uma ação."},
      motivador:{welcome:"Vamos transformar suas ideias em passos possíveis! Escolha por onde começar.",confirm:"Já temos um plano de registro! Revise e confirme os itens.",empty:"Pode começar pequeno. Escolha um registro ou escreva seu objetivo."},
      neutro:{welcome:"Assistente do Fluir disponível para organizar registros.",confirm:"Itens identificados. Confirme antes de salvar.",empty:"Use o campo de mensagem ou as opções disponíveis."}
    };
    return (messages[tone]||messages.calmo)[category]||messages.calmo.welcome;
  }

  const api = Object.freeze({normalize,parseIntent,describe,getSummary,messageForTone,ROUTES});
  if (typeof module!=="undefined" && module.exports) module.exports=api;
  if (root) root.FluirAssistantCore=api;
})(typeof window!=="undefined"?window:undefined);

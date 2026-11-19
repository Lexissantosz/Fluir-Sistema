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

    return actions.filter((item,index,all)=>all.findIndex(other=>other.type===item.type&&other.value===item.value)===index).slice(0,6);
  }

  function describe(record) {
    if (record.type==="task") return "Tarefa: "+record.value;
    if (record.type==="mood") return "Humor: "+record.label;
    if (record.type==="energy") return "Disposição: "+record.label;
    if (record.type==="diary") return "Diário: "+record.value;
    return "Registro";
  }
  function getSummary(records) {
    const r=Array.isArray(records)?records:[];
    const count = (type) => r.filter(item=>item.type===type).length;
    const latest = (type) => [...r].reverse().find(item=>item.type===type);
    return {
      tasks:count("task"), diary:count("diary"), moods:count("mood"), energy:count("energy"),
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

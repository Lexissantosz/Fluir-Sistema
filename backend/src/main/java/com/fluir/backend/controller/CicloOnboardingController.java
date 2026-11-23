package com.fluir.backend.controller;

import java.time.LocalDate;
import java.util.Base64;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * Persists the optional cycle settings as part of Fluir's existing onboarding.
 * Draft people are identification placeholders only, NOT grants or health records.
 */
@RestController
@RequestMapping("/api/ciclos")
public class CicloOnboardingController {
    private final JdbcTemplate db;
    public CicloOnboardingController(JdbcTemplate db) { this.db = db; }

    private int authenticated(Authentication auth) {
        if (auth==null || !(auth.getPrincipal() instanceof Integer id))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return id;
    }
    private ResponseStatusException bad(String reason) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST,reason);
    }
    private String string(Map<String,Object> map,String key,int max) {
        Object value=map.get(key);
        if(value==null)return null;
        if(!(value instanceof String s)||s.length()>max)throw bad("Campo inválido: "+key);
        return s.isBlank()?null:s.trim();
    }
    private Integer days(Map<String,Object> map,String key,int min,int max){
        Object value=map.get(key);
        if(value==null)return null;
        if(!(value instanceof Number n)||n.doubleValue()!=n.intValue()||n.intValue()<min||n.intValue()>max)
            throw bad("Dias inválidos: "+key);
        return n.intValue();
    }
    private LocalDate date(Map<String,Object> map,String key){
        String value=string(map,key,10);
        if(value==null)return null;
        try {
            LocalDate result=LocalDate.parse(value);
            if(result.isAfter(LocalDate.now())) throw bad("Data futura não permitida.");
            return result;
        }catch(java.time.format.DateTimeParseException ex){throw bad("Data inválida.");}
    }
    private String photo(Map<String,Object> map){
        String src=string(map,"foto",210000);
        if(src==null)return null;
        String prefix="data:image/jpeg;base64,";
        if(!src.startsWith(prefix))throw bad("Foto deve ser JPEG.");
        try {
            byte[] b=Base64.getDecoder().decode(src.substring(prefix.length()));
            if(b.length>150000||b.length<12||b[0]!=(byte)0xff||b[1]!=(byte)0xd8||b[2]!=(byte)0xff)
                throw bad("Foto inválida ou maior que 150 KB.");
        }catch(IllegalArgumentException ex){throw bad("Foto inválida.");}
        return src;
    }

    @SuppressWarnings("unchecked")
    @PutMapping("/configuracao-inicial")
    @Transactional
    public Map<String,String> configure(@RequestBody Map<String,Object> payload,Authentication auth) {
        int viewer=authenticated(auth);
        String mode=string(payload,"modo",15);
        if(mode==null||!List.of("later","self","other","both").contains(mode))throw bad("Escolha um modo válido.");
        Object draftsInput=payload.get("rascunhos");
        if(!(draftsInput instanceof List<?> draftList) || draftList.size()>5)throw bad("Lista de pessoas inválida.");
        boolean hasSelf=mode.equals("self")||mode.equals("both");
        boolean hasOthers=mode.equals("other")||mode.equals("both");
        if(hasOthers && draftList.isEmpty() || !hasOthers && !draftList.isEmpty())throw bad("Escolha e quantidade de pessoas incompatíveis.");
        // Validate everything before any write to avoid partial updates on bad requests.
        record Draft(String alias, String hasApp, boolean sync){}
        java.util.ArrayList<Draft> drafts=new java.util.ArrayList<>();
        if(hasOthers)for(Object raw:draftList){
            if(!(raw instanceof Map<?,?> m))throw bad("Pessoa inválida.");
            Map<String,Object> data=(Map<String,Object>)m;
            String alias=string(data,"apelido",60);
            String hasApp=string(data,"possuiFluir",10);
            Object sync=data.get("sincronizar");
            if(alias==null || hasApp==null || !List.of("sim","nao","nao-sei").contains(hasApp) || !(sync instanceof Boolean))
                throw bad("Cada pessoa deve ter apelido e escolha válidos.");
            drafts.add(new Draft(alias,hasApp,(Boolean)sync));
        }
        String alias=hasSelf?string(payload,"apelido",60):null;
        String avatar=hasSelf?photo(payload):null;
        String menstruates=hasSelf?string(payload,"menstrua",32):null;
        if(menstruates!=null&&!List.of("sim","nao","prefiro-nao-responder").contains(menstruates))
            throw bad("Resposta de menstruação inválida.");
        Integer cycle=hasSelf?days(payload,"duracaoCiclo",15,90):null;
        Integer bleeding=hasSelf?days(payload,"duracaoMenstruacao",1,20):null;
        LocalDate last=hasSelf?date(payload,"ultimaMenstruacao"):null;
        // Ausência de menstruação atual ou recusa em responder nunca deve deixar
        // datas e durações antigas preenchidas no perfil.
        if(!"sim".equals(menstruates)){
            last=null;
            cycle=null;
            bleeding=null;
        }

        if(hasSelf){
            db.update("INSERT INTO ciclo_perfis(usuario_id,apelido,foto_data,menstrua_atualmente,"+
                    "modo_acompanhamento,duracao_ciclo,duracao_menstruacao,ultima_menstruacao) "+
                    "VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(usuario_id) DO UPDATE SET "+
                    "apelido=EXCLUDED.apelido,foto_data=EXCLUDED.foto_data,"+
                    "menstrua_atualmente=EXCLUDED.menstrua_atualmente,modo_acompanhamento=EXCLUDED.modo_acompanhamento,"+
                    "duracao_ciclo=EXCLUDED.duracao_ciclo,duracao_menstruacao=EXCLUDED.duracao_menstruacao,"+
                    "ultima_menstruacao=EXCLUDED.ultima_menstruacao,atualizado_em=CURRENT_TIMESTAMP",
                    viewer,alias,avatar,menstruates,mode,cycle,bleeding,last);
        }else{
            db.update("INSERT INTO ciclo_perfis(usuario_id,modo_acompanhamento) VALUES(?,?) "+
                    "ON CONFLICT(usuario_id) DO UPDATE SET modo_acompanhamento=EXCLUDED.modo_acompanhamento,"+
                    "atualizado_em=CURRENT_TIMESTAMP",viewer,mode);
        }
        db.update("DELETE FROM ciclo_rascunhos_acompanhamento WHERE visitante_id=?",viewer);
        for(Draft draft:drafts){
            db.update("INSERT INTO ciclo_rascunhos_acompanhamento(visitante_id,apelido,possui_fluir,"+
                "sincronizacao_solicitada) VALUES(?,?,?,?)",viewer,draft.alias(),draft.hasApp(),draft.sync());
        }
        return Map.of("status","salvo","observacao","Rascunhos não conferem acesso aos dados de terceiros.");
    }

    @GetMapping("/rascunhos")
    public List<Map<String,Object>> listDrafts(Authentication auth){
        return db.queryForList("SELECT id,apelido,possui_fluir,sincronizacao_solicitada, "+
            "CASE WHEN ROW_NUMBER() OVER (ORDER BY id)=1 THEN 'GRATUITO' ELSE 'PLANEJADO' END AS tipo_vaga "+
            "FROM ciclo_rascunhos_acompanhamento WHERE visitante_id=? ORDER BY id",authenticated(auth));
    }

    @DeleteMapping("/rascunhos/{draft}")
    public void removeDraft(@PathVariable long draft,Authentication auth){
        if(db.update("DELETE FROM ciclo_rascunhos_acompanhamento WHERE id=? AND visitante_id=?",
            draft,authenticated(auth))==0)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
}

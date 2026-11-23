package com.fluir.backend.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * Records voluntary plan interest. Never updates subscription status,
 * entitlements or payment information.
 */
@RestController
@RequestMapping("/api/planos")
public class PlanosInteresseController {
    private static final Set<String> PERSONAL = Set.of("finance.basic","diary.full","nutrition.basic",
        "health.physical","attachments.extra","achievements","reports.simple");
    private static final Set<String> COMPLETE = Set.of("finance.advanced","diary.daylio",
        "nutrition.calories","reports.advanced","ai.insights","backup.cloud");
    private final JdbcTemplate db;
    public PlanosInteresseController(JdbcTemplate db) {this.db=db;}
    private int actor(Authentication authentication) {
        if(authentication==null || !(authentication.getPrincipal() instanceof Integer id))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return id;
    }
    private ResponseStatusException bad() {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST,"Seleção de planos inválida.");
    }
    private String tier(List<String> features){
        if(features.stream().anyMatch(COMPLETE::contains))return "complete";
        if(!features.isEmpty())return "personal";
        return "free";
    }
    @PutMapping("/interesse")
    @Transactional
    public Map<String,Object> save(@RequestBody Map<String,Object> input,Authentication authentication) {
        int user=actor(authentication);
        if(!(input.get("selectedFeatures") instanceof List<?> raw) || raw.size()>30)
            throw bad();
        if(!(input.get("interest") instanceof String interest) ||
            !Set.of("later","interested").contains(interest))throw bad();
        java.util.ArrayList<String> features=new java.util.ArrayList<>();
        for(Object obj:raw){
            if(!(obj instanceof String feature) || feature.length()>35 ||
                !(PERSONAL.contains(feature)||COMPLETE.contains(feature)||
                    feature.matches("cycle[.]extra[.][1-4]")))throw bad();
            features.add(feature);
        }
        if(features.size()!=features.stream().distinct().count())throw bad();
        String plan=tier(features);
        boolean interested="interested".equals(interest)&&!"free".equals(plan);
        db.update("INSERT INTO interesse_planos_onboarding(usuario_id,plano_sugerido,tem_interesse,"+
            "recursos_solicitados) VALUES(?,?,?,?) "+
            "ON CONFLICT(usuario_id) DO UPDATE SET plano_sugerido=EXCLUDED.plano_sugerido,"+
            "tem_interesse=EXCLUDED.tem_interesse,recursos_solicitados=EXCLUDED.recursos_solicitados,"+
            "atualizado_em=CURRENT_TIMESTAMP",
            user,plan,interested,String.join(";",features));
        return Map.of("status","salvo","planoSugerido",plan,"interesse",interested);
    }
    @GetMapping("/interesse")
    public Map<String,Object> read(Authentication authentication){
        int id=actor(authentication);
        try {
            Map<String,Object> row=db.queryForMap("SELECT plano_sugerido,tem_interesse,recursos_solicitados "+
                "FROM interesse_planos_onboarding WHERE usuario_id=?",id);
            String serialized=(String)row.get("recursos_solicitados");
            return Map.of("planoSugerido",row.get("plano_sugerido"),"interesse",row.get("tem_interesse"),
                "recursosSolicitados",serialized.isBlank()?List.of():Arrays.asList(serialized.split(";")));
        }catch(EmptyResultDataAccessException ignored){
            return Map.of("planoSugerido","free","interesse",false,"recursosSolicitados",List.of());
        }
    }
}

package com.fluir.backend.controller;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/**
 * Cycle API: no owner ID is accepted as an identity assertion.
 * A token is ONLY an invitation to request access; the owner must approve.
 * Shared profiles are intentionally read-only.
 */
@RestController
@RequestMapping("/api/ciclos")
public class CicloPerfisController {
    private final JdbcTemplate db;
    private final SecureRandom random = new SecureRandom();

    public CicloPerfisController(JdbcTemplate db) { this.db = db; }

    private int actor(Authentication auth) {
        if (auth == null || !(auth.getPrincipal() instanceof Integer id))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return id;
    }

    private ResponseStatusException bad(String msg) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
    }
    private String string(Map<String,Object> body, String key, int max) {
        Object o = body.get(key);
        if (o == null) return null;
        if (!(o instanceof String s) || s.length() > max) throw bad("Campo inválido: "+key);
        return s.isBlank() ? null : s.trim();
    }
    private boolean bool(Map<String,Object> body, String key) {
        Object v = body.get(key);
        if (!(v instanceof Boolean b)) throw bad("Permissão inválida: "+key);
        return b;
    }
    private Integer intRange(Map<String,Object> b,String key,int min,int max) {
        Object v=b.get(key);
        if(v==null || "".equals(v)) return null;
        if(!(v instanceof Number n) || n.doubleValue()!=n.intValue() || n.intValue()<min || n.intValue()>max)
            throw bad("Valor inválido: "+key);
        return n.intValue();
    }
    private LocalDate date(Map<String,Object> b,String key) {
        String value=string(b,key,10);
        if(value==null)return null;
        try { return LocalDate.parse(value); }
        catch (RuntimeException e) {throw bad("Data inválida: "+key);}
    }
    private String safeImage(Map<String,Object> body) {
        String image=string(body,"foto",230000);
        if(image==null) return null;
        String type;
        if(image.startsWith("data:image/png;base64,")) type="png";
        else if(image.startsWith("data:image/jpeg;base64,")) type="jpeg";
        else if(image.startsWith("data:image/webp;base64,")) type="webp";
        else throw bad("Formato de foto inválido.");
        try {
            byte[] bytes=Base64.getDecoder().decode(image.substring(image.indexOf(',')+1));
            if(bytes.length>150000 || bytes.length<12) throw bad("Foto deve ter no máximo 150 KB.");
            boolean ok= switch(type) {
                case "png" -> bytes[0]==(byte)137 && bytes[1]==80 && bytes[2]==78 && bytes[3]==71;
                case "jpeg" -> bytes[0]==(byte)255 && bytes[1]==(byte)216 && bytes[2]==(byte)255;
                default -> bytes[0]==82 && bytes[1]==73 && bytes[2]==70 && bytes[3]==70 &&
                    bytes[8]==87 && bytes[9]==69 && bytes[10]==66 && bytes[11]==80;
            };
            if(!ok) throw bad("Conteúdo de foto inválido.");
            return image;
        } catch(IllegalArgumentException ex) {throw bad("Foto não é uma imagem válida.");}
    }
    private Map<String,Object> row(String sql,Object... args) {
        try {return db.queryForMap(sql,args);}
        catch(EmptyResultDataAccessException ex) {throw new ResponseStatusException(HttpStatus.NOT_FOUND);}
    }
    private int count(String sql,Object... args) {
        return Objects.requireNonNull(db.queryForObject(sql,Integer.class,args));
    }

    @GetMapping("/perfis")
    public List<Map<String,Object>> profiles(Authentication auth) {
        int id=actor(auth);
        List<Map<String,Object>> result=db.queryForList(
            "SELECT u.id AS \"id\", COALESCE(p.apelido,u.nome) AS \"nome\", p.foto_data AS \"foto\", "+
            "'SELF' AS \"tipo\", TRUE AS \"calendario\", TRUE AS \"sintomas\", TRUE AS \"notas\" "+
            "FROM usuarios u LEFT JOIN ciclo_perfis p ON p.usuario_id=u.id WHERE u.id=?",id);
        result.addAll(db.queryForList(
            "SELECT u.id AS \"id\", COALESCE(g.apelido_local, CASE WHEN g.sincronizar_perfil "+
            "THEN COALESCE(p.apelido,u.nome) ELSE 'Perfil compartilhado' END) AS \"nome\", "+
            "CASE WHEN g.sincronizar_perfil THEN p.foto_data ELSE NULL END AS \"foto\", "+
            "'SHARED' AS \"tipo\",g.ver_calendario AS \"calendario\", "+
            "g.ver_sintomas AS \"sintomas\",g.ver_notas AS \"notas\" "+
            "FROM ciclo_permissoes g JOIN usuarios u ON u.id=g.titular_id "+
            "LEFT JOIN ciclo_perfis p ON p.usuario_id=u.id "+
            "WHERE g.visitante_id=? AND g.revogado_em IS NULL ORDER BY g.criado_em",id));
        return result;
    }

    @GetMapping("/meu-perfil")
    public Map<String,Object> ownProfile(Authentication auth) {
        int id=actor(auth);
        List<Map<String,Object>> v=db.queryForList(
            "SELECT apelido, foto_data AS foto, menstrua_atualmente, modo_acompanhamento, duracao_ciclo, "+
            "duracao_menstruacao, ultima_menstruacao FROM ciclo_perfis WHERE usuario_id=?",id);
        return v.isEmpty()?Map.of():v.get(0);
    }

    @PutMapping("/preferencia")
    public Map<String,String> savePreference(@RequestBody Map<String,Object> input, Authentication auth) {
        int id=actor(auth);
        String mode=string(input,"modo",15);
        if(mode==null || !List.of("self","other","both","later").contains(mode))
            throw bad("Escolha inválida.");
        db.update("INSERT INTO ciclo_perfis(usuario_id,modo_acompanhamento) VALUES(?,?) "+
            "ON CONFLICT(usuario_id) DO UPDATE SET modo_acompanhamento=EXCLUDED.modo_acompanhamento,"+
            "atualizado_em=CURRENT_TIMESTAMP",id,mode);
        return Map.of("status","salvo");
    }

    @PutMapping("/meu-perfil")
    public Map<String,String> saveProfile(@RequestBody Map<String,Object> input,Authentication auth) {
        int id=actor(auth);
        String nick=string(input,"apelido",60);
        String image=safeImage(input);
        String menstrual=string(input,"menstrua",20);
        if(menstrual!=null && !List.of("sim","nao","prefiro-nao-responder").contains(menstrual))
            throw bad("Resposta inválida.");
        Integer cycle=intRange(input,"duracaoCiclo",15,90);
        Integer period=intRange(input,"duracaoMenstruacao",1,20);
        LocalDate last=date(input,"ultimaMenstruacao");
        if(last!=null && last.isAfter(LocalDate.now())) throw bad("A data não pode ser futura.");
        db.update("INSERT INTO ciclo_perfis(usuario_id,apelido,foto_data,menstrua_atualmente,duracao_ciclo,duracao_menstruacao,ultima_menstruacao) "+
            "VALUES(?,?,?,?,?,?,?) ON CONFLICT(usuario_id) DO UPDATE SET apelido=EXCLUDED.apelido,"+
            "foto_data=EXCLUDED.foto_data,menstrua_atualmente=EXCLUDED.menstrua_atualmente,"+
            "duracao_ciclo=EXCLUDED.duracao_ciclo,duracao_menstruacao=EXCLUDED.duracao_menstruacao,"+
            "ultima_menstruacao=EXCLUDED.ultima_menstruacao,atualizado_em=CURRENT_TIMESTAMP",
            id,nick,image,menstrual,cycle,period,last);
        return Map.of("status","salvo");
    }

    @GetMapping("/registros/{titular}")
    public List<Map<String,Object>> records(@PathVariable int titular,Authentication auth) {
        int id=actor(auth);
        boolean own=titular==id;
        Map<String,Object> grant=own?Map.of("ver_calendario",true,"ver_sintomas",true,"ver_notas",true):
            row("SELECT ver_calendario,ver_sintomas,ver_notas FROM ciclo_permissoes "+
                "WHERE titular_id=? AND visitante_id=? AND revogado_em IS NULL",titular,id);
        boolean calendar=(Boolean)grant.get("ver_calendario");
        boolean symptoms=(Boolean)grant.get("ver_sintomas");
        boolean notes=(Boolean)grant.get("ver_notas");
        if(!calendar && !symptoms && !notes) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        String restriction = own ? "" : (calendar && symptoms ?
            " AND tipo IN ('period','symptom')" : calendar ? " AND tipo='period'" : " AND tipo='symptom'");
        if(!own && !calendar && !symptoms) return List.of();
        String sql="SELECT id,tipo,intensidade,titulo,"+
            (notes?"nota":"NULL::varchar AS nota")+
            ",data_registro AS data,criado_em FROM ciclo_registros WHERE titular_id=?"+restriction+
            " ORDER BY data_registro DESC,id DESC LIMIT 1000";
        return db.queryForList(sql,titular);
    }

    @PostMapping("/registros")
    public Map<String,Object> addRecord(@RequestBody Map<String,Object> input, Authentication auth) {
        int id=actor(auth);
        String type=string(input,"tipo",20), intensity=string(input,"intensidade",20),
               title=string(input,"titulo",150),note=string(input,"nota",2000);
        if(type==null || !List.of("period","symptom","mood","other").contains(type))throw bad("Tipo inválido.");
        if(title==null || title.length()<2)throw bad("Título inválido.");
        LocalDate date=date(input,"data");
        if(date==null || date.isAfter(LocalDate.now()))throw bad("Data inválida.");
        Long record=db.queryForObject("INSERT INTO ciclo_registros(titular_id,tipo,intensidade,titulo,nota,data_registro) "+
            "VALUES(?,?,?,?,?,?) RETURNING id",Long.class,id,type,intensity,title,note,date);
        return Map.of("id",record);
    }

    @DeleteMapping("/registros/{record}")
    public void deleteRecord(@PathVariable long record,Authentication auth) {
        int id=actor(auth);
        if(db.update("DELETE FROM ciclo_registros WHERE id=? AND titular_id=?",record,id)==0)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    private String hash(String token) {
        try {
            byte[] digest=MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch(Exception ex){throw new IllegalStateException(ex);}
    }
    @PostMapping("/convites")
    @Transactional
    public Map<String,Object> createInvite(@RequestBody Map<String,Object> input,Authentication auth) {
        int id=actor(auth);
        if(count("SELECT count(*) FROM ciclo_permissoes WHERE titular_id=? AND revogado_em IS NULL",id)>=1)
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Limite gratuito de compartilhamentos atingido.");
        if(count("SELECT count(*) FROM ciclo_convites WHERE titular_id=? AND "+
            "consumido_em IS NULL AND expira_em>CURRENT_TIMESTAMP",id)>=3)
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                "Limite temporário de convites atingido. Aguarde a expiração.");
        boolean calendar=bool(input,"calendario"),symptoms=bool(input,"sintomas"),
            notes=bool(input,"notas"),profile=bool(input,"perfil");
        if(!calendar && !symptoms && !notes && !profile) throw bad("Selecione uma permissão.");
        byte[] randomBytes=new byte[24];random.nextBytes(randomBytes);
        String token=Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
        db.update("INSERT INTO ciclo_convites(titular_id,token_hash,expira_em,ver_calendario,"+
            "ver_sintomas,ver_notas,sincronizar_perfil) VALUES(?,?,CURRENT_TIMESTAMP+INTERVAL '10 minutes',?,?,?,?)",
            id,hash(token),calendar,symptoms,notes,profile);
        return Map.of("codigo",token,"validadeMinutos",10);
    }
    @PostMapping("/convites/solicitar")
    @Transactional
    public Map<String,String> requestInvite(@RequestBody Map<String,Object> input,Authentication auth) {
        int viewer=actor(auth);
        String token=string(input,"codigo",100);
        if(token==null)throw bad("Informe o código.");
        if(count("SELECT count(*) FROM ciclo_permissoes WHERE visitante_id=? AND revogado_em IS NULL",viewer)>=1)
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Limite gratuito atingido.");
        List<Map<String,Object>> rows=db.queryForList(
            "SELECT id,titular_id FROM ciclo_convites WHERE token_hash=? "+
            "AND consumido_em IS NULL AND solicitante_id IS NULL AND expira_em>CURRENT_TIMESTAMP FOR UPDATE",
            hash(token));
        if(rows.isEmpty())throw bad("Código inválido, vencido ou já utilizado.");
        Map<String,Object> row=rows.get(0);
        int owner=((Number)row.get("titular_id")).intValue();
        if(owner==viewer)throw bad("Você não pode compartilhar consigo.");
        db.update("UPDATE ciclo_convites SET solicitante_id=?,consumido_em=CURRENT_TIMESTAMP WHERE id=?",
            viewer,row.get("id"));
        return Map.of("status","Aguardando aprovação do titular.");
    }
    @GetMapping("/convites/pendentes")
    public List<Map<String,Object>> pending(Authentication auth) {
        int id=actor(auth);
        return db.queryForList("SELECT c.id,u.nome AS solicitante,c.ver_calendario,c.ver_sintomas,"+
            "c.ver_notas,c.sincronizar_perfil FROM ciclo_convites c JOIN usuarios u ON u.id=c.solicitante_id "+
            "WHERE c.titular_id=? AND c.solicitante_id IS NOT NULL AND c.aprovado_em IS NULL "+
            "AND c.rejeitado_em IS NULL ORDER BY c.consumido_em DESC",id);
    }
    @PostMapping("/convites/{invite}/decidir")
    @Transactional
    public Map<String,String> decide(@PathVariable long invite,@RequestBody Map<String,Object> input,Authentication auth) {
        int owner=actor(auth);
        boolean approve=bool(input,"aprovar");
        Map<String,Object> row=row("SELECT * FROM ciclo_convites WHERE id=? AND titular_id=? "+
            "AND solicitante_id IS NOT NULL AND aprovado_em IS NULL AND rejeitado_em IS NULL FOR UPDATE",invite,owner);
        int viewer=((Number)row.get("solicitante_id")).intValue();
        if(!approve){
            db.update("UPDATE ciclo_convites SET rejeitado_em=CURRENT_TIMESTAMP WHERE id=?",invite);
            return Map.of("status","negado");
        }
        if(count("SELECT count(*) FROM ciclo_permissoes WHERE titular_id=? AND revogado_em IS NULL",owner)>=1
            ||count("SELECT count(*) FROM ciclo_permissoes WHERE visitante_id=? AND revogado_em IS NULL",viewer)>=1)
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Limite gratuito atingido.");
        db.update("INSERT INTO ciclo_permissoes(titular_id,visitante_id,ver_calendario,ver_sintomas,ver_notas,sincronizar_perfil) "+
            "VALUES(?,?,?,?,?,?)",owner,viewer,row.get("ver_calendario"),row.get("ver_sintomas"),
            row.get("ver_notas"),row.get("sincronizar_perfil"));
        db.update("UPDATE ciclo_convites SET aprovado_em=CURRENT_TIMESTAMP WHERE id=?",invite);
        return Map.of("status","aprovado");
    }
    @GetMapping("/compartilhamentos")
    public List<Map<String,Object>> shares(Authentication auth){
        return db.queryForList("SELECT g.id,u.nome AS visitante,g.ver_calendario,g.ver_sintomas,"+
            "g.ver_notas,g.sincronizar_perfil FROM ciclo_permissoes g JOIN usuarios u ON u.id=g.visitante_id "+
            "WHERE g.titular_id=? AND g.revogado_em IS NULL",actor(auth));
    }
    @DeleteMapping("/compartilhamentos/{grant}")
    public void revoke(@PathVariable long grant,Authentication auth){
        int owner=actor(auth);
        int affected=db.update("UPDATE ciclo_permissoes SET revogado_em=CURRENT_TIMESTAMP "+
            "WHERE id=? AND titular_id=? AND revogado_em IS NULL",grant,owner);
        if(affected==0)throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }
    @PutMapping("/acessos/{owner}/apelido")
    public Map<String,String> renameAccess(@PathVariable int owner,
        @RequestBody Map<String,Object> input,Authentication auth) {
        int viewer=actor(auth);
        String alias=string(input,"apelido",60);
        if(db.update("UPDATE ciclo_permissoes SET apelido_local=? WHERE titular_id=? "+
            "AND visitante_id=? AND revogado_em IS NULL",alias,owner,viewer)==0)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return Map.of("status","salvo");
    }

    @DeleteMapping("/acessos/{owner}")
    public void leave(@PathVariable int owner,Authentication auth){
        int viewer=actor(auth);
        db.update("UPDATE ciclo_permissoes SET revogado_em=CURRENT_TIMESTAMP "+
            "WHERE titular_id=? AND visitante_id=? AND revogado_em IS NULL",owner,viewer);
    }
}

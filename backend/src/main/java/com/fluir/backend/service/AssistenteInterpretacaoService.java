package com.fluir.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fluir.backend.repository.PerfilUsuarioRepository;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/** IA propõe ações; SOMENTE o usuário confirma a gravação pela API protegida. */
@Service
public class AssistenteInterpretacaoService {
    private static final Set<String> TIPOS = Set.of("mood","energy","diary","task",
        "habit","water","sleep","finances","nutrition","physicalHealth","menstrualCycle","timeline");
    private static final Set<String> TONS = Set.of("calmo","direto","motivador","neutro");
    private final String key;
    private final String model;
    private final PerfilUsuarioRepository perfis;
    private final ObjectMapper mapper;
    private final HttpClient client=HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(6)).build();

    public record Proposta(String type,String value,String label) {}
    public record Interpretacao(String resposta,List<Proposta> acoes) {}

    public AssistenteInterpretacaoService(
        @Value("${FLUIR_GEMINI_API_KEY:}") String key,
        @Value("${FLUIR_AI_MODEL:gemini-2.5-flash}") String model,
        PerfilUsuarioRepository perfis,ObjectMapper mapper) {
        this.key=key==null?"":key.trim();
        this.model=model==null?"":model.trim();
        this.perfis=perfis;
        this.mapper=mapper;
    }

    public boolean configurado() {
        return !key.isBlank() && model.matches("[a-zA-Z0-9._-]{2,90}");
    }

    public Interpretacao interpretar(Integer usuarioId,String mensagem) {
        if(!configurado())throw new IllegalStateException("IA generativa não configurada.");
        if(usuarioId==null||mensagem==null||mensagem.isBlank()||mensagem.length()>1200)
            throw new IllegalArgumentException("Mensagem inválida ou longa demais.");
        String tone=perfis.findByUsuario_Id(usuarioId)
            .map(p->p.getTomComunicacao()).orElse("calmo");
        if(tone==null||!TONS.contains(tone.toLowerCase(Locale.ROOT)))tone="calmo";

        String system="Você é o assistente Fluir, um aplicativo de organização de vida. "+
          "Responda exclusivamente em JSON com campos resposta (string) e acoes (array). "+
          "Cada item de acoes tem type, value, label. Tom escolhido pelo usuário: "+tone+". "+
          "Tipos possíveis: mood, energy, diary, task, habit, water, sleep, finances, "+
          "nutrition, physicalHealth, menstrualCycle, timeline. "+
          "Proponha ações SOMENTE quando o usuário pedir explicitamente para registrar, "+
          "ou quando relatar espontaneamente humor e disposição com clareza. "+
          "Não crie anexos, não atribua conquistas, não invente valores, sintomas ou histórico. "+
          "Não dê diagnóstico médico. Nunca afirme que salvou algo: o usuário precisa confirmar "+
          "cada ação no aplicativo. Para consultas sem registros, retorne acoes=[] e resposta útil. "+
          "Valor da ação e rótulo devem ser curtos e fiéis ao texto original. "+
          "Máximo 8 ações, texto em português brasileiro.";

        try{
            Map<String,Object> payload=Map.of(
              "systemInstruction",Map.of("parts",new Object[]{Map.of("text",system)}),
              "contents",new Object[]{Map.of("role","user","parts",
                  new Object[]{Map.of("text",mensagem)})},
              "generationConfig",Map.of("temperature",0.18,"maxOutputTokens",1100,
                  "responseMimeType","application/json")
            );
            HttpRequest request=HttpRequest.newBuilder()
                .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/"
                    +model+":generateContent"))
                .header("Content-Type","application/json")
                .header("x-goog-api-key",key)
                .timeout(Duration.ofSeconds(15))
                .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(payload)))
                .build();
            HttpResponse<String> response=client.send(request,HttpResponse.BodyHandlers.ofString());
            if(response.statusCode()!=200)
                throw new IllegalStateException("O provedor de IA está indisponível.");
            JsonNode node=mapper.readTree(response.body()).path("candidates")
                .path(0).path("content").path("parts").path(0).path("text");
            if(node.isMissingNode())throw new IllegalStateException("A IA não retornou resposta.");
            return validarResposta(node.asText(""));
        }catch(InterruptedException error){
            Thread.currentThread().interrupt();
            throw new IllegalStateException("A interpretação foi interrompida.");
        }catch(IllegalStateException error){
            throw error;
        }catch(Exception error){
            throw new IllegalStateException("Não foi possível interpretar a mensagem.");
        }
    }

    Interpretacao validarResposta(String texto) {
        try{
            JsonNode root=mapper.readTree(texto);
            String resposta=root.path("resposta").asText("").trim();
            if(resposta.length()>1500)resposta=resposta.substring(0,1500);
            List<Proposta> actions=new ArrayList<>();
            JsonNode propostas=root.path("acoes");
            if(propostas.isArray()){
                for(JsonNode p:propostas){
                    if(actions.size()==8)break;
                    String type=p.path("type").asText("").trim();
                    String value=p.path("value").asText("").trim();
                    String label=p.path("label").asText("").trim();
                    if(!TIPOS.contains(type)||value.isBlank()||value.length()>1200||
                        label.isBlank()||label.length()>160)continue;
                    if("task".equals(type)&&value.length()>150)continue;
                    actions.add(new Proposta(type,value,label));
                }
            }
            if(resposta.isBlank()) resposta=actions.isEmpty() ?
                "Pode me contar o que precisa organizar." :
                "Separei propostas para você revisar. Nada será salvo sem confirmação.";
            return new Interpretacao(resposta,List.copyOf(actions));
        }catch(Exception error) {
            throw new IllegalStateException("A IA retornou uma resposta inválida.");
        }
    }
}

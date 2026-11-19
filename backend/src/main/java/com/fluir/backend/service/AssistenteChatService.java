package com.fluir.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fluir.backend.repository.PerfilUsuarioRepository;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AssistenteChatService {
    private static final Set<String> TONS = Set.of("calmo", "direto", "motivador", "neutro");
    private final String apiKey;
    private final String model;
    private final PerfilUsuarioRepository perfis;
    private final ObjectMapper mapper;
    private final HttpClient client = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(6)).build();

    public AssistenteChatService(
        @Value("${FLUIR_GEMINI_API_KEY:}") String apiKey,
        @Value("${FLUIR_AI_MODEL:gemini-2.5-flash}") String model,
        PerfilUsuarioRepository perfis,
        ObjectMapper mapper) {
        this.apiKey = apiKey == null ? "" : apiKey.trim();
        this.model = model == null ? "" : model.trim();
        this.perfis = perfis;
        this.mapper = mapper;
    }

    public boolean configured() {
        return !apiKey.isBlank() && model.matches("[a-zA-Z0-9._-]{2,90}");
    }

    public String responder(Integer usuarioId, String mensagem) {
        if (!configured()) {
            throw new IllegalStateException("IA generativa ainda não configurada no servidor.");
        }
        if (usuarioId == null || mensagem == null || mensagem.isBlank() ||
            mensagem.length() > 1200) {
            throw new IllegalArgumentException("Escreva uma mensagem de até 1200 caracteres.");
        }
        String tone = perfis.findByUsuario_Id(usuarioId)
            .map(perfil -> perfil.getTomComunicacao())
            .orElse("calmo");
        if (tone == null || !TONS.contains(tone.toLowerCase(Locale.ROOT))) tone = "calmo";
        final String tomSelecionado = tone.toLowerCase(Locale.ROOT);

        // Não enviar diário, finanças ou dados médicos automaticamente.
        String instruction = "Você é o assistente Fluir, em português brasileiro. "+
          "Tom de comunicação do onboarding: "+tomSelecionado+". "+
          "Ajude o usuário de modo gentil, claro, prático e conciso. "+
          "Você NÃO pode executar operações no aplicativo nem acessar banco de dados. "+
          "Nunca diga que salvou, excluiu, agendou ou consultou um registro. "+
          "Se o usuário pedir registro, explique que precisa confirmar na interface. "+
          "Não invente informações pessoais e não dê diagnósticos médicos. "+
          "Responda em no máximo 900 caracteres.";

        try {
            Map<String,Object> payload = Map.of(
                "systemInstruction", Map.of("parts", new Object[]{Map.of("text", instruction)}),
                "contents", new Object[]{Map.of("role","user","parts",
                    new Object[]{Map.of("text", mensagem)})},
                "generationConfig", Map.of("temperature", 0.45, "maxOutputTokens", 440)
            );
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/"
                     + model + ":generateContent"))
                .timeout(Duration.ofSeconds(12))
                .header("Content-Type", "application/json")
                .header("x-goog-api-key", apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(payload)))
                .build();
            HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                throw new IllegalStateException("O provedor de IA está indisponível.");
            }
            JsonNode node = mapper.readTree(response.body()).path("candidates")
                .path(0).path("content").path("parts").path(0).path("text");
            String text = node.asText("").trim();
            if (text.isEmpty()) throw new IllegalStateException("A IA não retornou uma resposta.");
            return text.length() > 2500 ? text.substring(0,2500) : text;
        } catch (InterruptedException error) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("A resposta de IA foi interrompida.");
        } catch (java.net.http.HttpTimeoutException error) {
            throw new IllegalStateException("A IA demorou para responder.");
        } catch (Exception error) {
            throw new IllegalStateException("A IA não pôde responder nesta tentativa.");
        }
    }
}

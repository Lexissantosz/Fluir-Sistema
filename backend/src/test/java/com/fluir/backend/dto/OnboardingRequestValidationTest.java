package com.fluir.backend.dto;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import java.time.LocalDate;

class OnboardingRequestValidationTest {

    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    @BeforeAll
    static void configurarValidator() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void fecharValidator() {
        validatorFactory.close();
    }

    @Test
    void deveRejeitarDataDaUltimaMenstruacaoNoFuturo() {
        OnboardingRequest request = criarRequestValido();

        PreferenciasCicloMenstrualRequest ciclo =
                new PreferenciasCicloMenstrualRequest();

        ciclo.setLastPeriodDate(
                LocalDate.now().plusDays(1).toString()
        );

        request.setCicloMenstrual(ciclo);

        Set<ConstraintViolation<OnboardingRequest>> violations =
                validator.validate(request);

        assertTrue(
                violations.stream().anyMatch(
                        violation ->
                                violation.getMessage()
                                        .equals(
                                                "A data da última menstruação deve ser válida e não pode estar no futuro"
                                        )
                )
        );
    }

    @Test
    void deveRejeitarRendaMensalNegativa() {
        OnboardingRequest request = criarRequestValido();

        PreferenciasFinancasRequest financas =
                new PreferenciasFinancasRequest();

        financas.setMonthlyIncome(
                new BigDecimal("-100.00")
        );

        request.setFinancas(financas);

        Set<ConstraintViolation<OnboardingRequest>> violations =
                validator.validate(request);

        assertTrue(
                violations.stream().anyMatch(
                        violation ->
                                violation.getMessage()
                                        .equals(
                                                "A renda mensal não pode ser negativa"
                                        )
                )
        );
    }

    @Test
    void deveAceitarOnboardingComDadosBasicosValidos() {
        OnboardingRequest request = criarRequestValido();

        Set<ConstraintViolation<OnboardingRequest>> violations =
                validator.validate(request);

        assertTrue(violations.isEmpty());
    }

    @Test
    void deveRejeitarIdadeAbaixoDe13Anos() {
        OnboardingRequest request = criarRequestValido();
        request.setIdade(12);

        Set<ConstraintViolation<OnboardingRequest>> violations =
                validator.validate(request);

        assertTrue(
                violations.stream().anyMatch(
                        violation ->
                                violation.getMessage()
                                        .equals("A idade mínima é 13 anos")
                )
        );
    }

    @Test
    void deveRejeitarIdadeAcimaDe120Anos() {
        OnboardingRequest request = criarRequestValido();
        request.setIdade(121);

        Set<ConstraintViolation<OnboardingRequest>> violations =
                validator.validate(request);

        assertTrue(
                violations.stream().anyMatch(
                        violation ->
                                violation.getMessage()
                                        .equals("A idade máxima é 120 anos")
                )
        );
    }

    @Test
    void deveRejeitarNomeVazio() {
        OnboardingRequest request = criarRequestValido();
        request.setNome("   ");

        Set<ConstraintViolation<OnboardingRequest>> violations =
                validator.validate(request);

        assertTrue(
                violations.stream().anyMatch(
                        violation ->
                                violation.getMessage()
                                        .equals("O nome é obrigatório")
                )
        );
    }

    @Test
    void deveRejeitarCamposObrigatoriosAusentes() {
        OnboardingRequest request = new OnboardingRequest();

        Set<ConstraintViolation<OnboardingRequest>> violations =
                validator.validate(request);

        assertFalse(violations.isEmpty());

        assertTrue(
                violations.stream().anyMatch(
                        violation ->
                                violation.getPropertyPath()
                                        .toString()
                                        .equals("usuarioId")
                )
        );

        assertTrue(
                violations.stream().anyMatch(
                        violation ->
                                violation.getPropertyPath()
                                        .toString()
                                        .equals("idade")
                )
        );

        assertTrue(
                violations.stream().anyMatch(
                        violation ->
                                violation.getPropertyPath()
                                        .toString()
                                        .equals("nome")
                )
        );
    }

    private OnboardingRequest criarRequestValido() {
        OnboardingRequest request = new OnboardingRequest();

        request.setUsuarioId(1);
        request.setNome("Alex");
        request.setApelido("Lex");
        request.setPronomes("ele/dele");
        request.setGeneroNascimento("masculino");
        request.setIdade(18);
        request.setTomComunicacao("amigavel");

        return request;
    }
}
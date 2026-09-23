package com.fluir.backend.security;

import java.io.IOException;
import java.util.Collections;

import com.fluir.backend.service.AuthSessionService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class FluirSessionFilter extends OncePerRequestFilter {

    private static final String TOKEN_PREFIX = "Bearer ";

    private final AuthSessionService authSessionService;

    public FluirSessionFilter(AuthSessionService authSessionService) {
        this.authSessionService = authSessionService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authorization = request.getHeader("Authorization");

        if (
                authorization != null
                && authorization.startsWith(TOKEN_PREFIX)
                && SecurityContextHolder.getContext().getAuthentication() == null
        ) {
            String token = authorization
                    .substring(TOKEN_PREFIX.length())
                    .trim();

            Integer usuarioId = authSessionService.obterUsuarioId(token);

            if (usuarioId != null) {
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                usuarioId,
                                null,
                                Collections.emptyList()
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
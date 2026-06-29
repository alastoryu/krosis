package com.stormcloaks.krosis.security;

import com.stormcloaks.krosis.model.Usuario;
import com.stormcloaks.krosis.repository.UsuarioRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UsuarioAutenticado {

    private final UsuarioRepository repository;

    public UsuarioAutenticado(UsuarioRepository repository) {
        this.repository = repository;
    }

    public Usuario get() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
}
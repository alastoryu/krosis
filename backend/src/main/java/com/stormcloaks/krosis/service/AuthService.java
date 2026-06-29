package com.stormcloaks.krosis.service;

import com.stormcloaks.krosis.dto.*;
import com.stormcloaks.krosis.model.Usuario;
import com.stormcloaks.krosis.repository.UsuarioRepository;
import com.stormcloaks.krosis.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository repository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final UsuarioService usuarioService; // ← delega o cadastro

    public AuthService(UsuarioRepository repository,
                       PasswordEncoder encoder,
                       JwtService jwtService,
                       UsuarioService usuarioService) {
        this.repository     = repository;
        this.encoder        = encoder;
        this.jwtService     = jwtService;
        this.usuarioService = usuarioService;
    }

    public LoginResponse login(LoginRequest req) {
        Usuario usuario = repository.findByEmail(req.email())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!usuario.isAtivo())
            throw new RuntimeException("Usuário inativo");

        if (!encoder.matches(req.senha(), usuario.getSenha()))
            throw new RuntimeException("Senha incorreta");

        String token = jwtService.gerarToken(usuario.getEmail(), usuario.getRole().name());
        return new LoginResponse(token, usuario.getNome(), usuario.getRole().name());
    }

    public void register(RegisterRequest req) {

        UsuarioCreateDTO dto = new UsuarioCreateDTO();
        dto.setNome(req.nome());
        dto.setEmail(req.email());
        dto.setSenha(req.senha());
        dto.setAtivo(true);
        dto.setRole("USER");

        usuarioService.criar(dto);
    }
}
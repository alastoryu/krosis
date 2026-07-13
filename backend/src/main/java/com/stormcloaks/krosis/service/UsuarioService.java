package com.stormcloaks.krosis.service;

import com.stormcloaks.krosis.dto.UsuarioCreateDTO;
import com.stormcloaks.krosis.dto.UsuarioDTO;
import com.stormcloaks.krosis.model.Usuario;
import com.stormcloaks.krosis.model.filtro.UsuarioFiltro;
import com.stormcloaks.krosis.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder   = passwordEncoder;
    }

    public Page<UsuarioDTO> buscarComFiltro(String nome, String email, Pageable pageable) {
        Specification<Usuario> spec = UsuarioFiltro.comFiltro(nome, email);
        return usuarioRepository.findAll(spec, pageable).map(this::toDTO);
    }

    public UsuarioDTO buscarPorId(Long id) {
        return toDTO(buscarEntidade(id));
    }

    public UsuarioDTO criar(UsuarioCreateDTO dto) {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        usuario.setAtivo(dto.getAtivo() != null ? dto.getAtivo() : true);
        usuario.setRole(Usuario.Role.valueOf(dto.getRole()));

        return toDTO(usuarioRepository.save(usuario));
    }

    public UsuarioDTO atualizar(Long id, UsuarioCreateDTO dto) {
        Usuario usuario = buscarEntidade(id);

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());

        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            usuario.setSenha(passwordEncoder.encode(dto.getSenha()));
        }

        usuario.setAtivo(dto.getAtivo());
        usuario.setRole(Usuario.Role.valueOf(dto.getRole()));

        return toDTO(usuarioRepository.save(usuario));
    }

    @Transactional
    public void excluir(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new EntityNotFoundException("Usuário não encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    private Usuario buscarEntidade(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
    }

    private UsuarioDTO toDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setEmail(usuario.getEmail());
        dto.setAtivo(usuario.isAtivo());
        dto.setRole(usuario.getRole().toString());
        return dto;
    }
}
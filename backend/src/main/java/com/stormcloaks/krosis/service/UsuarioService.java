package com.stormcloaks.krosis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.stormcloaks.krosis.dto.UsuarioCreateDTO;
import com.stormcloaks.krosis.dto.UsuarioDTO;
import com.stormcloaks.krosis.model.Usuario;
import com.stormcloaks.krosis.model.filtro.UsuarioFiltro;
import com.stormcloaks.krosis.repository.UsuarioRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Page<UsuarioDTO> buscarComFiltro(String nome, String email, Pageable pageable) {
        Specification<Usuario> spec = UsuarioFiltro.comFiltro(nome, email);
        return usuarioRepository.findAll(spec, pageable)
                .map(this::toDTO);
    }

    public UsuarioDTO buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        return toDTO(usuario);
    }

    public UsuarioDTO criar(UsuarioCreateDTO dto) {
        Usuario usuario = new Usuario();

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setSenha(dto.getSenha());
        usuario.setAtivo(dto.getAtivo() != null ? dto.getAtivo() : true);
        usuario.setRole(Usuario.Role.valueOf(dto.getRole()));

        return toDTO(usuarioRepository.save(usuario));
    }

    public UsuarioDTO atualizar(Long id, UsuarioCreateDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());

        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            usuario.setSenha(dto.getSenha());
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
package com.stormcloaks.krosis.service;

import com.stormcloaks.krosis.dto.DashboardResumoDTO;
import com.stormcloaks.krosis.repository.CategoriaRepository;
import com.stormcloaks.krosis.repository.FabricanteRepository;
import com.stormcloaks.krosis.repository.ProdutoRepository;
import com.stormcloaks.krosis.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private FabricanteRepository fabricanteRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public DashboardResumoDTO getResumo() {

        Long totalProdutos = produtoRepository.count();
        Long totalCategorias = categoriaRepository.count();
        Long totalFabricantes = fabricanteRepository.count();
        Long totalUsuarios = usuarioRepository.count();

        return new DashboardResumoDTO(
                totalProdutos,
                totalCategorias,
                totalFabricantes,
                totalUsuarios
        );
    }
}
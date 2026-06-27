package com.stormcloaks.krosis.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stormcloaks.krosis.model.ListaProduto;
import com.stormcloaks.krosis.repository.ListaProdutoRepository;

@Service
public class ListaProdutoService {

	@Autowired private ListaProdutoRepository listaProdutoRepository;
	
	public List<ListaProduto> findAllPaged (){
		
		List<ListaProduto> lista = listaProdutoRepository.findAll();
		
		return lista;
	}
}

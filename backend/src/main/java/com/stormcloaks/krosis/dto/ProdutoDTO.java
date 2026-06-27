package com.stormcloaks.krosis.dto;

public class ProdutoDTO {

	private Long id;
	private String nome;
	private String descricao;
	private String codigoDeBarras;

	private Long categoriaId;
	private String categoriaNome;

	private Long fabricanteId;
	private String fabricanteNome;

	private boolean ativo;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public String getCodigoDeBarras() {
		return codigoDeBarras;
	}

	public void setCodigoDeBarras(String codigoDeBarras) {
		this.codigoDeBarras = codigoDeBarras;
	}

	public Long getCategoriaId() {
		return categoriaId;
	}

	public void setCategoriaId(Long categoriaId) {
		this.categoriaId = categoriaId;
	}

	public String getCategoriaNome() {
		return categoriaNome;
	}

	public void setCategoriaNome(String categoriaNome) {
		this.categoriaNome = categoriaNome;
	}

	public Long getFabricanteId() {
		return fabricanteId;
	}

	public void setFabricanteId(Long fabricanteId) {
		this.fabricanteId = fabricanteId;
	}

	public String getFabricanteNome() {
		return fabricanteNome;
	}

	public void setFabricanteNome(String fabricanteNome) {
		this.fabricanteNome = fabricanteNome;
	}

	public boolean isAtivo() {
		return ativo;
	}

	public void setAtivo(boolean ativo) {
		this.ativo = ativo;
	}
}
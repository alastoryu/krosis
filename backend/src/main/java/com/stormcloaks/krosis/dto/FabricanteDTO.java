package com.stormcloaks.krosis.dto;

public class FabricanteDTO {

	private Long id;
	private String nome;
	private String descricao;
	private String paisOrigem;
	private Boolean ativo;

	public FabricanteDTO() {
	}

	public FabricanteDTO(
			Long id,
			String nome,
			String descricao,
			String paisOrigem,
			Boolean ativo) {

		this.id = id;
		this.nome = nome;
		this.descricao = descricao;
		this.paisOrigem = paisOrigem;
		this.ativo = ativo;
	}

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

	public String getPaisOrigem() {
		return paisOrigem;
	}

	public void setPaisOrigem(String paisOrigem) {
		this.paisOrigem = paisOrigem;
	}

	public Boolean isAtivo() {
		return ativo;
	}

	public void setAtivo(Boolean ativo) {
		this.ativo = ativo;
	}
}

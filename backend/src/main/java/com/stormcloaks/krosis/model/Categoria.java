package com.stormcloaks.krosis.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "categoria")
public class Categoria {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, length = 100)
	private String nome;

	@Column(length = 500)
	private String descricao;

	@Column(nullable = false)
	private Boolean ativo = true;

	@Column(nullable = false, updatable = false)
	private LocalDateTime dataCriacao;

	private LocalDateTime dataAtualizacao;

	@PrePersist
	public void prePersist() {
		this.dataCriacao = LocalDateTime.now();
		this.dataAtualizacao = LocalDateTime.now();
	}

	@PreUpdate
	public void preUpdate() {
		this.dataAtualizacao = LocalDateTime.now();
	}

	// Getters e Setters

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

	public Boolean getAtivo() {
		return ativo;
	}

	public void setAtivo(Boolean ativo) {
		this.ativo = ativo;
	}

	public LocalDateTime getDataCriacao() {
		return dataCriacao;
	}

	public LocalDateTime getDataAtualizacao() {
		return dataAtualizacao;
	}

	@OneToMany(mappedBy = "categoria")
	private List<Produto> produtos;
}
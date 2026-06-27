CREATE TABLE categorias (
                            id BIGSERIAL PRIMARY KEY,
                            nome VARCHAR(100) NOT NULL UNIQUE,
                            descricao VARCHAR(500),
                            ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE fabricantes (
                             id BIGSERIAL PRIMARY KEY,
                             nome VARCHAR(150) NOT NULL UNIQUE,
                             descricao VARCHAR(500),
                             pais_origem VARCHAR(100),
                             ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE produtos (
                          id BIGSERIAL PRIMARY KEY,
                          nome VARCHAR(150) NOT NULL,
                          descricao VARCHAR(500),
                          codigo_de_barras VARCHAR(50) NOT NULL UNIQUE,
                          categoria_id BIGINT NOT NULL,
                          fabricante_id BIGINT,
                          ativo BOOLEAN NOT NULL DEFAULT TRUE,

                          CONSTRAINT fk_produto_categoria
                              FOREIGN KEY (categoria_id)
                                  REFERENCES categorias(id),

                          CONSTRAINT fk_produto_fabricante
                              FOREIGN KEY (fabricante_id)
                                  REFERENCES fabricantes(id)
);
# 🥬 Sistema de Gestão de Produtos Perecíveis

Sistema web para gerenciamento de produtos perecíveis no varejo, que permite cadastrar produtos, fabricantes e categorias e registrar a entrada de lotes com suas datas de validade, identificando o usuário responsável por cada registro.

## 📋 Sobre o Projeto

O controle de produtos perecíveis é um dos maiores desafios do setor varejista e da indústria alimentícia. Muitos estabelecimentos ainda acompanham as datas de validade manualmente, o que torna o processo lento, sujeito a erros e aumenta o desperdício de mercadorias.

Este projeto é o desenvolvimento do Trabalho de Conclusão de Curso (TCC) de **Christopher Ryuhei Nitta** e oferece uma base para controlar a validade **por lote**, centralizando as informações de produto, fabricante, categoria, lote e validade.

---

## 🎯 Objetivos

* Centralizar o cadastro de produtos perecíveis.
* Controlar a validade por lote, e não apenas por produto.
* Organizar os produtos por categoria e fabricante.
* Identificar o usuário que realizou cada entrada de lote.
* Criar a base para alertas e relatórios de vencimento.

---

## ✨ Funcionalidades

### 👤 Usuários e Acesso

* Cadastro, edição, consulta e exclusão de usuários
* Acesso ao sistema por meio do id do usuário

### 🏭 Fabricantes

* Cadastro, edição, consulta e exclusão de fabricantes

### 🗂 Categorias

* Cadastro, edição, consulta e exclusão de categorias
* Exemplos: bazar, têxtil, padaria

### 📦 Produtos

* Cadastro, edição, consulta e exclusão de produtos
* Cada produto possui código de barras, categoria e fabricante

### 📅 Entrada de Lote

* Seleção do produto
* Registro do número do lote e da validade
* Registro do usuário que realizou a entrada
* Consulta dos lotes e validades registrados

---

## 🔄 Fluxo de Funcionamento

1. Cadastro do usuário e acesso ao sistema.
2. Cadastro de fabricantes e categorias.
3. Cadastro do produto, com código de barras, categoria e fabricante.
4. Entrada de lote, informando produto, lote e validade.

---

## 🏗 Arquitetura

Aplicação em camadas, com separação entre cliente e servidor.

### Backend

* API REST
* Regras de negócio
* Persistência dos dados com Hibernate/JPA

### Frontend

* Interface web em Angular
* Telas de cadastro e listagem
* Consumo da API

### Banco de Dados

* PostgreSQL

---

## 💻 Tecnologias

### Backend

* Java
* Spring Boot
* Hibernate
* JPA
* Maven

### Frontend

* Angular
* TypeScript
* HTML
* CSS
* Bootstrap

### Banco de Dados

* PostgreSQL

### Infraestrutura

* Execução em ambiente local
* Disponibilização na internet via [ngrok](https://ngrok.com)

---

## 📁 Estrutura do Projeto

```text
├── backend
│   ├── src
│   ├── controllers
│   ├── services
│   ├── repositories
│   ├── entities
│   └── security
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   ├── services
│   └── models
│
└── database
    └── scripts
```

---

## 🚀 Como Executar

### Banco de Dados

1. Criar um banco no PostgreSQL.
2. Executar os scripts da pasta `/database`, se houver.
3. Configurar a conexão no arquivo `application.properties`.

### Backend

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git

cd backend

mvn clean install

mvn spring-boot:run
```

### Frontend

```bash
cd frontend

npm install

ng serve
```

### Acesso pela internet (opcional)

Com o sistema rodando localmente, o ngrok cria um endereço público temporário:

```bash
ngrok http <porta-da-aplicacao>
```

O endereço gerado muda a cada execução, por isso o ngrok é indicado apenas para demonstração e testes.

---

## 📌 Requisitos

* Java 17+
* Maven
* Node.js
* Angular CLI
* PostgreSQL
* Git
* ngrok (opcional)

---

## 📈 Próximas Implementações

* Alertas de produtos próximos do vencimento e vencidos, com antecedência configurável pelo usuário
* Dashboard com os produtos em risco
* Relatórios por período, categoria e fabricante
* Controle de quantidade em estoque
* Aplicativo Android com leitura de código de barras pela câmera
* Implantação em nuvem (AWS) com endereço fixo
* Integração com ERPs

---

## 📖 Metodologia

O projeto é desenvolvido com práticas ágeis, com foco em entregas incrementais e melhoria contínua.

* Scrum (Solo Scrum)
* Kanban

---

## 👨‍💻 Autor

**Christopher Ryuhei Nitta**

Projeto desenvolvido como Trabalho de Conclusão de Curso, com a proposta de um Sistema de Gestão de Produtos Perecíveis para o setor varejista e a indústria alimentícia.

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

Sinta-se livre para utilizar, modificar e contribuir.

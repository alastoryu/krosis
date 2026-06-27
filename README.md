# 🥬 Sistema de Gestão de Produtos Perecíveis

Sistema web e mobile desenvolvido para gerenciamento de produtos perecíveis no varejo, permitindo o controle de validade por lote, monitoramento de estoque, emissão de alertas e geração de relatórios gerenciais.

## 📋 Sobre o Projeto

O controle de produtos perecíveis é um dos maiores desafios do setor varejista e da indústria alimentícia. Muitos estabelecimentos ainda realizam o acompanhamento das datas de validade manualmente, tornando o processo lento, sujeito a erros e aumentando o desperdício de mercadorias.

Este projeto tem como objetivo fornecer uma solução moderna para gerenciamento de produtos perecíveis, automatizando o controle de validade e auxiliando na tomada de decisões através de dashboards, alertas e relatórios personalizados.

---

## 🎯 Objetivos

* Automatizar o controle de validade de produtos.
* Reduzir perdas por vencimento.
* Facilitar o cadastro e gerenciamento de produtos.
* Melhorar o controle de estoque.
* Agilizar processos utilizando leitura de código de barras.
* Disponibilizar informações estratégicas através de relatórios.

---

## ✨ Funcionalidades

### 📦 Gestão de Produtos

* Cadastro de produtos
* Edição de produtos
* Exclusão de produtos
* Consulta de produtos
* Controle de estoque
* Cadastro de fornecedores
* Cadastro de código de barras

### 📅 Gestão de Lotes e Validade

* Cadastro de lotes
* Controle de validade por lote
* Associação de lote ao produto
* Histórico de movimentações

### 📲 Aplicativo Mobile

* Leitura de código de barras
* Consulta rápida de produtos
* Cadastro de lote
* Cadastro de validade
* Consulta de estoque
* Interface otimizada para smartphones e tablets Android

### 🚨 Alertas Inteligentes

Sistema configurável de alertas para produtos:

* Próximos do vencimento
* Vencidos
* Com estoque baixo

O usuário poderá definir quantos dias antes do vencimento deseja receber notificações.

Exemplo:

Produto: Pão Integral

Validade média: 45 dias

Configuração do usuário:

* Alertar quando restarem 15 dias para o vencimento.

---

## 📊 Relatórios

O sistema permitirá a geração de diversos relatórios, como:

* Produtos vencidos
* Produtos próximos ao vencimento
* Produtos por fornecedor
* Produtos por marca
* Produtos por categoria
* Produtos por setor
* Produtos por período
* Estoque atual
* Produtos por lote

Todos os relatórios poderão ser filtrados conforme necessidade do usuário.

---

## 🏗 Arquitetura

O sistema será dividido em dois módulos principais.

### Backend

Responsável por:

* API REST
* Regras de negócio
* Autenticação
* Controle de estoque
* Processamento de alertas
* Persistência dos dados

### Frontend

Responsável por:

* Interface do usuário
* Dashboards
* Relatórios
* Cadastro de produtos
* Gestão de lotes
* Consumo da API

### Mobile

Aplicação Android para:

* Leitura de código de barras
* Cadastro de produtos
* Cadastro de validade
* Consulta rápida

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

* Microsoft SQL Server

### Infraestrutura

* AWS
* Nginx

### Mobile

* Android

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
├── mobile
│   ├── app
│   └── scanner
│
└── database
    ├── scripts
    └── migrations
```

---

## 🔄 Fluxo de Funcionamento

1. Cadastro do produto.
2. Cadastro do lote.
3. Registro da validade.
4. Atualização do estoque.
5. Monitoramento automático.
6. Geração de alertas.
7. Emissão de relatórios.

---

## 📈 Futuras Implementações

* Dashboard com indicadores em tempo real.
* Integração com leitores industriais.
* Notificações Push.
* QR Code.
* Integração com ERPs.
* Inteligência Artificial para previsão de perdas.
* API pública para integração com outros sistemas.
* Controle de inventário.
* Auditoria de movimentações.
* Multiempresa.

---

## 🚀 Como Executar

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

### Banco de Dados

1. Criar um banco no SQL Server.
2. Executar os scripts da pasta `/database`.
3. Configurar a conexão no arquivo `application.properties`.

---

## 📌 Requisitos

* Java 17+
* Maven
* Node.js
* Angular CLI
* SQL Server
* Git

---

## 📖 Metodologia

O projeto é desenvolvido utilizando práticas ágeis, com foco em entregas incrementais e melhoria contínua.

Metodologias utilizadas:

* Scrum (Solo Scrum)
* Kanban

---

## 👨‍💻 Autor

**Christopher Ryuhei Nitta**

Projeto desenvolvido como proposta de um Sistema de Gestão de Produtos Perecíveis para o setor varejista e indústria alimentícia.

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

Sinta-se livre para utilizar, modificar e contribuir.

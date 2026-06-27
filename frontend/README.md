Sistema de Cadastro de Produtos - Angular 19
Este projeto implementa um sistema completo de cadastro de produtos com funcionalidades de adição, edição, listagem e exclusão.

📁 Estrutura de Arquivos
src/
├── app/
│   ├── components/
│   │   ├── produto-form/
│   │   │   ├── produto-form.component.ts
│   │   │   ├── produto-form.component.html
│   │   │   └── produto-form.component.scss
│   │   └── produto-lista/
│   │       ├── produto-lista.component.ts
│   │       ├── produto-lista.component.html
│   │       └── produto-lista.component.scss
│   ├── services/
│   │   └── produto.service.ts
│   ├── app.component.ts
│   └── app.routes.ts
└── main.ts
🚀 Instalação
1. Instalar dependências do Angular Material
bash
ng add @angular/material
2. Instalar dependências necessárias
bash
npm install @angular/common @angular/forms @angular/router @angular/animations
3. Configurar o angular.json
Certifique-se de que o Angular Material theme está incluído em angular.json:

json
"styles": [
  "@angular/material/prebuilt-themes/indigo-pink.css",
  "src/styles.css"
]
🛠️ Configuração
1. Estrutura de pastas
Crie as seguintes pastas em src/app/:

components/produto-form/
components/produto-lista/
services/
2. Configurar a API
No arquivo produto.service.ts, ajuste a URL da API:

typescript
private readonly API_URL = 'http://localhost:8080/api/produtos'; // Sua URL aqui
3. Interface do Produto
A interface Produto está definida como:

typescript
export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  codigoDeBarras: string;
  categoria: string;
  fabricante?: string;
  ativo: boolean;
}
🎯 Funcionalidades
✅ Implementadas
Listagem de produtos com paginação e filtros
Formulário de cadastro com validações
Edição de produtos existentes
Exclusão com confirmação
Responsividade para mobile
Feedback visual (loading, messages)
Validação de formulários reativa
🔧 Validações do Formulário
Nome: obrigatório, mínimo 2 caracteres
Código de barras: obrigatório, exatamente 13 dígitos
Categoria: obrigatória (select)
Descrição: opcional
Fabricante: opcional
Ativo: boolean (padrão: true)
🎨 Design e UX
Interface moderna com Angular Material
Tema padrão Indigo-Pink
Ícones intuitivos
Estados de loading
Mensagens de feedback
Design responsivo
🌐 API Endpoints Esperados
O service espera os seguintes endpoints REST:

GET    /api/produtos           # Listar todos
GET    /api/produtos/:id       # Buscar por ID
POST   /api/produtos           # Criar novo
PUT    /api/produtos/:id       # Atualizar
DELETE /api/produtos/:id       # Deletar
🚀 Como Usar
1. Executar o projeto
bash
ng serve
2. Navegar para:
http://localhost:4200 - Lista de produtos
http://localhost:4200/produtos/novo - Novo produto
http://localhost:4200/produtos/editar/:id - Editar produto
📱 Responsividade
Desktop: Tabela completa com todas as colunas
Tablet: Oculta colunas menos importantes
Mobile: Mostra apenas informações essenciais
🐛 Troubleshooting
Erro de HttpClient
Se aparecer erro de NullInjectorError: HttpClient, verifique se provideHttpClient() está no main.ts.

Erro de Material Table
Se aparecer erro de DataSource, verifique se o dataSource está inicializado como array vazio.

Problemas de importação
Certifique-se de que todos os módulos do Material estão importados nos componentes que os utilizam.

📋 Próximos Passos
Adicionar filtros avançados
Implementar busca por categoria
Adicionar upload de imagens
Implementar ordenação personalizada
Adicionar exportação para Excel/PDF

# FastMarmita

Aplicação de pedidos de marmitas com:
- **Backend** em ASP.NET Core (API REST com autenticação JWT)
- **Mobile** em React Native (Expo)

O projeto oferece fluxo completo de catálogo, carrinho, checkout e acompanhamento de pedidos, com área administrativa para gestão de marmitas, pedidos e relatório de vendas.

## Funcionalidades

### Cliente
- Cadastro e login
- Visualização de cardápio
- Carrinho de compras
- Finalização de pedido
- Acompanhamento de status do pedido
- Histórico de pedidos

### Administrador
- Cadastro, edição e remoção de marmitas
- Upload de imagem para marmitas
- Visualização de todos os pedidos
- Atualização de status dos pedidos
- Relatório de vendas por período

## Stack

### Backend (`/Backend`)
- .NET 10 (ASP.NET Core Web API)
- Entity Framework Core + SQL Server
- JWT (token)
- Mapster
- BCrypt (hash de senha)
- Swagger
- SignalR (`/chathub`)

### Mobile (`/Mobile`)
- React Native + Expo
- React Navigation
- Axios
- AsyncStorage

## Estrutura do repositório

```text
FastMarmita/
├── Backend/   # API, regras de negócio e persistência
├── Mobile/    # App mobile em React Native (Expo)
└── Cart.sln   # Solução .NET na raiz
```

## Pré-requisitos

- .NET SDK 10
- SQL Server LocalDB (ou SQL Server compatível)
- Node.js (LTS)
- npm
- Expo Go (opcional, para testar em dispositivo)

## Como rodar

## 1) Backend

No diretório `/Backend`:

```bash
dotnet restore
dotnet run
```

API padrão em:
- `http://localhost:5111`
- Swagger (ambiente de desenvolvimento): `http://localhost:5111/swagger`

> O projeto inicializa dados automaticamente (`DbInitializer`) quando não existem registros no banco.

### Configurações importantes

Arquivo: `Backend/appsettings.json`
- `ConnectionStrings:DefaultConnection`
- `Jwt:Key`
- `Jwt:Issuer`
- `Jwt:Audience`

Se necessário, ajuste também `Backend/Properties/launchSettings.json`.

## 2) Mobile

No diretório `/Mobile`:

```bash
npm install
npm run start
```

Depois, use o Expo para abrir em Android/iOS/Web.

### Base URL da API no app

Arquivo: `Mobile/src/services/api.js`
- Android Emulator: `http://10.0.2.2:5111/api`
- iOS/Web/local: `http://localhost:5111/api`

Se estiver usando dispositivo físico, troque para o IP da máquina que está rodando o backend.

## Credenciais iniciais (seed)

Na primeira execução, o backend cria um usuário administrador:

- **Email:** `admin@fastmarmita.com`
- **Senha:** `admin123`

## Endpoints principais

### Auth
- `POST /api/Auth/login`
- `POST /api/Auth/register`

### Marmitas
- `GET /api/Marmitas`
- `GET /api/Marmitas/{id}`
- `POST /api/Marmitas` (Admin)
- `PUT /api/Marmitas/{id}` (Admin)
- `DELETE /api/Marmitas/{id}` (Admin)
- `POST /api/Marmitas/upload` (Admin)

### Pedidos
- `GET /api/Pedidos`
- `GET /api/Pedidos/{id}`
- `POST /api/Pedidos`
- `PATCH /api/Pedidos/{id}/status` (Admin)
- `GET /api/Pedidos/report?start={data}&end={data}` (Admin)

## Regras de acesso

- Endpoints protegidos exigem token JWT no header `Authorization`.
- Usuário comum acessa apenas os próprios pedidos.
- Usuário administrador tem acesso às rotas administrativas.

## Observações

- Uploads de imagens ficam em `Backend/wwwroot/uploads`.
- O status do pedido segue a enum:
  - `0`: AguardandoAceite
  - `1`: EmPreparo
  - `2`: EmEntrega
  - `3`: Entregue
  - `4`: Cancelado

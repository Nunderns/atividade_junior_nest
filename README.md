# 📦 Pedidos Microserviço

API **NestJS** para gerenciamento de **clientes e pedidos**, com **upload de comprovantes (AWS S3 ou local)**, **processamento assíncrono com BullMQ (Redis)** e **relatórios agregados**.

Este projeto foi desenvolvido como **teste técnico para Backend**, com foco em arquitetura limpa, boas práticas, validação, integrações externas e segurança.

---

## 🧱 Stack utilizada

- **Node.js / TypeScript**
- **NestJS**
- **MongoDB (Mongoose)**
- **Redis + BullMQ**
- **AWS S3 (upload de arquivos)**
- **Axios (API externa de câmbio USD/BRL)**
- **Swagger (OpenAPI)**

---

## 🚀 Quickstart

### 1️⃣ Configuração de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Edite o .env com os valores adequados (MongoDB, Redis, AWS, etc).

⚠️ Por segurança, credenciais reais não são versionadas.
Use apenas placeholders no .env.example.

2️⃣ Subir dependências (MongoDB e Redis)

Você pode usar Docker para iniciar os serviços:
```bash
docker run -d --name mongo -p 27017:27017 mongo:6
docker run -d --name redis -p 6379:6379 redis:7
```
3️⃣ Instalar dependências e rodar a aplicação
```bash
npm install
npm run start:dev
```

A API estará disponível em:
```bash
http://localhost:3000
```
📚 Documentação da API (Swagger)

A documentação interativa está disponível em:
```bash
http://localhost:3000/docs
```

Inclui:
- Endpoints
- Modelos
- Validações

Parâmetros de query e body

🔌 Principais endpoints
**Clientes**

- POST /clientes
- GET /clientes
- GET /clientes/:id
- PUT /clientes/:id
- DELETE /clientes/:id

**Pedidos**

POST /pedidos

Calcula automaticamente totalUSD e totalBRL

Consome API externa de câmbio

Enfileira notificação assíncrona

GET /pedidos

Suporte a paginação (page, limit)

GET /pedidos/:id

PUT /pedidos/:id

DELETE /pedidos/:id

Upload de comprovantes

POST /pedidos/:id/comprovante

Upload de PDF ou imagem

Suporte a AWS S3 ou armazenamento local

Salva a URL do comprovante no pedido

Relatórios

GET /relatorios/top-clientes?limit=10

Retorna os clientes ordenados pelo valor total gasto em BRL

Inclui dados do cliente (nome, email, país)

📦 Upload de arquivos (S3 ou local)

O projeto suporta dois modos de upload:

🔹 AWS S3 (produção)

Configure no .env:

STORAGE_PROVIDER=s3
USE_LOCAL_UPLOAD=false
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET=your_bucket_name

🔹 Armazenamento local (desenvolvimento)
USE_LOCAL_UPLOAD=true
UPLOADS_PATH=uploads

🔁 Processamento assíncrono (BullMQ)

Fila: notificacao

Ao criar um pedido:

Um job é enfileirado

O processor consome o job e simula envio de e-mail via log

Implementado usando:

@nestjs/bullmq

@Processor

@Process

🌎 Conversão de moeda

A conversão USD → BRL é feita via API externa:

https://economia.awesomeapi.com.br/json/last/USD-BRL


Configurável via variável de ambiente:

EXCHANGE_RATE_API_URL=https://economia.awesomeapi.com.br/json/last/USD-BRL

🧪 Testes
npm run test
npm run test:e2e
npm run test:cov


⚠️ Testes automatizados são opcionais no escopo do teste, mas a estrutura está preparada.

🔐 Segurança

Credenciais sensíveis não são versionadas

.env.example contém apenas placeholders

Upload e filas são abstraídos por serviços, facilitando troca de providers

📝 Observações técnicas

A API não gera comprovantes automaticamente

O backend apenas recebe e armazena arquivos enviados

Decisão alinhada ao escopo do teste e separação de responsabilidades
# SMH

API REST de monitoramento hospitalar -- gestao de pacientes, leitos, sensores e leituras clinicas com autenticacao JWT e autorizacao por papeis (roles).

## EXA0252 - Programação Web - T01 (2026.2)

**Curso:** Ciencia da Computacao / CCEN - Mossoro - Bacharelado - MT
**Universidade:** UFERSA - Universidade Federal Rural do Semi-Arido
**Professor:** Paulo Gabriel Gadelha Queiroz

**Integrantes:**

| Nome                                | GitHub                                         |
|-------------------------------------|------------------------------------------------|
| Guilherme Francisco Martins de Melo | [@glhermeMelo](https://github.com/glhermeMelo) |
| Karen Gomes                         | [@KarenSGomes](https://github.com/KarenSGomes) |
| Lavinia Santana                     | [@lavicrw](https://github.com/lavicrw)         |

---

## 1. Stack

| Camada           | Tecnologia                                       |
|------------------|--------------------------------------------------|
| Linguagem        | Java 21                                          |
| Framework        | Spring Boot 4.1.1                                |
| Build            | Maven (`./mvnw`)                                 |
| Autenticacao     | Spring Security + JWT (auth0 java-jwt)           |
| ORM              | Spring Data JPA + Hibernate 7                    |
| Database         | PostgreSQL 16                                    |
| Migrations       | Flyway                                           |
| Validacao        | Bean Validation (Hibernate Validator, `@CPF`)    |
| Sensores         | CoAP - Eclipse Californium 3.14 (UDP 5683)       |
| Monitoramento    | Spring Boot Actuator (health)                    |
| Container        | Docker + Docker Compose                          |
| Seguranca        | BCrypt (hash de senha) + `@RolesAllowed`         |

## 2. Integracoes

| Integracao                  | Proposito                          | Status              |
|-----------------------------|------------------------------------|---------------------|
| Dispositivos CoAP           | Envio de leituras dos sensores     | Ativo (ambiente)    |
| Postgres (`db`)             | Persistencia                       | Ativo               |

> O sensor de **ambiente** ja envia leituras via CoAP (`POST /leituras/ambiente`, secao 5.10); o sensor de **paciente** esta em desenvolvimento. A API REST expoe apenas a consulta das leituras (secao 5.9).

## 3. Pre-requisitos

- Docker Engine + Docker Compose plugin
- Java 21 JDK + Maven (apenas para dev local)
- `openssl` (para gerar o `JWT_SECRET`)
- `coap-client` (libcoap -- opcional, para testar o CoAP pelo terminal)

## 4. Setup

### 1. Clonar e configurar

```bash
git clone <https://github.com/glhermeMelo/sistema-de-monitoramento-hospitalar>
cd SMH
```

Crie o `.env` na raiz copiando o exemplo (o `.env` e git-ignored e lido automaticamente pela aplicacao; o `.env.example` tem todas as variaveis):

```bash
cp .env.example .env
```

| Variavel                  | Descricao                             | Exemplo                   |
|---------------------------|---------------------------------------|---------------------------|
| `JWT_SECRET`              | Chave HMAC para assinar/validar o JWT | `openssl rand -base64 48` |
| `JWT_ISSUER`              | Emissor do token (claim `iss`)        | `smh`                     |
| `POSTGRES_HOST`           | URL em que o PostgreSQL roda          | `localhost`               |
| `POSTGRES_USER`           | Usuario do PostgreSQL                 | `postgres`                |
| `POSTGRES_PASSWORD`       | Senha do PostgreSQL                   | `senhapostgres`           |
| `POSTGRES_DB_NAME`        | Nome do database                      | `SMH`                     |
| `POSTGRES_PORT`           | Porta do db no host                   | `5432`                    |
| `CONTAINER_POSTGRES_NAME` | Nome do container do db               | `smh-db`                  |
| `CONTAINER_APP_NAME`      | Nome do container da app              | `smh-app`                 |
| `APP_PORT`                | Porta da API no host                  | `8080`                    |
| `COAP_PORTA`              | Porta UDP do servidor CoAP            | `5683`                    |
| `COAP_NOME_SERVIDOR`      | Nome/tag do servidor CoAP             | `smh-coap`                |

> **Nao commitar o `.env`** -- contem segredos. `COAP_PORTA` e `COAP_NOME_SERVIDOR` sao opcionais (default `5683` e `smh-coap`).

### 2. Subir tudo

```bash
docker compose up -d
```

Apos inicio, os servicos estarao disponiveis em:

| Servico                | URL                                     |
|------------------------|-----------------------------------------|
| App (API REST)         | `${POSTGRES_HOST}:${APP_PORT}`          |
| Saude (publica)        | `http://localhost:8080/actuator/health` |
| PostgreSQL             | `localhost:${POSTGRES_PORT}`            |
| CoAP (UDP)             | `coap://<host>:5683`                    |

> **CoAP no Docker:** o `compose.yaml` publica apenas a porta TCP da API. Para o dispositivo alcancar o CoAP de fora do container, adicione `- '5683:5683/udp'` em `ports` do servico `app` -- ou rode o backend direto no host (secao 8).

### 3. Seeds de desenvolvimento

As migrations Flyway (`V1__create_tables.sql`) rodam sozinhas no boot. Para recriar o schema do zero: `docker compose down -v` (apaga o volume do Postgres; as seeds rodam de novo na proxima subida).

Na primeira subida, os seeds (`CommandLineRunner`) criam os dados abaixo de forma **idempotente** -- so quando o registro ainda nao existe:

**Administrador** (`AdminSeed`):

| Campo  | Valor                |
|--------|----------------------|
| nome   | `Admin`              |
| cpf    | `52998224725`        |
| login  | `admin`              |
| senha  | `Admin@123` (bcrypt) |

**Dados para os dispositivos CoAP** (`LeitoSeed`, `PacienteSeed`, `SensorSeed`):

| Seed           | O que cria                                                             |
|----------------|------------------------------------------------------------------------|
| `LeitoSeed`    | leito `1` -- localizacao `Quarto 101`, status `LIVRE`                   |
| `PacienteSeed` | paciente `1` -- `Paciente Teste`, CPF `11144477735`, nasc. `1990-01-01` |
| `SensorSeed`   | sensor de ambiente (leito 1, 2000 ms) e sensor de paciente (paciente 1, 1000 ms) |

> Os `idSensor` vem do `SERIAL`: confira no log do boot (`[SEED] Sensor ambiente criado: idSensor=1 -> leito 1`) e use esse valor no `ID_SENSOR` do firmware. Troque a senha do admin apos o primeiro login. Para zerar tudo: `docker compose down -v`.

---

## 5. Documentacao da API

### 5.1. Autenticacao (visao geral)

Todos os endpoints exceto `POST /api/v3/auth/login` e `GET /actuator/health` exigem token JWT no header:

```
Authorization: Bearer <token>
```

- O token expira em **15 minutos**; apos expirar, refaca o login.
- Claims: `iss=smh`, `sub=<login>`, `role=<papel>`, `exp`.
- No Postman: aba **Authorization -> Type: Bearer Token** -> cole o token.

**Papeis (roles):**

| Role        | Descricao                                                          | Endpoints cobertos                                   |
|-------------|--------------------------------------------------------------------|------------------------------------------------------|
| `ADMIN`     | Gestao de contas e permissoes (usuarios e liberacao de CPFs)       | `/api/v3/usuarios`, `/api/v3/admins`                 |
| `MEDICO`    | Equipe clinica                                                     | `/api/v3/pacientes`, `/api/v3/**/leituras`           |
| `ENFERMAGEM`| Equipe clinica (mesmo acesso do MEDICO)                            | `/api/v3/pacientes`, `/api/v3/**/leituras`           |
| `MANUTENCAO`| Manutencao de infraestrutura fisica                                | `/api/v3/leitos`, `/api/v3/**/sensores`              |

> **Obs.:** o `ADMIN` **nao** acessa pacientes, leituras, leitos ou sensores -- cada papel ve so o seu bloco. O papel vem do `cargo` do CPF liberado (`cargo_usuario`: `MEDICO`, `ENFERMAGEM`, `MANUTENCAO`); o administrador logado sempre tem `ADMIN`.
>
> **Leitos:** os `GET` de leitos tambem estao liberados para `MEDICO` e `ENFERMAGEM` (somente leitura); criar/editar/remover continua exclusivo de `MANUTENCAO`.

**Como cada um obtem um papel:**

1. Login como `admin` (seed) -> token `ADMIN`
2. `POST /api/v3/admins` libera um CPF com `cargo` + `dataLimiteHabilitado`
3. `POST /api/v3/usuarios` cria o usuario daquele CPF (a senha nasce com hash bcrypt)
4. Login com o `login`/`senha` do usuario -> token com o cargo correspondente

> Usuario sem CPF liberado ou com `dataLimiteHabilitado` vencida recebe **401** no login (conta desabilitada).

---

### 5.2. Saude

`GET /actuator/health` — **Publico**

```bash
curl http://localhost:8080/actuator/health
```

---

### 5.3. Autenticacao

#### Login

`POST /api/v3/auth/login` — **Publico**

```json
// Request
{
  "login": "string (required)",
  "senha": "string (required)"
}

// Response 200
{
  "token": "string (JWT, valido 15min)"
}
```

```bash
curl -X POST http://localhost:8080/api/v3/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","senha":"Admin@123"}'
```

Credenciais invalidas -> `401` (ProblemDetail). Usuario desabilitado/vencido -> `401`.

---

### 5.4. Usuarios (`ADMIN`)

Recurso de contas de acesso (medicos, enfermeiros, manutencoes). O CPF precisa estar **liberado** em `/api/v3/admins` antes de criar -- senao -> `404`.

#### Listar

`GET /api/v3/usuarios` — **ADMIN**

```json
// Response 200
[
  { "nome": "string", "cpf": "string", "login": "string" }
]
```

```bash
curl http://localhost:8080/api/v3/usuarios \
  -H "Authorization: Bearer $TOKEN"
```

#### Cadastrar

`POST /api/v3/usuarios` — **ADMIN**

```json
// Request
{
  "nome": "string (required, apenas letras e espacos, max 255)",
  "cpf": "string (required, 11 digitos, CPF valido)",
  "login": "string (required, max 255)",
  "senha": "string (required, min 8, maiuscula + minuscula + numero + especial)"
}

// Response 201
{
  "nome": "string",
  "cpf": "string",
  "login": "string"
}
```

```bash
curl -X POST http://localhost:8080/api/v3/usuarios \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria Silva","cpf":"12345678909","login":"maria","senha":"Senha@123"}'
```

#### Detalhar por CPF

`GET /api/v3/usuarios/{cpf}` — **ADMIN** -> `200` com `{ "nome", "cpf", "login" }` (nao encontrado -> `404`).

#### Atualizar (parcial)

`PATCH /api/v3/usuarios/{cpf}` — **ADMIN**

```json
// Request (campos opcionais)
{
  "login": "string (max 255)",
  "senha": "string (mesmas regras do cadastro)"
}

// Response 200
{
  "nome": "string",
  "cpf": "string",
  "login": "string"
}
```

#### Remover

`DELETE /api/v3/usuarios/{cpf}` — **ADMIN** -> `204` (remocao definitiva).

---

### 5.5. Liberacao de CPFs / Cargos (`ADMIN`)

`/api/v3/admins` gerencia quem pode ter conta e com qual cargo (e ate quando vale o acesso).

#### Listar liberacoes

`GET /api/v3/admins` — **ADMIN**

```json
// Response 200
[
  {
    "cpf": "string",
    "cargo": "MEDICO | ENFERMAGEM | MANUTENCAO",
    "dataLimiteHabilitado": "yyyy-MM-dd",
    "idAdmin": 1
  }
]
```

#### Liberar CPF

`POST /api/v3/admins` — **ADMIN**

```json
// Request
{
  "cpf": "string (required, CPF valido)",
  "cargo": "MEDICO | ENFERMAGEM | MANUTENCAO (required)",
  "idAdmin": 1 (required, id do administrador que liberou),
  "dataLimiteHabilitado": "yyyy-MM-dd (required, hoje ou futura)"
}

// Response 201
{
  "cpf": "string",
  "cargo": "string",
  "dataLimiteHabilitado": "yyyy-MM-dd",
  "idAdmin": 1
}
```

```bash
curl -X POST http://localhost:8080/api/v3/admins \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cpf":"12345678909","cargo":"MEDICO","idAdmin":1,"dataLimiteHabilitado":"2026-12-31"}'
```

#### Detalhar liberacao

`GET /api/v3/admins/cpf/{cpf}` — **ADMIN** -> `200` ou `404`.

#### Atualizar liberacao (parcial)

`PATCH /api/v3/admins/cpf/{cpf}` — **ADMIN**

```json
// Request (campos opcionais)
{
  "cargo": "MEDICO | ENFERMAGEM | MANUTENCAO",
  "dataLimiteHabilitado": "yyyy-MM-dd (hoje ou futura)"
}

// Response 200 (mesmo formato do Response acima)
```

#### Revogar liberacao

`DELETE /api/v3/admins/cpf/{cpf}` — **ADMIN** -> `204`

> **Atencao:** por FK com `ON DELETE CASCADE`, revogar o CPF **remove tambem** o usuario vinculado.

---

### 5.6. Pacientes (`MEDICO`, `ENFERMAGEM`)

#### Listar

`GET /api/v3/pacientes` — **MEDICO | ENFERMAGEM**

```json
// Response 200
[
  {
    "idPaciente": 1,
    "nome": "string",
    "dataNascimento": "yyyy-MM-dd"
  }
]
```

```bash
curl http://localhost:8080/api/v3/pacientes \
  -H "Authorization: Bearer $TOKEN"
```

#### Cadastrar

`POST /api/v3/pacientes` — **MEDICO | ENFERMAGEM**

```json
// Request
{
  "nome": "string (required, apenas letras e espacos, max 255)",
  "cpf": "string (required, CPF valido)",
  "dataNascimento": "dd/MM/yyyy (required, data no passado)"
}

// Response 201
{
  "idPaciente": 1,
  "nome": "string",
  "dataNascimento": "yyyy-MM-dd"
}
```

```bash
curl -X POST http://localhost:8080/api/v3/pacientes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Joao Souza","cpf":"98765432109","dataNascimento":"15/03/1980"}'
```

#### Detalhar

`GET /api/v3/pacientes/{idPaciente}` — **MEDICO | ENFERMAGEM** -> `200` ou `404`.

#### Remover (soft delete)

`DELETE /api/v3/pacientes/{idPaciente}` — **MEDICO | ENFERMAGEM** -> `204` (paciente marcado como inativo; o registro permanece para historico de leituras).

---

### 5.7. Leitos (`MANUTENCAO` -- `GET` tambem para `MEDICO`/`ENFERMAGEM`)

#### Listar

`GET /api/v3/leitos` — **MANUTENCAO | MEDICO | ENFERMAGEM**

```json
// Response 200
[
  {
    "numeroLeito": 1,
    "localizacao": "string",
    "statusLeito": "LIVRE | OCUPADO | MANUTENCAO"
  }
]
```

```bash
curl http://localhost:8080/api/v3/leitos \
  -H "Authorization: Bearer $TOKEN"
```

#### Cadastrar

`POST /api/v3/leitos` — **MANUTENCAO**

```json
// Request
{
  "numeroLeito": 1 (required, inteiro >= 1, PK),
  "localizacao": "string (required, max 100)",
  "statusLeito": "LIVRE | OCUPADO | MANUTENCAO (opcional, default LIVRE)",
  "idPaciente": 1 (opcional, inteiro >= 1, paciente ja cadastrado)
}

// Response 201
{
  "numeroLeito": 1,
  "localizacao": "string",
  "statusLeito": "string"
}
```

```bash
curl -X POST http://localhost:8080/api/v3/leitos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"numeroLeito":101,"localizacao":"Ala A - Quarto 1"}'
```

#### Detalhar

`GET /api/v3/leitos/{numeroLeito}` — **MANUTENCAO | MEDICO | ENFERMAGEM** -> `200` ou `404`.

#### Atualizar (total)

`PUT /api/v3/leitos/{numeroLeito}` — **MANUTENCAO**

```json
// Request (mesmo corpo do POST)
{
  "numeroLeito": 1 (required),
  "localizacao": "string (required)",
  "statusLeito": "opcional",
  "idPaciente": "opcional"
}

// Response 200
```

#### Atualizar (parcial)

`PATCH /api/v3/leitos/{numeroLeito}` — **MANUTENCAO**

```json
// Request (campos opcionais)
{
  "numeroLeito": "inteiro >= 1",
  "localizacao": "string (max 100)",
  "statusLeito": "LIVRE | OCUPADO | MANUTENCAO"
}

// Response 200
```

#### Remover

`DELETE /api/v3/leitos/{numeroLeito}` — **MANUTENCAO** -> `204`.

---

### 5.8. Sensores (`MANUTENCAO`)

Dois tipos: sensor de **paciente** (vital signs) e sensor de **ambiente** (clima do quarto). O tipo (`PACIENTE` / `LEITO`) e definido automaticamente pela rota.

#### Sensores do paciente

Base: `/api/v3/pacientes/{idPaciente}/sensores`

`GET` (lista), `GET /{idSensor}` (detalhe) — **MANUTENCAO**

```json
// Response 200
[
  {
    "idSensor": 1,
    "idPaciente": 1,
    "intervaloLeitura": 10,
    "tipo": "PACIENTE",
    "pinosI2c": 21,
    "pinosOneWire": 4
  }
]
```

`POST` — **MANUTENCAO**

```json
// Request
{
  "intervaloLeitura": 10 (required, inteiro >= 1, segundos),
  "pinosI2c": 21 (required, pino I2C - MAX30102),
  "pinosOneWire": 4 (required, pino One Wire - termometria)
}

// Response 201
{
  "idSensor": 1,
  "idPaciente": 1,
  "intervaloLeitura": 10,
  "tipo": "PACIENTE",
  "pinosI2c": 21,
  "pinosOneWire": 4
}
```

```bash
curl -X POST http://localhost:8080/api/v3/pacientes/1/sensores \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"intervaloLeitura":10,"pinosI2c":21,"pinosOneWire":4}'
```

`PUT /{idSensor}` — **MANUTENCAO** (mesmo corpo do POST) · `PATCH /{idSensor}` — campos opcionais · `DELETE /{idSensor}` — `204`.

#### Sensores do ambiente

Base: `/api/v3/leitos/{numeroLeito}/sensores`

`GET` (lista), `GET /{idSensor}` (detalhe) — **MANUTENCAO**

```json
// Response 200
[
  {
    "idSensor": 1,
    "numeroLeito": 101,
    "intervaloLeitura": 30,
    "tipo": "LEITO",
    "pinosSdaScl": 21,
    "pinoAnalogico": 34
  }
]
```

`POST` — **MANUTENCAO**

```json
// Request
{
  "intervaloLeitura": 30 (required, inteiro >= 1, segundos),
  "pinosSdaScl": 21 (required, pins SDA/SCL - BME280/ENS160),
  "pinoAnalogico": 34 (required, pino analogico - KY-037)
}

// Response 201 (mesmo formato do Response acima)
```

```bash
curl -X POST http://localhost:8080/api/v3/leitos/101/sensores \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"intervaloLeitura":30,"pinosSdaScl":21,"pinoAnalogico":34}'
```

`PUT /{idSensor}` — **MANUTENCAO** (mesmo corpo do POST) · `PATCH /{idSensor}` — campos opcionais · `DELETE /{idSensor}` — `204`.

---

### 5.9. Leituras (`MEDICO`, `ENFERMAGEM`)

Somente leitura -- as leituras sao inseridas pelos dispositivos via CoAP (secao 5.10).

#### Leituras do paciente

`GET /api/v3/pacientes/{idPaciente}/leituras` — **MEDICO | ENFERMAGEM**

```json
// Response 200
[
  {
    "idLeitura": 1,
    "idSensor": 1,
    "idPaciente": 1,
    "dataLeitura": "2026-09-28T14:30:00",
    "temperaturaCorporal": 36.5,
    "spo2": 98,
    "bpm": 72
  }
]
```

```bash
curl http://localhost:8080/api/v3/pacientes/1/leituras \
  -H "Authorization: Bearer $TOKEN"
```

`GET /api/v3/pacientes/{idPaciente}/leituras/{idLeitura}` — detalhe (`200` ou `404`).

#### Leituras do ambiente

`GET /api/v3/leitos/{numeroLeito}/leituras` — **MEDICO | ENFERMAGEM**

```json
// Response 200
[
  {
    "idLeitura": 1,
    "idSensor": 1,
    "numeroLeito": 101,
    "dataLeitura": "2026-09-28T14:30:00",
    "temperaturaAmbiente": 24.1,
    "umidadeAmbiente": 55.2,
    "pressaoAmbiente": 1013.0,
    "indiceTvoc": 120,
    "indiceEco2": 450,
    "nivelRuido": 35.5,
    "nivelLuminosidade": 320.0
  }
]
```

```bash
curl http://localhost:8080/api/v3/leitos/101/leituras \
  -H "Authorization: Bearer $TOKEN"
```

`GET /api/v3/leitos/{numeroLeito}/leituras/{idLeitura}` — detalhe (`200` ou `404`).

---

### 5.10. CoAP (dispositivos)

O backend sobe o servidor CoAP (Eclipse Californium) em **UDP 5683** junto com a aplicacao. Os dispositivos enviam leituras por `POST` com payload **JSON** (`Content-Format: 50`, opcional na entrada).

| Recurso                   | Metodo | Descricao                                             |
|---------------------------|--------|-------------------------------------------------------|
| `/leituras/ambiente`      | POST   | Leitura do no ambiente (AHT21, ENS160, BH1750, KY-037) |
| `/leituras/paciente`      | --     | Em desenvolvimento (no de sinais vitais)               |

**Payload -- ambiente** (`LeituraAmbienteDTO`):

```json
{
  "idSensor": 1,
  "temperaturaAmbiente": 24.1,
  "umidadeAmbiente": 55.0,
  "pressaoAmbiente": null,
  "indiceTvoc": 120,
  "indiceEco2": 410,
  "nivelRuido": 18.5,
  "nivelLuminosidade": 210.0
}
```

- Apenas `idSensor` e obrigatorio: o servidor resolve o `numeroLeito` a partir do sensor cadastrado (`sensor_ambiente`).
- Campos ausentes/`null` viram `NULL` no banco; campos extras no JSON sao ignorados.
- `dataLeitura` e gerada pelo **servidor** (`now()`), nao pelo dispositivo.
- O dispositivo so precisa saber o `idSensor` (retornado por `POST /api/v3/leitos/{n}/sensores` ou no log do seed).

**Respostas:**

| Codigo CoAP               | Quando acontece                                           |
|---------------------------|-----------------------------------------------------------|
| `2.01 Created`            | leitura gravada (corpo: JSON da leitura, com `idLeitura`)  |
| `4.00 Bad Request`        | payload vazio, JSON invalido ou `idSensor` ausente         |
| `4.04 Not Found`          | sensor inexistente ou sensor que nao pertence ao leito     |
| `4.05 Method Not Allowed` | metodo diferente de `POST`                                 |
| `5.00 Internal Server Error` | erro inesperado (detalhe vai para o console do backend) |

```bash
# Pre-requisito: libcoap (ex.: sudo apt install libcoap3-bin)

# Descoberta de recursos (deve listar </leituras/ambiente>)
coap-client -m get coap://localhost:5683/.well-known/core

# Teste de leitura (sem o dispositivo)
coap-client -m post -t 50 \
  -e '{"idSensor":1,"temperaturaAmbiente":24.1,"umidadeAmbiente":55,"indiceTvoc":120,"indiceEco2":410,"nivelRuido":18.5,"nivelLuminosidade":210}' \
  coap://localhost:5683/leituras/ambiente
```

> O CoAP **nao passa pelo JWT**: o acesso e controlado pela rede (dispositivos na mesma LAN). Autenticacao (DTLS-PSK/token) fica para uma proxima etapa.

---

### 5.11. Erros

Toda resposta de erro usa **ProblemDetail** (`application/problem+json`):

```json
{
  "title": "Acesso negado",
  "status": 403,
  "detail": "Voce nao tem permissao para executar esta operacao.",
  "instance": "/api/v3/usuarios",
  "timestamp": "2026-09-28T22:47:38.154831Z"
}
```

| Status | Quando acontece                                                   |
|--------|-------------------------------------------------------------------|
| `400`  | Corpo invalido (validacao de campos: CPF, senha, obrigatorios)    |
| `401`  | Login/senha incorretos ou conta desabilitada (grant vencido)       |
| `403`  | Sem token, token expirado/invalido ou papel nao autorizado na rota |
| `404`  | Recurso inexistente (paciente, leito, sensor, CPF nao liberado)   |
| `409`  | Conflito (login duplicado, violacao de integridade)                |
| `500`  | Erro inesperado                                                   |

```bash
# Sem token -> 403
curl -i http://localhost:8080/api/v3/usuarios

# Senha errada -> 401
curl -i -X POST http://localhost:8080/api/v3/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","senha":"errada"}'
```

---

## 6. Comandos uteis

```bash
# Subir tudo
docker compose up -d

# Subir apenas o banco (dev local)
docker compose up -d db

# Rebuildar apos alteracoes no codigo
docker compose up -d --build

# Ver logs
docker compose logs -f app

# Status
docker ps

# Entrar no psql
docker exec -it smh-db psql -U postgres -d SMH

# Health check (publico)
curl -s http://localhost:8080/actuator/health

# Testar login de ponta a ponta
curl -s -X POST http://localhost:8080/api/v3/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","senha":"Admin@123"}'

# Testar o CoAP (descoberta + leitura de exemplo)
coap-client -m get coap://localhost:5683/.well-known/core
coap-client -m post -t 50 -e '{"idSensor":1,"temperaturaAmbiente":24.1,"umidadeAmbiente":55}' \
  coap://localhost:5683/leituras/ambiente

# Zerar o banco (recria schema + seeds no proximo boot)
docker compose down -v
```

## 7. Estrutura do Projeto

```
SMH/
├── compose.yaml                  # Orquestracao (app + db)
├── Dockerfile                    # Build multi-stage (Maven + JRE 21)
├── pom.xml                       # Dependencias Maven
├── .env                          # Segredos/config (git-ignored)
│
├── src/main/
│   ├── java/br/edu/ufersa/smh/
│   │   ├── SmhApplication.java
│   │   ├── admin/                            # Liberacao de CPFs + cargos
│   │   │   ├── AdminController.java          # /api/v3/admins
│   │   │   ├── AdminSeed.java                # Seed do 1o admin no boot
│   │   │   ├── CpfCadastradoService.java
│   │   │   ├── AdminRepository.java / CpfCadastradoRepository.java
│   │   │   ├── model/Admin.java / model/CpfCadastrado.java / model/CargoUsuario.java
│   │   │   └── dto/                          # CpfCadastradoDTO/Response...
│   │   ├── auth/                             # Autenticacao
│   │   │   ├── AuthController.java           # POST /api/v3/auth/login
│   │   │   ├── AuthService.java
│   │   │   ├── TokenService.java             # JWT15min (HMAC256)
│   │   │   ├── UserDetailServiceImpl.java    # Branch usuario/admin + expiry
│   │   │   └── AuthDTO.java / AuthResponse.java
│   │   ├── common/
│   │   │   ├── security/
│   │   │   │   ├── SecurityConfig.java       # Chain + @EnableMethodSecurity + beans
│   │   │   │   └── SecurityFilter.java       # Bearer -> SecurityContext
│   │   │   ├── exception/GlobalExceptionHandler.java  # ProblemDetail 4xx/5xx
│   │   │   └── vo/                           # Nome, Cpf, Login, Senha (VOs)
│   │   ├── usuario/                          # Contas de acesso (ADMIN)
│   │   │   ├── UsuarioController.java        # /api/v3/usuarios
│   │   │   ├── UsuarioService.java
│   │   │   └── dto/
│   │   ├── paciente/                         # Pacientes (MEDICO/ENFERMAGEM)
│   │   │   ├── PacienteController.java       # /api/v3/pacientes
│   │   │   ├── PacienteSeed.java             # Seed: paciente de teste no boot
│   │   │   ├── PacienteService.java
│   │   │   └── dto/
│   │   ├── leito/                            # Leitos (MANUTENCAO)
│   │   │   ├── LeitoController.java          # /api/v3/leitos
│   │   │   ├── LeitoSeed.java                # Seed: leito 1 no boot
│   │   │   ├── LeitoService.java
│   │   │   └── dto/
│   │   ├── sensor/                           # Sensores (MANUTENCAO)
│   │   │   ├── SensorPacienteController.java # /api/v3/pacientes/{id}/sensores
│   │   │   ├── SensorAmbienteController.java # /api/v3/leitos/{n}/sensores
│   │   │   ├── SensorSeed.java               # Seed: sensores de ambiente/paciente
│   │   │   └── dto/
│   │   ├── leitura/                          # Leituras (MEDICO/ENFERMAGEM)
│   │   │   ├── LeituraPacienteController.java# /api/v3/pacientes/{id}/leituras
│   │   │   ├── LeituraAmbienteController.java# /api/v3/leitos/{n}/leituras
│   │   │   ├── LeituraAmbienteService.java   # cadastrarLeituraAmbiente (usado pelo CoAP)
│   │   │   └── dto/
│   │   └── coap/                             # Servidor CoAP (UDP 5683)
│   │       ├── CoapServerConfig.java         # Sobe o CoapServer + arvore /leituras
│   │       ├── LeituraAmbienteCoapResource.java  # POST /leituras/ambiente
│   │       └── LeituraPacienteCoapResource.java  # (em desenvolvimento)
│   │
│   └── resources/
│       ├── application.properties            # ddl-auto=validate, datasource (.env)
│       └── db/migration/
│           └── V1__create_tables.sql         # Schema completo (Flyway)
```

## 8. Desenvolvimento local (sem Docker)

```bash
# 1. Sobe so o banco
docker compose up -d db

# 2. A app local (porta 8080 + CoAP em UDP 5683, le .env da raiz)
./mvnw spring-boot:run
```

- Requer `JWT_SECRET` no `.env` (senao o boot falha ao resolver o placeholder).
- O CoAP sobe junto com a aplicacao (`UDP 5683`): os dispositivos acessam `coap://<IP-da-maquina>:5683/leituras/ambiente` (libere UDP 5683 no firewall).
- Os seeds imprimem `[SEED] ...` no log do boot -- use o `idSensor` no firmware.
- **Conflito de porta:** se o container `smh-app` estiver no ar, derrube-o antes (`docker compose stop app`) ou mude `APP_PORT` no `.env`.
- Devtools ativo: reload automatico apos `mvnw compile`.
- `ddl-auto=validate`: o schema vem do Flyway; se a entidade mudar, ajuste a `V1` e **recrie o schema** (`docker compose down -v`).

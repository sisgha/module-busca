# sisgea-module-busca

Microservice de busca.

## Desenvolvimento

```
git clone https://github.com/sisgha/module-busca.git
cd module-busca
```

### Serviços do [devops/development/docker-compose.yml](./devops/development/docker-compose.yml)

| Host                            | Endereço             | Descrição                               | Plataforma Base                   |
| ------------------------------- | -------------------- | --------------------------------------- | --------------------------------- |
| `sisgea-module-busca`    | `127.128.69.63:3469` | Aplicação NodeJS do module-busca | `docker.io/library/node:18`       |
| `sisgea-module-busca-meilisearch` | `127.128.69.65:7700` | Banco de dados postgres                 | `getmeili/meilisearch:v1.5` |

### Scripts Make

O projeto conta com um [arquivo make](./Makefile) que comporta scrips destinados ao desenvolvimento da aplicação.

```Makefile
dev-setup:
  # Configura o ambiente de deselvolvimento, como a criação da rede sisgea-net e os arquivos .env
dev-up:
  # Inicia os containers docker
dev-shell:
  # Inicia os containers docker e abre o bash na aplicação node
dev-down:
  # Para todos os containers
dev-logs:
  # Mostra os registros dos containers
```

### Aplicação nest/nodejs

```bash
$ npm install
```

#### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

#### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

#### Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

#### Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

#### License

Nest is [MIT licensed](LICENSE).

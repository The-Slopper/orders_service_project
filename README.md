# node-orders

Serviço de pedidos em Express. Autenticação por JWT, exportação de relatórios e
download de notas fiscais.

## Rodando

```bash
npm install
node index.js
```

## Endpoints

- `POST /login` — autentica e retorna JWT
- `GET /orders/:id` — detalhe do pedido
- `POST /orders/:id/pay` — debita saldo e marca como pago
- `GET /invoices/:file` — baixa um PDF de nota fiscal
- `POST /reports/export` — exporta relatório por formato

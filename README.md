# Crud de Pedidos (Orders)

## Getting Started
Para começar deve-se registrar um usuário. Os payloads são apenas exemplos.

/sec/register

payload:{
"nome": "Usuario teste",
"login": "user",
"email": "user@gmail.com",
"senha": "123456"
}

Depois realizar login em:

/sec/login

payload: {
"login": "user",
"senha": "123456"
}

----------

Especificação do CRUD de Pedidos

GET /api/pedidos

POST /api/pedidos

payload: {
  "nome_cliente": "New",
  "id_status": 1,
  "valor_total": 10,
  "observacao": "Pedido de New"
}

GET /api/pedidos/<id>

PUT /api/pedidos/<id>

DELETE /api/pedidos/<id>
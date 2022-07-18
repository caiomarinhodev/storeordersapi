
CREATE SEQUENCE pedido_id_seq; 
CREATE table pedido (
    id int4 NOT NULL DEFAULT nextval('pedido_id_seq'), 
    nome_cliente varchar(255) NULL,
    id_status INTEGER,
    valor_total FLOAT,
    observacao TEXT,
    CONSTRAINT pedido_pk PRIMARY KEY (id) 
);

CREATE UNIQUE INDEX pedido_id_idx ON public.pedido USING btree (id); 


CREATE SEQUENCE usuario_id_seq; 
CREATE TABLE public.usuario ( 
    id int NOT NULL DEFAULT nextval('usuario_id_seq'), 
    nome varchar(200) NOT NULL, 
    email varchar(100) NOT NULL, 
    login varchar(100) NOT NULL, 
    senha varchar(100) NOT NULL, 
    roles varchar (200)  NOT NULL DEFAULT 'USER', 
    CONSTRAINT usuario_pk PRIMARY KEY (id) 
); 

-- Status: 1 para pendente, 2 em processo, 3 finalizado
INSERT INTO pedido (nome_cliente, id_status, valor_total, observacao) VALUES ('João', 1, 10.00, 'Pedido de teste');
INSERT INTO pedido (nome_cliente, id_status, valor_total, observacao) VALUES ('Maria', 1, 10.00, 'Pedido de teste');
INSERT INTO pedido (nome_cliente, id_status, valor_total, observacao) VALUES ('José', 1, 10.00, 'Pedido de teste');
INSERT INTO pedido (nome_cliente, id_status, valor_total, observacao) VALUES ('José', 2, 10.00, 'Pedido de teste');
INSERT INTO pedido (nome_cliente, id_status, valor_total, observacao) VALUES ('José', 3, 10.00, 'Pedido de teste');
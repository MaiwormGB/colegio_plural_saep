create database plural_db;

create table usuario(
	id serial primary key,
	nome varchar(100) not null,
	senha text not null

);

create table responsavel(
	id serial primary key,
	nome varchar(100) not null
);

create table aluno(
	id serial primary key,
	nome varchar(100) not null,
	responsavel_id int not null references responsavel(id)

);

create table agendamento(
	id serial primary key,
	usuario_id int not null references usuario(id),
	aluno_id int not null references aluno(id),
	data_agendamento date not null
	
);

insert into responsavel (nome)
values
('Marcia'),
('Rafaela'),
('Nicola');

insert into aluno (nome, responsavel_id)
values 
('Frank' 1),
('Arthur', 2),
('Malu', 3);

insert into usuario (nome, senha),
values
('Mauricio','$2b$10$MqDvhXis7zmkb8/VXUpcYuSyQsQGY6EpGSvQCopM6X/G.39gLpl7a'),
('Juracema','$2b$10$PAgdagjjVd55qlpioGXZ9.ursKdHqF2m6v4Y1chow6.KxgvMyM53O'),
('Miu','$2b$10$5qm9AdauO6K4ypeQCSi88epTjmCYy3FdsBaodkN8.Jq8qJYAfVQFe');

insert into agendamento(usuario_id, aluno_id, data_agendamento)
values
(1, 1, '2026-10-03'),
(2, 2, '2026-10-06'),
(3, 3, '2026-10-10');



select * from usuario;








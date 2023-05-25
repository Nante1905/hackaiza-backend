create user taxi login password 'taxi' createDB;
create database taxi;
alter database taxi owner to taxi;

-- \c taxi taxi
create extension if not exists pgcrypto;

create sequence scrole increment by 1 minvalue 1 start 1;
create table if not exists role (
    idrole int NOT NULL default nextval('scrole') CONSTRAINT pkrole PRIMARY KEY,
    title varchar(10)
);
insert into role (title) values ('client');
insert into role (title) values ('driver');
insert into role (title) values ('backoffice');

create sequence scbrand increment by 1 minvalue 1 start 1;
create table if not exists brand
(
  idbrand int NOT NULL default nextval('scbrand') CONSTRAINT pkbrand PRIMARY KEY,
  name varchar(45)
);

insert into brand (name) values ('peugeot');
insert into brand (name) values ('citroen');
insert into brand (name) values ('renault');
insert into brand (name) values ('mazda');
insert into brand (name) values ('hyundai');

create sequence scusers increment by 1 minvalue 1 start 1;
create table if not exists users
(
  idusers int NOT NULL default nextval('scusers') CONSTRAINT pkusers PRIMARY KEY,
  name varchar(45),
  forname varchar(45),
  birthdate date,
  telephone varchar(15),
  email varchar(45),
  idrole int NOT NULL,
  password varchar(45),
  FOREIGN KEY (idrole) REFERENCES role(idrole)
);
insert into users(name, forname, birthdate, telephone, email, idrole, password) values ('Rasoa', 'Jeanne', '1998-02-20', '0337454411', 'rasoa@gmail.com', 1, md5('rasoa123'));
insert into users(name, forname, birthdate, telephone, email, idrole, password) values ('Rajean', 'Luc', '1980-10-03', '0342122529', 'rajean@gmail.com', 1, md5('rajean123'));
insert into users(name, forname, birthdate, telephone, email, idrole, password) values ('Rabe', 'Zaka', '1994-04-28', '0344194574', 'rabe@gmail.com', 2, md5('rabe123'));
insert into users(name, forname, birthdate, telephone, email, idrole, password) values ('Ravao', 'Marie', '1992-08-24', '0327294247', 'ravao@gmail.com', 2, md5('ravao123'));
insert into users(name, forname, birthdate, telephone, email, idrole, password) values ('Rakoto', 'Fra', '1995-05-14', '0335162808', 'rakoto@gmail.com', 2, md5('rakoto123'));


create sequence scdriver increment by 1 minvalue 1 start 1;
create table if not exists driver(
  idusers int NOT NULL,
  registration varchar(10),
  idbrand int,
  isavailable smallint,
  estimationPrice double precision,
  FOREIGN KEY (idusers) REFERENCES users(idusers),
  FOREIGN KEY (idbrand) REFERENCES brand(idbrand)
);
insert into driver (idusers, registration, idbrand, isavailable, estimationPrice) values (3, '8596 TBE', 1, 1, 5000);

insert into driver (idusers, registration, idbrand, isavailable, estimationPrice) values (4, '8292 TBD', 1, 1, 4000);

insert into driver (idusers, registration, idbrand, isavailable, estimationPrice) values (5, '8998 WWT', 5, 1, 4500);

create table if not exists activation
(
  code varchar(10),
  status smallint
);
insert into activation values (encode(gen_random_bytes(5), 'hex'), 0);
insert into activation values (encode(gen_random_bytes(5), 'hex'), 0);
insert into activation values (encode(gen_random_bytes(5), 'hex'), 0);
insert into activation values (encode(gen_random_bytes(5), 'hex'), 0);
insert into activation values (encode(gen_random_bytes(5), 'hex'), 0);

-- drop table activation;
-- drop table appreciation;
-- drop table driver;
-- drop sequence seq_brand;
-- drop table brand;
-- drop sequence seq_message;
-- drop table message;
-- drop sequence seq_chat;
-- drop table chat;
-- drop sequence seq_users;
-- drop table users;
-- drop sequence seq_roles;
-- drop table roles;


-- roles
CREATE sequence seq_roles increment by 1 minvalue 1 START 1; 
CREATE TABLE roles(
    idRole int not NULL DEFAULT nextval('seq_roles'),
    title VARCHAR(45),
    PRIMARY key(idRole)
);

-- users
CREATE sequence seq_users increment by 1 minvalue 1 START 1; 
CREATE TABLE users(
    idUser int not NULL DEFAULT nextval('seq_users'),
    name VARCHAR(45),
    forname VARCHAR(45),
    birthdate DATE,
    telephone VARCHAR(15),
    email VARCHAR(45),
    idRole int,
    password VARCHAR(45),
    PRIMARY key(idUser),
    FOREIGN KEY (idRole) REFERENCES roles(idRole)
);

-- chat
CREATE sequence seq_chat increment by 1 minvalue 1 START 1; 
CREATE TABLE chat(
    idChat int not NULL DEFAULT nextval('seq_chat'),
    idUser1 int,
    idUser2 int,
    isClosed boolean,
    PRIMARY key(idChat),
    FOREIGN key (idUser1) REFERENCES users(idUser),
    FOREIGN key (idUser2) REFERENCES users(idUser)
);

-- message
CREATE sequence seq_message increment by 1 minvalue 1 START 1; 
CREATE TABLE message(
    idMessage int not NULL DEFAULT nextval('seq_message'),
    idChat int,
    content text,
    author int,
    receptor int,
    dateSent DATE,
    PRIMARY key(idMessage),
    FOREIGN key (author) REFERENCES users(idUser),
    FOREIGN key (receptor) REFERENCES users(idUser)
);

-- brand
CREATE sequence seq_brand increment by 1 minvalue 1 START 1; 
CREATE TABLE brand(
    idBrand int not NULL DEFAULT nextval('seq_brand'),
    name VARCHAR(45),
    PRIMARY key(idBrand)
);

-- driver
-- CREATE sequence seq_driver increment by 1 minvalue 1 START 1; 
CREATE TABLE Driver(
    idDriver int,
    regitration VARCHAR(10),
    idBrand int,
    isAvalable BOOLEAN,
    estimatePrice DOUBLE PRECISION,
    FOREIGN KEY (idDriver) REFERENCES Users (idUser),
    FOREIGN KEY (idBrand) REFERENCES Brand (idBrand)
);

-- appreciation
CREATE sequence seq_appreciation increment by 1 minvalue 1 START 1; 
CREATE TABLE appreciation (
    idappreciation int not NULL DEFAULT nextval('seq_appreciation'),
    idCommentator int,
    idDriver int,
    comment text,
    note int,
    PRIMARY key(idappreciation),
    FOREIGN KEY (idCommentator) REFERENCES Users (idUser),
    FOREIGN KEY (idDriver) REFERENCES Users (idUser)
);

-- activation
CREATE TABLE activation (
    code VARCHAR(10),
    status BOOLEAN
);


INSERT INTO roles VALUES(DEFAULT, 'Client');
INSERT INTO roles VALUES(DEFAULT, 'Chauffeur');

INSERT INTO users VALUES(DEFAULT, 'Rabe', 'RANDRIAMAMONJY', '12-05-1996', '0348712356', 'rabe@gmail.com', 1, 'azerty');
INSERT INTO users VALUES(DEFAULT, 'Jean', 'RAKOTO', '12-05-1996', '0340100001', 'jean@gmail.com', 2, 'jean');
INSERT INTO users VALUES(DEFAULT, 'Jeane', 'RAKOTO', '12-05-1996', '0340100001', 'jeane@gmail.com', 2, 'jeane');

insert into driver values (2, '1111 TBA', null, true, 3000)
insert into driver values (3, '1112 TBA', null, true, 3500)

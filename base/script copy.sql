CREATE table roles (
    idrole SERIAL not null PRIMARY key,
    nom VARCHAR(100)
);

insert into roles values (default, 'client');
insert into roles values (default, 'chauffeur');

CREATE TABLE utilisateurs(
    idutilisateur SERIAL NOT NULL PRIMARY KEY,
    nom VARCHAR(45),
    prenom VARCHAR(45),
    dateNaissance DATE,
    email VARCHAR(45),
    phone VARCHAR(25),
    pass TEXT,
    idrole int,
    token text,
    FOREIGN key(idrole) REFERENCES roles(idrole)
);

-- INSERT INTO utilisateurs 
-- VALUES(DEFAULT, 'Rabe', 'RANDRIAMAMONJY', '12-05-1996', 'rabe@gmail.com','0348712356', 'azerty' , 2, 'azerty');

CREATE TABLE marque(
    idMarque SERIAL NOT NULL PRIMARY KEY,
    nom VARCHAR(25)
);
INSERT into marque values (default, 'Renault');

CREATE TABLE chauffeurs(
    idChauffeur SERIAL PRIMARY KEY,
    idutilisateur INT,
    idMarque INT,
    modele VARCHAR(25),
    plaque VARCHAR(25),
    prix DECIMAL,
    FOREIGN KEY (idutilisateur) REFERENCES utilisateurs(idutilisateur),
    FOREIGN KEY (idMarque) REFERENCES marque(idMarque)
);
-- INSERT INTO chauffeurs values
-- (default, 1, 1, 'test', 'test', 1000);

CREATE TABLE chat(
    idChat SERIAL PRIMARY KEY,
    status INT,
    idclient int,
    idchauffeur int,
    dateheurecreation timestamp,
    idcourse int,
    FOREIGN key(idclient) REFERENCES utilisateurs(idutilisateur),
    FOREIGN key(idchauffeur) REFERENCES utilisateurs(idutilisateur),
    FOREIGN key(idcourse) REFERENCES courses(idcourse)
);

CREATE TABLE messages(
    idMessage SERIAL PRIMARY KEY,
    idChat INT,
    idExpedit INT,
    text TEXT,
    dateEnvoie timestamp,
    FOREIGN KEY (idChat) REFERENCES chat(idChat),
    FOREIGN KEY (idExpedit) REFERENCES utilisateurs(idutilisateur)
);

CREATE TABLE courses(
    idCourse SERIAL PRIMARY KEY,
    idChauffeur INT,
    idClient INT,
    depart GEOGRAPHY,
    destination GEOGRAPHY,
    dateCourse timestamp,
    status INT,
    prix DECIMAL,
    departlat numeric,
    departlng numeric,
    destinationlat numeric,
    destinationlng numeric,
    nomdepart VARCHAR(250),
    nomdestination VARCHAR(250),
    FOREIGN KEY (idChauffeur) REFERENCES utilisateurs(idutilisateur),
    FOREIGN KEY (idClient) REFERENCES utilisateurs(idutilisateur)
);

CREATE TABLE commentaires(
    idCommentaire SERIAL PRIMARY KEY,
    idChauffeur INT,
    idClient INT,
    text TEXT,
    dateCom DATE,
    FOREIGN KEY (idChauffeur) REFERENCES utilisateurs(idutilisateur),
    FOREIGN KEY (idClient) REFERENCES utilisateurs(idutilisateur)
);

CREATE TABLE notes(
    idNote SERIAL PRIMARY KEY,
    idChauffeur INT,
    valeur INT,
    FOREIGN KEY (idChauffeur) REFERENCES utilisateurs(idutilisateur)
);

CREATE TABLE activation(
    idActivation SERIAL PRIMARY KEY,
    code VARCHAR(25),
    status INT,
    idrole int,
    FOREIGN key(idrole) REFERENCES roles(idrole)
);



insert into courses values(default, 1, 1, ST_GeomFromText('POINT(-122.4194 37.7749)'), ST_GeomFromText('POINT(-122.4194 37.7749)'), '2023-06-11', 1, 3000, 4, 5, 4, 5, 'azerty', 'qwerty');
insert into courses values(default, 1, 1, ST_GeomFromText('POINT(-122.4194 37.7749)'), ST_GeomFromText('POINT(-122.4194 37.7749)'), '2023-06-18', 1, 3000, 4, 5, 4, 5, 'azerty', 'qwerty');

SELECT COUNT(status) FROM courses WHERE status = 1 AND EXTRACT(MONTH FROM dateCourse) = 6; 

SELECT SUM(prix) FROM courses WHERE status = 1 AND EXTRACT(MONTH FROM dateCourse) = 6;


create view v_dernier_dateenvoie as SELECT idchat, max(dateEnvoie) dateenvoie from messages group by idchat;

create view v_dernier_message_par_chat as select m.* from messages m join v_dernier_dateenvoie ld on m.idChat = ld.idChat and m.dateEnvoie=ld.dateEnvoie;

create view v_chat_dernier_message as select c.*, concat(u1.nom, ' ', u1.prenom) nomclient, concat(u2.nom, ' ', u2.prenom) nomchauffeur, lm.text message, lm.dateEnvoie from chat c left outer join v_dernier_message_par_chat lm on c.idchat=lm.idchat join utilisateurs u1 on c.idclient=u1.idutilisateur join utilisateurs u2 on c.idchauffeur=u2.idutilisateur;

create view v_chat_courses as select ch.*, c.status coursestatus, concat(u1.nom, ' ', u1.prenom) nomclient, concat(u2.nom, ' ', u2.prenom) nomchauffeur from courses c join chat ch on c.idcourse=ch.idcourse join utilisateurs u1 on u1.idutilisateur=ch.idclient join utilisateurs u2 on u2.idutilisateur=ch.idchauffeur;
CREATE table roles (
    idrole SERIAL not null PRIMARY key,
    nom VARCHAR(100)
);

insert into roles values (default, 'client');
insert into roles values (default, 'chauffeur');

CREATE TABLE users(
    idUser SERIAL NOT NULL PRIMARY KEY,
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

INSERT INTO users 
VALUES(DEFAULT, 'Rabe', 'RANDRIAMAMONJY', '12-05-1996', 'rabe@gmail.com','0348712356', 'azerty' , 2, 'azerty');

CREATE TABLE marque(
    idMarque SERIAL NOT NULL PRIMARY KEY,
    nom VARCHAR(25)
);

CREATE TABLE chauffeurs(
    idChauffeur SERIAL PRIMARY KEY,
    idUser INT,
    idMarque INT,
    modele VARCHAR(25),
    plaque VARCHAR(25),
    prix DECIMAL,
    FOREIGN KEY (idUser) REFERENCES users(idUser),
    FOREIGN KEY (idMarque) REFERENCES marque(idMarque)
);
INSERT INTO chauffeurs values
(default, 1, 1, 'test', 'test', 1000);

CREATE TABLE chat(
    idChat SERIAL PRIMARY KEY,
    status INT,
    idclient int,
    idchauffeur int,
    dateheurecreation timestamp,
    idcourse int,
    FOREIGN key(idclient) REFERENCES users(iduser),
    FOREIGN key(idchauffeur) REFERENCES users(iduser),
    FOREIGN key(idcourse) REFERENCES courses(idcourse)
);

CREATE TABLE messages(
    idMessage SERIAL PRIMARY KEY,
    idChat INT,
    idExpedit INT,
    text TEXT,
    dateEnvoie DATE,
    FOREIGN KEY (idChat) REFERENCES chat(idChat),
    FOREIGN KEY (idExpedit) REFERENCES users(idUser)
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
    FOREIGN KEY (idChauffeur) REFERENCES users(iduser),
    FOREIGN KEY (idClient) REFERENCES users(idUser)
);

CREATE TABLE commentaires(
    idCommentaire SERIAL PRIMARY KEY,
    idChauffeur INT,
    idClient INT,
    text TEXT,
    dateCom DATE,
    FOREIGN KEY (idChauffeur) REFERENCES chauffeurs(idChauffeur),
    FOREIGN KEY (idClient) REFERENCES users(idUser)
);

CREATE TABLE notes(
    idNote SERIAL PRIMARY KEY,
    idChauffeur INT,
    valeur INT,
    FOREIGN KEY (idChauffeur) REFERENCES chauffeurs(idChauffeur)
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

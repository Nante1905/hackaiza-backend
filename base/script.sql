CREATE TABLE users(
    idUser SERIAL NOT NULL PRIMARY KEY,
    nom VARCHAR(45),
    prenom VARCHAR(45),
    dateNaissance DATE,
    email VARCHAR(45),
    phone VARCHAR(25),
    pass TEXT
);

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

CREATE TABLE chat(
    idChat SERIAL PRIMARY KEY,
    status INT
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
    dateCourse DATE,
    status INT,
    prix DECIMAL,
    FOREIGN KEY (idChauffeur) REFERENCES chauffeurs(idChauffeur),
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
    status INT
);
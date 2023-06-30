-- chauffeur details vue;
create or replace view v_chauffeurs 
    as select u.idUser, u.nom, prenom, phone, email, m.nom marque, modele, plaque, prix 
    from users u 
    join chauffeurs on u.idUser = chauffeurs.iduser 
    join marque m on m.idmarque = chauffeurs.idmarque;

--select *, (st_distance(st_setsrid(st_makepoint(47.5332608, -18.9136896), 4326)::geography, st_setsrid(st_makepoint(47.5582392, -18.8754385), 4326)::geography)) as distStart, (st_distance(st_setsrid(st_makepoint(47.5422745, -18.9793256), 4326)::geography, st_setsrid(st_makepoint(47.5582392, -18.8754385), 4326)::geography)) as distPath from v_chauffeurs where iduser=1 order by distStart;

-- stat chauffeur
CREATE or replace view stat_chauffeur as
    select  
        idChauffeur, status,count(*) as nombre, sum(prix) as prix_total,  
        EXTRACT(Year FROM dateCourse) as anne,
        EXTRACT(month FROM dateCourse) as mois,
        EXTRACT(day FROM dateCourse) as jour
        from courses
        group by idChauffeur, status, anne, mois, jour;

-- stat chauffeur par mois
create or replace view stat_chauffeur_mois as
    select 
        idChauffeur, status , sum(nombre) as nombre, sum(prix_total) as prix_total, anne, mois
        from stat_chauffeur
        group by idChauffeur, status, anne, mois;


-- getComment
create or replace view v_comment_user as
    select users.nom, users.prenom, users.phone, commentaires.idChauffeur, commentaires.text, datecom from commentaires 
        JOIN users 
            ON commentaires.idClient = users.idUser;






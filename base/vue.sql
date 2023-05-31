--  details users
CREATE view details_users  AS
    select 
        idUser, name, forname, birthdate, email, telephone,  users.idRole, title 
    from users natural join roles;
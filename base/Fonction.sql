-- stat chauffeur dans une anne
CREATE OR REPLACE FUNCTION stat_chauffeur_anne_beta(id_chauffeur int,_anne int, _status int)
RETURNS TABLE (
    idChauffeur int,
    status int,
    nombre int,
    prix_total numeric,
    mois int
)
AS $$
DECLARE 
    i int;
    _mois int;
BEGIN
    FOR i in 1..12
    LOOP
    _mois := i;
        RETURN QUERY
            select 
                id_chauffeur, 
                _status, 
                (select 
                    stat_chauffeur_mois.nombre::integer 
                    FROM stat_chauffeur_mois
                        where 
                        stat_chauffeur_mois.anne = _anne 
                        and stat_chauffeur_mois.mois = _mois
                        and stat_chauffeur_mois.idChauffeur = id_chauffeur
                        and stat_chauffeur_mois.status = _status
                ),
                (select 
                    stat_chauffeur_mois.prix_total 
                    FROM stat_chauffeur_mois
                        where 
                        stat_chauffeur_mois.anne = _anne 
                        and stat_chauffeur_mois.mois = _mois
                        and stat_chauffeur_mois.idChauffeur = id_chauffeur
                        and stat_chauffeur_mois.status = _status
                ),
                _mois::integer;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION stat_chauffeur_anne(id_chauffeur int,_anne int, _status int)
RETURNS TABLE (
    idChauffeur int,
    status int,
    nombre int,
    prix_total numeric,
    mois int
)
AS $$
BEGIN
    RETURN QUERY 
        select 
        val.idchauffeur,  
        val.status,
        case 
            when val.nombre is null
            then 0
            else val.nombre
        end,  
        case 
            when val.prix_total is null
            then 0
            else val.prix_total
        end,  
        val.mois from stat_chauffeur_anne_beta(id_chauffeur, _anne, _status) as val;
END;
$$ LANGUAGE plpgsql;

SELECT * from stat_chauffeur_anne_beta(1, 2023, 1) as val;
SELECT * from stat_chauffeur_anne(1, 2023, 1);

-- stat chauffeur a partir d'un date donne et un intervalle de jour
CREATE OR REPLACE FUNCTION generate_date(date_debut Date, jour integer )
RETURNS table(
    date_genere date
) 
AS $$
BEGIN
    RETURN QUERY 
    SELECT generate_series(date_debut, (date_debut + (jour || ' days')::interval), '1 day')::date AS date_range;
END;
$$ LANGUAGE plpgsql;

select * from generate_date('2023-06-25'::date,10);

CREATE OR REPLACE FUNCTION stat_chauffeur_jour_beta(id_chauffeur integer, date_debut date, nb_jour integer, _status integer)
RETURNS table(
    idChauffeur int,
    date_genere date,
    status int,
    nombre int,
    prix_total numeric
) 
AS $$
DECLARE row_date RECORD;
BEGIN
    FOR row_date in select * from generate_date(date_debut,nb_jour) LOOP
        RETURN QUERY
        select 
        id_chauffeur,
        row_date.date_genere,
        _status,
        (select 
            stat_chauffeur.nombre::integer 
            FROM stat_chauffeur
                where 
                stat_chauffeur.anne = EXTRACT(YEAR FROM row_date.date_genere)  
                and stat_chauffeur.mois = EXTRACT(MONTH FROM row_date.date_genere)
                and stat_chauffeur.jour = EXTRACT(DAY FROM row_date.date_genere)
                and stat_chauffeur.idChauffeur = id_chauffeur
                and stat_chauffeur.status = _status),
        (select 
            stat_chauffeur.prix_total::numeric 
            FROM stat_chauffeur
                where 
                stat_chauffeur.anne = EXTRACT(YEAR FROM row_date.date_genere)  
                and stat_chauffeur.mois = EXTRACT(MONTH FROM row_date.date_genere)
                and stat_chauffeur.jour = EXTRACT(DAY FROM row_date.date_genere)
                and stat_chauffeur.idChauffeur = id_chauffeur
                and stat_chauffeur.status = _status);
    END LOOP;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION stat_chauffeur_jour(id_chauffeur integer, date_debut date, nb_jour integer, _status integer)
RETURNS table(
    idChauffeur int,
    date_genere date,
    status int,
    nombre int,
    prix_total numeric
) 
AS $$
BEGIN
    RETURN QUERY
    select 
        val.idChauffeur,
        val.date_genere,
        val.status,
        case
            when val.nombre is null then 0
            else val.nombre 
        end,
        case
            when val.prix_total is null then 0
            else val.prix_total  
        end
        from stat_chauffeur_jour_beta(id_chauffeur, date_debut, nb_jour, _status) as val;
END;
$$ LANGUAGE plpgsql;



select * from stat_chauffeur_jour_beta(1, '2023-06-11'::date,10, 1 );
select * from stat_chauffeur_jour(1, '2023-06-11'::date,10, 1 );

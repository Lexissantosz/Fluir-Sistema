-- 'prefiro-nao-responder' tem 21 caracteres. Impedir truncamento e inconsistência no cadastro.
ALTER TABLE ciclo_perfis ALTER COLUMN menstrua_atualmente TYPE VARCHAR(32);

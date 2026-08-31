ALTER TABLE perfis_usuario
ADD COLUMN idade INT;

ALTER TABLE perfis_usuario
ADD CONSTRAINT CK_perfis_usuario_idade
CHECK (idade IS NULL OR idade BETWEEN 13 AND 120);

ALTER TABLE perfis_usuario
ADD COLUMN tom_comunicacao VARCHAR(20);

ALTER TABLE perfis_usuario
ADD CONSTRAINT CK_perfis_usuario_tom_comunicacao
CHECK (
    tom_comunicacao IS NULL
    OR tom_comunicacao IN ('calmo', 'direto', 'motivador', 'delicado', 'neutro')
);